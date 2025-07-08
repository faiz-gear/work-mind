// import { ReactNode } from 'react';

// Task status types
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

// Task priority types
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

// Basic task data structure
export interface TaskData {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  timeTracked?: string;
  dueDate?: Date;
  projectId?: string;
  projectName?: string;
  tags?: string[];
}

// Base props for TaskItem
export interface BaseTaskItemProps {
  task: TaskData;
  className?: string;
  showTime?: boolean;
  showStatus?: boolean;
  showPriority?: boolean;
  showProject?: boolean;
  showDueDate?: boolean;
  disabled?: boolean;
}

// Event handler props
export interface TaskItemEventProps {
  onToggleComplete?: (taskId: string, completed: boolean) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
  onClick?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

// Variant props
export interface TaskItemVariantProps {
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
}

// Loading and state props
export interface TaskItemStateProps {
  isLoading?: boolean;
  isUpdating?: boolean;
  isSelected?: boolean;
  isDragging?: boolean;
}

// Combined props interface
export interface TaskItemProps 
  extends BaseTaskItemProps, 
          TaskItemEventProps, 
          TaskItemVariantProps, 
          TaskItemStateProps {}

// Checkbox props
export interface TaskCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// Task time display props
export interface TaskTimeProps {
  timeTracked?: string;
  dueDate?: Date;
  showDueDate?: boolean;
  compact?: boolean;
}