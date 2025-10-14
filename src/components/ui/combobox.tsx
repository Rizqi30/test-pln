import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ComboboxProps {
  value: string;
  onChange: (value: string, label?: string) => void;
  options: string[];
  placeholder?: string;
  disabled?: boolean;
  error?: string; // New error prop
  configOption?: boolean;
  search?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  onChange,
  options,
  placeholder = '',
  disabled = false,
  error, // New error prop
  configOption = true,
  search = true,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);
  const [selectedValues, setSelectedValues] = React.useState([value]);
  const triggerRef = React.useRef<any>(null);
  const [popoverWidth, setPopoverWidth] = React.useState();

  const handleSelect = (selectedValue: any, label?: any) => {
    if (typeof onChange === 'function') {
      const newValue = selectedValue === value ? '' : selectedValue;
      onChange(newValue, label);
      setSelectedValues([newValue]);
    }
    setOpen(false);
  };

  const handleClear = () => {
    if (typeof onChange === 'function') {
      onChange('');
      setSelectedValues(['']);
    }
    setOpen(false);
  };

  React.useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            ref={triggerRef}
            className={cn(
              `w-full justify-between rounded-[0.5rem] border-neutral-500 bg-white px-3 py-2 text-left text-sm font-normal text-black outline-none transition-all duration-300 hover:bg-transparent hover:text-black ${
                (props as any).className
              }`,
              error ? 'border-red-500' : 'border-neutral-500 ',
              disabled ? 'bg-gray-200' : 'bg-white'
            )}
            disabled={disabled}
          >
            {value ? (
              (options?.find((data: any) => data.value === value) as any)
                ?.label || '-'
            ) : (
              <span className={cn('text-sm')}>{placeholder}</span>
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="z-[100] p-0 rounded-[0.5rem] border border-gray-400 bg-white"
          style={{ width: popoverWidth }}
        >
          <Command className="rounded-[0.5rem]" {...(props as any)}>
            {search && <CommandInput />}
            <CommandList {...(props as any)}>
              <CommandEmpty {...(props as any)}>No Data found.</CommandEmpty>
              <CommandGroup {...(props as any)}>
                {options?.map((data: any) => (
                  <CommandItem
                    key={data.value}
                    onSelect={() => handleSelect(data.value, data.label)}
                    className={'rounded-[0.5rem]'}
                    {...(props as any)}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === data.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {data.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              {configOption && (
                <>
                  <CommandSeparator {...(props as any)} />
                  <CommandGroup {...(props as any)}>
                    <div className="flex items-center justify-between">
                      {selectedValues.length > 0 && (
                        <>
                          <CommandItem
                            onSelect={handleClear}
                            className="flex-1 justify-center cursor-pointer"
                            {...(props as any)}
                          >
                            Clear
                          </CommandItem>
                          <CommandSeparator
                            className="flex min-h-6 h-full"
                            {...(props as any)}
                          />
                        </>
                      )}
                      <CommandItem
                        onSelect={() => setOpen(false)}
                        className="flex-1 justify-center cursor-pointer"
                        {...(props as any)}
                      >
                        Close
                      </CommandItem>
                    </div>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="mt-1 text-xs font-normal text-red-500">{error}</p>
      )}
    </div>
  );
};
