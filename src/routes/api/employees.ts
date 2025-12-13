import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { db } from "@/db"
import { employees } from "@/db/schema"

export const Route = createFileRoute("/api/employees")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				console.info("Fetching employees... @", request.url)

				// 
				const res = await db.select().from(employees)
				return json(res)
			},
		},
	},
})
