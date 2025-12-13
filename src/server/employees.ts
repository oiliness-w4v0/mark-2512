import z from "zod";
import { createServerFn } from '@tanstack/react-start'
import { getEmployeeById } from '@/db/employees.server'

// 根据ID获取用户基本信息
export const getEmployeeByIdServer = createServerFn({
  method: 'GET',
})
  .inputValidator(z.object({
    id: z.uuid(),
  }))
  .handler(async ({ data }) => {
    const employee = await getEmployeeById(data.id)
    return employee
  })