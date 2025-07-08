import { ReactNode } from 'react';

// Chart types
export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'scatter' | 'donut' | 'radar' | 'funnel';

// Chart size presets
export type ChartSize = 'sm' | 'md' | 'lg' | 'xl' | 'custom';

// Base props for ChartPlaceholder
export interface BaseChartPlaceholderProps {
  title?: string;
  description?: string;
  className?: string;
  height?: number | string;
  width?: number | string;
  icon?: ReactNode;
  placeholder?: string;
}

// Chart configuration props
export interface ChartConfigProps {
  type?: ChartType;
  size?: ChartSize;
  theme?: 'light' | 'dark' | 'auto';
  animated?: boolean;
  interactive?: boolean;
}

// State props
export interface ChartStateProps {
  isLoading?: boolean;
  hasError?: boolean;
  isEmpty?: boolean;
  noData?: boolean;
  skeleton?: boolean;
}

// Event props
export interface ChartEventProps {
  onClick?: () => void;
  onRefresh?: () => void;
  onExport?: () => void;
  onFullscreen?: () => void;
}

// Data props (for when actual data is provided)
export interface ChartDataProps {
  data?: unknown;
  labels?: string[];
  datasets?: unknown[];
  options?: Record<string, unknown>;
}

// Action button configuration
export interface ChartAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
}

// Combined props interface
export interface ChartPlaceholderProps 
  extends BaseChartPlaceholderProps, 
          ChartConfigProps, 
          ChartStateProps, 
          ChartEventProps, 
          ChartDataProps {
  actions?: ChartAction[];
}

// Error state props
export interface ChartErrorStateProps {
  message?: string;
  icon?: ReactNode;
  retry?: () => void;
}

// Loading state props
export interface ChartLoadingStateProps {
  message?: string;
  progress?: number;
}

// Empty state props
export interface ChartEmptyStateProps {
  message?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Chart header props
export interface ChartHeaderProps {
  title?: string;
  description?: string;
  actions?: ChartAction[];
  showRefresh?: boolean;
  showExport?: boolean;
  showFullscreen?: boolean;
  onRefresh?: () => void;
  onExport?: () => void;
  onFullscreen?: () => void;
}