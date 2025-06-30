'use client'

import { useTranslations } from 'next-intl'
import { MenuIcon, BellIcon, UserIcon } from 'lucide-react'

interface HeaderProps {
  title?: string
}

const Header = ({ title }: HeaderProps) => {
  const t = useTranslations('common')

  return (
    <header className="navbar bg-base-100 border-b border-base-300 px-4 min-h-16">
      {/* Mobile menu button */}
      <div className="navbar-start">
        <label htmlFor="drawer-toggle" className="btn btn-square btn-ghost btn-sm lg:hidden">
          <MenuIcon size={20} />
        </label>
        
        {/* Page title */}
        {title && (
          <h1 className="text-lg font-semibold ml-2 lg:ml-0">{title}</h1>
        )}
      </div>

      {/* Center content */}
      <div className="navbar-center">
        {/* Search bar for larger screens */}
        <div className="form-control hidden lg:block">
          <input
            type="text"
            placeholder={t('search')}
            className="input input-sm input-bordered w-64"
          />
        </div>
      </div>

      {/* Right side actions */}
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="btn btn-ghost btn-sm btn-square">
            <BellIcon size={18} />
          </button>

          {/* User menu */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm btn-square">
              <UserIcon size={18} />
            </div>
            <ul tabIndex={0} className="dropdown-content menu menu-sm bg-base-100 rounded-box z-[1] w-52 p-2 shadow border border-base-300">
              <li>
                <a className="text-sm">Profile</a>
              </li>
              <li>
                <a className="text-sm">Settings</a>
              </li>
              <li>
                <hr className="my-1" />
              </li>
              <li>
                <a className="text-sm">Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
