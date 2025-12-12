import { beforeAll, describe, expect, it } from "vitest"
import { generateRootDepartment } from "./departments.test"
import type { Employee } from "@/db/employees.server"
import { db } from "@/db"
import { createDepartment, createDepartmentRelationship, getActiveDepartments } from "@/db/department.server"
import { createEmployee, getAllEmployees } from "@/db/employees.server"
import { resetTables } from "@/db/common.server"

// eg: 创建测试员工数据
export async function generateTestEmployee(departmentId: string, name: string) {
	const employee: Employee = {
		name: "Employee " + name,
		identityCard: "ID" + Math.random().toString().slice(2, 10),
		email: name.replace(/\s+/g, "").toLowerCase() + "@163.com",
		phone: "123-456-7890",
		position: "Sales Manager",
		departmentId, // 替换为实际部门 UUID
	}
	return await createEmployee(employee)
}

describe("employees", () => {
	// 这里可以添加员工相关的测试用例
	beforeAll(async () => {
		await resetTables()
	})

	it("employees 表清空", async () => {
		const result = await getAllEmployees()
		expect(result.length).toBe(0)
	})

	it("创建部门和员工", async () => {
		// 创建根部门 Sales 并添加员工
		const sales = await generateRootDepartment("Sales")
		const employee1 = await generateTestEmployee(sales.id, "Alice Johnson")
		expect(employee1.name).toBe("Employee Alice Johnson")
		expect(employee1.departmentId).toBe(sales.id)
		const employee2 = await generateTestEmployee(sales.id, "Bob Smith")
		expect(employee2.name).toBe("Employee Bob Smith")
		expect(employee2.departmentId).toBe(sales.id)

		// 创建部门 A 并添加员工
		const departmentA = await createDepartment("A", "Handles A", 3)
		const employeeA = await generateTestEmployee(departmentA.id, "Charlie Brown")
		expect(employeeA.name).toBe("Employee Charlie Brown")
		expect(employeeA.departmentId).toBe(departmentA.id)

		// 添加部门 A 和根部门 Sales 的关系
		await createDepartmentRelationship(sales.id, departmentA.id)

		// 创建部门 B 并添加员工
		const departmentB = await createDepartment("B", "Handles B", 3)
		const employeeB = await generateTestEmployee(departmentB.id, "Diana Prince")
		expect(employeeB.name).toBe("Employee Diana Prince")
		expect(employeeB.departmentId).toBe(departmentB.id)

		// 添加部门 B 和根部门 Sales 的关系
		await createDepartmentRelationship(sales.id, departmentB.id)

		// 创建部门 E 并添加员工
		const departmentE = await createDepartment("E", "Handles E", 5)
		const employeeE = await generateTestEmployee(departmentE.id, "Ethan Hunt")
		expect(employeeE.name).toBe("Employee Ethan Hunt")
		expect(employeeE.departmentId).toBe(departmentE.id)

		// 添加部门 E 和部门 B 的关系
		await createDepartmentRelationship(departmentB.id, departmentE.id)
	})

	it("获取所有部门(包括人员数据)", async () => {
		const allDepartments = await getActiveDepartments()
		expect(allDepartments.length).toBeGreaterThanOrEqual(1) // 只包括 Sales 和部门里面的俩名员工
		expect(allDepartments[0].employees.length).toBeGreaterThanOrEqual(2)
	})
})
