'use client'

import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon, 
  CheckSquareIcon, 
  FolderIcon, 
  BarChart3Icon, 
  BotIcon, 
  SettingsIcon 
} from 'lucide-react'

const Sidebar = () => {
  const t = useTranslations('navigation')
  const pathname = usePathname()

  const menuItems = [
    {
      href: '/dashboard',
      label: t('dashboard'),
      icon: HomeIcon,
    },
    {
      href: '/tasks',
      label: t('tasks'),
      icon: CheckSquareIcon,
    },
    {
      href: '/projects',
      label: t('projects'),
      icon: FolderIcon,
    },
    {
      href: '/summary',
      label: t('summary'),
      icon: BarChart3Icon,
    },
    {
      href: '/agent',
      label: t('agent'),
      icon: BotIcon,
    },
    {
      href: '/settings',
      label: t('settings'),
      icon: SettingsIcon,
    },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="drawer-side">
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <aside className="min-h-full w-64 bg-base-200 p-4">
        {/* Logo */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-primary">WorkMind</h1>
        </div>

        {/* Navigation Menu */}
        <ul className="menu menu-sm space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-content'
                      : 'hover:bg-base-300'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </aside>
    </div>
  )
}

export default Sidebar
