import React from "react"
import type { TooltipState } from "./types"

const Tooltip: React.FC<TooltipState> = ({
    visible,
    x,
    y,
    title,
    content,
}) => {
    return (
        <div
            className="tooltip"
            style={{
                opacity: visible ? 1 : 0,
                transform: `translate(${x}px, ${y}px) translateY(${visible ? 0 : 4}px)`,
                left: 0,
                top: 0,
            }}
        >
            <div className="tt-date">{title}</div>
            <div className="tt-note">{content}</div>
        </div>
    )
}

export default Tooltip
