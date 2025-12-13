import {   eq } from "drizzle-orm"
import { employees } from "./schema"
import type {InferInsertModel, InferSelectModel} from "drizzle-orm";
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

// 根据ID获取员工
export async function getEmployeeById(id: string) {
    const employee = await db
        .select()
        .from(employees)
        .where(eq(employees.id, id))
        .limit(1)
    return employee[0]
}

// 更新员工信息
export async function updateEmployee(id: string, updatedData: Partial<Employee>) {
    const [updatedEmployee] = await db
        .update(employees)
        .set(updatedData)
        .where(eq(employees.id, id))
        .returning()
    return updatedEmployee
}

// 删除员工
export async function deleteEmployee(id: string) {
    await db.delete(employees).where(eq(employees.id, id))
}