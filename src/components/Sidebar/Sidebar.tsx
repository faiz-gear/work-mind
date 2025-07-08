import React, { forwardRef, useState, useEffect } from 'react';
import { 
  SidebarProps, 
  NavigationItem,
  SidebarHeaderProps,
  SidebarNavItemProps,
  SidebarFooterProps
} from './interface';

// Sidebar header component
const SidebarHeader = ({ 
  brand, 
  showCollapseButton, 
  isCollapsed, 
  onToggleCollapse, 
  onBrandClick 
}: SidebarHeaderProps) => {
  if (!brand && !showCollapseButton) return null;

  return (
    <div className="flex items-center justify-between p-4 border-b border-base-200">
      {/* Brand */}
      {brand && (
        <div 
          className={`flex items-center gap-3 ${
            brand.onClick || brand.href ? 'cursor-pointer hover:opacity-80' : ''
          } ${isCollapsed ? 'justify-center' : ''}`}
          onClick={brand.onClick || onBrandClick}
        >
          {brand.logo && (
            <div className="text-2xl flex-shrink-0">
              {brand.logo}
            </div>
          )}
          {brand.title && !isCollapsed && (
            <h1 className="text-lg font-semibold text-base-content truncate">
              {brand.title}
            </h1>
          )}
        </div>
      )}
      
      {/* Collapse button */}
      {showCollapseButton && (
        <button
          onClick={onToggleCollapse}
          className="btn btn-ghost btn-sm"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '→' : '←'}
        </button>
      )}
    </div>
  );
};

// Navigation item component
const SidebarNavItem = ({ 
  item, 
  isCollapsed, 
  level = 0, 
  onNavigate, 
  activeItemId,
  expandedItems = [],
  onToggleExpand
}: SidebarNavItemProps) => {
  const isActive = item.id === activeItemId;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.includes(item.id);
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (item.isDisabled) return;
    
    if (hasChildren) {
      onToggleExpand?.(item.id);
    } else {
      onNavigate?.(item);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as unknown as React.MouseEvent);
    }
  };

  // Base item classes
  const itemClasses = [
    'flex',
    'items-center',
    'w-full',
    'px-3',
    'py-2',
    'mx-2',
    'rounded-md',
    'text-sm',
    'transition-colors',
    'duration-200',
    'group',
    isActive ? 'bg-primary text-primary-content' : 'text-base-content hover:bg-base-200',
    item.isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    level > 0 ? 'ml-4' : ''
  ];

  return (
    <div>
      <div
        className={itemClasses.join(' ')}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={item.isDisabled ? -1 : 0}
        role="button"
        aria-label={item.label}
        aria-expanded={hasChildren ? isExpanded : undefined}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        {/* Icon */}
        {item.icon && (
          <div className="text-lg flex-shrink-0 mr-3">
            {item.icon}
          </div>
        )}
        
        {/* Label */}
        {!isCollapsed && (
          <span className="flex-1 truncate">
            {item.label}
          </span>
        )}
        
        {/* Badge */}
        {!isCollapsed && item.badge && (
          <span className="badge badge-sm badge-primary ml-2">
            {item.badge}
          </span>
        )}
        
        {/* Expand/collapse icon */}
        {!isCollapsed && hasChildren && (
          <div className="ml-2 text-xs">
            {isExpanded ? '▼' : '▶'}
          </div>
        )}
      </div>
      
      {/* Children */}
      {hasChildren && isExpanded && !isCollapsed && (
        <div className="ml-4">
          {item.children!.map((child) => (
            <SidebarNavItem
              key={child.id}
              item={child}
              isCollapsed={isCollapsed}
              level={level + 1}
              onNavigate={onNavigate}
              activeItemId={activeItemId}
              expandedItems={expandedItems}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Sidebar footer component
const SidebarFooter = ({ children, isCollapsed }: SidebarFooterProps) => {
  if (!children) return null;

  return (
    <div className={`p-4 border-t border-base-200 ${isCollapsed ? 'px-2' : ''}`}>
      {children}
    </div>
  );
};

export const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(
  ({ 
    items,
    brand,
    className = '',
    width = 240,
    position = 'left',
    overlay = false,
    onNavigate,
    onBrandClick,
    onToggle,
    onClose,
    isOpen = true,
    isCollapsed = false,
    isCollapsible = true,
    isMobile = false,
    activeItemId,
    expandedItems = [],
    variant = 'default',
    // theme = 'auto',
    size = 'md',
    showBrand = true,
    showCollapseButton = true,
    showOverlay = true,
    collapsedWidth = 64,
    expandedWidth,
    // breakpoint = 'lg',
    ...props 
  }, ref) => {
    const [internalCollapsed, setInternalCollapsed] = useState(isCollapsed);
    const [internalExpanded, setInternalExpanded] = useState<string[]>(expandedItems);

    // Update internal state when props change
    useEffect(() => {
      setInternalCollapsed(isCollapsed);
    }, [isCollapsed]);

    useEffect(() => {
      setInternalExpanded(expandedItems);
    }, [expandedItems]);

    const collapsed = internalCollapsed;
    const currentWidth = expandedWidth || width;
    const sidebarWidth = collapsed ? collapsedWidth : currentWidth;

    // Handle collapse toggle
    const handleToggleCollapse = () => {
      const newCollapsed = !collapsed;
      setInternalCollapsed(newCollapsed);
      onToggle?.(newCollapsed);
    };

    // Handle item navigation
    const handleNavigate = (item: NavigationItem) => {
      if (item.href) {
        window.location.href = item.href;
      }
      if (item.onClick) {
        item.onClick();
      }
      onNavigate?.(item);
      
      // Close sidebar on mobile after navigation
      if (isMobile && onClose) {
        onClose();
      }
    };

    // Handle item expansion
    const handleToggleExpand = (itemId: string) => {
      const newExpanded = internalExpanded.includes(itemId)
        ? internalExpanded.filter(id => id !== itemId)
        : [...internalExpanded, itemId];
      
      setInternalExpanded(newExpanded);
    };

    // Handle overlay click
    const handleOverlayClick = () => {
      if (onClose) {
        onClose();
      }
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    // Base styling classes
    const baseClasses = [
      'sidebar',
      'bg-base-100',
      'border-base-200',
      'flex',
      'flex-col',
      'h-full',
      'transition-all',
      'duration-300',
      'ease-in-out',
      'overflow-hidden'
    ];

    // Variant classes
    const variantClasses = {
      default: 'shadow-md',
      compact: 'shadow-sm',
      minimal: 'shadow-none border-r',
      floating: 'shadow-xl rounded-r-lg'
    };

    // Size classes
    const sizeClasses = {
      sm: 'text-sm',
      md: '',
      lg: 'text-lg'
    };

    // Position classes
    const positionClasses = {
      left: 'left-0',
      right: 'right-0'
    };

    // Mobile/overlay classes
    const overlayClasses = overlay || isMobile ? [
      'fixed',
      'top-0',
      'z-50',
      isOpen ? 'translate-x-0' : position === 'left' ? '-translate-x-full' : 'translate-x-full'
    ] : [
      'relative'
    ];

    return (
      <>
        {/* Overlay */}
        {showOverlay && (overlay || isMobile) && isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleOverlayClick}
          />
        )}

        {/* Sidebar */}
        <div
          ref={ref}
          className={[
            ...baseClasses,
            variantClasses[variant],
            sizeClasses[size],
            positionClasses[position],
            ...overlayClasses,
            className
          ].join(' ')}
          style={{ 
            width: `${sidebarWidth}px`,
            minWidth: `${sidebarWidth}px`,
            maxWidth: `${sidebarWidth}px`
          }}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
          {...props}
        >
          {/* Header */}
          {showBrand && (
            <SidebarHeader
              brand={brand}
              showCollapseButton={showCollapseButton && isCollapsible}
              isCollapsed={collapsed}
              onToggleCollapse={handleToggleCollapse}
              onBrandClick={onBrandClick}
            />
          )}

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-2">
            <div className="space-y-1">
              {items.map((item) => (
                <SidebarNavItem
                  key={item.id}
                  item={item}
                  isCollapsed={collapsed}
                  onNavigate={handleNavigate}
                  activeItemId={activeItemId}
                  expandedItems={internalExpanded}
                  onToggleExpand={handleToggleExpand}
                />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <SidebarFooter isCollapsed={collapsed}>
            {/* You can add footer content here */}
          </SidebarFooter>
        </div>
      </>
    );
  }
);

Sidebar.displayName = 'Sidebar';