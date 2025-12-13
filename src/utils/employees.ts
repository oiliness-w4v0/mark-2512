import { queryOptions } from '@tanstack/react-query'
import axios from 'redaxios'
import type { Employees } from '@/db/schema'

export const DEPLOY_URL = 'http://localhost:3000'

export const employeesQueryOptions = (id: string) => 
     queryOptions({
        queryKey: ['employees', id],
        queryFn: () =>
            axios
                .get<Employees>(`${DEPLOY_URL}/api/employees/` + id)
                .then((res) => res.data)
                .catch((err) => {
                    console.error('Error fetching employees:', err)
                    throw err
                }),
     })
