import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { format } from "date-fns"
import { CalendarIcon, ExternalLinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSet,
} from "@/components/ui/field"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer"
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemTitle,
} from "@/components/ui/item"
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export const Route = createFileRoute("/leave-approval copy")({
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
		startTime: "",
		endTime: "",
	})
	const [errors, setErrors] = useState<Record<string, string>>({})
	const [submissionStatus, setSubmissionStatus] = useState<
		"idle" | "submitting" | "submitted" | "approved" | "rejected"
	>("idle")
	const [drawerOpen, setDrawerOpen] = useState(false)
	const [selectingField, setSelectingField] = useState<
		"name" | "approver" | null
	>(null)
	const [history, setHistory] = useState<Array<any>>([
		{
			name: "张三",
			reason: "家庭事务",
			approverId: "2",
			startDate: new Date("2025-12-15"),
			endDate: new Date("2025-12-16"),
			startTime: "09:00",
			endTime: "17:00",
			status: "approved",
			submittedAt: new Date("2025-12-10"),
			approverName: "李四"
		},
		{
			name: "李四",
			reason: "生病",
			approverId: "3",
			startDate: new Date("2025-12-12"),
			endDate: new Date("2025-12-12"),
			startTime: "09:00",
			endTime: "14:00",
			status: "rejected",
			submittedAt: new Date("2025-12-09"),
			approverName: "王五"
		},
		{
			name: "王五",
			reason: "出差",
			approverId: "1",
			startDate: new Date("2025-12-20"),
			endDate: new Date("2025-12-22"),
			startTime: "00:00",
			endTime: "00:00",
			status: "submitted",
			submittedAt: new Date("2025-12-11"),
			approverName: "张三"
		}
	])
	const [startDate, setStartDate] = useState<Date>()
	const [endDate, setEndDate] = useState<Date>()

	const getSelectedApproverName = () => {
		const approver = employees.find((emp) => emp.id === formData.approverId)
		return approver ? approver.name : ""
	}

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
		if (!startDate) newErrors.startDate = "请选择开始日期"
		if (!endDate) newErrors.endDate = "请选择结束日期"
		if (!formData.startTime) newErrors.startTime = "请选择开始时间"
		if (!formData.endTime) newErrors.endTime = "请选择结束时间"
		if (startDate && endDate && startDate > endDate) {
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
				const finalStatus = Math.random() > 0.5 ? "approved" : "rejected"
				setSubmissionStatus(finalStatus)
				// 添加到历史记录
				const approver = employees.find((emp) => emp.id === formData.approverId)
				setHistory(prev => [...prev, {
					...formData,
					startDate,
					endDate,
					status: finalStatus,
					submittedAt: new Date(),
					approverName: approver ? approver.name : ""
				}])
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
			startTime: "",
			endTime: "",
		})
		setStartDate(undefined)
		setEndDate(undefined)
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
			if (errors.approverId) {
				setErrors((prev) => ({ ...prev, approverId: "" }))
			}
		}
		setDrawerOpen(false)
		setSelectingField(null)
	}

	const getTimeLabel = (time: string) => {
		if (time === "09:00") return "上午"
		if (time === "14:00") return "下午"
		if (time === "00:00") return "全天"
		return time
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
								{startDate ? format(startDate, "yyyy-MM-dd") : ""} {getTimeLabel(formData.startTime)} 至 {endDate ? format(endDate, "yyyy-MM-dd") : ""} {getTimeLabel(formData.endTime)}
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
			<div className="w-5xl flex flex-row gap-4">
				<div className="basis-4/6">
					<LeaveForm
						formData={formData}
						errors={errors}
						handleInputChange={handleInputChange}
						handleSubmit={handleSubmit}
						submissionStatus={submissionStatus}
						openDrawer={openDrawer}
						getSelectedApproverName={getSelectedApproverName}
						startDate={startDate}
						setStartDate={setStartDate}
						endDate={endDate}
						setEndDate={setEndDate}
						setFormData={setFormData}
						setErrors={setErrors}
					/>
				</div>
				<div className="basis-2/6 flex w-full max-w-md flex-col gap-3">
					{history.length === 0 ? (
						<p className="text-gray-500">暂无历史记录</p>
					) : (
						history.map((record, index) => (
							<Item key={index} variant="outline">
								<ItemContent>
									<ItemTitle>{record.name} 的请假申请</ItemTitle>
									<ItemDescription>
										事由: {record.reason}<br />
										时间: {record.startDate ? format(record.startDate, "yyyy-MM-dd") : ""} {getTimeLabel(record.startTime)} 至 {record.endDate ? format(record.endDate, "yyyy-MM-dd") : ""} {getTimeLabel(record.endTime)}<br />
										审批人: {record.approverName}<br />
										状态: {record.status === "approved" ? "已批准" : record.status === "rejected" ? "已拒绝" : "已提交"}
									</ItemDescription>
								</ItemContent>
          <ItemActions>
            <ExternalLinkIcon className="size-4" />
          </ItemActions>
							</Item>
						))
					)}
				</div>
			</div>
			<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
				<DrawerContent data-vaul-drawer-direction="right">
					<DrawerHeader>
						<DrawerTitle>
							{selectingField === "name" ? "选择姓名" : "选择审批人"}
						</DrawerTitle>
					</DrawerHeader>
					<div className="p-4">
						{employees.map((employee) => (
							<Button
								key={employee.id}
								variant="ghost"
								className="w-full justify-start"
								onClick={() => selectEmployee(employee)}
							>
								{employee.name}
							</Button>
						))}
					</div>
				</DrawerContent>
			</Drawer>
		</div>
	)
}

function LeaveForm({
	formData,
	errors,
	handleInputChange,
	handleSubmit,
	submissionStatus,
	openDrawer,
	getSelectedApproverName,
	startDate,
	setStartDate,
	endDate,
	setEndDate,
	setFormData,
	setErrors,
}: {
	formData: any
	errors: Record<string, string>
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
	handleSubmit: (e: React.FormEvent) => void
	submissionStatus: string
	openDrawer: (field: "name" | "approver") => void
	getSelectedApproverName: () => string
	startDate: Date | undefined
	setStartDate: (date: Date | undefined) => void
	endDate: Date | undefined
	setEndDate: (date: Date | undefined) => void
	setFormData: React.Dispatch<React.SetStateAction<any>>
	setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
}) {
	const handleTimeChange = (name: string, value: string) => {
		let timeValue = ""
		if (value === "上午") timeValue = "09:00"
		else if (value === "下午") timeValue = "14:00"
		else if (value === "全天") timeValue = "00:00"
		setFormData((prev: any) => ({ ...prev, [name]: timeValue }))
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }))
		}
	}
	return (
		<div className="w-full">
			<form onSubmit={handleSubmit}>
				<FieldGroup>
					<FieldSet>
						<FieldLegend>请假申请</FieldLegend>
						<FieldDescription>
							请填写以下信息提交请假申请
						</FieldDescription>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor="name">姓名</FieldLabel>
								<Input
									id="name"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									placeholder="请输入姓名"
									required
								/>
								<FieldError>{errors.name}</FieldError>
							</Field>
							<Field>
								<FieldLabel htmlFor="reason">事由</FieldLabel>
								<Textarea
									id="reason"
									name="reason"
									value={formData.reason}
									onChange={handleInputChange}
									placeholder="请输入请假事由"
									required
								/>
								<FieldError>{errors.reason}</FieldError>
							</Field>
							<Field>
								<FieldLabel htmlFor="approver">审批人</FieldLabel>
								<Button
									type="button"
									variant="outline"
									onClick={() => openDrawer("approver")}
									className="w-full justify-start"
								>
									{getSelectedApproverName() || "请选择审批人"}
								</Button>
								<FieldError>{errors.approverId}</FieldError>
							</Field>
							<Field>
								<FieldLabel>开始日期和时间</FieldLabel>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"justify-start text-left font-normal",
													!startDate && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{startDate ? format(startDate, "yyyy-MM-dd") : <span>选择日期</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={startDate}
												onSelect={(date) => {
													setStartDate(date)
													if (errors.startDate) {
														setErrors((prev) => ({ ...prev, startDate: "" }))
													}
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<Select onValueChange={(value) => handleTimeChange("startTime", value)}>
										<SelectTrigger>
											<SelectValue placeholder="选择时间段" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="上午">上午</SelectItem>
											<SelectItem value="下午">下午</SelectItem>
											<SelectItem value="全天">全天</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<FieldError>{errors.startDate}</FieldError>
								<FieldError>{errors.startTime}</FieldError>
							</Field>
							<Field>
								<FieldLabel>结束日期和时间</FieldLabel>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-2">
									<Popover>
										<PopoverTrigger asChild>
											<Button
												variant={"outline"}
												className={cn(
													"justify-start text-left font-normal",
													!endDate && "text-muted-foreground"
												)}
											>
												<CalendarIcon className="mr-2 h-4 w-4" />
												{endDate ? format(endDate, "yyyy-MM-dd") : <span>选择日期</span>}
											</Button>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0">
											<Calendar
												mode="single"
												selected={endDate}
												onSelect={(date) => {
													setEndDate(date)
													if (errors.endDate) {
														setErrors((prev) => ({ ...prev, endDate: "" }))
													}
												}}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
                                    <Select onValueChange={(value) => handleTimeChange("endTime", value)}>
										<SelectTrigger>
											<SelectValue placeholder="选择时间段" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="上午">上午</SelectItem>
											<SelectItem value="下午">下午</SelectItem>
											<SelectItem value="全天">全天</SelectItem>
										</SelectContent>
									</Select>
								</div>
								<FieldError>{errors.endDate}</FieldError>
								<FieldError>{errors.endTime}</FieldError>
							</Field>
						</FieldGroup>
					</FieldSet>
					<Field orientation="horizontal">
						<Button type="submit" disabled={submissionStatus === "submitting"}>
							{submissionStatus === "submitting" ? "提交中..." : "提交申请"}
						</Button>
						<Button variant="outline" type="button" onClick={() => window.location.reload()}>
							取消
						</Button>
					</Field>
				</FieldGroup>
			</form>
		</div>
	)
}
