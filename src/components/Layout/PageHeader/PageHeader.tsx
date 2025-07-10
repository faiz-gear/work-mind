import React, { forwardRef } from 'react';
import Image from 'next/image';
import { 
  PageHeaderProps, 
  BreadcrumbNavProps,
  UserMenuProps,
  LanguageSelectorProps,
  ActionGroupProps
} from './interface';

// Breadcrumb navigation component
const BreadcrumbNav = ({ 
  items, 
  onItemClick, 
  // separator = '/', 
  showHome = true, 
  homeIcon = '🏠',
  onHomeClick
}: BreadcrumbNavProps) => {
  if (!items.length && !showHome) return null;

  return (
    <nav className="breadcrumbs text-sm">
      <ul>
        {showHome && (
          <li>
            <button
              onClick={onHomeClick}
              className="hover:text-primary transition-colors"
              title="Go to home"
            >
              {homeIcon}
            </button>
          </li>
        )}
        
        {items.map((item, index) => (
          <li key={index}>
            {item.href || item.onClick ? (
              <button
                onClick={() => {
                  if (item.onClick) {
                    item.onClick();
                  } else if (item.href) {
                    window.location.href = item.href;
                  }
                  onItemClick?.(item);
                }}
                className={`hover:text-primary transition-colors ${
                  item.isActive ? 'text-primary font-medium' : 'text-base-content/70'
                }`}
              >
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </button>
            ) : (
              <span className={item.isActive ? 'text-primary font-medium' : 'text-base-content/70'}>
                {item.icon && <span className="mr-1">{item.icon}</span>}
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

// User menu component
const UserMenu = ({ 
  user, 
  onProfileClick, 
  onSettingsClick, 
  onLogout,
  showProfile = true,
  showSettings = true,
  showLogout = true
}: UserMenuProps) => {
  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-8 rounded-full">
          {user.avatar ? (
            <Image src={user.avatar} alt={user.name} width={32} height={32} className="rounded-full" />
          ) : (
            <div className="bg-primary text-primary-content w-full h-full rounded-full flex items-center justify-center text-sm font-medium">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      
      <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
        <li className="menu-title">
          <span className="text-xs">
            {user.name}
            {user.email && <br />}
            <span className="text-base-content/50">{user.email}</span>
          </span>
        </li>
        
        {showProfile && onProfileClick && (
          <li>
            <button onClick={onProfileClick}>
              👤 Profile
            </button>
          </li>
        )}
        
        {showSettings && onSettingsClick && (
          <li>
            <button onClick={onSettingsClick}>
              ⚙️ Settings
            </button>
          </li>
        )}
        
        {showLogout && onLogout && (
          <>
            <li><hr /></li>
            <li>
              <button onClick={onLogout} className="text-error">
                🚪 Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

// Language selector component
const LanguageSelector = ({ 
  languages, 
  currentLanguage, 
  onLanguageChange, 
  variant = 'dropdown' 
}: LanguageSelectorProps) => {
  const currentLang = languages.find(lang => lang.code === currentLanguage);

  if (variant === 'compact') {
    return (
      <select
        className="select select-ghost select-sm w-full max-w-xs"
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
        {currentLang?.flag} {currentLang?.label}
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              onClick={() => onLanguageChange(lang.code)}
              className={currentLanguage === lang.code ? 'active' : ''}
            >
              {lang.flag} {lang.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Action group component
const ActionGroup = ({ 
  actions, 
  maxVisible = 3, 
  // moreLabel = 'More', 
  moreIcon = '⋯' 
}: ActionGroupProps) => {
  const visibleActions = actions.slice(0, maxVisible);
  const hiddenActions = actions.slice(maxVisible);

  return (
    <div className="flex items-center gap-2">
      {visibleActions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          disabled={action.disabled || action.loading}
          className={`btn ${
            action.variant === 'primary' ? 'btn-primary' :
            action.variant === 'secondary' ? 'btn-secondary' :
            action.variant === 'outline' ? 'btn-outline' :
            'btn-ghost'
          } ${
            action.size === 'sm' ? 'btn-sm' :
            action.size === 'lg' ? 'btn-lg' :
            'btn-md'
          }`}
        >
          {action.loading && <span className="loading loading-spinner loading-sm mr-1"></span>}
          {action.icon && !action.loading && <span className="mr-1">{action.icon}</span>}
          {action.label}
        </button>
      ))}
      
      {hiddenActions.length > 0 && (
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
            {moreIcon}
          </div>
          
          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
            {hiddenActions.map((action, index) => (
              <li key={index}>
                <button
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className={action.disabled ? 'disabled' : ''}
                >
                  {action.loading && <span className="loading loading-spinner loading-xs mr-1"></span>}
                  {action.icon && !action.loading && <span className="mr-1">{action.icon}</span>}
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ 
    title,
    subtitle,
    description,
    className = '',
    icon,
    breadcrumbs = [],
    actions = [],
    children,
    showDivider = true,
    user,
    showUserMenu = true,
    showLanguageSelector = false,
    languages = [],
    currentLanguage = 'en',
    onLanguageChange,
    onUserMenuClick,
    onLogout,
    variant = 'default',
    size = 'md',
    alignment = 'between',
    sticky = false,
    bordered = false,
    shadow = false,
    isLoading = false,
    hasError = false,
    errorMessage,
    onTitleClick,
    onBreadcrumbClick,
    onRefresh,
    onBack,
    ...props 
  }, ref) => {
    // Base styling classes
    const baseClasses = [
      'page-header',
      'bg-base-100',
      'transition-all',
      'duration-200'
    ];

    // Size classes
    const sizeClasses = {
      sm: 'py-3 px-4',
      md: 'py-4 px-6',
      lg: 'py-6 px-8'
    };

    // Variant classes
    const variantClasses = {
      default: '',
      compact: 'py-2',
      minimal: 'py-2 px-4',
      detailed: 'py-6'
    };

    // Layout classes
    const layoutClasses = [
      sticky ? 'sticky top-0 z-30' : '',
      bordered ? 'border-b border-base-200' : '',
      shadow ? 'shadow-sm' : ''
    ];

    // Alignment classes for main content
    const alignmentClasses = {
      left: 'justify-start',
      center: 'justify-center',
      between: 'justify-between'
    };

    return (
      <div
        ref={ref}
        className={[
          ...baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          ...layoutClasses,
          className
        ].join(' ')}
        {...props}
      >
        {/* Error state */}
        {hasError && (
          <div className="alert alert-error mb-4">
            <span>⚠️</span>
            <span>{errorMessage || 'An error occurred'}</span>
            {onRefresh && (
              <button onClick={onRefresh} className="btn btn-error btn-sm">
                Retry
              </button>
            )}
          </div>
        )}

        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <div className="mb-3">
            <BreadcrumbNav
              items={breadcrumbs}
              onItemClick={onBreadcrumbClick}
              onHomeClick={onBack}
            />
          </div>
        )}

        {/* Main header content */}
        <div className={`flex items-start ${alignmentClasses[alignment]} gap-4`}>
          {/* Left side - Title and description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              {/* Back button */}
              {onBack && !breadcrumbs.length && (
                <button
                  onClick={onBack}
                  className="btn btn-ghost btn-circle btn-sm"
                  title="Go back"
                >
                  ←
                </button>
              )}

              {/* Icon */}
              {icon && (
                <div className="text-2xl flex-shrink-0">
                  {icon}
                </div>
              )}

              {/* Title */}
              <div className="flex-1 min-w-0">
                {isLoading ? (
                  <div className="h-8 bg-base-300 rounded animate-pulse w-48"></div>
                ) : (
                  <h1 
                    className={`text-2xl font-semibold text-base-content truncate ${
                      onTitleClick ? 'cursor-pointer hover:text-primary' : ''
                    }`}
                    onClick={onTitleClick}
                  >
                    {title}
                  </h1>
                )}

                {/* Subtitle */}
                {subtitle && !isLoading && (
                  <p className="text-sm text-base-content/60 mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            {description && !isLoading && (
              <p className="text-sm text-base-content/70 mt-2 max-w-2xl">
                {description}
              </p>
            )}
          </div>

          {/* Right side - Actions and user controls */}
          {!isLoading && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Language selector */}
              {showLanguageSelector && languages.length > 0 && onLanguageChange && (
                <LanguageSelector
                  languages={languages}
                  currentLanguage={currentLanguage}
                  onLanguageChange={onLanguageChange}
                  variant="compact"
                />
              )}

              {/* Actions */}
              {actions.length > 0 && (
                <ActionGroup actions={actions} />
              )}

              {/* User menu */}
              {showUserMenu && user && (
                <UserMenu
                  user={user}
                  onProfileClick={onUserMenuClick}
                  onLogout={onLogout}
                />
              )}
            </div>
          )}
        </div>

        {/* Custom children content */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}

        {/* Divider */}
        {showDivider && !bordered && (
          <div className="border-b border-base-200 mt-4"></div>
        )}
      </div>
    );
  }
);

PageHeader.displayName = 'PageHeader';