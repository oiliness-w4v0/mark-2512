import type { Employee } from "@/db/employees.server";
import { createDepartment, createDepartmentRelationship } from "@/db/department.server"
import { createEmployee } from "@/db/employees.server"

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

	return [sales, departmentA, departmentB, departmentC, departmentD, departmentE]
}

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