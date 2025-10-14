'use client'

import * as React from 'react'
import { ArrowUpDown, LucideIcon, Plus, SearchIcon, SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

interface ToolbarButtonProps {
  label: string
  icon: LucideIcon
  className?: string
}

function ToolbarButton({ label, icon: Icon, className }: ToolbarButtonProps) {
  return (
    <Button
      type='button'
      size='sm'
      variant='outline'
      className={cn(
        'gap-2 rounded-md border-greyscale-200 bg-greyscale-0 text-sm font-medium text-greyscale-700',
        className
      )}
    >
      {label}
      <Icon className='h-4 w-4 text-greyscale-500' aria-hidden='true' />
    </Button>
  )
}

export interface CreateModuleFormValues {
  code: string
  name: string
  description: string
}

interface ModuleToolbarProps {
  onCreate?: (values: CreateModuleFormValues) => void
}

const INITIAL_FORM_VALUES: CreateModuleFormValues = {
  code: '',
  name: '',
  description: ''
}

export function ModuleToolbar({ onCreate }: ModuleToolbarProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [formValues, setFormValues] = React.useState<CreateModuleFormValues>(INITIAL_FORM_VALUES)

  const codeId = React.useId()
  const nameId = React.useId()
  const descriptionId = React.useId()

  const handleInputChange =
    (field: keyof CreateModuleFormValues) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormValues((previous) => ({ ...previous, [field]: event.target.value }))
    }

  const handleOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) {
      setFormValues(INITIAL_FORM_VALUES)
    }
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onCreate?.(formValues)
    setDialogOpen(false)
  }

  return (
    <div className='flex flex-col gap-3 md:flex-row md:items-center md:justify-between'>
      <div className='flex items-center gap-2'>
        <ToolbarButton label='Sort by' icon={ArrowUpDown} />
        <ToolbarButton label='Categories' icon={SlidersHorizontal} />
      </div>

      <div className='flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end'>
        <InputGroup className='w-full sm:w-60'>
          <InputGroupInput placeholder='Tìm chương' />
          <InputGroupAddon>
            <SearchIcon className='text-greyscale-400' />
          </InputGroupAddon>
        </InputGroup>

        <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button type='button' size='sm' className='h-10 gap-2 rounded-md px-4 text-sm font-semibold shadow-sm '>
              <Plus className='h-4 w-4' aria-hidden='true' />
              Tạo chuyên đề
            </Button>
          </DialogTrigger>

          <DialogContent className='max-w-[420px] gap-6 rounded-xl border-greyscale-200 bg-greyscale-0 p-6 shadow-md'>
            <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
              <DialogHeader className='gap-3 text-left'>
                <DialogTitle className='text-lg font-semibold text-greyscale-900'>Tạo chuyên đề</DialogTitle>
                <DialogDescription className='text-sm text-greyscale-500'>
                  Điền đầy đủ thông tin (*) và bấm <span className='font-semibold text-greyscale-900'>Xác nhận</span> để
                  hoàn tất.
                </DialogDescription>
              </DialogHeader>

              <div className='flex flex-col gap-4'>
                <div className='flex flex-col gap-2'>
                  <Label htmlFor={codeId} className='text-sm font-medium text-greyscale-900'>
                    Mã chuyên đề<span className='text-destructive'> *</span>
                  </Label>
                  <Input
                    id={codeId}
                    value={formValues.code}
                    onChange={handleInputChange('code')}
                    placeholder='Nhập mã chuyên đề'
                    required
                    className='h-10 rounded-lg border-greyscale-200 bg-greyscale-0 text-sm text-greyscale-900 placeholder:text-greyscale-400'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <Label htmlFor={nameId} className='text-sm font-medium text-greyscale-900'>
                    Tên chuyên đề<span className='text-destructive'> *</span>
                  </Label>
                  <Input
                    id={nameId}
                    value={formValues.name}
                    onChange={handleInputChange('name')}
                    placeholder='Nhập tên chuyên đề'
                    required
                    className='h-10 rounded-lg border-greyscale-200 bg-greyscale-0 text-sm text-greyscale-900 placeholder:text-greyscale-400'
                  />
                </div>

                <div className='flex flex-col gap-2'>
                  <Label htmlFor={descriptionId} className='text-sm font-medium text-greyscale-900'>
                    Mô tả
                  </Label>
                  <Textarea
                    id={descriptionId}
                    value={formValues.description}
                    onChange={handleInputChange('description')}
                    placeholder='Nhập mô tả ngắn'
                    className='min-h-24 rounded-lg border-greyscale-200 bg-greyscale-0 text-sm text-greyscale-900 placeholder:text-greyscale-400'
                  />
                </div>
              </div>

              <DialogFooter className='flex-row justify-end gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  className='h-10 rounded-lg border-greyscale-200 bg-greyscale-50 px-4 text-sm font-medium text-greyscale-900 hover:bg-greyscale-100'
                  onClick={() => setDialogOpen(false)}
                >
                  Hủy bỏ
                </Button>
                <Button
                  type='submit'
                  className='h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90'
                >
                  Xác nhận
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
