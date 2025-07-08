import { ReactNode } from 'react';

// Base props for all stat cards
export interface BaseStatCardProps {
  className?: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
}

// Variant props for different stat card types
export interface StatCardVariantProps {
  variant?: 'default' | 'compact' | 'detailed';
  size?: 'sm' | 'md' | 'lg';
}

// Loading state props
export interface StatCardLoadingProps {
  isLoading?: boolean;
  skeleton?: boolean;
}

// Action props for interactive stat cards
export interface StatCardActionProps {
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

// Combined props interface
export interface StatCardProps 
  extends BaseStatCardProps, 
          StatCardVariantProps, 
          StatCardLoadingProps, 
          StatCardActionProps {}

// Type for change indicator styling
export type ChangeType = 'positive' | 'negative' | 'neutral';

// Interface for stat card data
export interface StatCardData {
  title: string;
  value: string | number;
  change?: string;
  changeType?: ChangeType;
  icon?: ReactNode;
}