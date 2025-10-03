import { AppSidebar } from '@/components/layouts/app-sidebar'
import { Navbar } from '@/components/common/navbar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function MainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <div className='w-full py-2 pr-2 bg-greyscale-25'>
        <div className='flex flex-col h-full rounded-lg border-1'>
          <Navbar />
          {children}
        </div>
      </div>
    </SidebarProvider>
  )
}
