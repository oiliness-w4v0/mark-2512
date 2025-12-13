import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { employees } from '@/db/schema'

export const Route = createFileRoute('/api/employees/$id')({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        console.info('Fetching employee by ID... @', request.url, params.id)

        const [employee] = await db
          .select()
          .from(employees)
          .where(eq(employees.id, params.id))

        return json(employee)
      },
    },
  }
})
