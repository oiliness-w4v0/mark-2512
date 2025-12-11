import { createServerFn } from '@tanstack/react-start'
import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { departmentRelationships, departments } from '@/db/schema'

export const getDepartments = createServerFn({
  method: "GET",
}).handler(async () => {
  console.log(1)
    const nodes = await db.select().from(departments).orderBy(asc(departments.level));
    const edges = await db.select().from(departmentRelationships);
    return {
        nodes,
        edges,
    };
});