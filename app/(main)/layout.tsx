'use client'

import { AppSidebar } from '@/components/layouts/app-sidebar'
import { Navbar } from '@/components/common/navbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AuthGuard } from '@/components/guard/auth-guard'
import { usePathname } from 'next/navigation'
import { BreadcrumbProvider } from '@/lib/context/breadcrumb-context'
import { EntryTestGuard } from '@/components/guard/entry-test-guard'

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const isMeetingPage = pathname?.includes('/meeting')

  return (
       <AuthGuard>
      {isMeetingPage ? (
        children
      ) : (
        <BreadcrumbProvider>
          <SidebarProvider defaultOpen={false}>
            <AppSidebar />
            <div className='w-full py-2 pr-2 bg-greyscale-25'>
              <div className='flex flex-col h-full rounded-md border bg-greyscale-0'>
                <Navbar />
                <EntryTestGuard>
                  {children}
                </EntryTestGuard>
              </div>
            </div>
          </SidebarProvider>
        </BreadcrumbProvider>
      )}
    </AuthGuard>
  )
}
