import React, { forwardRef, useMemo } from 'react';
import { TaskItem } from '../TaskItem/TaskItem';
import { TaskListProps, TaskGroup, TaskListAction, TaskListEmptyStateProps, TaskListHeaderProps, TaskSortOptions } from './interface';
import { TaskData } from '../TaskItem/interface';

// Empty state component
const TaskListEmptyState = ({ message = 'No tasks found', icon, action }: TaskListEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="text-4xl mb-4 text-base-content/30">
      {icon || '📝'}
    </div>
    <p className="text-base-content/60 mb-4">{message}</p>
    {action && (
      <button 
        onClick={action.onClick}
        className="btn btn-primary btn-sm"
      >
        {action.label}
      </button>
    )}
  </div>
);

// Header component
const TaskListHeader = ({ 
  title, 
  count, 
  actions, 
  sortOptions, 
  onSort, 
  // showFilters, 
  // onFilter 
}: TaskListHeaderProps) => {
  // const [showSortMenu, setShowSortMenu] = useState(false);

  const handleSort = (field: TaskSortOptions['field']) => {
    const newDirection = sortOptions?.field === field && sortOptions?.direction === 'asc' ? 'desc' : 'asc';
    onSort?.({ field, direction: newDirection });
    // setShowSortMenu(false); // Commented out since showSortMenu state is not used
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {title && (
          <h3 className="text-lg font-semibold text-base-content">
            {title}
          </h3>
        )}
        {count !== undefined && (
          <span className="badge badge-neutral badge-sm">
            {count}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Sort dropdown */}
        {onSort && (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm">
              Sort
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><a onClick={() => handleSort('title')}>Title</a></li>
              <li><a onClick={() => handleSort('status')}>Status</a></li>
              <li><a onClick={() => handleSort('priority')}>Priority</a></li>
              <li><a onClick={() => handleSort('dueDate')}>Due Date</a></li>
              <li><a onClick={() => handleSort('createdAt')}>Created</a></li>
            </ul>
          </div>
        )}

        {/* Actions */}
        {actions && actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            className={`btn btn-sm ${
              action.variant === 'primary' ? 'btn-primary' : 
              action.variant === 'secondary' ? 'btn-secondary' : 
              'btn-ghost'
            }`}
          >
            {action.icon && <span className="mr-1">{action.icon}</span>}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// Task group component
const TaskGroupComponent = ({ 
  group, 
  showTime, 
  showStatus, 
  showPriority, 
  showProject, 
  showDueDate, 
  onTaskToggle, 
  onTaskEdit, 
  onTaskDelete, 
  onTaskClick,
  size 
}: {
  group: TaskGroup;
  showTime?: boolean;
  showStatus?: boolean;
  showPriority?: boolean;
  showProject?: boolean;
  showDueDate?: boolean;
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  onTaskEdit?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskClick?: (taskId: string) => void;
  size?: 'sm' | 'md' | 'lg';
}) => (
  <div className="mb-6">
    <div className="flex items-center gap-2 mb-3">
      <h4 className="font-medium text-base-content/80">{group.title}</h4>
      <span className="badge badge-sm badge-outline">{group.count}</span>
    </div>
    <div className="bg-base-100 rounded-lg border border-base-200 overflow-hidden">
      {group.tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          showTime={showTime}
          showStatus={showStatus}
          showPriority={showPriority}
          showProject={showProject}
          showDueDate={showDueDate}
          onToggleComplete={onTaskToggle}
          onEdit={onTaskEdit}
          onDelete={onTaskDelete}
          onClick={onTaskClick}
          size={size}
        />
      ))}
    </div>
  </div>
);

export const TaskList = forwardRef<HTMLDivElement, TaskListProps>(
  ({ 
    tasks,
    title,
    className = '',
    emptyMessage = 'No tasks found',
    showHeader = true,
    showActions = true,
    showTime = true,
    showStatus = false,
    showPriority = false,
    showProject = false,
    showDueDate = false,
    maxItems,
    groupBy = 'none',
    sortOptions,
    filterOptions,
    onTaskToggle,
    onTaskEdit,
    onTaskDelete,
    onTaskClick,
    onNewTask,
    onViewAll,
    onSort,
    onFilter,
    variant = 'default',
    size = 'md',
    // layout = 'list',
    isLoading = false,
    isUpdating = false,
    selectedTasks = [],
    // dragEnabled = false,
    // multiSelect = false,
    actions,
    ...props 
  }, ref) => {
    // Filter tasks based on filter options
    const filteredTasks = useMemo(() => {
      let filtered = [...tasks];

      if (filterOptions) {
        if (filterOptions.status) {
          const statusFilter = Array.isArray(filterOptions.status) ? filterOptions.status : [filterOptions.status];
          filtered = filtered.filter(task => statusFilter.includes(task.status));
        }

        if (filterOptions.priority) {
          const priorityFilter = Array.isArray(filterOptions.priority) ? filterOptions.priority : [filterOptions.priority];
          filtered = filtered.filter(task => task.priority && priorityFilter.includes(task.priority));
        }

        if (filterOptions.projectId) {
          filtered = filtered.filter(task => task.projectId === filterOptions.projectId);
        }

        if (filterOptions.search) {
          const searchLower = filterOptions.search.toLowerCase();
          filtered = filtered.filter(task => 
            task.title.toLowerCase().includes(searchLower) ||
            task.description?.toLowerCase().includes(searchLower)
          );
        }

        if (filterOptions.tags && filterOptions.tags.length > 0) {
          filtered = filtered.filter(task => 
            task.tags?.some(tag => filterOptions.tags!.includes(tag))
          );
        }
      }

      return filtered;
    }, [tasks, filterOptions]);

    // Sort tasks
    const sortedTasks = useMemo(() => {
      if (!sortOptions) return filteredTasks;

      const sorted = [...filteredTasks].sort((a, b) => {
        let aValue: unknown;
        let bValue: unknown;

        switch (sortOptions.field) {
          case 'title':
            aValue = a.title;
            bValue = b.title;
            break;
          case 'status':
            aValue = a.status;
            bValue = b.status;
            break;
          case 'priority':
            const priorityOrder = { 'URGENT': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
            aValue = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
            bValue = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
            break;
          case 'dueDate':
            aValue = a.dueDate?.getTime() || 0;
            bValue = b.dueDate?.getTime() || 0;
            break;
          case 'createdAt':
            // Assuming createdAt exists in TaskData (you might need to add this)
            aValue = 0;
            bValue = 0;
            break;
          default:
            return 0;
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOptions.direction === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOptions.direction === 'asc' ? aValue - bValue : bValue - aValue;
        }

        return 0;
      });

      return sorted;
    }, [filteredTasks, sortOptions]);

    // Limit items if maxItems is set
    const displayTasks = maxItems ? sortedTasks.slice(0, maxItems) : sortedTasks;

    // Group tasks if groupBy is set
    const groupedTasks = useMemo(() => {
      if (groupBy === 'none') return null;

      const groups: Record<string, TaskData[]> = {};

      displayTasks.forEach(task => {
        let groupKey: string;

        switch (groupBy) {
          case 'status':
            groupKey = task.status;
            break;
          case 'priority':
            groupKey = task.priority || 'No Priority';
            break;
          case 'project':
            groupKey = task.projectName || 'No Project';
            break;
          case 'dueDate':
            if (!task.dueDate) {
              groupKey = 'No Due Date';
            } else {
              const today = new Date();
              const dueDate = new Date(task.dueDate);
              const diffTime = dueDate.getTime() - today.getTime();
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays < 0) groupKey = 'Overdue';
              else if (diffDays === 0) groupKey = 'Due Today';
              else if (diffDays === 1) groupKey = 'Due Tomorrow';
              else if (diffDays <= 7) groupKey = 'Due This Week';
              else groupKey = 'Due Later';
            }
            break;
          default:
            groupKey = 'Other';
        }

        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(task);
      });

      return Object.entries(groups).map(([title, tasks]) => ({
        title,
        tasks,
        count: tasks.length
      }));
    }, [displayTasks, groupBy]);

    // Default actions
    const defaultActions: TaskListAction[] = [
      ...(onNewTask ? [{
        label: 'New Task',
        icon: '➕',
        onClick: onNewTask,
        variant: 'primary' as const
      }] : []),
      ...(onViewAll && maxItems && sortedTasks.length > maxItems ? [{
        label: 'View All',
        onClick: onViewAll,
        variant: 'secondary' as const
      }] : [])
    ];

    const allActions = [...defaultActions, ...(actions || [])];

    // Base styling
    const baseClasses = [
      'task-list',
      variant === 'compact' ? 'space-y-1' : 'space-y-2',
      className
    ];

    // Render loading state
    if (isLoading) {
      return (
        <div ref={ref} className={baseClasses.join(' ')} {...props}>
          {showHeader && title && (
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 bg-base-300 rounded w-32 animate-pulse"></div>
              <div className="h-8 bg-base-300 rounded w-24 animate-pulse"></div>
            </div>
          )}
          <div className="bg-base-100 rounded-lg border border-base-200 overflow-hidden">
            {Array.from({ length: 3 }).map((_, index) => (
              <TaskItem key={index} task={{} as TaskData} isLoading={true} />
            ))}
          </div>
        </div>
      );
    }

    // Render empty state
    if (displayTasks.length === 0) {
      return (
        <div ref={ref} className={baseClasses.join(' ')} {...props}>
          {showHeader && (
            <TaskListHeader
              title={title}
              count={0}
              actions={showActions ? allActions : []}
              sortOptions={sortOptions}
              onSort={onSort}
              onFilter={onFilter}
            />
          )}
          <div className="bg-base-100 rounded-lg border border-base-200">
            <TaskListEmptyState
              message={emptyMessage}
              action={onNewTask ? { label: 'Create Task', onClick: onNewTask } : undefined}
            />
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={baseClasses.join(' ')} {...props}>
        {showHeader && (
          <TaskListHeader
            title={title}
            count={sortedTasks.length}
            actions={showActions ? allActions : []}
            sortOptions={sortOptions}
            onSort={onSort}
            onFilter={onFilter}
          />
        )}

        {groupedTasks ? (
          // Render grouped tasks
          <div>
            {groupedTasks.map((group, index) => (
              <TaskGroupComponent
                key={index}
                group={group}
                showTime={showTime}
                showStatus={showStatus}
                showPriority={showPriority}
                showProject={showProject}
                showDueDate={showDueDate}
                onTaskToggle={onTaskToggle}
                onTaskEdit={onTaskEdit}
                onTaskDelete={onTaskDelete}
                onTaskClick={onTaskClick}
                size={size}
              />
            ))}
          </div>
        ) : (
          // Render flat task list
          <div className="bg-base-100 rounded-lg border border-base-200 overflow-hidden">
            {displayTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                showTime={showTime}
                showStatus={showStatus}
                showPriority={showPriority}
                showProject={showProject}
                showDueDate={showDueDate}
                onToggleComplete={onTaskToggle}
                onEdit={onTaskEdit}
                onDelete={onTaskDelete}
                onClick={onTaskClick}
                size={size}
                isSelected={selectedTasks.includes(task.id)}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

TaskList.displayName = 'TaskList';