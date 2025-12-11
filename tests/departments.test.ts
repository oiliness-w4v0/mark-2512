import { beforeAll, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { departmentRelationships, departments } from '@/db/schema';
import { generateTestDepartments } from '@/db/department.server';

describe("departments", () => {
    beforeAll(async () => {
        await db.delete(departments)
    })

    it('departments 表清空', async () => {
        const result = await db.select().from(departments)
        expect(result.length).toBe(0)
    })

    it('创建测试数据', async () => {
        const [sales, departmentA, departmentB, departmentC] = await generateTestDepartments();
        expect(sales.name).toBe('Sales');
        expect(departmentA.name).toBe('Domestic Sales');
        expect(departmentB.name).toBe('International Sales');
        expect(departmentC.name).toBe('Online Sales');
    })

    it('验证部门关系', async () => {
        const allDepartments = await db.select().from(departments);
        const sales = allDepartments.find(dept => dept.name === 'Sales');
        const domesticSales = allDepartments.find(dept => dept.name === 'Domestic Sales');
        const internationalSales = allDepartments.find(dept => dept.name === 'International Sales');
        const onlineSales = allDepartments.find(dept => dept.name === 'Online Sales');
        expect(sales).toBeDefined();
        expect(domesticSales).toBeDefined();
        expect(internationalSales).toBeDefined();
        expect(onlineSales).toBeDefined();
        const relationships = await db.select().from(departmentRelationships);
        const salesToDomestic = relationships.find(rel => rel.departmentId === sales!.id && rel.relatedDepartmentId === domesticSales!.id);
        const salesToInternational = relationships.find(rel => rel.departmentId === sales!.id && rel.relatedDepartmentId === internationalSales!.id);
        const domesticToOnline = relationships.find(rel => rel.departmentId === domesticSales!.id && rel.relatedDepartmentId === onlineSales!.id);
        expect(salesToDomestic).toBeDefined();
        expect(salesToInternational).toBeDefined();
        expect(domesticToOnline).toBeDefined();
    })

//     it('获取部门层级结构', async () => {
//         const allDepartments = await db.select().from(departments);
//         const hierarchy = getDepartmentHierarchy(allDepartments);
//         expect(hierarchy.length).toBe(1); // Only one root department (Sales)
//         expect(hierarchy[0].name).toBe('Sales');
//         expect(hierarchy[0].children.length).toBe(2); // Sales has two children
//         const [domesticSales, internationalSales] = hierarchy[0].children;
//         expect(domesticSales.name).toBe('Domestic Sales');
//         expect(internationalSales.name).toBe('International Sales');
//     })
})