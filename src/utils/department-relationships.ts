import { queryOptions } from "@tanstack/react-query"
import axios from "redaxios"
import type {DepartmentRelationships} from "@/db/schema";

export const DEPLOY_URL = "http://localhost:3000"

export const departmentRelationshipsQueryOptions = () =>
	queryOptions({
		queryKey: ["departmentRelationships"],
        queryFn: () =>
            axios
				.get<Array<DepartmentRelationships>>(`${DEPLOY_URL}/api/department-relationships`)
				.then((res) => res.data)
				.catch((err) => {
					console.error("Error fetching departments:", err)
					throw err
				}),
	})
