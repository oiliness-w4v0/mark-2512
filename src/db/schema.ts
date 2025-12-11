import {
	boolean,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

export const todos = pgTable("todos", {
	id: serial("id").primaryKey(),
	title: text("title").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
})

// 部门表
export const departments = pgTable("departments", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	descrition: text("description"),
	// 区分部门的级别，默认10，数字越小级别越高
	// 目前暂定：0：超级管理员，1：管理员，2：公司级，3：一级部门，4：二级部门，依此类推
	level: serial("level").$defaultFn(() => 10).notNull(),

	isActive: boolean("is_active").default(true),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})

// 部门关联表
export const departmentRelationships = pgTable(
	"department_relationships",
	{
		departmentId: uuid("department_id")
			.notNull()
			.references(() => departments.id, { onDelete: "cascade" }),
		relatedDepartmentId: uuid("related_department_id")
			.notNull()
			.references(() => departments.id, { onDelete: "cascade" }),
	},
	(table) => ({
		pk: primaryKey({
			columns: [table.departmentId, table.relatedDepartmentId],
		}),
		// 防止重复的相反关系（如果需要）
		uniqueReverse: primaryKey({
			columns: [table.relatedDepartmentId, table.departmentId],
		}),
	}),
)

// 定义关系
export const departmentsRelations = relations(departments, ({ many }) => ({
	relationships: many(departmentRelationships),
}))

export const departmentRelationshipsRelations = relations(
	departmentRelationships,
	({ one }) => ({
		department: one(departments, {
			fields: [departmentRelationships.departmentId],
			references: [departments.id],
		}),
		relatedDepartment: one(departments, {
			fields: [departmentRelationships.relatedDepartmentId],
			references: [departments.id],
		}),
	}),
)
