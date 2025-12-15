import {
	CircleCheckIcon,
	FileMinusCornerIcon,
	ShieldAlertIcon,
} from "lucide-react"


import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"

interface Form {
  id: number;
  name: string;
  description: string;
  department: string;
  status: string;
}

interface FormIndexProps {
  forms: Array<Form>;
}

export default function FormIndex({ forms }: FormIndexProps) {
	return (
		<div className="grid grid-cols-3 gap-4">
			{forms.map((form) => {
        return (
      <Item variant="outline" className="flex-1 px-3 py-3 cursor-pointer hover:bg-gray-50" key={form.id}>
				<ItemMedia variant="icon">
					<FileMinusCornerIcon />
				</ItemMedia>
				<ItemContent>
              <ItemTitle>{form.name} ({form.status})</ItemTitle>
					<ItemDescription>
						{form.description} - 所属部门：{form.department}
					</ItemDescription>
				</ItemContent>
			</Item>
        )
      })}
		</div>
	)
}
