import { useCallback, useEffect, useState } from "react"
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
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useServerFn } from "@tanstack/react-start"
import type { Edge, Node, OnConnect } from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { InferSelectModel } from "drizzle-orm"
import type {
	departmentRelationships,
	departments,
	employees,
} from "@/db/schema"
import type { DepartmentWithEmployees } from "@/db/department.server"
import { getDepartments } from "@/server/departments"
import { getEmployeeByIdServer } from "@/server/employees"

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
					x: index * 280 - totalWidth / 2,
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
			type: "custom-edge",
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
const edgeTypes = {
	"custom-edge": CustomEdge,
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
		(params) =>
			setEdges((edgesSnapshot) => {
				return addEdge({ ...params, type: "custom-edge" }, edgesSnapshot)
			}),
		[],
	)

	return (
		<div style={{ width: "100vw", height: "100vh" }}>
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

function DepartmentNode({
	data,
}: {
	data: {
		label: string
		raw: DepartmentSelect
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

function Dialog() {

	const visiable = useStore(store, (s) => s.visiable)
	const userId = useStore(store, (s) => s.userId)
	if (!visiable) return null
	if (!userId) return null

	// console.log("Opening dialog for userId:", userId)

	return (
		<div className="fixed w-full h-full top-0 left-0 flex justify-center items-center z-10">
			<div
				className="absolute w-full h-full top-0 left-0 bg-black/80"
				onClick={() => closeDepartmentDialog()}
			></div>
			<div className="w-2xl h-3/5 bg-white rounded-lg p-4 relative z-5">
				{/* <h1>{userId}</h1> */}
				{/* {isPending && <div>Loading...</div>}
				{error && <div className="text-red-500">Error: {error.message}</div>}
				{data && (
					<div>
						<h2 className="text-2xl font-bold mb-4">员工详情</h2>
						<p><strong>姓名:</strong> {data.name}</p>
						<p><strong>职位:</strong> {data.position}</p>
						<p><strong>邮箱:</strong> {data.email}</p>
						<button
							className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
							onClick={() => closeDepartmentDialog()}
						>
							关闭
						</button>
					</div>
				)} */}
			</div>
		</div>
	)
}
