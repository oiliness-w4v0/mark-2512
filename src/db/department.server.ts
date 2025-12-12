import { asc, eq, gt, gte, lt } from "drizzle-orm"
import { departmentRelationships, departments } from "./schema"
import { db } from "@/db"

// 创建部门
export async function createDepartment(
	name: string,
	descrition: string,
	level: number,
) {
	const [newDepartment] = await db
		.insert(departments)
		.values({
			name,
			descrition,
			level,
		})
		.returning()
	return newDepartment
}

// 创建关联
export async function createDepartmentRelationship(
	departmentId: string,
	relatedDepartmentId: string,
) {
	const [newRelationship] = await db
		.insert(departmentRelationships)
		.values({
			departmentId,
			relatedDepartmentId,
		})
		.returning()
	return newRelationship
}

// 获取所有部门数据（按照级别升序排列）
export async function getAllDepartments() {
	const allDepartments = await db
		.select()
		.from(departments)
		.orderBy(asc(departments.level))
	return allDepartments
}

export type DepartmentWithEmployees = NonNullable<
	Awaited<ReturnType<typeof getActiveDepartments>>
>

// 获取所有部门数据（包含人员数据，按照级别升序排列）
export async function getActiveDepartments() {
	const activeDepartments = await db.query.departments.findMany({
		orderBy: asc(departments.level),
		with: {
			employees: true,
		},
	})
	return activeDepartments
}

// 根据ID获取部门数据
export async function getDepartmentById(departmentId: string) {
	const department = await db
		.select()
		.from(departments)
		.where(eq(departments.id, departmentId))
		.limit(1)
	return department[0]
}

// 根据名称获取部门数据
export async function getDepartmentByName(name: string) {
	const department = await db
		.select()
		.from(departments)
		.where(eq(departments.name, name))
		.limit(1)
	return department[0]
}

// 根据ID获取所有自己级别以下的部门
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

// 根据Name获取所有自己级别以下的部门
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

// 获取所有关联关系
export async function getAllDepartmentRelationships() {
	const relationships = await db.select().from(departmentRelationships)
	return relationships
}