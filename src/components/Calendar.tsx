import React, { useState } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

interface Event {
  id: string;
  title: string;
  date: Date;
  color: string;
}

export const Calendar: React.FC = () => {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Portfolio Review', date: new Date(today.getFullYear(), today.getMonth(), 15), color: '#FF6B6B' },
    { id: '2', title: 'Team Meeting', date: new Date(today.getFullYear(), today.getMonth(), 20), color: '#4ECDC4' },
    { id: '3', title: 'Project Deadline', date: new Date(today.getFullYear(), today.getMonth(), 25), color: '#FFE66D' },
  ]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(event.date, date));
  };

  const addEvent = () => {
    if (newEventTitle.trim() && selectedDate) {
      const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA'];
      const newEvent: Event = {
        id: Date.now().toString(),
        title: newEventTitle.trim(),
        date: selectedDate,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
      setEvents([...events, newEvent]);
      setNewEventTitle('');
      setShowEventForm(false);
    }
  };

  const deleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const prevMonthDays = getDaysInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));

  const renderCalendarDays = () => {
    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, day);
      days.push(
        <button
          key={`prev-${day}`}
          onClick={() => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
            setSelectedDate(date);
          }}
          className="h-10 w-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors text-sm"
        >
          {day}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isToday = isSameDay(date, today);
      const isSelected = selectedDate && isSameDay(date, selectedDate);
      const dayEvents = getEventsForDate(date);

      days.push(
        <button
          key={day}
          onClick={() => setSelectedDate(date)}
          className={`h-10 w-10 flex flex-col items-center justify-center rounded-full transition-all text-sm relative
            ${isSelected
              ? 'bg-red-500 text-white font-semibold'
              : isToday
                ? 'bg-red-100 text-red-600 font-semibold'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
          {day}
          {dayEvents.length > 0 && !isSelected && (
            <div className="absolute bottom-1 flex gap-0.5">
              {dayEvents.slice(0, 3).map((event, idx) => (
                <div
                  key={idx}
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
              ))}
            </div>
          )}
        </button>
      );
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, day);
      days.push(
        <button
          key={`next-${day}`}
          onClick={() => {
            setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
            setSelectedDate(date);
          }}
          className="h-10 w-10 flex items-center justify-center text-gray-400 hover:bg-gray-100 rounded-full transition-colors text-sm"
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <div className="flex h-full bg-white">
      {/* Left: Calendar Grid */}
      <div className="flex-1 flex flex-col p-4 border-r border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium text-red-500 hover:bg-red-50 rounded-md transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Previous month"
            >
              <IoChevronBack className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Next month"
            >
              <IoChevronForward className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Right: Event Details */}
      <div className="w-64 flex flex-col bg-gray-50">
        {/* Selected date header */}
        <div className="p-4 border-b border-gray-200">
          {selectedDate ? (
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                {DAYS[selectedDate.getDay()]}
              </div>
              <div className="text-3xl font-light text-gray-800">
                {selectedDate.getDate()}
              </div>
              <div className="text-sm text-gray-600">
                {MONTHS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Select a date</div>
          )}
        </div>

        {/* Events list */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedDateEvents.length > 0 ? (
            <div className="space-y-2">
              {selectedDateEvents.map(event => (
                <div
                  key={event.id}
                  className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white transition-colors"
                >
                  <div
                    className="w-3 h-3 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-800 truncate">
                      {event.title}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEvent(event.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-400 text-center py-4">
              No events
            </div>
          )}
        </div>

        {/* Add event section */}
        <div className="p-4 border-t border-gray-200">
          {showEventForm ? (
            <div className="space-y-2">
              <input
                type="text"
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addEvent()}
                placeholder="Event title..."
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={addEvent}
                  className="flex-1 px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                >
                  Add
                </button>
                <button
                  onClick={() => {
                    setShowEventForm(false);
                    setNewEventTitle('');
                  }}
                  className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowEventForm(true)}
              disabled={!selectedDate}
              className="w-full px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              + Add Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
