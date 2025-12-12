import { beforeAll, describe, expect, it } from "vitest"
import {
	createDepartment,
	createDepartmentRelationship,
	getAllDepartmentRelationships,
	getAllDepartments,
	getSubDepartmentsByName,
} from "@/db/department.server"
import { resetTables } from "@/db/common.server"

// test: 生成根部门
export function generateRootDepartment(name: string) {
	return createDepartment(name, `${name} Department`, 2)
}

// test: 生成测试部门数据
export async function generateTestDepartments() {
	const sales = await generateRootDepartment("Sales")

	const departmentA = await createDepartment("A", "Handles A", 3)
	const departmentB = await createDepartment("B", "Handles B", 3)

	const departmentC = await createDepartment("C", "Handles C", 4)
	const departmentD = await createDepartment("D", "Handles D", 4)

	const departmentE = await createDepartment("E", "Handles E", 5)

	// 建立部门关系
	await createDepartmentRelationship(sales.id, departmentA.id) // root -> A
	await createDepartmentRelationship(sales.id, departmentB.id) // root -> B
	await createDepartmentRelationship(departmentA.id, departmentC.id) // A -> C
	await createDepartmentRelationship(departmentA.id, departmentD.id) // A -> D
	await createDepartmentRelationship(departmentB.id, departmentC.id) // B -> C
	await createDepartmentRelationship(departmentB.id, departmentD.id) // B -> D
	await createDepartmentRelationship(departmentD.id, departmentE.id) // D -> E

	return [sales, departmentA, departmentB, departmentC, departmentD]
}

describe("departments", () => {
	beforeAll(async () => {
		await resetTables()
	})

	it("departments 表清空", async () => {
		const result = await getAllDepartments()
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
		const allDepartments = await getAllDepartments()
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

		const relationships = await getAllDepartmentRelationships()
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
		const allDepartments = await getAllDepartments()
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
})
