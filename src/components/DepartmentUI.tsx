import { useCallback, useEffect, useState } from "react"
import {
	Background,
	Handle,
	Position,
	ReactFlow,
	addEdge,
	useEdgesState,
	useNodesState
} from "@xyflow/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Edge, Node, OnConnect } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { InferSelectModel } from "drizzle-orm"
import type {
	departmentRelationships,
	departments,
	employees,
} from "@/db/schema"
import type { DepartmentWithEmployees }	from "@/db/department.server"
import { getDepartments } from "@/server/departments"

type DepartmentSelect = InferSelectModel<typeof departments> & {
	employees: Array<InferSelectModel<typeof employees>>
}
type DepartmentRelationshipSelect = InferSelectModel<
	typeof departmentRelationships
>

// 让 ReactFlow 只在客户端渲染（SSR 环境更稳）
function ClientOnly(props: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	if (!mounted) return null
	return <>{props.children}</>
}

function dtoToXyflow(dto: {
	nodes: DepartmentWithEmployees
	edges: Array<DepartmentRelationshipSelect>
}): { nodes: Array<Node>; edges: Array<Edge> } {
	const nodes: Array<Node> = []
	const edges: Array<Edge> = []

	const maxLevel = dto.nodes.reduce(
		(max, node) => (node.level > max ? node.level : max),
		0,
	)
	const levels: Array<Array<DepartmentSelect>> = new Array(maxLevel + 1)
		.fill(0)
		.map(() => [])

	dto.nodes.forEach((node) => {
		levels[node.level].push(node)
	})

	levels.forEach((levelNodes, level) => {
		const totalWidth = (levelNodes.length - 1) * 180
		levelNodes.forEach((n, index) => {
			const obj = {
				id: n.id,
				position: {
					x: index * 250 - totalWidth / 2,
					y: level * 200,
				},
				data: {
					label: n.name,
					raw: n,
				},
				type: "department" as const,
			}
			nodes.push(obj)
		})
	})

	dto.edges.forEach((e) => {
		const obj = {
			id: e.departmentId + "-" + e.relatedDepartmentId,
			source: e.departmentId,
			target: e.relatedDepartmentId,
			type: "default",
		}
		edges.push(obj)
	})

	return {
		nodes,
		edges,
	}
}

const nodeTypes = {
	department: DepartmentNode,
}

export default function App() {
	const qc = useQueryClient()
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

	// console.log("Rendering DepartmentUI")
	const flowQuery = useQuery({
		queryKey: ["flow"],
		queryFn: () => getDepartments(),
	})

	useEffect(() => {
		if (flowQuery.data) {
			const { nodes: dtoNodes, edges: dtoEdges } = dtoToXyflow(flowQuery.data)
			setNodes(dtoNodes)
			setEdges(dtoEdges)
		}
	}, [flowQuery.data])

	const onConnect: OnConnect = useCallback(
		(params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
		[],
	)

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<ClientOnly>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					onNodesChange={onNodesChange}
					onEdgesChange={onEdgesChange}
					onConnect={onConnect}
					fitView
				>
					<Background />
				</ReactFlow>
			</ClientOnly>
		</div>
	)
}

function DepartmentNode({ data }: { data: {
	label: string
	raw: DepartmentSelect
} }) {
	return <div className="border-2 rounded-sm overflow-hidden bg-white shadow-md">
		<Handle type="target" position={Position.Top} />
		<div className="px-2 pt-2">级别：{data.raw.level} </div>
		<div className="px-2 pb-2 font-bold">{data.label}</div>
		<hr />
		<div className="px-2 pt-2 font-semibold">员工列表：</div>
		<ul className="pb-2">
			{data.raw.employees.map((emp) => (
				<li key={emp.id} className="px-2 py-1 hover:bg-gray-200 flex items-center">
					<input // checkbox for employee selection
						type="checkbox"
						className="mr-2"
						disabled
					/>
					{emp.name}
				</li>
			))}
		</ul>
		<Handle type="source" position={Position.Bottom} />
	</div>
}