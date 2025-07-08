import type { Meta, StoryObj } from '@storybook/nextjs';
import { ChartPlaceholder } from './ChartPlaceholder';

const meta: Meta<typeof ChartPlaceholder> = {
  title: 'Business/ChartPlaceholder',
  component: ChartPlaceholder,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A flexible chart placeholder component that can display various chart types with different states including loading, error, empty, and data states.'
      }
    }
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Chart title displayed in header'
    },
    description: {
      control: 'text',
      description: 'Chart description displayed in header'
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text shown in the chart area'
    },
    type: {
      control: 'select',
      options: ['line', 'bar', 'pie', 'area', 'scatter', 'donut', 'radar', 'funnel'],
      description: 'Type of chart to display'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl', 'custom'],
      description: 'Predefined size of the chart'
    },
    height: {
      control: 'text',
      description: 'Custom height (use with size="custom")'
    },
    width: {
      control: 'text',
      description: 'Custom width (use with size="custom")'
    },
    isLoading: {
      control: 'boolean',
      description: 'Show loading state'
    },
    hasError: {
      control: 'boolean',
      description: 'Show error state'
    },
    isEmpty: {
      control: 'boolean',
      description: 'Show empty state'
    },
    noData: {
      control: 'boolean',
      description: 'Show no data state'
    },
    skeleton: {
      control: 'boolean',
      description: 'Show skeleton loading state'
    },
    interactive: {
      control: 'boolean',
      description: 'Enable interactive features'
    },
    onClick: {
      action: 'clicked',
      description: 'Callback when chart is clicked'
    },
    onRefresh: {
      action: 'refresh',
      description: 'Callback when refresh is clicked'
    },
    onExport: {
      action: 'export',
      description: 'Callback when export is clicked'
    },
    onFullscreen: {
      action: 'fullscreen',
      description: 'Callback when fullscreen is clicked'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    title: 'Weekly Progress',
    placeholder: 'Chart: Task completion over time',
    type: 'line'
  }
};

// Different chart types
export const BarChart: Story = {
  args: {
    title: 'Task Distribution',
    description: 'Tasks grouped by status',
    type: 'bar',
    placeholder: 'Chart: Task distribution by status'
  }
};

export const PieChart: Story = {
  args: {
    title: 'Project Allocation',
    description: 'Time spent on different projects',
    type: 'pie',
    placeholder: 'Chart: Project time allocation'
  }
};

export const AreaChart: Story = {
  args: {
    title: 'Performance Trends',
    description: 'Performance metrics over time',
    type: 'area',
    placeholder: 'Chart: Performance trends'
  }
};

export const DonutChart: Story = {
  args: {
    title: 'Task Priority',
    description: 'Tasks by priority level',
    type: 'donut',
    placeholder: 'Chart: Task priority distribution'
  }
};

// Different sizes
export const SmallChart: Story = {
  args: {
    title: 'Small Chart',
    type: 'bar',
    size: 'sm'
  }
};

export const LargeChart: Story = {
  args: {
    title: 'Large Chart',
    type: 'line',
    size: 'lg'
  }
};

export const ExtraLargeChart: Story = {
  args: {
    title: 'Extra Large Chart',
    type: 'area',
    size: 'xl'
  }
};

export const CustomSize: Story = {
  args: {
    title: 'Custom Size Chart',
    type: 'bar',
    size: 'custom',
    height: '250px',
    width: '500px'
  }
};

// Different states
export const Loading: Story = {
  args: {
    title: 'Loading Chart',
    description: 'Please wait while we load your data...',
    type: 'line',
    isLoading: true
  }
};

export const Error: Story = {
  args: {
    title: 'Error State',
    description: 'Something went wrong',
    type: 'bar',
    hasError: true,
    onRefresh: () => console.log('Refresh clicked')
  }
};

export const Empty: Story = {
  args: {
    title: 'Empty Chart',
    description: 'No data to display',
    type: 'pie',
    isEmpty: true,
    onRefresh: () => console.log('Refresh clicked')
  }
};

export const NoData: Story = {
  args: {
    title: 'No Data Available',
    description: 'Data source is empty',
    type: 'line',
    noData: true,
    onRefresh: () => console.log('Refresh clicked')
  }
};

export const Skeleton: Story = {
  args: {
    title: 'Loading with Skeleton',
    description: 'Animated skeleton loading state',
    type: 'bar',
    skeleton: true
  }
};

// With actions
export const WithActions: Story = {
  args: {
    title: 'Chart with Actions',
    description: 'Chart with various action buttons',
    type: 'line',
    onRefresh: () => console.log('Refresh clicked'),
    onExport: () => console.log('Export clicked'),
    onFullscreen: () => console.log('Fullscreen clicked')
  }
};

export const WithCustomActions: Story = {
  args: {
    title: 'Custom Actions',
    description: 'Chart with custom action buttons',
    type: 'bar',
    actions: [
      {
        label: 'Share',
        icon: '📤',
        onClick: () => console.log('Share clicked'),
        variant: 'primary'
      },
      {
        label: 'Settings',
        icon: '⚙️',
        onClick: () => console.log('Settings clicked'),
        variant: 'secondary'
      }
    ]
  }
};

// Interactive
export const Interactive: Story = {
  args: {
    title: 'Interactive Chart',
    description: 'Click to view details',
    type: 'line',
    interactive: true,
    onClick: () => console.log('Chart clicked')
  }
};

// With data
export const WithData: Story = {
  args: {
    title: 'Chart with Data',
    description: 'Chart displaying actual data',
    type: 'bar',
    data: [10, 20, 30, 40, 50],
    placeholder: 'Chart: Sales data visualization'
  }
};

// Dashboard style (matching the prototype)
export const DashboardStyle: Story = {
  args: {
    title: 'Weekly Progress',
    type: 'line',
    size: 'md',
    placeholder: 'Chart: Task completion over time',
    interactive: true,
    onClick: () => console.log('Chart clicked')
  }
};

// Multiple charts in a grid
export const MultipleCharts: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ChartPlaceholder
        title="Tasks Completed"
        type="bar"
        size="sm"
        placeholder="Chart: Daily task completion"
      />
      <ChartPlaceholder
        title="Time Tracking"
        type="line"
        size="sm"
        placeholder="Chart: Time spent on tasks"
      />
      <ChartPlaceholder
        title="Project Distribution"
        type="pie"
        size="sm"
        placeholder="Chart: Project allocation"
      />
      <ChartPlaceholder
        title="Performance Trends"
        type="area"
        size="sm"
        placeholder="Chart: Performance over time"
      />
    </div>
  )
};

// Different skeleton types
export const SkeletonVariations: Story = {
  render: () => (
    <div className="space-y-6">
      <h2 className="text-lg font-bold">Skeleton Loading States</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartPlaceholder
          title="Bar Chart Skeleton"
          type="bar"
          size="sm"
          skeleton={true}
        />
        <ChartPlaceholder
          title="Line Chart Skeleton"
          type="line"
          size="sm"
          skeleton={true}
        />
        <ChartPlaceholder
          title="Pie Chart Skeleton"
          type="pie"
          size="sm"
          skeleton={true}
        />
        <ChartPlaceholder
          title="Area Chart Skeleton"
          type="area"
          size="sm"
          skeleton={true}
        />
      </div>
    </div>
  )
};

// Real-world dashboard
export const RealWorldDashboard: Story = {
  render: () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartPlaceholder
            title="Revenue Over Time"
            description="Monthly revenue trends for the last 12 months"
            type="area"
            size="lg"
            onRefresh={() => console.log('Refresh revenue data')}
            onExport={() => console.log('Export revenue data')}
            placeholder="Chart: Monthly revenue trends"
          />
        </div>
        
        <div className="space-y-4">
          <ChartPlaceholder
            title="Traffic Sources"
            description="Website traffic by source"
            type="donut"
            size="md"
            placeholder="Chart: Traffic source breakdown"
          />
          
          <ChartPlaceholder
            title="User Growth"
            description="New users this month"
            type="line"
            size="sm"
            placeholder="Chart: User growth rate"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartPlaceholder
          title="Sales Performance"
          description="Sales by product category"
          type="bar"
          size="md"
          placeholder="Chart: Sales by category"
        />
        
        <ChartPlaceholder
          title="Customer Satisfaction"
          description="Customer satisfaction scores"
          type="radar"
          size="md"
          placeholder="Chart: Customer satisfaction metrics"
        />
      </div>
    </div>
  )
};