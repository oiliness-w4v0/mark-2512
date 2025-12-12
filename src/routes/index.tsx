import { createFileRoute } from "@tanstack/react-router"
import DepartmentUI from "@/components/DepartmentUI"

export const Route = createFileRoute("/")({
	component: App,
})

function App() {
	return (
		<div>
			<DepartmentUI />
		</div>
	)
}
