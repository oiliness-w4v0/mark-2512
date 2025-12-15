import { queryOptions } from "@tanstack/react-query"
import axios from "redaxios"
import type { DepartmentWithEmployees } from "@/db/schema"

export const DEPLOY_URL = "http://localhost:3000"

export const departmentsQueryOptions = () =>
	queryOptions({
		queryKey: ["departments"],
		queryFn: () =>
			axios
				.get<Array<DepartmentWithEmployees>>(`${DEPLOY_URL}/api/departments`)
				.then((res) => res.data)
				.catch((err) => {
					console.error("Error fetching departments:", err)
					throw err
				}),
	})
