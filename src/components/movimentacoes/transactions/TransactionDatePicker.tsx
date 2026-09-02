"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { CalendarDays, Check, ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionDatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  min?: string;
  max?: string;
}

interface CalendarDay {
  date: Date;
  currentMonth: boolean;
}

const WEEK_DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const MONTHS = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDateValue(date: Date) {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}`;
}

function parseDateValue(value: string) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);

  if (
    !year ||
    !month ||
    !day ||
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day)
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function startOfPreviousMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() - 1, 1);
}

function startOfNextMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function sameDay(first: Date, second: Date) {
  return (
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate()
  );
}

function isBeforeDay(first: Date, second: Date) {
  const firstTime = new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate(),
  ).getTime();

  const secondTime = new Date(
    second.getFullYear(),
    second.getMonth(),
    second.getDate(),
  ).getTime();

  return firstTime < secondTime;
}

function isAfterDay(first: Date, second: Date) {
  const firstTime = new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate(),
  ).getTime();

  const secondTime = new Date(
    second.getFullYear(),
    second.getMonth(),
    second.getDate(),
  ).getTime();

  return firstTime > secondTime;
}

function buildCalendarDays(monthDate: Date): CalendarDay[] {
  const firstDay = startOfMonth(monthDate);

  const lastDay = endOfMonth(monthDate);

  const firstWeekday = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  const daysInMonth = lastDay.getDate();

  const previousMonth = startOfPreviousMonth(monthDate);

  const daysInPreviousMonth = endOfMonth(previousMonth).getDate();

  const days: CalendarDay[] = [];

  for (let index = firstWeekday; index > 0; index--) {
    const day = daysInPreviousMonth - index + 1;

    days.push({
      date: new Date(
        previousMonth.getFullYear(),
        previousMonth.getMonth(),
        day,
      ),
      currentMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      date: new Date(monthDate.getFullYear(), monthDate.getMonth(), day),
      currentMonth: true,
    });
  }

  const remaining = 42 - days.length;

  const nextMonth = startOfNextMonth(monthDate);

  for (let day = 1; day <= remaining; day++) {
    days.push({
      date: new Date(nextMonth.getFullYear(), nextMonth.getMonth(), day),
      currentMonth: false,
    });
  }

  return days;
}

function formatDisplayDate(value: string) {
  const date = parseDateValue(value);

  if (!date) {
    return "Selecionar data";
  }

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function TransactionDatePicker({
  label = "Data da movimentação",
  value,
  onChange,
  error,
  min,
  max,
}: TransactionDatePickerProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = parseDateValue(value);

  const minDate = parseDateValue(min ?? "");

  const maxDate = parseDateValue(max ?? "");

  const today = new Date();

  const [visibleMonth, setVisibleMonth] = useState<Date>(
    selectedDate ? startOfMonth(selectedDate) : startOfMonth(today),
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const calendarRef = useRef<HTMLDivElement>(null);

  const [openUpwards, setOpenUpwards] = useState(true);

  function calculateCalendarPosition() {
    if (!containerRef.current) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();

    const estimatedHeight = 350;

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;

    if (spaceBelow >= estimatedHeight || spaceBelow > spaceAbove) {
      setOpenUpwards(false);
    } else {
      setOpenUpwards(true);
    }
  }

  useEffect(() => {
    if (selectedDate) {
      setVisibleMonth(startOfMonth(selectedDate));
    }
  }, [value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    calculateCalendarPosition();

    function handleResize() {
      calculateCalendarPosition();
    }

    function handleScroll() {
      calculateCalendarPosition();
    }

    window.addEventListener("resize", handleResize);

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("resize", handleResize);

      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (containerRef.current && !containerRef.current.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);

      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const calendarDays = useMemo(
    () => buildCalendarDays(visibleMonth),
    [visibleMonth],
  );

  function isDisabled(date: Date) {
    if (minDate && isBeforeDay(date, minDate)) {
      return true;
    }

    if (maxDate && isAfterDay(date, maxDate)) {
      return true;
    }

    return false;
  }

  function handleSelectDate(date: Date) {
    if (isDisabled(date)) {
      return;
    }

    onChange(formatDateValue(date));

    setOpen(false);
  }

  function handleToggle() {
    if (!open) {
      calculateCalendarPosition();
    }

    setOpen((previous) => !previous);
  }

  function handlePreviousMonth() {
    setVisibleMonth((current) => startOfPreviousMonth(current));
  }

  function handleNextMonth() {
    setVisibleMonth((current) => startOfNextMonth(current));
  }

  function handleToday() {
    const todayDate = new Date();

    if (isDisabled(todayDate)) {
      return;
    }

    onChange(formatDateValue(todayDate));

    setVisibleMonth(startOfMonth(todayDate));

    setOpen(false);
  }

  function canGoPrevious() {
    if (!minDate) {
      return true;
    }

    const previousMonth = startOfPreviousMonth(visibleMonth);

    const previousMonthEnd = endOfMonth(previousMonth);

    return !isBeforeDay(previousMonthEnd, minDate);
  }

  function canGoNext() {
    if (!maxDate) {
      return true;
    }

    const nextMonth = startOfNextMonth(visibleMonth);

    const nextMonthStart = startOfMonth(nextMonth);

    return !isAfterDay(nextMonthStart, maxDate);
  }

  return (
    <div ref={containerRef} className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={handleToggle}
          aria-haspopup="dialog"
          aria-expanded={open}
          className={`group flex h-11 w-full items-center rounded-xl border bg-surface-sidebar px-3.5 text-left transition-all duration-200 ${
            error
              ? "border-rose-500/50"
              : open
                ? "border-brand-500/60 bg-surface-main ring-2 ring-brand-500/10"
                : "border-surface-border hover:border-slate-600"
          }`}
        >
          <CalendarDays
            size={15}
            className={`mr-2.5 shrink-0 transition-colors ${
              open
                ? "text-brand-400"
                : "text-slate-600 group-hover:text-brand-400"
            }`}
          />

          <span
            className={`text-xs font-medium ${
              value ? "text-slate-200" : "text-slate-600"
            }`}
          >
            {formatDisplayDate(value)}
          </span>

          <span className="ml-auto text-[8px] font-semibold uppercase tracking-wider text-slate-700">
            {open ? "Fechar" : "Selecionar"}
          </span>
        </button>

        {open && (
          <div
            ref={calendarRef}
            className={`absolute left-0 z-[300] w-full min-w-[300px] max-w-[340px] overflow-hidden rounded-2xl border border-surface-border bg-[#122033] p-3 shadow-2xl shadow-black/50 backdrop-blur-xl ${
              openUpwards ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
            }`}
          >
            <div className="mb-3 flex items-center justify-between">
              <button
                type="button"
                onClick={handlePreviousMonth}
                disabled={!canGoPrevious()}
                aria-label="Mês anterior"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-200 disabled:pointer-events-none disabled:opacity-20"
              >
                <ChevronLeft size={15} />
              </button>

              <div className="text-center">
                <p className="text-[10px] font-bold text-slate-200">
                  {MONTHS[visibleMonth.getMonth()]}
                </p>

                <p className="mt-0.5 text-[8px] font-semibold text-brand-400">
                  {visibleMonth.getFullYear()}
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                disabled={!canGoNext()}
                aria-label="Próximo mês"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-slate-200 disabled:pointer-events-none disabled:opacity-20"
              >
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="mb-1 grid grid-cols-7">
              {WEEK_DAYS.map((day) => (
                <span
                  key={day}
                  className="py-1 text-center text-[7px] font-bold uppercase tracking-wider text-slate-700"
                >
                  {day}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
              {calendarDays.map(({ date, currentMonth }) => {
                const disabled = isDisabled(date);

                const selected = selectedDate
                  ? sameDay(date, selectedDate)
                  : false;

                const isToday = sameDay(date, today);

                return (
                  <button
                    key={formatDateValue(date)}
                    type="button"
                    disabled={disabled}
                    onClick={() => handleSelectDate(date)}
                    className={`relative flex h-8 items-center justify-center rounded-md text-[8px] font-semibold transition-all ${
                      !currentMonth
                        ? "text-slate-800"
                        : disabled
                          ? "cursor-not-allowed text-slate-800"
                          : selected
                            ? "bg-brand-500 text-white shadow-md shadow-brand-500/20"
                            : "text-slate-400 hover:bg-white/[0.05] hover:text-slate-200"
                    }`}
                  >
                    {date.getDate()}

                    {isToday && !selected && !disabled && (
                      <span className="absolute bottom-0.5 h-0.5 w-0.5 rounded-full bg-brand-400" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-surface-border pt-2.5">
              <div className="flex min-w-0 items-center gap-1.5">
                {selectedDate && (
                  <>
                    <Check size={10} className="shrink-0 text-brand-400" />

                    <span className="truncate text-[8px] font-medium text-slate-600">
                      {formatDisplayDate(value)}
                    </span>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleToday}
                disabled={
                  !!(minDate && isBeforeDay(today, minDate)) ||
                  !!(maxDate && isAfterDay(today, maxDate))
                }
                className="shrink-0 rounded-lg px-2.5 py-1.5 text-[8px] font-bold text-brand-400 transition-colors hover:bg-brand-500/10 disabled:pointer-events-none disabled:opacity-30"
              >
                Hoje
              </button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-[10px] font-medium text-rose-400">{error}</p>
      )}
    </div>
  );
}
