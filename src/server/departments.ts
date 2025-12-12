import { createServerFn } from '@tanstack/react-start'
import { db } from '@/db'
import { departmentRelationships } from '@/db/schema'
import { getActiveDepartments } from '@/db/department.server'

export const getDepartments = createServerFn({
  method: "GET",
}).handler(async () => {
    const nodes = await getActiveDepartments();
    const edges = await db.select().from(departmentRelationships);
    return {
        nodes,
        edges,
    };
});