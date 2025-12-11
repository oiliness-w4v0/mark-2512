import { useCallback, useEffect, useState } from "react"
import {
	Background,
	ReactFlow,
	addEdge,
	useEdgesState,
	useNodesState,
} from "@xyflow/react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import type { Edge, Node, OnConnect } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { InferSelectModel } from "drizzle-orm"
import type { departmentRelationships, departments } from "@/db/schema"
import { getDepartments } from "@/server/departments"

type DepartmentSelect = InferSelectModel<typeof departments>
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
	nodes: Array<DepartmentSelect>
	edges: Array<DepartmentRelationshipSelect>
}): { nodes: Array<Node>; edges: Array<Edge> } {
	const nodes: Array<Node> = []
	const edges: Array<Edge> = []

	const maxLevel = dto.nodes.reduce(
		(max, n) => (n.level > max ? n.level : max),
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
					x: index * 180 - totalWidth / 2,
					y: level * 200,
				},
				data: { label: n.name },
				type: "default",
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
