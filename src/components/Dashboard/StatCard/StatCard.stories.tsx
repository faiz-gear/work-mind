import type {Meta, StoryObj} from '@storybook/nextjs';
import {StatCard} from './StatCard';

const meta: Meta<typeof StatCard> = {
    title: 'Business/Dashboard/StatCard',
    component: StatCard,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A reusable statistics card component for displaying key metrics with value, change indicators, and optional icons.'
            }
        }
    },
    argTypes: {
        title: {
            control: 'text',
            description: 'The title/label for the statistic'
        },
        value: {
            control: 'text',
            description: 'The main value to display'
        },
        change: {
            control: 'text',
            description: 'Change indicator text (optional)'
        },
        changeType: {
            control: 'select',
            options: ['positive', 'negative', 'neutral'],
            description: 'Type of change indicator styling'
        },
        variant: {
            control: 'select',
            options: ['default', 'compact', 'detailed'],
            description: 'Visual variant of the card'
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the card'
        },
        isLoading: {
            control: 'boolean',
            description: 'Show loading skeleton state'
        },
        onClick: {
            action: 'clicked',
            description: 'Click handler for interactive cards'
        }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
    args: {
        title: 'Total Tasks',
        value: '24',
        change: '+3 this week',
        changeType: 'positive'
    }
};

// Different change types
export const PositiveChange: Story = {
    args: {
        title: 'Completed Tasks',
        value: '18',
        change: '+5 from last week',
        changeType: 'positive'
    }
};

export const NegativeChange: Story = {
    args: {
        title: 'Overdue Tasks',
        value: '3',
        change: '+2 from last week',
        changeType: 'negative'
    }
};

export const NeutralChange: Story = {
    args: {
        title: 'Active Projects',
        value: '7',
        change: 'No change',
        changeType: 'neutral'
    }
};

// Without change indicator
export const WithoutChange: Story = {
    args: {
        title: 'Team Members',
        value: '12'
    }
};

// With icon
export const WithIcon: Story = {
    args: {
        title: 'Hours Tracked',
        value: '42.5',
        change: '+5.2 from last week',
        changeType: 'positive',
        icon: '⏰'
    }
};

// Different sizes
export const SmallSize: Story = {
    args: {
        title: 'Small Card',
        value: '100',
        change: '+10%',
        changeType: 'positive',
        size: 'sm'
    }
};

export const LargeSize: Story = {
    args: {
        title: 'Large Card',
        value: '1,234',
        change: '+15% this month',
        changeType: 'positive',
        size: 'lg'
    }
};

// Different variants
export const CompactVariant: Story = {
    args: {
        title: 'Compact',
        value: '500',
        change: '+2.5%',
        changeType: 'positive',
        variant: 'compact'
    }
};

export const DetailedVariant: Story = {
    args: {
        title: 'Detailed View',
        value: '1,500',
        change: '+12% from last month',
        changeType: 'positive',
        variant: 'detailed'
    }
};

// Loading states
export const Loading: Story = {
    args: {
        title: 'Loading...',
        value: '0',
        isLoading: true
    }
};

export const Skeleton: Story = {
    args: {
        title: 'Loading...',
        value: '0',
        skeleton: true
    }
};

// Interactive
export const Interactive: Story = {
    args: {
        title: 'Clickable Card',
        value: '99',
        change: '+5 today',
        changeType: 'positive',
        onClick: () => alert('Card clicked!')
    }
};

// Multiple cards in a grid
export const MultipleCards: Story = {
    render: () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Total Tasks"
                value="24"
                change="+3 this week"
                changeType="positive"
            />
            <StatCard
                title="Completed"
                value="18"
                change="75% completion rate"
                changeType="positive"
            />
            <StatCard
                title="Hours Tracked"
                value="42.5"
                change="+5.2 from last week"
                changeType="positive"
            />
            <StatCard
                title="Active Projects"
                value="3"
                change="2 due this week"
                changeType="neutral"
            />
        </div>
    )
};

// Real-world dashboard example
export const DashboardExample: Story = {
    render: () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Revenue"
                    value="$45,231"
                    change="+20.1% from last month"
                    changeType="positive"
                    icon="💰"
                />
                <StatCard
                    title="Users"
                    value="2,350"
                    change="+12% from last month"
                    changeType="positive"
                    icon="👥"
                />
                <StatCard
                    title="Sales"
                    value="12,234"
                    change="-3% from last month"
                    changeType="negative"
                    icon="📈"
                />
                <StatCard
                    title="Active Now"
                    value="573"
                    change="+201 since yesterday"
                    changeType="positive"
                    icon="🔴"
                />
            </div>
        </div>
    )
};