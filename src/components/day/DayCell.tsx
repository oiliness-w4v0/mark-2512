import React from "react"
import type { DayInfo, LeaveInfo } from "./types"

interface DayCellProps {
    dayInfo: DayInfo
    leaveInfo?: LeaveInfo
    onHover: (
        e: React.MouseEvent<HTMLDivElement>,
        show: boolean,
        title?: string,
        note?: string,
    ) => void
}

const DayCell: React.FC<DayCellProps> = ({ dayInfo, leaveInfo, onHover }) => {
    if (dayInfo.type === "empty") {
        return <div className="day empty"></div>
    }

    const { day, isToday, isPast } = dayInfo

    let className = "day"
    if (isToday) className += " is-today"
    else if (isPast) className += " is-past"

    if (leaveInfo) className += " has-leave"

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
        if (leaveInfo) {
            onHover(e, true, `${day}日`, leaveInfo.note)
        }
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        if (leaveInfo) {
            onHover(e, false)
        }
    }

    return (
        <div
            className={className}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {day}
        </div>
    )
}

export default DayCell
