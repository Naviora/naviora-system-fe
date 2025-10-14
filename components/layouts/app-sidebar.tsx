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
import { Separator } from '../ui/separator'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useRoleNavigation } from '@/hooks/use-role-navigation'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../ui/input-group'
import { SearchIcon } from 'lucide-react'
import { Kbd } from '../ui/kbd'

export function AppSidebar() {
  const pathname = usePathname()
  const { mainNavigation, bottomNavigation } = useRoleNavigation()

  return (
    <Sidebar collapsible='icon' className='border-none'>
      <div className='flex flex-col px-4 group-data-[collapsible=icon]:px-0 h-full'>
        <SidebarHeader>
          <div className='flex items-center justify-between  group-data-[collapsible=icon]:justify-end group-data-[collapsible=icon]:flex-col-reverse'>
            <Logo size='sm' />
            <SidebarTrigger />
          </div>
          <div className='relative group-data-[collapsible=icon]:hidden'>
            <InputGroup className='w-full rounded-md'>
              <InputGroupInput placeholder='Tìm chương' />
              <InputGroupAddon>
                <SearchIcon className='text-greyscale-400' />
              </InputGroupAddon>
              <InputGroupAddon align='inline-end'>
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </InputGroupAddon>
            </InputGroup>
          </div>
        </SidebarHeader>
        <div className='px-2'>
          <Separator />
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className='gap-2'>
                {mainNavigation.map((item) => {
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
