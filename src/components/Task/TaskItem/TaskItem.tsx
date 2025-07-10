import React, { forwardRef, useState } from 'react';
import { TaskItemProps, TaskStatus, TaskPriority, TaskCheckboxProps, TaskTimeProps } from './interface';

// Checkbox component
const TaskCheckbox = ({ checked, onChange, disabled, size = 'md' }: TaskCheckboxProps) => {
  const sizeClasses = {
    sm: 'checkbox-sm',
    md: '',
    lg: 'checkbox-lg'
  };

  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      className={`checkbox checkbox-primary ${sizeClasses[size]}`}
    />
  );
};

// Time display component
const TaskTime = ({ timeTracked, dueDate, showDueDate, compact }: TaskTimeProps) => {
  const now = new Date();
  const isOverdue = dueDate && dueDate < now;
  
  if (compact) {
    return (
      <div className="text-xs text-base-content/60">
        {timeTracked || (showDueDate && dueDate && dueDate.toLocaleDateString())}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end text-right">
      {timeTracked && (
        <span className="text-sm text-base-content/70">{timeTracked}</span>
      )}
      {showDueDate && dueDate && (
        <span className={`text-xs ${isOverdue ? 'text-error' : 'text-base-content/60'}`}>
          {dueDate.toLocaleDateString()}
        </span>
      )}
    </div>
  );
};

// Priority badge component
const PriorityBadge = ({ priority }: { priority: TaskPriority }) => {
  const priorityConfig = {
    LOW: { color: 'badge-ghost', text: 'Low' },
    MEDIUM: { color: 'badge-info', text: 'Medium' },
    HIGH: { color: 'badge-warning', text: 'High' },
    URGENT: { color: 'badge-error', text: 'Urgent' }
  };

  const config = priorityConfig[priority];
  
  return (
    <div className={`badge badge-sm ${config.color}`}>
      {config.text}
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }: { status: TaskStatus }) => {
  const statusConfig = {
    TODO: { color: 'badge-neutral', text: 'To Do' },
    IN_PROGRESS: { color: 'badge-primary', text: 'In Progress' },
    COMPLETED: { color: 'badge-success', text: 'Completed' },
    CANCELLED: { color: 'badge-error', text: 'Cancelled' }
  };

  const config = statusConfig[status];
  
  return (
    <div className={`badge badge-sm ${config.color}`}>
      {config.text}
    </div>
  );
};

export const TaskItem = forwardRef<HTMLDivElement, TaskItemProps>(
  ({ 
    task,
    className = '',
    showTime = true,
    showStatus = false,
    showPriority = false,
    showProject = false,
    showDueDate = false,
    disabled = false,
    onToggleComplete,
    onEdit,
    onDelete,
    onClick,
    // onStatusChange,
    variant = 'default',
    size = 'md',
    // layout = 'horizontal',
    isLoading = false,
    isUpdating = false,
    isSelected = false,
    isDragging = false,
    ...props 
  }, ref) => {
    const [isHovered, setIsHovered] = useState(false);

    // Base styling classes
    const baseClasses = [
      'flex',
      'items-center',
      'group',
      'transition-all',
      'duration-200',
      'border-b',
      'border-base-200',
      'last:border-b-0'
    ];

    // Size classes
    const sizeClasses = {
      sm: 'py-2 px-3 gap-2',
      md: 'py-3 px-4 gap-3',
      lg: 'py-4 px-5 gap-4'
    };

    // Variant classes
    const variantClasses = {
      default: 'hover:bg-base-50',
      compact: 'hover:bg-base-50',
      detailed: 'hover:bg-base-50 rounded-lg mb-2 border border-base-200 shadow-sm'
    };

    // State classes
    const stateClasses = [
      isSelected ? 'bg-primary/10 border-primary/20' : '',
      isDragging ? 'opacity-50 rotate-2' : '',
      isUpdating ? 'animate-pulse' : '',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
    ];

    // Handle checkbox change
    const handleCheckboxChange = (checked: boolean) => {
      if (disabled || isUpdating) return;
      onToggleComplete?.(task.id, checked);
    };

    // Handle item click
    const handleItemClick = (e: React.MouseEvent) => {
      if (disabled || isUpdating) return;
      if (e.target instanceof HTMLInputElement) return; // Don't trigger on checkbox
      onClick?.(task.id);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled || isUpdating) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick?.(task.id);
      }
    };

    // Render loading skeleton
    if (isLoading) {
      return (
        <div
          ref={ref}
          className={[
            ...baseClasses,
            sizeClasses[size],
            'animate-pulse',
            className
          ].join(' ')}
          {...props}
        >
          <div className="checkbox animate-pulse bg-base-300"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-base-300 rounded w-3/4"></div>
            {variant === 'detailed' && (
              <div className="h-3 bg-base-300 rounded w-1/2"></div>
            )}
          </div>
          <div className="h-3 bg-base-300 rounded w-16"></div>
        </div>
      );
    }

    const isCompleted = task.status === 'COMPLETED';

    return (
      <div
        ref={ref}
        className={[
          ...baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          ...stateClasses,
          className
        ].join(' ')}
        onClick={handleItemClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-label={`Task: ${task.title}`}
        {...props}
      >
        {/* Checkbox */}
        <TaskCheckbox
          checked={isCompleted}
          onChange={handleCheckboxChange}
          disabled={disabled || isUpdating}
          size={size}
        />

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {/* Task title */}
            <h3 className={`font-medium text-base-content ${isCompleted ? 'line-through text-base-content/50' : ''}`}>
              {task.title}
            </h3>

            {/* Badges */}
            <div className="flex items-center gap-1">
              {showStatus && <StatusBadge status={task.status} />}
              {showPriority && task.priority && <PriorityBadge priority={task.priority} />}
            </div>
          </div>

          {/* Task description (detailed variant) */}
          {variant === 'detailed' && task.description && (
            <p className="text-sm text-base-content/70 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          {/* Project name */}
          {showProject && task.projectName && (
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-base-content/50">📁</span>
              <span className="text-xs text-base-content/60">{task.projectName}</span>
            </div>
          )}

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {task.tags.map(tag => (
                <span key={tag} className="badge badge-xs badge-outline">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Time and actions */}
        <div className="flex items-center gap-2">
          {/* Time display */}
          {showTime && (
            <TaskTime
              timeTracked={task.timeTracked}
              dueDate={task.dueDate}
              showDueDate={showDueDate}
              compact={variant === 'compact'}
            />
          )}

          {/* Action buttons (shown on hover) */}
          {(isHovered || isSelected) && !disabled && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task.id);
                  }}
                  className="btn btn-ghost btn-xs"
                  title="Edit task"
                >
                  ✏️
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(task.id);
                  }}
                  className="btn btn-ghost btn-xs text-error"
                  title="Delete task"
                >
                  🗑️
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

TaskItem.displayName = 'TaskItem';