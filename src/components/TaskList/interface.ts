import { ReactNode } from 'react';
import { TaskData, TaskStatus, TaskPriority } from '../TaskItem/interface';

// Filter and sort options
export interface TaskFilterOptions {
  status?: TaskStatus | TaskStatus[];
  priority?: TaskPriority | TaskPriority[];
  projectId?: string;
  search?: string;
  dueDate?: {
    from?: Date;
    to?: Date;
  };
  tags?: string[];
}

export interface TaskSortOptions {
  field: 'title' | 'status' | 'priority' | 'dueDate' | 'createdAt' | 'timeTracked';
  direction: 'asc' | 'desc';
}

// Base props for TaskList
export interface BaseTaskListProps {
  tasks: TaskData[];
  title?: string;
  className?: string;
  emptyMessage?: string;
  showHeader?: boolean;
  showActions?: boolean;
}

// Event handler props
export interface TaskListEventProps {
  onTaskToggle?: (taskId: string, completed: boolean) => void;
  onTaskEdit?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskClick?: (taskId: string) => void;
  onNewTask?: () => void;
  onViewAll?: () => void;
  onSort?: (sortOptions: TaskSortOptions) => void;
  onFilter?: (filterOptions: TaskFilterOptions) => void;
}

// Display options
export interface TaskListDisplayProps {
  showTime?: boolean;
  showStatus?: boolean;
  showPriority?: boolean;
  showProject?: boolean;
  showDueDate?: boolean;
  maxItems?: number;
  groupBy?: 'none' | 'status' | 'priority' | 'project' | 'dueDate';
  sortOptions?: TaskSortOptions;
  filterOptions?: TaskFilterOptions;
}

// Variant props
export interface TaskListVariantProps {
  variant?: 'default' | 'compact' | 'detailed' | 'kanban';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'list' | 'grid' | 'table';
}

// State props
export interface TaskListStateProps {
  isLoading?: boolean;
  isUpdating?: boolean;
  selectedTasks?: string[];
  dragEnabled?: boolean;
  multiSelect?: boolean;
}

// Action button configuration
export interface TaskListAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

// Combined props interface
export interface TaskListProps 
  extends BaseTaskListProps, 
          TaskListEventProps, 
          TaskListDisplayProps, 
          TaskListVariantProps, 
          TaskListStateProps {
  actions?: TaskListAction[];
}

// Task group for grouped display
export interface TaskGroup {
  title: string;
  tasks: TaskData[];
  count: number;
  color?: string;
}

// Empty state props
export interface TaskListEmptyStateProps {
  message?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Header props
export interface TaskListHeaderProps {
  title?: string;
  count?: number;
  actions?: TaskListAction[];
  sortOptions?: TaskSortOptions;
  onSort?: (sortOptions: TaskSortOptions) => void;
  showFilters?: boolean;
  onFilter?: (filterOptions: TaskFilterOptions) => void;
}