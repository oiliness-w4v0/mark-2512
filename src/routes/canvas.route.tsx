import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import "@xyflow/react/dist/style.css"

import type { DepartmentWithEmployees } from "@/db/schema"
import type { DepartmentRelationshipSelect } from "@/db/department.server"
import {
	departmentsQueryOptions,
} from "@/utils/departments"
import {
	departmentRelationshipsQueryOptions,
} from "@/utils/department-relationships"
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram"

export const Route = createFileRoute("/canvas")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(departmentsQueryOptions())
		await context.queryClient.ensureQueryData(
			departmentRelationshipsQueryOptions(),
		)
	},
	component: RouteComponent,
})

function transformToXyflowNodes(departments: Array<DepartmentWithEmployees>) {
	return departments.map((dept, index) => ({
		id: dept.id,
		type: "department" as const,
		position: { x: index * 250, y: index * 150 },
		data: {
			label: dept.name,
			raw: dept,
		},
	}))
}

function transformToXyflowEdges(
	relationships: Array<DepartmentRelationshipSelect>,
) {
	return relationships.map((rel) => ({
		id: rel.departmentId + "-" + rel.relatedDepartmentId,
		source: rel.departmentId,
		target: rel.relatedDepartmentId,
		type: "custom-edge",
	}))
}

function RouteComponent() {
	const { data } = useSuspenseQuery(departmentsQueryOptions())
	const { data: relationships } = useSuspenseQuery(
		departmentRelationshipsQueryOptions(),
	)
	const nodes = transformToXyflowNodes(data)
	const edges = transformToXyflowEdges(relationships)

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<ArchitectureDiagram initNodes={nodes} initEdges={edges} />
		</div>
	)
}
