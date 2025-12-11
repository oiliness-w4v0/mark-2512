import { departmentRelationships, departments } from './schema'
// import type { InferSelectModel } from 'drizzle-orm';
import { db } from '@/db'

// type DepartmentSelect = InferSelectModel<typeof departments>;

// // Function to build a hierarchical structure of departments based on parent-child relationships
// // zh: 构建基于父子关系的部门层级结构的函数
// export function getDepartmentHierarchy(dps: Array<DepartmentSelect>) {
//     const departmentMap: Map<number, { id: number; name: string; parentId: number | null; children: Array<any> }> = new Map();

//     // Initialize the map
//     // zh: 初始化映射
//     dps.forEach(dept => {
//         departmentMap.set(dept.id, { ...dept, children: [] });
//     })

//     const hierarchy: Array<{ id: number; name: string; parentId: number | null; children: Array<any> }> = [];

//     // Build the hierarchy
//     // zh: 构建层级结构
//     dps.forEach(dept => {
//         const departmentNode = departmentMap.get(dept.id);
//         if (dept.parentId !== null) {
//             const parentNode = departmentMap.get(dept.parentId);
//             if (parentNode) {
//                 parentNode.children.push(departmentNode);
//             }
//         } else {
//             hierarchy.push(departmentNode!);
//         }
//     });
//     return hierarchy;
// }

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

// Function to generate test department data (basic tree structure)
// zh: 生成测试部门数据
export async function generateTestDepartments() {
  const sales = await generateRootDepartment('Sales')

  const [departmentA] = await db
    .insert(departments)
    .values({
      name: 'Domestic Sales',
      descrition: 'Handles domestic sales',
    })
    .returning()

  const [departmentB] = await db
    .insert(departments)
    .values({
      name: 'International Sales',
      descrition: 'Handles international sales',
    })
    .returning()

  const [departmentC] = await db
    .insert(departments)
    .values({
      name: 'Online Sales',
      descrition: 'Handles online sales',
    })
    .returning()

  // 建立部门关系 root -> A, root -> B, A -> C
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

  return [sales, departmentA, departmentB, departmentC]
}

// // Function to generate test department data ()
// // zh: 生成测试部门数据（带有矩阵结构的树形）
// export async function generateComplexTestDepartments() {
//     const sales = await generateRootDepartment('Sales');

//     const [departmentA] = await db.insert(departments).values({
//         name: 'Domestic Sales',
//         parentId: sales.id,
//     }).returning();

//     const [departmentB] = await db.insert(departments).values({
//         name: 'International Sales',
//         parentId: sales.id,
//     }).returning();

//     const [departmentC] = await db.insert(departments).values({
//         name: 'Online Sales',
//         parentId: departmentA.id,
//     }).returning();

//     const [departmentD] = await db.insert(departments).values({
//         name: 'Retail Sales',
//         parentId: departmentA.id,
//     }).returning();
// }
