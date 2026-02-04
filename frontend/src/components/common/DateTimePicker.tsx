import * as React from "react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Props {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  className?: string;
}

export default function DateTimePicker({
  value,
  onChange,
  className = "",
}: Props) {
  const [open, setOpen] = React.useState(false);

  const setDate = (date?: Date) => {
    if (!date) return;

    // keep previous time if exists
    if (value) {
      date.setHours(value.getHours());
      date.setMinutes(value.getMinutes());
      date.setSeconds(value.getSeconds());
    }

    onChange(date);
    setOpen(false);
  };

  const setTime = (time: string) => {
    if (!value) return;

    const [h, m, s] = time.split(":").map(Number);
    const newDate = new Date(value);
    newDate.setHours(h, m, s ?? 0);

    onChange(newDate);
  };

  return (
    <FieldGroup className="flex-row gap-3" dir="rtl">
      {/* Date */}
      <Field>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn("w-44 justify-between font-normal", className)}
            >
              {value ? format(value, "PPP", { locale: he }) : "בחר תאריך"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              locale={he}
              selected={value}
              defaultMonth={value}
              onSelect={setDate}
              dir="rtl"
            />
          </PopoverContent>
        </Popover>
      </Field>

      {/* Time */}
      <Field className="w-32">
        <Input
          type="time"
          step="1"
          value={
            value
              ? `${String(value.getHours()).padStart(2, "0")}:${String(
                  value.getMinutes(),
                ).padStart(2, "0")}:${String(value.getSeconds()).padStart(
                  2,
                  "0",
                )}`
              : ""
          }
          onChange={(e) => setTime(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
        />
      </Field>
    </FieldGroup>
  );
}
