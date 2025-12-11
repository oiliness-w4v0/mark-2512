import { beforeAll, describe, expect, it } from "vitest"
import { db } from "@/db"
import { departmentRelationships, departments } from "@/db/schema"
import {
	generateTestDepartments,
	getSubDepartmentTreeByName,
	getSubDepartmentsByName,
} from "@/db/department.server"

describe("departments", () => {
	beforeAll(async () => {
		await db.delete(departments)
	})

	it("departments 表清空", async () => {
		const result = await db.select().from(departments)
		expect(result.length).toBe(0)
	})

	it("创建测试数据", async () => {
		const [sales, departmentA, departmentB, departmentC, departmentD] =
			await generateTestDepartments()
		expect(sales.name).toBe("Sales")
		expect(departmentA.name).toBe("A")
		expect(departmentB.name).toBe("B")
		expect(departmentC.name).toBe("C")
		expect(departmentD.name).toBe("D")
	})

	it("验证部门关系", async () => {
		const allDepartments = await db.select().from(departments)
		const sales = allDepartments.find((dept) => dept.name === "Sales")
		const departmentA = allDepartments.find((dept) => dept.name === "A")
		const departmentB = allDepartments.find((dept) => dept.name === "B")
		const departmentC = allDepartments.find((dept) => dept.name === "C")
		const departmentD = allDepartments.find((dept) => dept.name === "D")
		expect(sales).toBeDefined()
		expect(departmentA).toBeDefined()
		expect(departmentB).toBeDefined()
		expect(departmentC).toBeDefined()
		expect(departmentD).toBeDefined()

		const relationships = await db.select().from(departmentRelationships)
		const salesToA = relationships.find(
			// root -> A
			(rel) =>
				rel.departmentId === sales!.id &&
				rel.relatedDepartmentId === departmentA!.id,
		)
		const salesToB = relationships.find(
			// root -> B
			(rel) =>
				rel.departmentId === sales!.id &&
				rel.relatedDepartmentId === departmentB!.id,
		)
		const aToC = relationships.find(
			// A -> C
			(rel) =>
				rel.departmentId === departmentA!.id &&
				rel.relatedDepartmentId === departmentC!.id,
		)
		const aToD = relationships.find(
			// A -> D
			(rel) =>
				rel.departmentId === departmentA!.id &&
				rel.relatedDepartmentId === departmentD!.id,
		)
		const bToC = relationships.find(
			// B -> C
			(rel) =>
				rel.departmentId === departmentB!.id &&
				rel.relatedDepartmentId === departmentC!.id,
		)
		const bToD = relationships.find(
			// B -> D
			(rel) =>
				rel.departmentId === departmentB!.id &&
				rel.relatedDepartmentId === departmentD!.id,
		)
		expect(salesToA).toBeDefined()
		expect(salesToB).toBeDefined()
		expect(aToC).toBeDefined()
		expect(aToD).toBeDefined()
		expect(bToC).toBeDefined()
		expect(bToD).toBeDefined()
	})

	it("验证部门级别", async () => {
		const allDepartments = await db.select().from(departments)
		const sales = allDepartments.find((dept) => dept.name === "Sales")
		const departmentA = allDepartments.find((dept) => dept.name === "A")
		const departmentB = allDepartments.find((dept) => dept.name === "B")
		const departmentC = allDepartments.find((dept) => dept.name === "C")
		const departmentD = allDepartments.find((dept) => dept.name === "D")
		expect(sales).toBeDefined()
		expect(departmentA).toBeDefined()
		expect(departmentB).toBeDefined()
		expect(departmentC).toBeDefined()
		expect(departmentD).toBeDefined()

		// 验证级别关系
		expect(sales!.level).toBeLessThan(departmentA!.level)
		expect(sales!.level).toBeLessThan(departmentB!.level)
		expect(departmentA!.level).toBeLessThan(departmentC!.level)
		expect(departmentA!.level).toBeLessThan(departmentD!.level)
		expect(departmentB!.level).toBeLessThan(departmentC!.level)
		expect(departmentB!.level).toBeLessThan(departmentD!.level)
	})

	it("获取所有子部门", async () => {
		const dps = await getSubDepartmentsByName("Sales")
		const departmentNames = dps.map((dept) => dept.name)
		expect(departmentNames).toContain("A")
		expect(departmentNames).toContain("B")
		expect(departmentNames).toContain("C")
		expect(departmentNames).toContain("D")
		expect(departmentNames).toContain("E")
		expect(dps.length).toBe(5)

		const dpsA = await getSubDepartmentsByName("A")
		const departmentNamesA = dpsA.map((dept) => dept.name)
		expect(departmentNamesA).toContain("C")
		expect(departmentNamesA).toContain("D")
		expect(dpsA.length).toBe(3)

		const dpsB = await getSubDepartmentsByName("D")
		const departmentNamesB = dpsB.map((dept) => dept.name)
		expect(departmentNamesB).toContain("E")
		expect(dpsB.length).toBe(1)
	})

	it("获取子部门树形结构", async () => {
		const tree = await getSubDepartmentTreeByName("Sales")
		console.log(JSON.stringify(tree, null, 2))
		expect(tree).toBeDefined()
		expect(tree.size).toBe(1)
		const salesNode = Array.from(tree.values())[0]
		expect(salesNode.name).toBe("Sales")
		expect(salesNode.children.length).toBe(2) // A, B

		const departmentANode = salesNode.children.find(
			(child) => child.name === "A",
		)!
		expect(departmentANode).toBeDefined()
		expect(departmentANode.children.length).toBe(2) // C, D

		const departmentBNode = salesNode.children.find(
			(child) => child.name === "B",
		)!
		expect(departmentBNode).toBeDefined()
		expect(departmentBNode.children.length).toBe(2) // C, D

		const departmentCNodeFromA = departmentANode.children.find(
			(child) => child.name === "C",
		)!
		expect(departmentCNodeFromA).toBeDefined()
		expect(departmentCNodeFromA.children.length).toBe(0)

		const departmentDNodeFromA = departmentANode.children.find(
			(child) => child.name === "D",
		)!
		expect(departmentDNodeFromA).toBeDefined()
		expect(departmentDNodeFromA.children.length).toBe(1) // E

		const departmentENode = departmentDNodeFromA.children.find(
			(child) => child.name === "E",
		)!
		expect(departmentENode).toBeDefined()
		expect(departmentENode.children.length).toBe(0)

		const departmentCNodeFromB = departmentBNode.children.find(
			(child) => child.name === "C",
		)!
		expect(departmentCNodeFromB).toBeDefined()
		expect(departmentCNodeFromB.children.length).toBe(0)

		const departmentDNodeFromB = departmentBNode.children.find(
			(child) => child.name === "D",
		)!
		expect(departmentDNodeFromB).toBeDefined()
		expect(departmentDNodeFromB.children.length).toBe(1) // E

		const departmentENodeFromB = departmentDNodeFromB.children.find(
			(child) => child.name === "E",
		)!
		expect(departmentENodeFromB).toBeDefined()
		expect(departmentENodeFromB.children.length).toBe(0)
	})

	it("清理测试数据", async () => {
		await db.delete(departments)
		const result = await db.select().from(departments)
		expect(result.length).toBe(0)
	})
})
