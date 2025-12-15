import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import FormIndex from "@/components/BugReportHistory"
import { TypographyH4 } from "@/components/ui/h4"
import { departments, forms } from "@/data/form-index-data"
import Index from "@/components/Index"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/leave-approval")({
	component: RouteComponent,
})

function RouteComponent() {
	const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

	const filteredForms = selectedDepartment === "all"
		? forms
		: forms.filter(form => form.department === selectedDepartment);

	return (
        <div className="flex gap-4 w-5xl mx-auto py-10 flex-col pt-40">
            <SelectDemo selectedDepartment={selectedDepartment} setSelectedDepartment={setSelectedDepartment} />
			<div className="flex justify-start">
				<TypographyH4>表单索引</TypographyH4>
			</div>
			<FormIndex forms={filteredForms} />
		</div>
	)
}


function SelectDemo({ selectedDepartment, setSelectedDepartment }: { selectedDepartment: string; setSelectedDepartment: (value: string) => void }) {
  return (
    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="选择部门" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>部门</SelectLabel>
          <SelectItem value="all">全部</SelectItem>
          {departments.map((dept) => (
            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}