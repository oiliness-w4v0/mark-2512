import React, { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import './index.css';

// --- Types & Interfaces ---

interface LeaveInfo {
  note: string;
  type?: string;
}

interface LeaveDataMap {
  [dateKey: string]: LeaveInfo;
}

interface YearLeaveDB {
  [year: number]: LeaveDataMap;
}

interface DayInfo {
  type: 'empty' | 'day';
  id: string;
  day?: number;
  isToday?: boolean;
  isPast?: boolean;
  dateKey?: string;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  title: string;
  content: string;
}

// --- Constants ---

const TODAY = new Date();

// Mock Data
const LEAVE_DB: YearLeaveDB = {
  2024: {
    "1-15": { note: "事假" },
    "2-10": { note: "病假" }, "2-11": { note: "病假" }, "2-12": { note: "病假" },
    // Dynamic today for demo
    [`${TODAY.getMonth() + 1}-${TODAY.getDate()}`]: { note: "今日处理重要事务" },
    "5-1": { note: "劳动节" }, "5-2": { note: "年假" }, "5-3": { note: "年假" }, "5-4": { note: "年假" },
    "10-1": { note: "国庆" }, "10-2": { note: "国庆" }
  },
  2023: {
      "12-25": { note: "圣诞节"}
  },
  2025: {
      "1-1": { note: "元旦"}
  }
};

// --- Helper Functions ---

const generateMonthDays = (year: number, month: number): Array<DayInfo> => {
  const firstDayIdx = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const totalCells = 42; // Force 6 rows

  const days: Array<DayInfo> = [];

  // 1. Pre-padding
  for (let i = 0; i < firstDayIdx; i++) {
    days.push({ type: 'empty', id: `prev-${i}` });
  }
  // 2. Days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateObj = new Date(year, month - 1, d);
    const isToday = dateObj.toDateString() === TODAY.toDateString();
    const isPast = dateObj < TODAY && !isToday;

    days.push({
      type: 'day',
      id: `day-${d}`,
      day: d,
      isToday,
      isPast,
      dateKey: `${month}-${d}`
    });
  }
  // 3. Post-padding
  const filled = firstDayIdx + daysInMonth;
  for (let i = filled; i < totalCells; i++) {
    days.push({ type: 'empty', id: `next-${i}` });
  }
  return days;
};

// --- Components ---

// 1. Tooltip Component
const Tooltip: React.FC<TooltipState> = ({ visible, x, y, title, content }) => {
  return (
    <div
      className="tooltip"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate(${x}px, ${y}px) translateY(${visible ? 0 : 4}px)`,
        left: 0,
        top: 0
      }}
    >
      <div className="tt-date">{title}</div>
      <div className="tt-note">{content}</div>
    </div>
  );
};

// 2. Header Component
interface HeaderProps {
  currentYear: number;
  years: Array<number>;
  onYearChange: (year: number) => void;
}

const Header: React.FC<HeaderProps> = ({ currentYear, years, onYearChange }) => {
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
        {years.map(y => (
          <button
            key={y}
            className={`tab-btn ${y === currentYear ? 'active' : ''}`}
            onClick={() => onYearChange(y)}
          >
            {y}
          </button>
        ))}
      </nav>
    </header>
  );
};

// 3. DayCell Component
interface DayCellProps {
  dayInfo: DayInfo;
  leaveInfo?: LeaveInfo;
  onHover: (e: React.MouseEvent<HTMLDivElement>, show: boolean, title?: string, note?: string) => void;
}

const DayCell: React.FC<DayCellProps> = ({ dayInfo, leaveInfo, onHover }) => {
  if (dayInfo.type === 'empty') {
    return <div className="day empty"></div>;
  }

  const { day, isToday, isPast } = dayInfo;

  let className = 'day';
  if (isToday) className += ' is-today';
  else if (isPast) className += ' is-past';

  if (leaveInfo) className += ' has-leave';

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (leaveInfo) {
      onHover(e, true, `${day}日`, leaveInfo.note);
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (leaveInfo) {
      onHover(e, false);
    }
  };

  return (
    <div
      className={className}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {day}
    </div>
  );
};

// 4. MonthUnit Component
interface MonthUnitProps {
  year: number;
  month: number;
  leaveData: LeaveDataMap;
  onUnitHover: (e: React.MouseEvent<HTMLDivElement>, month: number) => void;
  onDayHover: (e: React.MouseEvent<HTMLDivElement>, show: boolean, title?: string, note?: string) => void;
}

const MonthUnit = forwardRef<HTMLDivElement, MonthUnitProps>(({ year, month, leaveData, onUnitHover, onDayHover }, ref) => {
  const days = useMemo(() => generateMonthDays(year, month), [year, month]);
  const leaveCount = Object.keys(leaveData).filter(k => k.startsWith(`${month}-`)).length;

  return (
    <div
      className="month-unit"
      ref={ref}
      onMouseEnter={(e) => onUnitHover(e, month)}
    >
      <div className="month-header">
        <span>{month}月</span>
        {leaveCount > 0 && <span className="stat-badge">{leaveCount}天</span>}
      </div>

      <div className="days-container">
        {['日', '一', '二', '三', '四', '五', '六'].map(w => (
          <div key={w} className="weekday">{w}</div>
        ))}

        {days.map(dayObj => (
          <DayCell
            key={dayObj.id}
            dayInfo={dayObj}
            leaveInfo={dayObj.type === 'day' && dayObj.dateKey ? leaveData[dayObj.dateKey] : undefined}
            onHover={(e, show, title, note) => {
              onDayHover(e, show, `${month}月${title}`, note);
            }}
          />
        ))}
      </div>
    </div>
  );
});

MonthUnit.displayName = 'MonthUnit';

// 5. CalendarGrid Component
interface CalendarGridProps {
  year: number;
  leaveData: LeaveDataMap;
  onDayHover: (e: React.MouseEvent<HTMLDivElement>, show: boolean, title?: string, note?: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ year, leaveData, onDayHover }) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const monthRefs = useRef<Array<HTMLDivElement | null>>([]);

  // Magic Border State
  const [borderStyle, setBorderStyle] = useState<React.CSSProperties>({
    opacity: 0,
    width: 0,
    height: 0,
    transform: 'translate(0,0)'
  });

  const moveBorder = (targetEl: HTMLElement) => {
    if (!gridRef.current) return;

    const parentRect = gridRef.current.getBoundingClientRect();
    const elRect = targetEl.getBoundingClientRect();
    const offset = 8; // visual padding

    const top = elRect.top - parentRect.top - offset / 2;
    const left = elRect.left - parentRect.left - offset / 2;

    setBorderStyle({
      opacity: 1,
      width: elRect.width + offset,
      height: elRect.height + offset,
      transform: `translate(${left}px, ${top}px)`
    });
  };

  const handleUnitHover = (_e: React.MouseEvent<HTMLDivElement>, month: number) => {
    const el = monthRefs.current[month - 1];
    if (el) moveBorder(el);
  };

  const handleGridLeave = () => {
    const currentMonthIdx = TODAY.getMonth();
    // Only return to current month if viewing current year
    if (year === TODAY.getFullYear() && monthRefs.current[currentMonthIdx]) {
      moveBorder(monthRefs.current[currentMonthIdx]);
    } else {
      setBorderStyle(prev => ({ ...prev, opacity: 0 }));
    }
  };

  // Reset border on year change or mount
  useEffect(() => {
    if (year === TODAY.getFullYear()) {
      const currentMonthIdx = TODAY.getMonth();
      // setTimeout ensures DOM is fully painted
      setTimeout(() => {
        const el = monthRefs.current[currentMonthIdx];
        if (el) moveBorder(el);
      }, 50);
    } else {
      setBorderStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [year]);

  return (
    <div
      className="calendar-grid"
      ref={gridRef}
      onMouseLeave={handleGridLeave}
    >
      <div className="magic-border" style={borderStyle}></div>

      {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
        <MonthUnit
          key={m}
          year={year}
          month={m}
          leaveData={leaveData}
          ref={el => { monthRefs.current[m - 1] = el }}
          onUnitHover={handleUnitHover}
          onDayHover={onDayHover}
        />
      ))}
    </div>
  );
};

// 6. Main App
const App: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(2024);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    content: ''
  });

  // Generate last 3 years + next 4 years
  const years = Array.from({ length: 8 }, (_, i) => TODAY.getFullYear() - 3 + i);

  const handleDayHover = (e: React.MouseEvent<HTMLDivElement>, show: boolean, title?: string, note?: string) => {
    if (!show) {
      setTooltip(prev => ({ ...prev, visible: false }));
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipWidth = 120; // estimate
    const x = rect.left + rect.width / 2 - tooltipWidth / 2;
    const y = rect.top - 55; // above the cell

    setTooltip({
      visible: true,
      x,
      y,
      title: title || '',
      content: note || ''
    });
  };

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
        onDayHover={handleDayHover}
      />

      <Tooltip {...tooltip} />
    </div>
  );
};

export default App;