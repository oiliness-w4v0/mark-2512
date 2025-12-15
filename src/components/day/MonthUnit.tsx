import React, { forwardRef, useMemo } from "react"
import { generateMonthDays } from "./utils"
import DayCell from "./DayCell"
import type { LeaveDataMap } from "./types"

interface MonthUnitProps {
    year: number
    month: number
    leaveData: LeaveDataMap
    today: Date
    onUnitHover: (e: React.MouseEvent<HTMLDivElement>, month: number) => void
    onDayHover: (
        e: React.MouseEvent<HTMLDivElement>,
        show: boolean,
        title?: string,
        note?: string,
    ) => void
}

const MonthUnit = forwardRef<HTMLDivElement, MonthUnitProps>(
    ({ year, month, leaveData, today, onUnitHover, onDayHover }, ref) => {
        const days = useMemo(
            () => generateMonthDays(year, month, today),
            [year, month, today],
        )
        const leaveCount = Object.keys(leaveData).filter((k) =>
            k.startsWith(`${month}-`),
        ).length

        return (
            <div
                className="month-unit"
                ref={ref}
                onMouseEnter={(e) => onUnitHover(e, month)}
            >
                <div className="month-header">
                    <span>{month}月</span>
                    {leaveCount > 0 && (
                        <span className="stat-badge">{leaveCount}天</span>
                    )}
                </div>

                <div className="days-container">
                    {["日", "一", "二", "三", "四", "五", "六"].map((w) => (
                        <div key={w} className="weekday">
                            {w}
                        </div>
                    ))}

                    {days.map((dayObj) => (
                        <DayCell
                            key={dayObj.id}
                            dayInfo={dayObj}
                            leaveInfo={
                                dayObj.type === "day" && dayObj.dateKey
                                    ? leaveData[dayObj.dateKey]
                                    : undefined
                            }
                            onHover={(e, show, title, note) => {
                                onDayHover(e, show, `${month}月${title}`, note)
                            }}
                        />
                    ))}
                </div>
            </div>
        )
    },
)

MonthUnit.displayName = "MonthUnit"

export default MonthUnit
