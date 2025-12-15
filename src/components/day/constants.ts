import { YearLeaveDB } from "./types"

// Use a function to get today to avoid module-level side effects if possible,
// but for constants it's often acceptable.
// However, to ensure consistency across the app, we might want to pass 'today' from the top level.
// For this mock data, we'll just instantiate it here.

const TODAY = new Date()

export const getMockLeaveDB = (): YearLeaveDB => ({
	2024: {
		"1-15": { note: "事假" },
		"2-10": { note: "病假" },
		"2-11": { note: "病假" },
		"2-12": { note: "病假" },
		// Dynamic today for demo
		[`${TODAY.getMonth() + 1}-${TODAY.getDate()}`]: {
			note: "今日处理重要事务",
		},
		"5-1": { note: "劳动节" },
		"5-2": { note: "年假" },
		"5-3": { note: "年假" },
		"5-4": { note: "年假" },
		"10-1": { note: "国庆" },
		"10-2": { note: "国庆" },
	},
	2023: {
		"12-25": { note: "圣诞节" },
	},
	2025: {
		"1-1": { note: "元旦" },
	},
})
