import { employees } from "./schema"
import type { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { db } from "@/db"

export type Employee = InferInsertModel<typeof employees>
export type EmployeeSelect = InferSelectModel<typeof employees>

// 创建员工
export async function createEmployee(employee: Employee) {
    const [newEmployee] = await db
        .insert(employees)
        .values(employee)
        .returning()
    return newEmployee
}

// 获取所有员工
export async function getAllEmployees() {
    const allEmployees = await db.select().from(employees)
    return allEmployees
}