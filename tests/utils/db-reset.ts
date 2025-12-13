import { sql } from "drizzle-orm"
import { db } from "@/db"

(async () => {
	await db.execute(sql`DROP TABLE IF EXISTS todos, employees, departments, department_relationships`);
})()
