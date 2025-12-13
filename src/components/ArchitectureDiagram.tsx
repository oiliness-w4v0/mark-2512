import { useCallback, useEffect, useState } from "react"

import {
	Background,
	BaseEdge,
	EdgeLabelRenderer,
	Handle,
	Position,
	ReactFlow,
	addEdge,
	getStraightPath,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "@xyflow/react"
import type { Edge, Node, OnConnect } from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import type { DepartmentWithEmployees } from "@/db/schema"


const nodeTypes = {
	department: DepartmentNode,
}
const edgeTypes = {
	"custom-edge": CustomEdge,
}

export function ArchitectureDiagram({ initNodes, initEdges }: { initNodes: Array<Node>, initEdges: Array<Edge> }) {
	const [nodes, setNodes, onNodesChange] = useNodesState<Node>(initNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initEdges)

	const onConnect: OnConnect = useCallback(
		(params) =>
			setEdges((edgesSnapshot) => {
				return addEdge({ ...params, type: "custom-edge" }, edgesSnapshot)
			}),
		[],
	)

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
			<ClientOnly>
				<ReactFlow
					nodes={nodes}
					edges={edges}
					nodeTypes={nodeTypes}
					edgeTypes={edgeTypes}
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

function ClientOnly(props: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false)
	useEffect(() => setMounted(true), [])
	if (!mounted) return null
	return <>{props.children}</>
}

function DepartmentNode({
	data,
}: {
	data: {
		label: string
		raw: DepartmentWithEmployees
	}
}) {
	return (
		<div className="border-2 rounded-sm overflow-hidden bg-white shadow-md w-64">
			<Handle type="target" position={Position.Top} />
			<div className="px-2 pt-2">级别：{data.raw.level} </div>
			<div className="px-2 pb-2 font-bold">{data.label}</div>
			<hr />
			<div className="px-2 pt-2 font-semibold">员工列表：</div>
			<ul className="pb-2">
				{data.raw.employees.map((emp) => (
					<li
						key={emp.id}
						className="px-2 py-1 hover:bg-gray-200 flex items-center"
					>
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
	)
}

export function CustomEdge({
	id,
	sourceX,
	sourceY,
	targetX,
	targetY,
}: {
	id: string
	sourceX: number
	sourceY: number
	targetX: number
	targetY: number
}) {
	const { setEdges } = useReactFlow()
	const [edgePath, labelX, labelY] = getStraightPath({
		sourceX,
		sourceY,
		targetX,
		targetY,
	})

	return (
		<>
			<BaseEdge id={id} path={edgePath} interactionWidth={20} />
			<EdgeLabelRenderer>
				<button
					style={{
						position: "absolute",
						transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
						pointerEvents: "all",
					}}
					className="nodrag nopan"
					onClick={() => {
						setEdges((es) => es.filter((e) => e.id !== id))
					}}
				>
					delete
				</button>
			</EdgeLabelRenderer>
		</>
	)
}
