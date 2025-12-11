import { departmentRelationships, departments } from "./schema"
// import type { InferSelectModel } from 'drizzle-orm';
import { db } from "@/db"

// type DepartmentSelect = InferSelectModel<typeof departments>;

// Function to generate a root department object
// zh: 生成根部门
export async function generateRootDepartment(name: string) {
	const [rootDepartment] = await db
		.insert(departments)
		.values({
			name,
			descrition: `${name} Department`,
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
			name: "Domestic Sales",
			descrition: "Handles domestic sales",
		})
		.returning()

	const [departmentB] = await db
		.insert(departments)
		.values({
			name: "International Sales",
			descrition: "Handles international sales",
		})
		.returning()

	const [departmentC] = await db
		.insert(departments)
		.values({
			name: "Online Sales",
			descrition: "Handles online sales",
		})
		.returning()

	const [departmentD] = await db
		.insert(departments)
		.values({
			name: "Retail Sales",
			descrition: "Handles retail sales",
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

	return [sales, departmentA, departmentB, departmentC]
}
