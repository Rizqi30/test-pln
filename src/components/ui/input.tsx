/* eslint-disable react/prop-types */
import * as React from 'react';
import { cn } from '@/lib/utils';

const Input = React.forwardRef(
  (
    { className, type, iconBefore, iconAfter, error, loading, ...props }: any,
    ref
  ) => {
    return (
      <div>
        <div
          className={cn(
            `flex h-10 rounded-[0.5rem] border px-3 py-2 text-sm ring-offset-white items-center transition-transform
             ${error ? 'border-red-500' : 'border-neutral-500'} 
             ${props.disabled ? 'bg-gray-200 opacity-50' : 'bg-white'} 
             placeholder:text-neutral-500 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 
             focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 
             dark:border-neutral-800 dark:bg-neutral-950 dark:ring-offset-neutral-950 dark:file:text-neutral-50 dark:placeholder:text-neutral-400`,
            className
          )}
        >
          {iconBefore && <span className="mr-1">{iconBefore}</span>}
          <input
            type={type}
            ref={ref}
            {...props}
            className="w-full bg-transparent font-normal focus:ring-0 focus:outline-none text-black"
          />
          {iconAfter && <span className="ml-2">{iconAfter}</span>}
        </div>
        {error && (
          <p className="mt-1 text-xs font-normal text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
