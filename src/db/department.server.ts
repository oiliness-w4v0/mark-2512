import { eq, gt, gte, lt } from "drizzle-orm"
import { departmentRelationships, departments } from "./schema"
import { db } from "@/db"

// eg: 生成根部门
export async function generateRootDepartment(name: string) {
	const [rootDepartment] = await db
		.insert(departments)
		.values({
			name,
			descrition: `${name} Department`,
			level: 2,
		})
		.returning()

	return rootDepartment
}

// eg: 生成测试部门数据
export async function generateTestDepartments() {
	const sales = await generateRootDepartment("Sales")

	const [departmentA] = await db
		.insert(departments)
		.values({
			name: "A",
			descrition: "Handles A",
			level: 3,
		})
		.returning()

	const [departmentB] = await db
		.insert(departments)
		.values({
			name: "B",
			descrition: "Handles B",
			level: 3,
		})
		.returning()

	const [departmentC] = await db
		.insert(departments)
		.values({
			name: "C",
			descrition: "Handles C",
			level: 4,
		})
		.returning()

	const [departmentD] = await db
		.insert(departments)
		.values({
			name: "D",
			descrition: "Handles D",
			level: 4,
		})
		.returning()

	const [departmentE] = await db
		.insert(departments)
		.values({
			name: "E",
			descrition: "Handles E",
			level: 5,
		})
		.returning()

	// 建立部门关系 root -> A, root -> B, A -> C, A -> D, B -> C, B -> D
	await db.insert(departmentRelationships).values({
		departmentId: sales.id,
		relatedDepartmentId: departmentA.id,
	})
	await db.insert(departmentRelationships).values({
		departmentId: sales.id,
		relatedDepartmentId: departmentB.id,
	})
	await db.insert(departmentRelationships).values({
		departmentId: departmentA.id,
		relatedDepartmentId: departmentC.id,
	})
	await db.insert(departmentRelationships).values({
		departmentId: departmentA.id,
		relatedDepartmentId: departmentD.id,
	})
	await db.insert(departmentRelationships).values({
		departmentId: departmentB.id,
		relatedDepartmentId: departmentC.id,
	})
	await db.insert(departmentRelationships).values({
		departmentId: departmentB.id,
		relatedDepartmentId: departmentD.id,
	})
	await db.insert(departmentRelationships).values({
		departmentId: departmentD.id,
		relatedDepartmentId: departmentE.id,
	})

	return [sales, departmentA, departmentB, departmentC, departmentD]
}

// eg: 获取所有部门数据
export async function getAllDepartments() {
	const allDepartments = await db.select().from(departments)
	return allDepartments
}

// eg: 获取所有部门数据（包含人员数据）
export async function getActiveDepartments() {
	const activeDepartments = await db.query.departments.findMany({
		with: {
			employees: true,
		},
	})
	return activeDepartments
}

// eg: 根据ID获取部门数据
export async function getDepartmentById(departmentId: string) {
	const department = await db
		.select()
		.from(departments)
		.where(eq(departments.id, departmentId))
		.limit(1)
	return department[0]
}

// eg: 根据名称获取部门数据
export async function getDepartmentByName(name: string) {
	const department = await db
		.select()
		.from(departments)
		.where(eq(departments.name, name))
		.limit(1)
	return department[0]
}

// eg: 根据ID获取所有自己级别以下的部门
export async function getSubDepartments(departmentId: string) {
	// First, get the level of the specified department
	const department = await getDepartmentById(departmentId)

	// Then, get all departments with a higher level number (lower rank)
	const subDepartments = await db
		.select()
		.from(departments)
		.where(lt(departments.level, department.level))

	return subDepartments
}

// eg: 根据Name获取所有自己级别以下的部门
export async function getSubDepartmentsByName(name: string, have?: boolean) {
	// First, get the department by name
	const department = await getDepartmentByName(name)

	const subDepartments = have
		? await db
				.select()
				.from(departments)
				.where(gte(departments.level, department.level))
		: await db
				.select()
				.from(departments)
				.where(gt(departments.level, department.level))

	return subDepartments
}
