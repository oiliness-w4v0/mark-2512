import React, { useState } from "react"
import "./index.css"
import { getMockLeaveDB } from "./constants"
import Header from "./Header"
import CalendarGrid from "./CalendarGrid"
import Tooltip from "./Tooltip"
import type { TooltipState } from "./types"

interface DayCalendarProps {
    today?: Date
}

const DayCalendar: React.FC<DayCalendarProps> = ({ today: propToday }) => {
    // Use propToday if provided (SSR/Loader), otherwise fallback to client-side date
    // If propToday is provided from a loader, it ensures SSR consistency.
    const safeToday = propToday || new Date()

    const [currentYear, setCurrentYear] = useState<number>(2024)
    const [tooltip, setTooltip] = useState<TooltipState>({
        visible: false,
        x: 0,
        y: 0,
        title: "",
        content: "",
    })

    // Recalculate years based on safeToday
    const years = Array.from(
        { length: 8 },
        (_, i) => safeToday.getFullYear() - 3 + i,
    )

    const handleDayHover = (
        e: React.MouseEvent<HTMLDivElement>,
        show: boolean,
        title?: string,
        note?: string,
    ) => {
        if (!show) {
            setTooltip((prev) => ({ ...prev, visible: false }))
            return
        }
        const rect = e.currentTarget.getBoundingClientRect()
        const tooltipWidth = 120 // estimate
        const x = rect.left + rect.width / 2 - tooltipWidth / 2
        const y = rect.top - 55 // above the cell

        setTooltip({
            visible: true,
            x,
            y,
            title: title || "",
            content: note || "",
        })
    }

    // Mock DB - in real app, fetch based on year
    const LEAVE_DB = getMockLeaveDB()

    return (
        <div className="day-root">
            <Header
                currentYear={currentYear}
                years={years}
                onYearChange={setCurrentYear}
            />

            <CalendarGrid
                year={currentYear}
                leaveData={LEAVE_DB[currentYear]}
                today={safeToday}
                onDayHover={handleDayHover}
            />

            <Tooltip {...tooltip} />
        </div>
    )
}

export default DayCalendar