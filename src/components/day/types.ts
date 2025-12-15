export interface LeaveInfo {
	note: string
	type?: string
}

export interface LeaveDataMap {
	[dateKey: string]: LeaveInfo
}

export interface YearLeaveDB {
	[year: number]: LeaveDataMap
}

export interface DayInfo {
	type: "empty" | "day"
	id: string
	day?: number
	isToday?: boolean
	isPast?: boolean
	dateKey?: string
}

export interface TooltipState {
	visible: boolean
	x: number
	y: number
	title: string
	content: string
}
