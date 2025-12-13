import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { db } from '@/db'
import { departmentRelationships } from '@/db/schema'

export const Route = createFileRoute('/api/department-relationships')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                console.info('Fetching department relationships... @', request.url)

                const res = await db.select().from(departmentRelationships) // Adjust table name as needed
                return json(res)
            }
        }
    }
})
