import React, { forwardRef, useState } from 'react';
import { 
  ChartPlaceholderProps, 
  ChartType, 
  ChartSize, 
  ChartErrorStateProps, 
  ChartLoadingStateProps, 
  ChartEmptyStateProps,
  ChartHeaderProps,
  ChartAction
} from './interface';

// Chart type icons mapping
const chartIcons: Record<ChartType, string> = {
  line: '📈',
  bar: '📊',
  pie: '🥧',
  area: '📉',
  scatter: '🔷',
  donut: '🍩',
  radar: '🕸️',
  funnel: '🔺'
};

// Size presets
const sizePresets: Record<ChartSize, { width: string; height: string }> = {
  sm: { width: '100%', height: '200px' },
  md: { width: '100%', height: '300px' },
  lg: { width: '100%', height: '400px' },
  xl: { width: '100%', height: '500px' },
  custom: { width: '100%', height: '300px' }
};

// Error state component
const ChartErrorState = ({ message = 'Failed to load chart', icon, retry }: ChartErrorStateProps) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <div className="text-4xl mb-4 text-error">
      {icon || '⚠️'}
    </div>
    <p className="text-error mb-4 font-medium">{message}</p>
    {retry && (
      <button onClick={retry} className="btn btn-error btn-sm">
        Try Again
      </button>
    )}
  </div>
);

// Loading state component
const ChartLoadingState = ({ message = 'Loading chart...', progress }: ChartLoadingStateProps) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
    <p className="text-base-content/60 mb-2">{message}</p>
    {progress !== undefined && (
      <div className="w-full max-w-xs">
        <progress className="progress progress-primary" value={progress} max="100"></progress>
        <p className="text-xs text-base-content/50 mt-1">{progress}%</p>
      </div>
    )}
  </div>
);

// Empty state component
const ChartEmptyState = ({ message = 'No data available', icon, action }: ChartEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <div className="text-4xl mb-4 text-base-content/30">
      {icon || '📊'}
    </div>
    <p className="text-base-content/60 mb-4">{message}</p>
    {action && (
      <button onClick={action.onClick} className="btn btn-primary btn-sm">
        {action.label}
      </button>
    )}
  </div>
);

// Chart header component
const ChartHeader = ({ 
  title, 
  description, 
  actions, 
  showRefresh, 
  showExport, 
  showFullscreen,
  onRefresh,
  onExport,
  onFullscreen
}: ChartHeaderProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const defaultActions: ChartAction[] = [
    ...(showRefresh && onRefresh ? [{
      label: 'Refresh',
      icon: isRefreshing ? '🔄' : '↻',
      onClick: handleRefresh,
      variant: 'ghost' as const,
      disabled: isRefreshing
    }] : []),
    ...(showExport && onExport ? [{
      label: 'Export',
      icon: '📥',
      onClick: onExport,
      variant: 'ghost' as const
    }] : []),
    ...(showFullscreen && onFullscreen ? [{
      label: 'Fullscreen',
      icon: '⛶',
      onClick: onFullscreen,
      variant: 'ghost' as const
    }] : [])
  ];

  const allActions = [...(actions || []), ...defaultActions];

  if (!title && !description && allActions.length === 0) {
    return null;
  }

  return (
    <div className="flex items-start justify-between mb-4 p-4 border-b border-base-200">
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-base-content mb-1">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-base-content/70">
            {description}
          </p>
        )}
      </div>
      
      {allActions.length > 0 && (
        <div className="flex items-center gap-2 ml-4">
          {allActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`btn btn-sm ${
                action.variant === 'primary' ? 'btn-primary' : 
                action.variant === 'secondary' ? 'btn-secondary' : 
                'btn-ghost'
              }`}
              title={action.label}
            >
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Skeleton component
const ChartSkeleton = ({ type }: { type: ChartType }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'bar':
        return (
          <div className="flex items-end justify-center gap-2 h-full p-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-base-300 animate-pulse rounded-t"
                style={{ 
                  width: '20px', 
                  height: `${Math.random() * 60 + 20}%` 
                }}
              />
            ))}
          </div>
        );
      
      case 'line':
      case 'area':
        return (
          <div className="p-6 h-full">
            <div className="relative h-full">
              <svg className="w-full h-full" viewBox="0 0 300 200">
                <path
                  d="M 0 150 Q 75 100 150 120 T 300 80"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-base-300 animate-pulse"
                />
                {Array.from({ length: 6 }).map((_, i) => (
                  <circle
                    key={i}
                    cx={i * 60}
                    cy={150 - Math.random() * 100}
                    r="4"
                    className="fill-base-300 animate-pulse"
                  />
                ))}
              </svg>
            </div>
          </div>
        );
      
      case 'pie':
      case 'donut':
        return (
          <div className="flex items-center justify-center h-full p-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-base-300 animate-pulse"></div>
              {type === 'donut' && (
                <div className="absolute inset-4 rounded-full bg-base-100"></div>
              )}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="grid grid-cols-4 gap-2 p-6 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-base-300 animate-pulse rounded"
                style={{ height: `${Math.random() * 40 + 20}px` }}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      {renderSkeleton()}
    </div>
  );
};

export const ChartPlaceholder = forwardRef<HTMLDivElement, ChartPlaceholderProps>(
  ({ 
    title,
    description,
    className = '',
    height,
    width,
    icon,
    placeholder = 'Chart: Data visualization',
    type = 'bar',
    size = 'md',
    // theme = 'auto',
    // animated = true,
    interactive = true,
    isLoading = false,
    hasError = false,
    isEmpty = false,
    noData = false,
    skeleton = false,
    onClick,
    onRefresh,
    onExport,
    onFullscreen,
    data,
    actions,
    ...props 
  }, ref) => {
    // Determine dimensions
    const dimensions = size === 'custom' 
      ? { width: width || '100%', height: height || '300px' }
      : sizePresets[size];

    // Base styling
    const baseClasses = [
      'chart-placeholder',
      'bg-base-100',
      'border',
      'border-base-200',
      'rounded-lg',
      'overflow-hidden',
      'shadow-sm',
      interactive && onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : '',
      className
    ];

    // Handle click
    const handleClick = () => {
      if (interactive && onClick && !isLoading && !hasError) {
        onClick();
      }
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && interactive && onClick) {
        e.preventDefault();
        handleClick();
      }
    };

    return (
      <div
        ref={ref}
        className={baseClasses.join(' ')}
        style={{ 
          width: dimensions.width, 
          height: dimensions.height,
          minHeight: typeof dimensions.height === 'string' ? dimensions.height : `${dimensions.height}px`
        }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={interactive && onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `Chart: ${title || placeholder}` : undefined}
        {...props}
      >
        {/* Header */}
        <ChartHeader
          title={title}
          description={description}
          actions={actions}
          showRefresh={!!onRefresh}
          showExport={!!onExport}
          showFullscreen={!!onFullscreen}
          onRefresh={onRefresh}
          onExport={onExport}
          onFullscreen={onFullscreen}
        />

        {/* Chart Content */}
        <div className="flex-1 min-h-0 relative">
          {hasError ? (
            <ChartErrorState retry={onRefresh} />
          ) : isLoading ? (
            <ChartLoadingState />
          ) : skeleton ? (
            <ChartSkeleton type={type} />
          ) : isEmpty || noData ? (
            <ChartEmptyState 
              message={noData ? 'No data to display' : 'Chart is empty'}
              action={onRefresh ? { label: 'Refresh Data', onClick: onRefresh } : undefined}
            />
          ) : data ? (
            // When actual data is provided, you would render the real chart here
            // For now, showing a placeholder with the data indication
            <div className="flex items-center justify-center h-full text-center p-6">
              <div>
                <div className="text-4xl mb-4">
                  {icon || chartIcons[type]}
                </div>
                <p className="text-base-content/70 text-sm">
                  Chart with {Array.isArray(data) ? data.length : 'real'} data points
                </p>
                <p className="text-xs text-base-content/50 mt-2">
                  {placeholder}
                </p>
              </div>
            </div>
          ) : (
            // Default placeholder
            <div className="flex items-center justify-center h-full text-center p-6">
              <div>
                <div className="text-4xl mb-4 text-base-content/40">
                  {icon || chartIcons[type]}
                </div>
                <p className="text-base-content/60 text-sm font-medium">
                  {placeholder}
                </p>
                <p className="text-xs text-base-content/40 mt-1">
                  {type.charAt(0).toUpperCase() + type.slice(1)} Chart
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ChartPlaceholder.displayName = 'ChartPlaceholder';