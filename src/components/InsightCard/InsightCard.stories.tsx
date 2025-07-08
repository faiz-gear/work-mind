import type { Meta, StoryObj } from '@storybook/nextjs';
import { InsightCard } from './InsightCard';
import { InsightData } from './interface';

// Sample insight data
const sampleInsight: InsightData = {
  id: '1',
  type: 'productivity',
  title: 'Peak Productivity Hours',
  content: 'Based on your work patterns, you\'re most productive between 9-11 AM. Consider scheduling important tasks during this time to maximize your efficiency.',
  priority: 'medium',
  timestamp: new Date(),
  source: 'AI Analysis',
  confidence: 85,
  tags: ['productivity', 'time-management', 'optimization']
};

const warningInsight: InsightData = {
  id: '2',
  type: 'warning',
  title: 'Deadline Approaching',
  content: 'You have 3 high-priority tasks due within the next 2 days. Consider adjusting your schedule to accommodate these deadlines.',
  priority: 'urgent',
  timestamp: new Date(),
  source: 'Task Manager',
  confidence: 95,
  tags: ['deadline', 'urgent', 'planning']
};

const suggestionInsight: InsightData = {
  id: '3',
  type: 'suggestion',
  title: 'Break Time Reminder',
  content: 'You\'ve been working for 2 hours straight. Taking a short break can help maintain your focus and prevent burnout.',
  priority: 'low',
  timestamp: new Date(),
  source: 'Wellness Monitor',
  confidence: 78,
  tags: ['wellness', 'breaks', 'focus']
};

const achievementInsight: InsightData = {
  id: '4',
  type: 'achievement',
  title: 'Weekly Goal Achieved',
  content: 'Congratulations! You\'ve completed 95% of your weekly tasks. Your consistency and dedication are paying off.',
  priority: 'medium',
  timestamp: new Date(),
  source: 'Progress Tracker',
  confidence: 100,
  tags: ['achievement', 'goals', 'success']
};

const longContentInsight: InsightData = {
  id: '5',
  type: 'recommendation',
  title: 'Task Optimization Strategy',
  content: 'Our analysis shows that you tend to work on similar tasks in scattered blocks throughout the day. By grouping similar tasks together, you could reduce context switching and increase your overall productivity by approximately 23%. This technique, known as task batching, is particularly effective for activities like email management, content creation, and administrative work. Consider dedicating specific time blocks to similar types of work to maximize your efficiency.',
  priority: 'high',
  timestamp: new Date(),
  source: 'Productivity AI',
  confidence: 92,
  tags: ['optimization', 'batching', 'efficiency', 'strategy']
};

const meta: Meta<typeof InsightCard> = {
  title: 'Business/InsightCard',
  component: InsightCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A comprehensive insight card component for displaying AI-generated insights, recommendations, and notifications with various actions and states.'
      }
    }
  },
  argTypes: {
    insight: {
      control: 'object',
      description: 'Insight data object'
    },
    showTimestamp: {
      control: 'boolean',
      description: 'Show timestamp in header'
    },
    showSource: {
      control: 'boolean',
      description: 'Show source in header'
    },
    showPriority: {
      control: 'boolean',
      description: 'Show priority badge'
    },
    showConfidence: {
      control: 'boolean',
      description: 'Show confidence percentage'
    },
    showTags: {
      control: 'boolean',
      description: 'Show tags in footer'
    },
    truncateContent: {
      control: 'boolean',
      description: 'Truncate long content'
    },
    maxContentLength: {
      control: 'number',
      description: 'Maximum content length before truncation'
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed', 'minimal'],
      description: 'Visual variant of the insight card'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the insight card'
    },
    layout: {
      control: 'select',
      options: ['card', 'banner', 'toast'],
      description: 'Layout style of the insight card'
    },
    isBookmarked: {
      control: 'boolean',
      description: 'Show as bookmarked'
    },
    isNew: {
      control: 'boolean',
      description: 'Show as new/unread'
    },
    isRead: {
      control: 'boolean',
      description: 'Show as read'
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when insight is clicked'
    },
    onDismiss: {
      action: 'dismissed',
      description: 'Callback when insight is dismissed'
    },
    onBookmark: {
      action: 'bookmarked',
      description: 'Callback when bookmark is toggled'
    },
    onShare: {
      action: 'shared',
      description: 'Callback when share is clicked'
    },
    onApply: {
      action: 'applied',
      description: 'Callback when apply is clicked'
    },
    onFeedback: {
      action: 'feedback',
      description: 'Callback when feedback is given'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    insight: sampleInsight,
    onClick: (id) => console.log(`Clicked insight ${id}`),
    onDismiss: (id) => console.log(`Dismissed insight ${id}`),
    onBookmark: (id) => console.log(`Bookmarked insight ${id}`),
    onApply: (id) => console.log(`Applied insight ${id}`),
    onFeedback: (id, feedback) => console.log(`Feedback for ${id}: ${feedback}`)
  }
};

// Different insight types
export const ProductivityInsight: Story = {
  args: {
    insight: sampleInsight,
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

export const WarningInsight: Story = {
  args: {
    insight: warningInsight,
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

export const SuggestionInsight: Story = {
  args: {
    insight: suggestionInsight,
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

export const AchievementInsight: Story = {
  args: {
    insight: achievementInsight,
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

// With all features enabled
export const WithAllFeatures: Story = {
  args: {
    insight: sampleInsight,
    showTimestamp: true,
    showSource: true,
    showPriority: true,
    showConfidence: true,
    showTags: true,
    onClick: (id) => console.log(`Clicked insight ${id}`),
    onDismiss: (id) => console.log(`Dismissed insight ${id}`),
    onBookmark: (id) => console.log(`Bookmarked insight ${id}`),
    onShare: (id) => console.log(`Shared insight ${id}`),
    onApply: (id) => console.log(`Applied insight ${id}`),
    onFeedback: (id, feedback) => console.log(`Feedback for ${id}: ${feedback}`)
  }
};

// Long content with truncation
export const LongContent: Story = {
  args: {
    insight: longContentInsight,
    truncateContent: true,
    maxContentLength: 150,
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

// Different variants
export const CompactVariant: Story = {
  args: {
    insight: sampleInsight,
    variant: 'compact',
    size: 'sm',
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

export const DetailedVariant: Story = {
  args: {
    insight: sampleInsight,
    variant: 'detailed',
    size: 'lg',
    showSource: true,
    showConfidence: true,
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

export const MinimalVariant: Story = {
  args: {
    insight: sampleInsight,
    variant: 'minimal',
    showPriority: false,
    showTags: false,
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

// Different layouts
export const BannerLayout: Story = {
  args: {
    insight: warningInsight,
    layout: 'banner',
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

export const ToastLayout: Story = {
  args: {
    insight: suggestionInsight,
    layout: 'toast',
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

// Different states
export const NewInsight: Story = {
  args: {
    insight: sampleInsight,
    isNew: true,
    isRead: false,
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

export const BookmarkedInsight: Story = {
  args: {
    insight: sampleInsight,
    isBookmarked: true,
    onBookmark: (id) => console.log(`Bookmarked insight ${id}`),
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

export const LoadingInsight: Story = {
  args: {
    insight: sampleInsight,
    isLoading: true
  }
};

// With custom actions
export const WithCustomActions: Story = {
  args: {
    insight: sampleInsight,
    actions: [
      {
        label: 'Schedule',
        icon: '📅',
        onClick: () => console.log('Schedule clicked'),
        variant: 'primary'
      },
      {
        label: 'Learn More',
        icon: '📖',
        onClick: () => console.log('Learn more clicked'),
        variant: 'secondary'
      }
    ],
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

// Dashboard style (matching the prototype)
export const DashboardStyle: Story = {
  args: {
    insight: {
      id: 'dashboard-insight',
      type: 'productivity',
      title: 'AI Insights',
      content: 'Based on your work patterns, you\'re most productive between 9-11 AM. Consider scheduling important tasks during this time.',
      priority: 'medium',
      timestamp: new Date(),
      source: 'AI Analysis',
      confidence: 85,
      tags: ['productivity', 'scheduling']
    },
    showTimestamp: false,
    showSource: false,
    showPriority: false,
    showConfidence: false,
    showTags: false,
    actions: [
      {
        label: 'Get More Insights',
        onClick: () => console.log('Get more insights clicked'),
        variant: 'secondary'
      }
    ],
    onClick: (id) => console.log(`Clicked insight ${id}`)
  }
};

// Multiple insights
export const MultipleInsights: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">AI Insights</h2>
      <div className="space-y-3">
        <InsightCard
          insight={sampleInsight}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
          onDismiss={(id) => console.log(`Dismissed insight ${id}`)}
        />
        <InsightCard
          insight={warningInsight}
          layout="banner"
          onClick={(id) => console.log(`Clicked insight ${id}`)}
          onDismiss={(id) => console.log(`Dismissed insight ${id}`)}
        />
        <InsightCard
          insight={suggestionInsight}
          variant="compact"
          onClick={(id) => console.log(`Clicked insight ${id}`)}
          onDismiss={(id) => console.log(`Dismissed insight ${id}`)}
        />
        <InsightCard
          insight={achievementInsight}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
          onDismiss={(id) => console.log(`Dismissed insight ${id}`)}
        />
      </div>
    </div>
  )
};

// Priority variations
export const PriorityVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Priority Levels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard
          insight={{ ...sampleInsight, priority: 'low' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
        <InsightCard
          insight={{ ...sampleInsight, priority: 'medium' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
        <InsightCard
          insight={{ ...sampleInsight, priority: 'high' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
        <InsightCard
          insight={{ ...sampleInsight, priority: 'urgent' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
      </div>
    </div>
  )
};

// Type variations
export const TypeVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Insight Types</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InsightCard
          insight={{ ...sampleInsight, type: 'productivity' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
        <InsightCard
          insight={{ ...sampleInsight, type: 'suggestion' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
        <InsightCard
          insight={{ ...sampleInsight, type: 'warning' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
        <InsightCard
          insight={{ ...sampleInsight, type: 'achievement' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
        <InsightCard
          insight={{ ...sampleInsight, type: 'trend' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
        <InsightCard
          insight={{ ...sampleInsight, type: 'recommendation' }}
          onClick={(id) => console.log(`Clicked insight ${id}`)}
        />
      </div>
    </div>
  )
};