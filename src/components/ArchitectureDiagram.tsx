import { Suspense, useCallback, useEffect, useState } from "react"
import { Store, useStore } from "@tanstack/react-store"

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
import { useSuspenseQuery } from "@tanstack/react-query"
import type { Edge, Node, OnConnect } from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import type { DepartmentWithEmployees } from "@/db/schema"
import { employeesQueryOptions } from "@/utils/employees"

const nodeTypes = {
	department: DepartmentNode,
}

const edgeTypes = {
	"custom-edge": CustomEdge,
}

export const store = new Store({
	visiable: false,
	userId: "" as string | null,
})

export function openDepartmentDialog(userId: string) {
	store.setState({ visiable: true, userId })
}

export function closeDepartmentDialog() {
	store.setState({ visiable: false, userId: null })
}

export function ArchitectureDiagram({ initNodes, initEdges }: { initNodes: Array<Node>, initEdges: Array<Edge> }) {
	const [nodes, _, onNodesChange] = useNodesState<Node>(initNodes)
	const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initEdges)

	const onConnect: OnConnect = useCallback(
		(params) =>
			setEdges((edgesSnapshot) => {
				return addEdge({ ...params, type: "custom-edge" }, edgesSnapshot)
			}),
		[],
	)

	return (
		<div style={{ width: "100vw", height: "100vh" }} className="relative">
			<Dialog />
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
						onClick={() => openDepartmentDialog(emp.id)}
					>
						<input
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

function CustomEdge({
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

function Dialog() {
	const visiable = useStore(store, (s) => s.visiable)
	const userId = useStore(store, (s) => s.userId)

	return (
		<div
			className={`fixed w-full h-full top-0 left-0 flex justify-center items-center z-10 transition-opacity duration-150 ${
				visiable ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			<div
				className={`absolute w-full h-full top-0 left-0 bg-black/80 transition-opacity duration-150 ${
					visiable ? "opacity-80" : "opacity-0"
				}`}
				onClick={() => closeDepartmentDialog()}
			></div>
			<div
				className={`w-full max-w-2xl h-3/5 bg-white rounded-lg p-4 relative z-5 overflow-auto transition-all duration-150 transform ${
					visiable ? "scale-100 opacity-100" : "scale-95 opacity-0"
				}`}
			>
				{userId && (
					<Suspense fallback={<DialogFallback />}>
						<DialogContent userId={userId} />
					</Suspense>
				)}
			</div>
		</div>
	)
}

function DialogFallback() {
	return (
		<div className="flex h-full w-full items-center justify-center">
			<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
		</div>
	)
}

function DialogContent({ userId }: { userId: string }) {
	const { data, error } = useSuspenseQuery(employeesQueryOptions(userId))

	return (
		<div>
			<h1 className="text-xl font-semibold mb-2">{userId}</h1>
			{error && <div className="text-red-500">Error: {error.message}</div>}
			
				<div>
					<h2 className="text-2xl font-bold mb-4">员工详情</h2>
					<p>
						<strong>姓名:</strong> {data.name}
					</p>
					<p>
						<strong>职位:</strong> {data.position}
					</p>
					<p>
						<strong>邮箱:</strong> {data.email}
					</p>
				</div>
			<button
				className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
				onClick={() => closeDepartmentDialog()}
			>
				关闭
			</button>
		</div>
	)
}
