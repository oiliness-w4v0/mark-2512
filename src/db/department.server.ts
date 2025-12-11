import { eq, gt, lt } from "drizzle-orm"
import { departmentRelationships, departments } from "./schema"
import type { InferSelectModel } from "drizzle-orm"
import { db } from "@/db"

type DepartmentSelect = InferSelectModel<typeof departments>

// Function to generate a root department object
// zh: 生成根部门
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

// Function to generate test department data
// zh: 生成测试部门数据
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

// Functions to retrieve department data
// zh: 获取所有部门数据
export async function getAllDepartments() {
	const allDepartments = await db.select().from(departments)
	return allDepartments
}

// Function to retrieve a department by ID
// zh: 根据ID获取部门数据
export async function getDepartmentById(departmentId: string) {
	const department = await db
		.select()
		.from(departments)
		.where(eq(departments.id, departmentId))
		.limit(1)
	return department[0]
}

// Function to retrieve a department by name
// zh: 根据名称获取部门数据
export async function getDepartmentByName(name: string) {
	const department = await db
		.select()
		.from(departments)
		.where(eq(departments.name, name))
		.limit(1)
	return department[0]
}

// zh: 根据ID获取所有自己级别以下的部门
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

// zh: 根据Name获取所有自己级别以下的部门
export async function getSubDepartmentsByName(name: string) {
	// First, get the department by name
	const department = await getDepartmentByName(name)

	// Then, get all departments with a higher level number (lower rank)
	const subDepartments = await db
		.select()
		.from(departments)
		.where(gt(departments.level, department.level))

	return subDepartments
}

// zh: 根据ID获取所有自己级别一下的部门（树形结构）
export async function getSubDepartmentTree(departmentId: string) {
	const dps = await getSubDepartments(departmentId)
	// 将平铺的部门列表转换为树形结构
	return buildDepartmentTree(dps)
}

// zh: 根据Name获取所有自己级别一下的部门（树形结构）
export async function getSubDepartmentTreeByName(name: string) {
	const dps = await getSubDepartmentsByName(name)
	// 将平铺的部门列表转换为树形结构
	return buildDepartmentTree(dps)
}

interface DepartmentNode extends DepartmentSelect {
	children: Array<DepartmentNode>
}

// zh: 将平铺的部门列表转换为树形结构
export function buildDepartmentTree(departmentsList: Array<DepartmentSelect>): Map<string, DepartmentNode> {
	// 找到最小的level作为根节点
	const rootDepartment = departmentsList.reduce((prev, curr) => {
		return prev.level < curr.level ? prev : curr
	})

	const departmentMap: Map<string, DepartmentNode> = new Map()

	departmentsList.forEach(dept => {
		departmentMap.set(dept.id, { ...dept, children: [] })
	})

	departmentsList.forEach(dept => {
		if (dept.level > rootDepartment.level) {
			// Example logic, assuming we have a way to find parent department
			const parentDept = departmentsList.find(d => d.level === dept.level - 1)
			if (parentDept) {
				const parent = departmentMap.get(parentDept.id)
				parent?.children.push(departmentMap.get(dept.id)!)
			}
		}
	})

	return (new Map()).set(rootDepartment.id, departmentMap.get(rootDepartment.id)!)
}
