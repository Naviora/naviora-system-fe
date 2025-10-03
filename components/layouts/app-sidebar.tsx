'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger
} from '@/components/ui/sidebar'
import Logo from '../common/logo'
import { Input } from '../ui'
import { Separator } from '../ui/separator'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { RiHome5Fill, RiBook2Fill, RiSearchLine, RiSettings2Fill, RiHeadphoneFill } from 'react-icons/ri'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: RiHome5Fill },
  { name: 'Modules', href: '/modules', icon: RiBook2Fill }
]

const bottomNavigation = [
  { name: 'Settings', href: '/settings', icon: RiSettings2Fill },
  { name: 'Help', href: '/help', icon: RiHeadphoneFill }
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible='icon' className='border-none bg-greyscale-25'>
      <div className='flex flex-col px-4 group-data-[collapsible=icon]:px-0 h-full'>
        <SidebarHeader>
          <div className='flex items-center justify-between  group-data-[collapsible=icon]:justify-end '>
            <Logo className='group-data-[collapsible=icon]:hidden' />
            <SidebarTrigger />
          </div>
          <div className='relative group-data-[collapsible=icon]:hidden'>
            <Input
              placeholder='Search anything'
              className='h-9 w-full border-greyscale-200 bg-background pl-9 body-small-medium placeholder:text-greyscale-400 rounded-sm'
            />
            <div className='pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1'>
              <RiSearchLine className='h-4 w-4 text-greyscale-400' />
            </div>
          </div>
        </SidebarHeader>
        <div className='px-2'>
          <Separator />
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className='gap-2'>
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <SidebarMenuItem key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 rounded-sm px-2 py-2 text-sm font-medium transition-colors ',
                          isActive
                            ? 'text-primary bg-greyscale-0 border-r-4 border-primary border-none'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                      >
                        <item.icon className='h-4 w-4' />
                        <div className='group-data-[collapsible=icon]:hidden'>{item.name}</div>
                      </Link>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup></SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className='px-2'>
            <Separator />
          </div>
          <SidebarMenu className='gap-2'>
            {bottomNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <SidebarMenuItem key={item.name}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-sm px-2 py-2 text-sm font-medium transition-colors ',
                      isActive
                        ? 'text-primary bg-greyscale-0 border-r-4 border-primary border-none'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <item.icon className='h-4 w-4' />
                    <div className='group-data-[collapsible=icon]:hidden'>{item.name}</div>
                  </Link>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
