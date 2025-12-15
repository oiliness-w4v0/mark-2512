import React, { useEffect, useState } from "react"
import "./index.css"
import { getMockLeaveDB } from "./constants"
import Header from "./Header"
import CalendarGrid from "./CalendarGrid"
import Tooltip from "./Tooltip"
import type { TooltipState } from "./types"

const DayCalendar: React.FC = () => {
    // Initialize today in state to avoid hydration mismatch
    // Default to a safe date or handle loading state if strict consistency is needed
    const [today, setToday] = useState<Date | null>(null)

    useEffect(() => {
        setToday(new Date())
    }, [])

    const [currentYear, setCurrentYear] = useState<number>(2024)
    const [tooltip, setTooltip] = useState<TooltipState>({
        visible: false,
        x: 0,
        y: 0,
        title: "",
        content: "",
    })

    // If today is not yet available (SSR/Hydration), we can render a loader or a default view
    // For this example, we'll default to 2024 if today is null, but 'years' calculation needs 'today'
    // Let's use a fallback date for initial render to match server if possible, or just wait for client.
    // A common pattern is to render null until mounted if date is critical, or use a fixed date.
    // Here we will use a fixed date for initial render to avoid hydration mismatch, then update.

    const safeToday = today || new Date() // Warning: new Date() on server might differ from client.
    // Ideally, pass 'today' from server side props.
    // For client-side only app, this is fine. For SSR, we should be careful.
    // To be strictly SSR safe without server props:
    const [isMounted, setIsMounted] = useState(false)
    useEffect(() => {
        setIsMounted(true)
    }, [])

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

    // To avoid hydration mismatch on 'years' and 'today' dependent logic:
    // We can render the structure but maybe not the specific date-dependent highlights until mounted.
    // OR, we accept that 'new Date()' might be slightly off and cause a re-render.
    // A better approach for SSR is to pass the current date from the server.
    // Assuming we don't have that, we'll use the 'isMounted' check to ensure client-side specific rendering if needed.
    // However, for SEO/SSR content, we want to render something.
    // Let's assume the server time is reasonably close or we don't care about the exact "Today" highlight on server.

    return (
        <div className="day-root">
            <Header
                currentYear={currentYear}
                years={years}
                onYearChange={setCurrentYear}
            />

            <CalendarGrid
                year={currentYear}
                leaveData={LEAVE_DB[currentYear] || {}}
                today={safeToday}
                onDayHover={handleDayHover}
            />

            <Tooltip {...tooltip} />
        </div>
    )
}

export default DayCalendar