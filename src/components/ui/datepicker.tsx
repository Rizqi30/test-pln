'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface DatePickerProps {
  value?: Date | string; // Nilai tanggal yang dipilih dari luar
  onChange: (date: Date | undefined) => void; // Callback saat tanggal berubah
  placeholder?: string; // Placeholder untuk teks default
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'Pick a date',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const [internalDate, setInternalDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Sinkronisasi antara value dan internal state jika value berubah
  React.useEffect(() => {
    setInternalDate(value as any);
  }, [value]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setInternalDate(selectedDate);
    onChange(selectedDate);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal',
            !internalDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDate ? (
            format(internalDate, 'PPP')
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 bg-white" align="start">
        <Calendar
          mode="single"
          selected={internalDate}
          onSelect={handleDateSelect} // Menggunakan handleDateSelect
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
