import { createServerFn } from "@tanstack/react-start"
import z from "zod";
import {
  deleteDRelationships,
	getActiveDepartments,
	getAllDepartmentRelationships,
	setDRelationships,
} from "@/db/department.server"

// api 获取所有部门及其关系
export const getDepartments = createServerFn({
	method: "GET",
}).handler(async () => {
	const nodes = await getActiveDepartments()
	const edges = await getAllDepartmentRelationships()
	return {
		nodes,
		edges,
	}
})

const DepartmentRelationshipsSchema = z.object({
  relationships: z.array(z.object({
    fromDepartmentId: z.uuid(),
    toDepartmentId: z.uuid(),
  })),
})

// api: 保存关系
export const saveDepartmentRelationships = createServerFn({
	method: "POST",
})
.inputValidator(DepartmentRelationshipsSchema)
.handler(
	async ({ data }) => {
    const { relationships } = data;
		await setDRelationships(relationships)
		return { success: true }
	},
)

// api: 删除关系
export const deleteDepartmentRelationships = createServerFn({
  method: "POST",
})
.inputValidator(DepartmentRelationshipsSchema)
.handler(
	async ({ data }) => {
    const { relationships } = data;
		await deleteDRelationships(relationships)
		return { success: true }
	},
)