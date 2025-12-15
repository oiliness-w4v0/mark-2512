import { createFileRoute } from "@tanstack/react-router"
import { json } from "@tanstack/react-start"
import { eq } from "drizzle-orm"
import { departments } from "@/db/schema"
import { db } from "@/db"

export const Route = createFileRoute("/api/departments/$id")({
	server: {
		handlers: {
			GET: async ({ request, params }) => {
				console.info("Fetching department by ID... @", request.url, params.id)

				const [department] = await db
					.select()
					.from(departments)
					.where(eq(departments.id, params.id))

				return json(department)
			},
		},
	},
})
