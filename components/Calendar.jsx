import React, { useState, useEffect, useRef } from 'react';
import styles from '@/styles/calendar.module.css';

export default function Calendar({ isOpen, onClose }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const calendarRef = useRef(null);

    function getDaysInMonth(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    function getFirstDayOfMonth(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    }

    function handlePrevMonth() {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    }

    function handleNextMonth() {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    }

    function handleToday() {
        setCurrentDate(new Date());
    }

    // Handle click outside to close the calendar
    useEffect(() => {
        function handleClickOutside(event) {
            if (calendarRef.current && !calendarRef.current.contains(event.target)) {
                onClose();
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        }
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
        days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
    const year = currentDate.getFullYear();
    const today = new Date();

    return (
        <div className={styles.calendarContainer} ref={calendarRef}>
            <div className={styles.header}>
                <button onClick={handlePrevMonth} className={styles.navButton}>‹</button>
                <div className={styles.monthYear}>
                    {monthName} {year}
                </div>
                <button onClick={handleNextMonth} className={styles.navButton}>›</button>
            </div>

            <div className={styles.weekDays}>
                <div className={styles.weekDay}>Sun</div>
                <div className={styles.weekDay}>Mon</div>
                <div className={styles.weekDay}>Tue</div>
                <div className={styles.weekDay}>Wed</div>
                <div className={styles.weekDay}>Thu</div>
                <div className={styles.weekDay}>Fri</div>
                <div className={styles.weekDay}>Sat</div>
            </div>

            <div className={styles.days}>
                {days.map((day, index) => {
                    const isToday = day&&day === today.getDate() &&
                        currentDate.getMonth() === today.getMonth() &&
                        currentDate.getFullYear() === today.getFullYear();

                    return (
                        <div
                            key={index}
                            className={`${styles.day} ${day ? styles.active : ''} ${isToday ? styles.today : ''}`}
                        >
                            {day}
                        </div>
                    );
                })}
            </div>

            <button onClick={handleToday} className={styles.todayButton}>
                Today
            </button>
        </div>
    );
}