'use client'

import { ChevronDownIcon } from 'lucide-react'
import { useQueryState } from 'nuqs'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface DatePickerProps {
  prefix?: string
  label?: string
  /** Controlled date value (optional) */
  value?: Date | null
  /** Callback when date changes (optional) */
  onChange?: (date: Date | null) => void
  /** Use query state for persistence (default: true) */
  useQueryState?: boolean
}

export function DatePicker(props: DatePickerProps) {
  const shouldUseQueryState = props.useQueryState !== false
  const [localOpen, setLocalOpen] = useState(false)

  // Query state management (for persistence)
  const [queryOpen, setQueryOpen] = useQueryState(
    `${props.prefix ? `${props.prefix}-` : ''}open`,
    {
      defaultValue: false,
      parse: value => value === 'true',
      serialize: value => (value ? 'true' : 'false'),
    },
  )

  const [queryDate, setQueryDate] = useQueryState(
    `${props.prefix ? `${props.prefix}-` : ''}date`,
    {
      defaultValue: null,
      parse: value => (value ? new Date(value) : null),
      serialize: value => (value ? value.toISOString() : ''),
    },
  )

  // Determine which state to use
  const open = shouldUseQueryState ? queryOpen : localOpen
  const setOpen = shouldUseQueryState ? setQueryOpen : setLocalOpen
  const date = props.value !== undefined ? props.value : queryDate

  const handleDateSelect = (selectedDate: Date | null) => {
    if (shouldUseQueryState) {
      setQueryDate(selectedDate)
    }
    if (props.onChange) {
      props.onChange(selectedDate)
    }
    setOpen(false)
  }

  return (
    <div className='flex flex-col gap-3 w-full'>
      <Label htmlFor='date' className='px-1'>
        {props.label ?? 'Due Date'}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            id='date'
            className='justify-between font-normal w-full'
          >
            {date ? date.toLocaleDateString() : 'Select date'}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={date || undefined}
            required
            captionLayout='dropdown'
            onSelect={handleDateSelect}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
