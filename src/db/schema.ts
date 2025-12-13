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
import type { InferInsertModel, InferSelectModel} from "drizzle-orm";

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
	(table) => [
		primaryKey({
			columns: [table.departmentId, table.relatedDepartmentId],
		}),
		// 防止重复的相反关系（如果需要）
		primaryKey({
			columns: [table.relatedDepartmentId, table.departmentId],
		}),
	],
)

// 定义关系
export const departmentsRelations = relations(departments, ({ many }) => ({
	relationships: many(departmentRelationships),
	employees: many(employees),
}))

// 定义关系
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

// 人员表
export const employees = pgTable("employees", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	departmentId: uuid("department_id")
		.notNull()
		.references(() => departments.id, { onDelete: "set null" }),
	position: text("position"), // 职位
	identityCard: text("identity_card").notNull().unique(), // 身份证号
	phone: text("phone"), // 电话号码
	email: text("email").notNull(), // 邮箱
	isActive: boolean("is_active").default(true), // 人员信息是否有效
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
})

// 定义关系
export const employeesRelations = relations(employees, ({ one }) => ({
	department: one(departments, {
		fields: [employees.departmentId],
		references: [departments.id],
	}),
}))

// 请假表单明细
export const leaveForms = pgTable("leave_forms", {
	id: uuid("id").defaultRandom().primaryKey(),
	// 申请人（员工）ID
	employeeId: uuid("employee_id")
		.notNull()
		.references(() => employees.id, { onDelete: "set null" }),
	startDate: timestamp("start_date").notNull(),
	endDate: timestamp("end_date").notNull(),
	reason: text("reason"),
	// 记录创建时间
	createdAt: timestamp("created_at").defaultNow(),
})

// 流程
export const processStatuses = pgTable("process_statuses", {
	id: uuid("id").defaultRandom().primaryKey(),
	formId: uuid("form_id")
		.notNull()
		.references(() => leaveForms.id, { onDelete: "cascade" }),
	status: text("status").$defaultFn(() => 'pending'), // 例如：pending, approved, rejected
	approverId: uuid("approver_id")
		.notNull()
		.references(() => employees.id, { onDelete: "set null" }), // 审批人ID
	comments: text("comments"), // 审批意见
	updatedAt: timestamp("updated_at").defaultNow(), // 记录更新时间 审批人
	createdAt: timestamp("created_at").defaultNow(), // 记录创建时间 发起人
})

// 定义关系 一个人员可以有多个请假表单
export const leaveFormsRelations = relations(leaveForms, ({ one }) => ({
	employee: one(employees, {
		fields: [leaveForms.employeeId],
		references: [employees.id],
	}),
}))

export type Employees = InferInsertModel<typeof employees>
export type EmployeesSelect = InferSelectModel<typeof employees>

export type Departments = InferInsertModel<typeof departments>
export type DepartmentsSelect = InferSelectModel<typeof departments>

export type DepartmentWithEmployees = DepartmentsSelect & {
	employees: Array<EmployeesSelect>
}
export type LeaveForms = InferInsertModel<typeof leaveForms>
export type LeaveFormsSelect = InferSelectModel<typeof leaveForms>

export type ProcessStatuses = InferInsertModel<typeof processStatuses>
export type ProcessStatusesSelect = InferSelectModel<
	typeof processStatuses
>

export type DepartmentRelationships = InferInsertModel<
	typeof departmentRelationships
>
export type DepartmentRelationshipsSelect = InferSelectModel<
	typeof departmentRelationships
>
