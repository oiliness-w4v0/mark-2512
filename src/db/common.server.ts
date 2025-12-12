import { departmentRelationships, departments, employees } from "./schema"
import { db } from "."

export async function resetTables() {
    await db.delete(employees)
    await db.delete(departmentRelationships)
    await db.delete(departments)
}