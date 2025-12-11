import { createServerFn } from "@tanstack/react-start";
import { asc } from 'drizzle-orm'
import { db } from '@/db'
import { departmentRelationships, departments } from '@/db/schema'

export const getDepartments = createServerFn({
  method: "GET",
}).handler(async () => {
    const nodes = await db.select().from(departments).orderBy(asc(departments.id));
    const edges = await db.select().from(departmentRelationships);
    return {
        nodes,
        edges,
    };
});