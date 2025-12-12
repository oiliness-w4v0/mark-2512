import { beforeAll, describe, expect, it } from "vitest"
import { db } from "@/db"
import { departments, employees } from "@/db/schema"
import {
	generateRootDepartment,
	getActiveDepartments,
} from "@/db/department.server"
import { generateTestEmployee } from "@/db/employees.server"

describe("employees", () => {
	// 这里可以添加员工相关的测试用例
	beforeAll(async () => {
		// 在所有测试之前运行的代码，例如清理数据库或设置测试数据
		await db.delete(departments)
		await db.delete(employees)
	})

	it("employees 表清空", async () => {
		const result = await db.select().from(employees)
		expect(result.length).toBe(0)
	})

	it("创建部门和员工", async () => {
		const sales = await generateRootDepartment("Sales")
		const employee1 = await generateTestEmployee(sales.id, "Alice Johnson")
		expect(employee1.name).toBe("Employee Alice Johnson")
		expect(employee1.departmentId).toBe(sales.id)
		const employee2 = await generateTestEmployee(sales.id, "Bob Smith")
		expect(employee2.name).toBe("Employee Bob Smith")
		expect(employee2.departmentId).toBe(sales.id)
	})

	it("获取所有部门(包括人员数据)", async () => {
		const allDepartments = await getActiveDepartments()
		expect(allDepartments.length).toBeGreaterThanOrEqual(1) // 只包括 Sales 和部门里面的俩名员工
		expect(allDepartments[0].employees.length).toBeGreaterThanOrEqual(2)
	})
})
