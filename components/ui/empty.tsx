import { FileQuestion } from 'lucide-react'

interface EmptyProps {
  title: string
  description?: string
  icon?: React.ReactNode
}

export function Empty({ title, description, icon }: EmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-muted-foreground">
        {icon || <FileQuestion className="h-16 w-16" />}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
      )}
    </div>
  )
}
