import React, { useEffect, useRef, useState } from "react"
import MonthUnit from "./MonthUnit"
import type { LeaveDataMap } from "./types"

interface CalendarGridProps {
    year: number
    leaveData: LeaveDataMap
    today: Date
    onDayHover: (
        e: React.MouseEvent<HTMLDivElement>,
        show: boolean,
        title?: string,
        note?: string,
    ) => void
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
    year,
    leaveData,
    today,
    onDayHover,
}) => {
    const gridRef = useRef<HTMLDivElement>(null)
    const monthRefs = useRef<Array<HTMLDivElement | null>>([])

    // Magic Border State
    const [borderStyle, setBorderStyle] = useState<React.CSSProperties>({
        opacity: 0,
        width: 0,
        height: 0,
        transform: "translate(0,0)",
    })

    const moveBorder = (targetEl: HTMLElement) => {
        if (!gridRef.current) return

        const parentRect = gridRef.current.getBoundingClientRect()
        const elRect = targetEl.getBoundingClientRect()
        const offset = 8 // visual padding

        const top = elRect.top - parentRect.top - offset / 2
        const left = elRect.left - parentRect.left - offset / 2

        setBorderStyle({
            opacity: 1,
            width: elRect.width + offset,
            height: elRect.height + offset,
            transform: `translate(${left}px, ${top}px)`,
        })
    }

    const handleUnitHover = (
        _e: React.MouseEvent<HTMLDivElement>,
        month: number,
    ) => {
        const el = monthRefs.current[month - 1]
        if (el) moveBorder(el)
    }

    const handleGridLeave = () => {
        const currentMonthIdx = today.getMonth()
        // Only return to current month if viewing current year
        if (
            year === today.getFullYear() &&
            monthRefs.current[currentMonthIdx]
        ) {
            moveBorder(monthRefs.current[currentMonthIdx])
        } else {
            setBorderStyle((prev) => ({ ...prev, opacity: 0 }))
        }
    }

    // Reset border on year change or mount
    useEffect(() => {
        if (year === today.getFullYear()) {
            const currentMonthIdx = today.getMonth()
            // setTimeout ensures DOM is fully painted
            setTimeout(() => {
                const el = monthRefs.current[currentMonthIdx]
                if (el) moveBorder(el)
            }, 50)
        } else {
            setBorderStyle((prev) => ({ ...prev, opacity: 0 }))
        }
    }, [year, today])

    return (
        <div
            className="calendar-grid"
            ref={gridRef}
            onMouseLeave={handleGridLeave}
        >
            <div className="magic-border" style={borderStyle}></div>

            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <MonthUnit
                    key={m}
                    year={year}
                    month={m}
                    leaveData={leaveData}
                    today={today}
                    ref={(el) => {
                        monthRefs.current[m - 1] = el
                    }}
                    onUnitHover={handleUnitHover}
                    onDayHover={onDayHover}
                />
            ))}
        </div>
    )
}

export default CalendarGrid
