import React, { forwardRef, useState } from 'react';
import { 
  InsightCardProps, 
  InsightType, 
  InsightPriority, 
  InsightIconConfig,
  InsightHeaderProps,
  InsightContentProps,
  InsightFooterProps,
  InsightAction
} from './interface';

// Insight type configuration
const insightTypeConfig: Record<InsightType, InsightIconConfig> = {
  productivity: {
    icon: '📈',
    color: 'text-success',
    bgColor: 'bg-success/10'
  },
  suggestion: {
    icon: '💡',
    color: 'text-info',
    bgColor: 'bg-info/10'
  },
  warning: {
    icon: '⚠️',
    color: 'text-warning',
    bgColor: 'bg-warning/10'
  },
  achievement: {
    icon: '🏆',
    color: 'text-success',
    bgColor: 'bg-success/10'
  },
  trend: {
    icon: '📊',
    color: 'text-primary',
    bgColor: 'bg-primary/10'
  },
  recommendation: {
    icon: '🎯',
    color: 'text-accent',
    bgColor: 'bg-accent/10'
  }
};

// Priority configuration
const priorityConfig: Record<InsightPriority, { color: string; label: string }> = {
  low: { color: 'badge-neutral', label: 'Low' },
  medium: { color: 'badge-info', label: 'Medium' },
  high: { color: 'badge-warning', label: 'High' },
  urgent: { color: 'badge-error', label: 'Urgent' }
};

// Insight header component
const InsightHeader = ({
  insight,
  showTimestamp,
  showSource,
  showPriority,
  showConfidence,
  onDismiss,
  isBookmarked,
  onBookmark
}: InsightHeaderProps) => {
  const config = insightTypeConfig[insight.type];
  const priorityConf = insight.priority ? priorityConfig[insight.priority] : null;

  return (
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* Icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center text-sm`}>
          {config.icon}
        </div>
        
        {/* Title and metadata */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base-content truncate">
            {insight.title}
          </h3>
          
          <div className="flex items-center gap-2 mt-1 text-xs text-base-content/60">
            {showTimestamp && insight.timestamp && (
              <span>{insight.timestamp.toLocaleTimeString()}</span>
            )}
            
            {showSource && insight.source && (
              <>
                {showTimestamp && <span>•</span>}
                <span>{insight.source}</span>
              </>
            )}
            
            {showConfidence && insight.confidence && (
              <>
                {(showTimestamp || showSource) && <span>•</span>}
                <span>{insight.confidence}% confident</span>
              </>
            )}
          </div>
        </div>
        
        {/* Priority badge */}
        {showPriority && priorityConf && (
          <div className={`badge badge-sm ${priorityConf.color}`}>
            {priorityConf.label}
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-1">
        {onBookmark && (
          <button
            onClick={() => onBookmark(insight.id)}
            className="btn btn-ghost btn-xs"
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {isBookmarked ? '⭐' : '☆'}
          </button>
        )}
        
        {onDismiss && (
          <button
            onClick={() => onDismiss(insight.id)}
            className="btn btn-ghost btn-xs"
            title="Dismiss"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

// Insight content component
const InsightContent = ({
  content,
  truncateContent,
  maxContentLength = 200,
  isExpanded,
  onToggleExpand
}: InsightContentProps) => {
  const shouldTruncate = truncateContent && content.length > maxContentLength;
  const displayContent = shouldTruncate && !isExpanded 
    ? content.substring(0, maxContentLength) + '...'
    : content;

  return (
    <div className="mb-4">
      <p className="text-sm text-base-content/80 leading-relaxed">
        {displayContent}
      </p>
      
      {shouldTruncate && onToggleExpand && (
        <button
          onClick={onToggleExpand}
          className="text-xs text-primary hover:underline mt-1"
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};

// Insight footer component
const InsightFooter = ({
  insight,
  actions,
  showTags,
  onFeedback,
  onShare
}: InsightFooterProps) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'helpful' | 'not_helpful' | null>(null);

  const handleFeedback = (feedback: 'helpful' | 'not_helpful') => {
    setFeedbackGiven(feedback);
    onFeedback?.(insight.id, feedback);
  };

  return (
    <div className="space-y-3">
      {/* Tags */}
      {showTags && insight.tags && insight.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {insight.tags.map(tag => (
            <span key={tag} className="badge badge-xs badge-outline">
              {tag}
            </span>
          ))}
        </div>
      )}
      
      {/* Actions and feedback */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {actions && actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              disabled={action.disabled}
              className={`btn btn-xs ${
                action.variant === 'primary' ? 'btn-primary' :
                action.variant === 'secondary' ? 'btn-secondary' :
                action.variant === 'danger' ? 'btn-error' :
                'btn-ghost'
              }`}
            >
              {action.icon && <span className="mr-1">{action.icon}</span>}
              {action.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Feedback buttons */}
          {onFeedback && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-base-content/50">Helpful?</span>
              <button
                onClick={() => handleFeedback('helpful')}
                className={`btn btn-xs ${feedbackGiven === 'helpful' ? 'btn-success' : 'btn-ghost'}`}
                title="Mark as helpful"
              >
                👍
              </button>
              <button
                onClick={() => handleFeedback('not_helpful')}
                className={`btn btn-xs ${feedbackGiven === 'not_helpful' ? 'btn-error' : 'btn-ghost'}`}
                title="Mark as not helpful"
              >
                👎
              </button>
            </div>
          )}
          
          {/* Share button */}
          {onShare && (
            <button
              onClick={() => onShare(insight.id)}
              className="btn btn-ghost btn-xs"
              title="Share insight"
            >
              📤
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const InsightCard = forwardRef<HTMLDivElement, InsightCardProps>(
  ({ 
    insight,
    className = '',
    showTimestamp = true,
    showSource = false,
    showPriority = true,
    showConfidence = false,
    showTags = true,
    truncateContent = true,
    maxContentLength = 200,
    onClick,
    onDismiss,
    onBookmark,
    onShare,
    onApply,
    onFeedback,
    variant = 'default',
    size = 'md',
    layout = 'card',
    isLoading = false,
    isBookmarked = false,
    isDismissed = false,
    isExpanded = false,
    isNew = false,
    isRead = true,
    actions,
    ...props 
  }, ref) => {
    const [expanded, setExpanded] = useState(isExpanded);
    
    const config = insightTypeConfig[insight.type];

    // Base styling classes
    const baseClasses = [
      'insight-card',
      'bg-base-100',
      'border',
      'border-base-200',
      'rounded-lg',
      'transition-all',
      'duration-200'
    ];

    // Size classes
    const sizeClasses = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-5'
    };

    // Variant classes
    const variantClasses = {
      default: 'shadow-sm hover:shadow-md',
      compact: 'shadow-sm',
      detailed: 'shadow-md hover:shadow-lg',
      minimal: 'border-0 shadow-none'
    };

    // Layout classes
    const layoutClasses = {
      card: '',
      banner: 'rounded-none border-l-4 border-r-0 border-t-0 border-b-0',
      toast: 'shadow-lg'
    };

    // State classes
    const stateClasses = [
      isNew && !isRead ? 'ring-2 ring-primary/50' : '',
      isDismissed ? 'opacity-50' : '',
      onClick ? 'cursor-pointer hover:bg-base-50' : ''
    ];

    // Border color based on type
    const borderColor = layout === 'banner' ? config.color.replace('text-', 'border-') : '';

    // Handle click
    const handleClick = (e: React.MouseEvent) => {
      if (onClick && !isDismissed) {
        // Don't trigger onClick if clicking on buttons
        if ((e.target as HTMLElement).closest('button')) return;
        onClick(insight.id);
      }
    };

    // Handle keyboard events
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && onClick && !isDismissed) {
        e.preventDefault();
        onClick(insight.id);
      }
    };

    // Default actions
    const defaultActions: InsightAction[] = [
      ...(onApply ? [{
        label: 'Apply',
        icon: '✓',
        onClick: () => onApply(insight.id),
        variant: 'primary' as const
      }] : [])
    ];

    const allActions = [...defaultActions, ...(actions || [])];

    // Render loading state
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={[
            ...baseClasses,
            sizeClasses[size],
            variantClasses[variant],
            layoutClasses[layout],
            'animate-pulse',
            className
          ].join(' ')}
          {...props}
        >
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-base-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-base-300 rounded w-3/4"></div>
              <div className="h-3 bg-base-300 rounded w-1/2"></div>
              <div className="h-3 bg-base-300 rounded w-full"></div>
              <div className="h-3 bg-base-300 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      );
    }

    // Don't render if dismissed
    if (isDismissed) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={[
          ...baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          layoutClasses[layout],
          borderColor,
          ...stateClasses,
          className
        ].join(' ')}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={onClick ? 0 : undefined}
        role={onClick ? 'button' : undefined}
        aria-label={onClick ? `Insight: ${insight.title}` : undefined}
        {...props}
      >
        {/* Header */}
        <InsightHeader
          insight={insight}
          showTimestamp={showTimestamp}
          showSource={showSource}
          showPriority={showPriority}
          showConfidence={showConfidence}
          onDismiss={onDismiss}
          isBookmarked={isBookmarked}
          onBookmark={onBookmark}
        />

        {/* Content */}
        <InsightContent
          content={insight.content}
          truncateContent={truncateContent}
          maxContentLength={maxContentLength}
          isExpanded={expanded}
          onToggleExpand={() => setExpanded(!expanded)}
        />

        {/* Footer */}
        <InsightFooter
          insight={insight}
          actions={allActions}
          showTags={showTags}
          onFeedback={onFeedback}
          onShare={onShare}
        />
      </div>
    );
  }
);

InsightCard.displayName = 'InsightCard';