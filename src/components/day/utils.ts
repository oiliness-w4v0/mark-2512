import type { DayInfo } from "./types"

export const generateMonthDays = (
	year: number,
	month: number,
	today: Date,
): Array<DayInfo> => {
	const firstDayIdx = new Date(year, month - 1, 1).getDay()
	const daysInMonth = new Date(year, month, 0).getDate()
	const totalCells = 42 // Force 6 rows

	const days: Array<DayInfo> = []

	// 1. Pre-padding
	for (let i = 0; i < firstDayIdx; i++) {
		days.push({ type: "empty", id: `prev-${i}` })
	}
	// 2. Days
	for (let d = 1; d <= daysInMonth; d++) {
		const dateObj = new Date(year, month - 1, d)
		const isToday = dateObj.toDateString() === today.toDateString()
		const isPast = dateObj < today && !isToday

		days.push({
			type: "day",
			id: `day-${d}`,
			day: d,
			isToday,
			isPast,
			dateKey: `${month}-${d}`,
		})
	}
	// 3. Post-padding
	const filled = firstDayIdx + daysInMonth
	for (let i = filled; i < totalCells; i++) {
		days.push({ type: "empty", id: `next-${i}` })
	}
	return days
}
