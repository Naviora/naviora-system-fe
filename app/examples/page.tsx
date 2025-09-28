'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner, LoadingPage } from '@/components/ui/loading'
import { ErrorBoundary, withErrorBoundary } from '@/components/ui/error-boundary'

// Component that throws error for demo
function ErrorComponent() {
  const [shouldError, setShouldError] = useState(false)

  if (shouldError) {
    throw new Error('Đây là lỗi demo từ component!')
  }

  return (
    <div className='p-4 border border-border rounded-lg'>
      <h3 className='heading-6 mb-2'>Component an toàn</h3>
      <p className='body-small-regular text-muted-foreground mb-4'>Component này sẽ gây ra lỗi khi bấm nút bên dưới.</p>
      <Button variant='destructive' onClick={() => setShouldError(true)}>
        Gây ra lỗi
      </Button>
    </div>
  )
}

// Wrap component with error boundary
const SafeErrorComponent = withErrorBoundary(ErrorComponent)

export default function ComponentExamples() {
  const [isLoading, setIsLoading] = useState(false)
  const [showLoadingPage, setShowLoadingPage] = useState(false)

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const simulatePageLoading = () => {
    setShowLoadingPage(true)
    setTimeout(() => {
      setShowLoadingPage(false)
    }, 5000)
  }

  if (showLoadingPage) {
    return <LoadingPage title='Đang tải trang' message='Vui lòng đợi trong khi chúng tôi tải nội dung...' />
  }

  return (
    <div className='min-h-screen bg-background p-8'>
      <div className='max-w-4xl mx-auto space-y-12'>
        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='heading-2 text-foreground'>Naviora UI Components Demo</h1>
          <p className='body-large-regular text-muted-foreground'>Xem các component Loading và Error trong action</p>
        </div>

        {/* Loading Spinners */}
        <section className='space-y-6'>
          <h2 className='heading-4 text-foreground'>Loading Spinners</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            <div className='p-6 border border-border rounded-lg'>
              <h3 className='heading-6 mb-4'>Default</h3>
              <LoadingSpinner variant='default' size='lg' message='Đang tải...' />
            </div>

            <div className='p-6 border border-border rounded-lg'>
              <h3 className='heading-6 mb-4'>Brand</h3>
              <LoadingSpinner variant='brand' size='lg' message='Loading...' />
            </div>

            <div className='p-6 border border-border rounded-lg'>
              <h3 className='heading-6 mb-4'>Dots</h3>
              <LoadingSpinner variant='dots' size='lg' message='Chờ xíu...' />
            </div>

            <div className='p-6 border border-border rounded-lg'>
              <h3 className='heading-6 mb-4'>Pulse</h3>
              <LoadingSpinner variant='pulse' size='lg' message='Processing...' />
            </div>

            <div className='p-6 border border-border rounded-lg'>
              <h3 className='heading-6 mb-4'>Minimal</h3>
              <LoadingSpinner variant='minimal' size='lg' message='Loading...' />
            </div>
          </div>
        </section>

        {/* Interactive Loading */}
        <section className='space-y-6'>
          <h2 className='heading-4 text-foreground'>Interactive Loading</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-6 border border-border rounded-lg space-y-4'>
              <h3 className='heading-6'>Button Loading State</h3>
              <Button onClick={simulateLoading} disabled={isLoading} className='w-full'>
                {isLoading && <LoadingSpinner variant='minimal' size='sm' className='mr-2 p-0' />}
                {isLoading ? 'Đang xử lý...' : 'Bắt đầu tải'}
              </Button>
            </div>

            <div className='p-6 border border-border rounded-lg space-y-4'>
              <h3 className='heading-6'>Full Page Loading</h3>
              <Button onClick={simulatePageLoading} variant='outline' className='w-full'>
                Hiển thị trang loading
              </Button>
            </div>
          </div>
        </section>

        {/* Error Boundary */}
        <section className='space-y-6'>
          <h2 className='heading-4 text-foreground'>Error Boundary</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <ErrorBoundary>
              <SafeErrorComponent />
            </ErrorBoundary>

            <ErrorBoundary
              fallback={
                <div className='p-4 border border-error rounded-lg bg-error-0'>
                  <h3 className='heading-6 text-error mb-2'>Custom Error UI</h3>
                  <p className='body-small-regular text-error-200'>
                    Đây là giao diện lỗi tùy chỉnh thay vì giao diện mặc định.
                  </p>
                </div>
              }
            >
              <div className='p-4 border border-border rounded-lg'>
                <h3 className='heading-6 mb-2'>Component với Custom Error</h3>
                <p className='body-small-regular text-muted-foreground mb-4'>
                  Component này có giao diện lỗi tùy chỉnh.
                </p>
                <Button
                  variant='destructive'
                  onClick={() => {
                    throw new Error('Custom error UI demo!')
                  }}
                >
                  Gây ra lỗi với UI tùy chỉnh
                </Button>
              </div>
            </ErrorBoundary>
          </div>
        </section>

        {/* Navigation to Error Pages */}
        <section className='space-y-6'>
          <h2 className='heading-4 text-foreground'>Error Pages</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='p-6 border border-border rounded-lg space-y-4'>
              <h3 className='heading-6'>404 Not Found</h3>
              <p className='body-small-regular text-muted-foreground'>Thử truy cập một đường dẫn không tồn tại.</p>
              <Button variant='outline' onClick={() => window.open('/non-existent-page', '_blank')} className='w-full'>
                Xem trang 404
              </Button>
            </div>

            <div className='p-6 border border-border rounded-lg space-y-4'>
              <h3 className='heading-6'>Global Loading</h3>
              <p className='body-small-regular text-muted-foreground'>Trang loading toàn cục khi navigating.</p>
              <Button
                variant='outline'
                onClick={() => {
                  // Simulate slow page transition
                  const newTab = window.open('', '_blank')
                  if (newTab) {
                    newTab.document.write(`
                      <!DOCTYPE html>
                      <html>
                        <head><title>Loading Demo</title></head>
                        <body>
                          <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: system-ui;">
                            <div>Đang tải trang mới...</div>
                          </div>
                          <script>
                            setTimeout(() => {
                              window.close();
                            }, 3000);
                          </script>
                        </body>
                      </html>
                    `)
                  }
                }}
                className='w-full'
              >
                Demo loading page
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
