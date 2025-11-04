import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from '@/components/ui/empty'
import { Button } from '@/components/ui/button'
import React from 'react'
import { MdOutlineFolderOff } from 'react-icons/md'

interface NEmptyProps {
  title?: string
  description?: string
  buttonText?: string
  onButtonClick?: () => void
  icon?: React.ReactNode
}

export const NEmpty = ({
  title = 'No data',
  description = 'No data found',
  buttonText,
  onButtonClick,
  icon = <MdOutlineFolderOff />
}: NEmptyProps) => (
  <Empty>
    <EmptyHeader>
      <EmptyMedia variant='icon'>
        {icon}
      </EmptyMedia>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyDescription>{description}</EmptyDescription>
    </EmptyHeader>
    {buttonText && (
      <EmptyContent>
        <Button onClick={onButtonClick}>{buttonText}</Button>
      </EmptyContent>
    )}
  </Empty>
)