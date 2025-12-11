import { employees } from "./schema"
import { db } from "@/db"

// eg: 创建测试员工数据
export async function generateTestEmployees(departmentId: string) {
    const [employee1] = await db
        .insert(employees)
        .values({
            name: "John1",
            identityCard: "330782199001011234",
            email: "18267094443@163.com",
            phone: "18267094443",
            position: "Sales Manager",
            departmentId, // 替换为实际部门 UUID
        })
        .returning()

    const [employee2] = await db
        .insert(employees)
        .values({
            name: "Jane2",
             identityCard: "330782199002022345",
            email: "330782199@test.com",
            phone: "13967891234",
            position: "Developer",
            departmentId, // 替换为实际部门 UUID
        })
        .returning()

    return [employee1, employee2]
}