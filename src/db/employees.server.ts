import { employees } from "./schema"
import { db } from "@/db"

// eg: 创建测试员工数据
export async function generateTestEmployee(departmentId: string, name: string) {
    const [employee1] = await db
        .insert(employees)
        .values({
            name: "Employee " + name,
            identityCard: "ID" + Math.random().toString().slice(2, 10),
            email: name.replace(/\s+/g, "").toLowerCase() + "@163.com",
            phone: "123-456-7890",
            position: "Sales Manager",
            departmentId, // 替换为实际部门 UUID
        })
        .returning()

    return employee1
}