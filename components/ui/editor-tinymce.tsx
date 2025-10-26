'use client'

import React, { useCallback } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { cn } from '@/lib/utils'

interface TinyMCEEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TinyMCEEditor({
  value = '',
  onChange,
  placeholder = 'Nhập nội dung...',
  disabled = false,
  className
}: TinyMCEEditorProps) {
  const handleEditorChange = useCallback(
    (content: string) => {
      onChange?.(content)
    },
    [onChange]
  )

  return (
    <div className={cn('w-full', className)}>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY || ''}
        value={value}
        onEditorChange={handleEditorChange}
        disabled={disabled}
        init={{
          height: 250,
          menubar: false,
          plugins: ['lists', 'link', 'code', 'table', 'image', 'wordcount'],
          toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | link image | table | code',
          content_css: false,
          body_class: 'tinymce-editor',
          relative_urls: false,
          remove_script_host: false,
          document_base_url: '/',
          branding: false,
          statusbar: false,
          placeholder: placeholder,
          paste_data_images: true,
          image_title: true,
          automatic_uploads: false,
          setup: (editor) => {
            editor.on('init', () => {
              const body = editor.getBody()
              body.style.fontSize = '14px'
              body.style.lineHeight = '1.5'
              body.style.color = 'rgb(19, 19, 24)'
            })
          }
        }}
      />
    </div>
  )
}
