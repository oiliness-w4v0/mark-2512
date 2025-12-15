import React from "react"

interface HeaderProps {
    currentYear: number
    years: Array<number>
    onYearChange: (year: number) => void
}

const Header: React.FC<HeaderProps> = ({
    currentYear,
    years,
    onYearChange,
}) => {
    return (
        <header className="top-bar">
            <div className="user-profile">
                <div className="avatar">李</div>
                <div className="user-info">
                    <div className="user-name">李逍遥</div>
                    <div className="user-id">ID: 510***********001X</div>
                </div>
            </div>
            <nav className="year-tabs">
                {years.map((y) => (
                    <button
                        key={y}
                        className={`tab-btn ${y === currentYear ? "active" : ""}`}
                        onClick={() => onYearChange(y)}
                    >
                        {y}
                    </button>
                ))}
            </nav>
        </header>
    )
}

export default Header
