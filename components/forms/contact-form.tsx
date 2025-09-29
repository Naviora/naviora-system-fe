'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { contactFormSchema, type ContactFormData } from '@/lib/validations/forms'
import { FadeIn } from '@/components/animations/fade-slide-scale'
import { ErrorHandler, SuccessHandler } from '@/lib/utils/error-handler'
import { SUCCESS_CODES } from '@/lib/constants'
import { useState } from 'react'

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void> | void
  className?: string
}

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'support', label: 'Technical Support' },
  { value: 'sales', label: 'Sales Question' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' }
]

export function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      attachments: undefined
    }
  })

  const handleSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(data)
      } else {
        // Default submission (could integrate with API)
        SuccessHandler.logSuccess('Form submitted', data)
        toast.success(SuccessHandler.getSuccessMessage(SUCCESS_CODES.OPERATION_COMPLETED))
      }
      form.reset()
    } catch (error) {
      const errorMessage = ErrorHandler.getErrorMessage(error)
      toast.error(errorMessage)
      ErrorHandler.logError(error, 'Contact Form')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <FadeIn className={className}>
      <div className='mx-auto max-w-lg space-y-6'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold tracking-tight'>Contact Us</h2>
          <p className='text-muted-foreground'>
            We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-6'>
            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name *</FormLabel>
                    <FormControl>
                      <Input placeholder='Your full name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type='email' placeholder='your@email.com' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input type='tel' placeholder='+1 (555) 123-4567' {...field} />
                    </FormControl>
                    <FormDescription>Optional - we&apos;ll call you if needed</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='subject'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a subject' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {subjectOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name='message'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Tell us more about your inquiry...' className='min-h-[120px]' {...field} />
                  </FormControl>
                  <FormDescription>Please provide as much detail as possible</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </Form>
      </div>
    </FadeIn>
  )
}
