import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { BadgeCheckIcon, ChevronDownIcon, ChevronRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from "@/components/ui/field"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item"

export const Route = createFileRoute("/leave-approval")({
	component: RouteComponent,
})

// 测试数据：员工列表
const employees = [
	{ id: "1", name: "张三" },
	{ id: "2", name: "李四" },
	{ id: "3", name: "王五" },
	{ id: "4", name: "赵六" },
	{ id: "5", name: "钱七" },
]

function RouteComponent() {
	const [formData, setFormData] = useState({
		name: "",
		reason: "",
		approverId: "",
		startDate: "",
		endDate: "",
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [submissionStatus, setSubmissionStatus] = useState<
		"idle" | "submitting" | "submitted" | "approved" | "rejected"
	>("idle")
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [selectingField, setSelectingField] = useState<
		"name" | "approver" | null
	>(null)
	const [open, setOpen] = useState(false)
	const [date, setDate] = useState<Date | undefined>(undefined)

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }))
		}
	}

	const validateForm = () => {
		const newErrors: Record<string, string> = {}
		if (!formData.name.trim()) newErrors.name = "姓名不能为空"
		if (!formData.reason.trim()) newErrors.reason = "事由不能为空"
		if (!formData.approverId) newErrors.approverId = "请选择审批人"
		if (!formData.startDate) newErrors.startDate = "请选择开始日期"
		if (!formData.endDate) newErrors.endDate = "请选择结束日期"
		if (
			formData.startDate &&
			formData.endDate &&
			new Date(formData.startDate) > new Date(formData.endDate)
		) {
			newErrors.endDate = "结束日期不能早于开始日期"
		}
		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		setSubmissionStatus("submitting")
		// 模拟提交延迟
		setTimeout(() => {
			setSubmissionStatus("submitted")
			// 模拟审批过程
			setTimeout(() => {
				setSubmissionStatus(Math.random() > 0.5 ? "approved" : "rejected")
			}, 2000)
		}, 1000)
	}

	const resetForm = () => {
		setFormData({
			name: "",
			reason: "",
			approverId: "",
			startDate: "",
			endDate: "",
		})
		setErrors({})
		setSubmissionStatus("idle")
	}

	const openDrawer = (field: "name" | "approver") => {
		setSelectingField(field)
		setDrawerOpen(true)
	}

	const selectEmployee = (employee: { id: string; name: string }) => {
		if (selectingField === "name") {
			setFormData((prev) => ({ ...prev, name: employee.name }))
		} else if (selectingField === "approver") {
			setFormData((prev) => ({ ...prev, approverId: employee.id }))
		}
		setDrawerOpen(false)
		setSelectingField(null)
	}

	const getSelectedApproverName = () => {
		const employee = employees.find((e) => e.id === formData.approverId)
		return employee ? employee.name : ""
	}

	if (
		submissionStatus === "submitted" ||
		submissionStatus === "approved" ||
		submissionStatus === "rejected"
	) {
		return (
			<div className="max-w-md mx-auto mt-10">
				<Card>
					<CardHeader>
						<CardTitle>请假申请进度</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div>
							<Label>姓名</Label>
							<p>{formData.name}</p>
						</div>
						<div>
							<Label>事由</Label>
							<p>{formData.reason}</p>
						</div>
						<div>
							<Label>审批人</Label>
							<p>{getSelectedApproverName()}</p>
						</div>
						<div>
							<Label>请假时间</Label>
							<p>
								{formData.startDate} 至 {formData.endDate}
							</p>
						</div>
						<div>
							{submissionStatus === "submitted" && (
								<p className="text-blue-500">已提交，等待审批...</p>
							)}
							{submissionStatus === "approved" && (
								<p className="text-green-500">已批准！</p>
							)}
							{submissionStatus === "rejected" && (
								<p className="text-red-500">已拒绝。</p>
							)}
						</div>
						<Button onClick={resetForm} variant="outline">
							提交新申请
						</Button>
					</CardContent>
				</Card>
			</div>
		)
	}

	return (
		<div className="min-h-screen flex items-center flex-col pt-12">
			<div className="w-4xl flex flex-row gap-4">
				<div className="basis-4/7">
					<FieldDemo />
				</div>
				<div className="basis-3/7 flex w-full max-w-md flex-col gap-3">
					<Item variant="outline">
						<ItemContent>
							<ItemTitle>Basic Item</ItemTitle>
							<ItemDescription>
								A simple item with title and description.
							</ItemDescription>
						</ItemContent>
						<ItemActions>
							<Button variant="outline" size="sm">
								查看
							</Button>
						</ItemActions>
					</Item>
					<Item variant="outline" size="sm" asChild>
						<a href="#">
							<ItemMedia>
								<BadgeCheckIcon className="size-5" />
							</ItemMedia>
							<ItemContent>
								<ItemTitle>Your profile has been verified.</ItemTitle>
							</ItemContent>
							<ItemActions>
								<ChevronRightIcon className="size-4" />
							</ItemActions>
						</a>
					</Item>
				</div>
			</div>
		</div>
	)
}

function FieldDemo() {
	return (
		<div className="w-full">
			<form>
				<FieldGroup>
					<FieldSet>
						<FieldLegend>Payment Method</FieldLegend>
						<FieldDescription>
							All transactions are secure and encrypted
						</FieldDescription>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="checkout-7j9-card-name-43j">
									Name on Card
								</FieldLabel>
								<Input
									id="checkout-7j9-card-name-43j"
									placeholder="Evil Rabbit"
									required
								/>
							</Field>
							<Field>
								<FieldLabel htmlFor="checkout-7j9-card-number-uw1">
									Card Number
								</FieldLabel>
								<Input
									id="checkout-7j9-card-number-uw1"
									placeholder="1234 5678 9012 3456"
									required
								/>
								<FieldDescription>
									Enter your 16-digit card number
								</FieldDescription>
							</Field>
							<div className="grid grid-cols-3 gap-4">
								<Field>
									<FieldLabel htmlFor="checkout-exp-month-ts6">
										Month
									</FieldLabel>
									<Select defaultValue="">
										<SelectTrigger id="checkout-exp-month-ts6">
											<SelectValue placeholder="MM" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="01">01</SelectItem>
											<SelectItem value="02">02</SelectItem>
											<SelectItem value="03">03</SelectItem>
											<SelectItem value="04">04</SelectItem>
											<SelectItem value="05">05</SelectItem>
											<SelectItem value="06">06</SelectItem>
											<SelectItem value="07">07</SelectItem>
											<SelectItem value="08">08</SelectItem>
											<SelectItem value="09">09</SelectItem>
											<SelectItem value="10">10</SelectItem>
											<SelectItem value="11">11</SelectItem>
											<SelectItem value="12">12</SelectItem>
										</SelectContent>
									</Select>
								</Field>
								<Field>
									<FieldLabel htmlFor="checkout-7j9-exp-year-f59">
										Year
									</FieldLabel>
									<Select defaultValue="">
										<SelectTrigger id="checkout-7j9-exp-year-f59">
											<SelectValue placeholder="YYYY" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="2024">2024</SelectItem>
											<SelectItem value="2025">2025</SelectItem>
											<SelectItem value="2026">2026</SelectItem>
											<SelectItem value="2027">2027</SelectItem>
											<SelectItem value="2028">2028</SelectItem>
											<SelectItem value="2029">2029</SelectItem>
										</SelectContent>
									</Select>
								</Field>
								<Field>
									<FieldLabel htmlFor="checkout-7j9-cvv">CVV</FieldLabel>
									<Input id="checkout-7j9-cvv" placeholder="123" required />
								</Field>
							</div>
						</FieldGroup>
					</FieldSet>
					<FieldSeparator />
					<FieldSet>
						<FieldLegend>Billing Address</FieldLegend>
						<FieldDescription>
							The billing address associated with your payment method
						</FieldDescription>
						<FieldGroup>
							<Field orientation="horizontal">
								<Checkbox
									id="checkout-7j9-same-as-shipping-wgm"
									defaultChecked
								/>
								<FieldLabel
									htmlFor="checkout-7j9-same-as-shipping-wgm"
									className="font-normal"
								>
									Same as shipping address
								</FieldLabel>
							</Field>
						</FieldGroup>
					</FieldSet>
					<FieldSet>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="checkout-7j9-optional-comments">
									Comments
								</FieldLabel>
								<Textarea
									id="checkout-7j9-optional-comments"
									placeholder="Add any additional comments"
									className="resize-none"
								/>
							</Field>
						</FieldGroup>
					</FieldSet>
					<Field orientation="horizontal">
						<Button type="submit">Submit</Button>
						<Button variant="outline" type="button">
							Cancel
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	)
}
