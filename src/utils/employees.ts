import { queryOptions } from '@tanstack/react-query'
import axios from 'redaxios'
import type { Employees } from '@/db/schema'

export const DEPLOY_URL = 'http://localhost:3000'

export const employeesQueryOptions = () => 
     queryOptions({
        queryKey: ['employees'],
        queryFn: () =>
            axios
                .get<Array<Employees>>(`${DEPLOY_URL}/api/employees`)
                .then((res) => res.data)
                .catch((err) => {
                    console.error('Error fetching employees:', err)
                    throw err
                }),
     })
