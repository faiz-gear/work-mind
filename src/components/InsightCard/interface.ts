import { ReactNode } from 'react';

// Insight types
export type InsightType = 'productivity' | 'suggestion' | 'warning' | 'achievement' | 'trend' | 'recommendation';

// Insight priority levels
export type InsightPriority = 'low' | 'medium' | 'high' | 'urgent';

// Base insight data structure
export interface InsightData {
  id: string;
  type: InsightType;
  title: string;
  content: string;
  priority?: InsightPriority;
  timestamp?: Date;
  source?: string;
  confidence?: number; // 0-100
  tags?: string[];
  metadata?: Record<string, unknown>;
}

// Base props for InsightCard
export interface BaseInsightCardProps {
  insight: InsightData;
  className?: string;
  showTimestamp?: boolean;
  showSource?: boolean;
  showPriority?: boolean;
  showConfidence?: boolean;
  showTags?: boolean;
  truncateContent?: boolean;
  maxContentLength?: number;
}

// Event handler props
export interface InsightCardEventProps {
  onClick?: (insightId: string) => void;
  onDismiss?: (insightId: string) => void;
  onBookmark?: (insightId: string) => void;
  onShare?: (insightId: string) => void;
  onApply?: (insightId: string) => void;
  onFeedback?: (insightId: string, feedback: 'helpful' | 'not_helpful') => void;
}

// Variant props
export interface InsightCardVariantProps {
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'card' | 'banner' | 'toast';
}

// State props
export interface InsightCardStateProps {
  isLoading?: boolean;
  isBookmarked?: boolean;
  isDismissed?: boolean;
  isExpanded?: boolean;
  isNew?: boolean;
  isRead?: boolean;
}

// Action configuration
export interface InsightAction {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
}

// Combined props interface
export interface InsightCardProps 
  extends BaseInsightCardProps, 
          InsightCardEventProps, 
          InsightCardVariantProps, 
          InsightCardStateProps {
  actions?: InsightAction[];
}

// Insight icon mapping
export interface InsightIconConfig {
  icon: string;
  color: string;
  bgColor: string;
}

// Insight header props
export interface InsightHeaderProps {
  insight: InsightData;
  showTimestamp?: boolean;
  showSource?: boolean;
  showPriority?: boolean;
  showConfidence?: boolean;
  onDismiss?: (insightId: string) => void;
  isBookmarked?: boolean;
  onBookmark?: (insightId: string) => void;
}

// Insight content props
export interface InsightContentProps {
  content: string;
  truncateContent?: boolean;
  maxContentLength?: number;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

// Insight footer props
export interface InsightFooterProps {
  insight: InsightData;
  actions?: InsightAction[];
  showTags?: boolean;
  onFeedback?: (insightId: string, feedback: 'helpful' | 'not_helpful') => void;
  onShare?: (insightId: string) => void;
}