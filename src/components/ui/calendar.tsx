"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { useNavigation } from "react-day-picker";
import { cn } from "@/lib/utils";

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4 bg-white rounded-xl shadow-md", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-2",
        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "h-9 w-9 text-center text-sm p-0 relative",
          "focus-within:relative focus-within:z-20",
        ),
        day: cn(
          "h-9 w-9 p-0 font-normal text-gray-800 rounded-full",
          "hover:bg-gray-100 hover:text-gray-900", // Gray tint on hover
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
        ),
        day_selected: cn(
          "bg-blue-600 text-white hover:bg-blue-700", // Solid blue when selected
          "focus:bg-blue-700",
        ),
        day_today: "border-2 border-blue-500 rounded-full", // Blue circle for current date
        day_outside: "text-muted opacity-50",
        day_disabled: "text-muted opacity-50",
        day_range_start: "bg-blue-600 text-white rounded-l-full",
        day_range_middle: cn(
          "bg-blue-100 text-blue-900", // Light blue for range middle
          "hover:bg-blue-200",
        ),
        day_range_end: "bg-blue-600 text-white rounded-r-full",
        ...classNames,
      }}
      components={{
        Caption: ({ displayMonth }) => {
          const { goToMonth, nextMonth, previousMonth } = useNavigation();

          return (
            <div className="flex items-center justify-between px-2 py-2">
              <button
                type="button"
                onClick={() => previousMonth && goToMonth(previousMonth)}
                className="hover:bg-gray-100 rounded-full p-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold">
                {format(displayMonth, "MMMM yyyy")}
              </span>
              <button
                type="button"
                onClick={() => nextMonth && goToMonth(nextMonth)}
                className="hover:bg-gray-100 rounded-full p-2"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          );
        },
      }}
      {...props}
    />
  );
}
