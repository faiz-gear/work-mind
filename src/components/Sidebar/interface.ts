import { ReactNode } from 'react';

// Navigation item structure
export interface NavigationItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  isActive?: boolean;
  isDisabled?: boolean;
  children?: NavigationItem[];
}

// Brand/logo configuration
export interface BrandConfig {
  logo?: ReactNode;
  title?: string;
  href?: string;
  onClick?: () => void;
}

// Base props for Sidebar
export interface BaseSidebarProps {
  items: NavigationItem[];
  brand?: BrandConfig;
  className?: string;
  width?: number | string;
  position?: 'left' | 'right';
  overlay?: boolean;
}

// Event handler props
export interface SidebarEventProps {
  onNavigate?: (item: NavigationItem) => void;
  onBrandClick?: () => void;
  onToggle?: (collapsed: boolean) => void;
  onClose?: () => void;
}

// State props
export interface SidebarStateProps {
  isOpen?: boolean;
  isCollapsed?: boolean;
  isCollapsible?: boolean;
  isMobile?: boolean;
  activeItemId?: string;
  expandedItems?: string[];
}

// Variant props
export interface SidebarVariantProps {
  variant?: 'default' | 'compact' | 'minimal' | 'floating';
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
}

// Layout props
export interface SidebarLayoutProps {
  showBrand?: boolean;
  showCollapseButton?: boolean;
  showOverlay?: boolean;
  collapsedWidth?: number;
  expandedWidth?: number;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl';
}

// Combined props interface
export interface SidebarProps 
  extends BaseSidebarProps, 
          SidebarEventProps, 
          SidebarStateProps, 
          SidebarVariantProps, 
          SidebarLayoutProps {}

// Navigation group for organizing items
export interface NavigationGroup {
  id: string;
  label?: string;
  items: NavigationItem[];
  collapsible?: boolean;
  isCollapsed?: boolean;
}

// Sidebar header props
export interface SidebarHeaderProps {
  brand?: BrandConfig;
  showCollapseButton?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onBrandClick?: () => void;
}

// Navigation item props
export interface SidebarNavItemProps {
  item: NavigationItem;
  isCollapsed?: boolean;
  level?: number;
  onNavigate?: (item: NavigationItem) => void;
  activeItemId?: string;
  expandedItems?: string[];
  onToggleExpand?: (itemId: string) => void;
}

// Sidebar footer props
export interface SidebarFooterProps {
  children?: ReactNode;
  isCollapsed?: boolean;
}

// Responsive behavior configuration
export interface ResponsiveConfig {
  breakpoint: 'sm' | 'md' | 'lg' | 'xl';
  behavior: 'overlay' | 'push' | 'hide' | 'collapse';
}