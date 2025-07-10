import React, { forwardRef } from 'react';
import { StatCardProps, ChangeType } from './interface';

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ 
    className = '', 
    title, 
    value, 
    change, 
    changeType = 'neutral', 
    icon,
    variant = 'default',
    size = 'md',
    isLoading = false,
    skeleton = false,
    onClick,
    href,
    disabled = false,
    ...props 
  }, ref) => {
    // Base styling classes
    const baseClasses = [
      'card',
      'bg-base-100', 
      'border',
      'border-base-200',
      'shadow-sm',
      'hover:shadow-md',
      'transition-shadow',
      'duration-200'
    ];

    // Size variant classes
    const sizeClasses = {
      sm: 'p-4',
      md: 'p-5',
      lg: 'p-6'
    };

    // Variant classes
    const variantClasses = {
      default: '',
      compact: 'card-compact',
      detailed: 'card-normal'
    };

    // Interactive classes
    const interactiveClasses = (onClick || href) && !disabled ? [
      'cursor-pointer',
      'hover:bg-base-50',
      'active:scale-[0.98]'
    ] : [];

    // Change indicator styling
    const getChangeClasses = (type: ChangeType): string => {
      switch (type) {
        case 'positive':
          return 'text-success';
        case 'negative':
          return 'text-error';
        case 'neutral':
        default:
          return 'text-base-content/70';
      }
    };

    // Render loading skeleton
    if (isLoading || skeleton) {
      return (
        <div
          ref={ref}
          className={[
            ...baseClasses,
            sizeClasses[size],
            variantClasses[variant],
            'animate-pulse',
            className
          ].join(' ')}
          {...props}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-base-300 rounded w-24"></div>
              {icon && <div className="h-5 w-5 bg-base-300 rounded"></div>}
            </div>
            <div className="h-8 bg-base-300 rounded w-16"></div>
            {change && <div className="h-3 bg-base-300 rounded w-20"></div>}
          </div>
        </div>
      );
    }

    // Main component content
    const content = (
      <div className="space-y-2">
        {/* Title and Icon */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-base-content/70 uppercase tracking-wider">
            {title}
          </h3>
          {icon && (
            <div className="text-base-content/50 text-lg">
              {icon}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="text-3xl font-bold text-base-content">
          {value}
        </div>

        {/* Change Indicator */}
        {change && (
          <div className={`text-sm font-medium ${getChangeClasses(changeType)}`}>
            {change}
          </div>
        )}
      </div>
    );

    // Handle click events
    const handleClick = () => {
      if (disabled) return;
      if (onClick) onClick();
      if (href) window.location.href = href;
    };

    return (
      <div
        ref={ref}
        className={[
          ...baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          ...interactiveClasses,
          disabled ? 'opacity-50 cursor-not-allowed' : '',
          className
        ].join(' ')}
        onClick={handleClick}
        role={onClick || href ? 'button' : undefined}
        tabIndex={onClick || href ? 0 : undefined}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && (onClick || href)) {
            e.preventDefault();
            handleClick();
          }
        }}
        {...props}
      >
        {content}
      </div>
    );
  }
);

StatCard.displayName = 'StatCard';