"use client";

import * as React from "react";
import { DayPicker, type DayPickerRangeProps } from "react-day-picker";
import { cn } from "@/lib/utils";

type CalendarProps = DayPickerRangeProps & {
  className?: string;
};

const Calendar = ({ className, ...props }: CalendarProps) => {
  return (
    <DayPicker
      className={cn("p-3", className)}
      showOutsideDays
      fixedWeeks
      {...props}
    />
  );
};

export { Calendar };
