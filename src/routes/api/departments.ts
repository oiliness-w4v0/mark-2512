import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { asc } from "drizzle-orm"
import { db } from "@/db"
import { departments } from "@/db/schema"

export const Route = createFileRoute("/api/departments")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				console.info("Fetching departments... @", request.url)

				// 获取所有部门信息（包含员工）
				const res = await db.query.departments.findMany({
					orderBy: asc(departments.level),
					with: {
						employees: true,
					},
				})
				return json(res)
			},
		},
	},
})
