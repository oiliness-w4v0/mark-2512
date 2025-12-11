import { beforeAll, describe, expect, it } from 'vitest';
import { db } from '@/db';
import { departments } from '@/db/schema';
import { generateTestDepartments } from '@/db/department.server';

describe("departments", () => {
    beforeAll(() => {
        db.delete(departments)
    })

    it('test demo', async () => {
        const [sales, departmentA, departmentB, departmentC] = await generateTestDepartments();
        expect(sales.name).toBe('Sales');
        expect(departmentA.parentId).toBe(sales.id);
        expect(departmentB.parentId).toBe(sales.id);
        expect(departmentC.parentId).toBe(departmentA.id);
    })
})