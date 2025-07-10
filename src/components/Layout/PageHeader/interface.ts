import { ReactNode } from 'react';

// Breadcrumb item structure
export interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  isActive?: boolean;
}

// Action button configuration
export interface HeaderAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
}

// User profile information
export interface UserProfile {
  name: string;
  email?: string;
  avatar?: string;
  role?: string;
}

// Language option
export interface LanguageOption {
  code: string;
  label: string;
  flag?: string;
}

// Base props for PageHeader
export interface BasePageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  className?: string;
  icon?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
}

// Content props
export interface PageHeaderContentProps {
  actions?: HeaderAction[];
  children?: ReactNode;
  showDivider?: boolean;
}

// User and settings props
export interface PageHeaderUserProps {
  user?: UserProfile;
  showUserMenu?: boolean;
  showLanguageSelector?: boolean;
  languages?: LanguageOption[];
  currentLanguage?: string;
  onLanguageChange?: (language: string) => void;
  onUserMenuClick?: () => void;
  onLogout?: () => void;
}

// Layout props
export interface PageHeaderLayoutProps {
  variant?: 'default' | 'compact' | 'minimal' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  alignment?: 'left' | 'center' | 'between';
  sticky?: boolean;
  bordered?: boolean;
  shadow?: boolean;
}

// State props
export interface PageHeaderStateProps {
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

// Event props
export interface PageHeaderEventProps {
  onTitleClick?: () => void;
  onBreadcrumbClick?: (item: BreadcrumbItem) => void;
  onRefresh?: () => void;
  onBack?: () => void;
}

// Combined props interface
export interface PageHeaderProps 
  extends BasePageHeaderProps, 
          PageHeaderContentProps, 
          PageHeaderUserProps, 
          PageHeaderLayoutProps, 
          PageHeaderStateProps, 
          PageHeaderEventProps {}

// Breadcrumb navigation props
export interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  onItemClick?: (item: BreadcrumbItem) => void;
  separator?: ReactNode;
  showHome?: boolean;
  homeIcon?: ReactNode;
  onHomeClick?: () => void;
}

// User menu props
export interface UserMenuProps {
  user: UserProfile;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
  showProfile?: boolean;
  showSettings?: boolean;
  showLogout?: boolean;
}

// Language selector props
export interface LanguageSelectorProps {
  languages: LanguageOption[];
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
  variant?: 'dropdown' | 'compact';
}

// Action group props
export interface ActionGroupProps {
  actions: HeaderAction[];
  maxVisible?: number;
  moreLabel?: string;
  moreIcon?: ReactNode;
}