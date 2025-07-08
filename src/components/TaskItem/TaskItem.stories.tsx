import type { Meta, StoryObj } from '@storybook/nextjs';
import { TaskItem } from './TaskItem';
import { TaskData } from './interface';

// Sample task data
const sampleTask: TaskData = {
  id: '1',
  title: 'Complete project documentation',
  description: 'Write comprehensive documentation for the new project features including API endpoints and user guides.',
  status: 'TODO',
  priority: 'HIGH',
  timeTracked: '2h 30m',
  dueDate: new Date('2024-12-31'),
  projectName: 'WorkMind Dashboard',
  tags: ['documentation', 'urgent']
};

const completedTask: TaskData = {
  id: '2',
  title: 'Review code changes',
  description: 'Review the pull request for the new authentication system.',
  status: 'COMPLETED',
  priority: 'MEDIUM',
  timeTracked: '1h 15m',
  projectName: 'Authentication System'
};

const overdueTask: TaskData = {
  id: '3',
  title: 'Team meeting preparation',
  description: 'Prepare agenda and materials for the weekly team meeting.',
  status: 'TODO',
  priority: 'URGENT',
  timeTracked: '45m',
  dueDate: new Date('2024-01-01'), // Past date
  projectName: 'Team Management',
  tags: ['meeting', 'preparation']
};

const meta: Meta<typeof TaskItem> = {
  title: 'Business/TaskItem',
  component: TaskItem,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'A reusable task item component for displaying individual tasks with checkbox, title, time tracking, and various metadata.'
      }
    }
  },
  argTypes: {
    task: {
      control: 'object',
      description: 'Task data object'
    },
    showTime: {
      control: 'boolean',
      description: 'Show time tracking information'
    },
    showStatus: {
      control: 'boolean',
      description: 'Show status badge'
    },
    showPriority: {
      control: 'boolean',
      description: 'Show priority badge'
    },
    showProject: {
      control: 'boolean',
      description: 'Show project name'
    },
    showDueDate: {
      control: 'boolean',
      description: 'Show due date'
    },
    variant: {
      control: 'select',
      options: ['default', 'compact', 'detailed'],
      description: 'Visual variant of the task item'
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Size of the task item'
    },
    disabled: {
      control: 'boolean',
      description: 'Disable interaction'
    },
    onToggleComplete: {
      action: 'toggle-complete',
      description: 'Callback when task completion is toggled'
    },
    onEdit: {
      action: 'edit',
      description: 'Callback when edit button is clicked'
    },
    onDelete: {
      action: 'delete',
      description: 'Callback when delete button is clicked'
    },
    onClick: {
      action: 'click',
      description: 'Callback when task item is clicked'
    }
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
  args: {
    task: sampleTask,
    showTime: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
    onEdit: (id) => console.log(`Edit task ${id}`),
    onDelete: (id) => console.log(`Delete task ${id}`),
    onClick: (id) => console.log(`Clicked task ${id}`)
  }
};

// Completed task
export const Completed: Story = {
  args: {
    task: completedTask,
    showTime: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)
  }
};

// With all badges
export const WithAllBadges: Story = {
  args: {
    task: sampleTask,
    showTime: true,
    showStatus: true,
    showPriority: true,
    showProject: true,
    showDueDate: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)
  }
};

// Overdue task
export const Overdue: Story = {
  args: {
    task: overdueTask,
    showTime: true,
    showStatus: true,
    showPriority: true,
    showProject: true,
    showDueDate: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)
  }
};

// Compact variant
export const Compact: Story = {
  args: {
    task: sampleTask,
    variant: 'compact',
    showTime: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)
  }
};

// Detailed variant
export const Detailed: Story = {
  args: {
    task: sampleTask,
    variant: 'detailed',
    showTime: true,
    showStatus: true,
    showPriority: true,
    showProject: true,
    showDueDate: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
    onEdit: (id) => console.log(`Edit task ${id}`),
    onDelete: (id) => console.log(`Delete task ${id}`)
  }
};

// Different sizes
export const SmallSize: Story = {
  args: {
    task: sampleTask,
    size: 'sm',
    showTime: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)
  }
};

export const LargeSize: Story = {
  args: {
    task: sampleTask,
    size: 'lg',
    showTime: true,
    showStatus: true,
    showPriority: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)
  }
};

// Loading state
export const Loading: Story = {
  args: {
    task: sampleTask,
    isLoading: true
  }
};

// Updating state
export const Updating: Story = {
  args: {
    task: sampleTask,
    isUpdating: true,
    showTime: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)
  }
};

// Selected state
export const Selected: Story = {
  args: {
    task: sampleTask,
    isSelected: true,
    showTime: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
    onEdit: (id) => console.log(`Edit task ${id}`),
    onDelete: (id) => console.log(`Delete task ${id}`)
  }
};

// Disabled state
export const Disabled: Story = {
  args: {
    task: sampleTask,
    disabled: true,
    showTime: true,
    onToggleComplete: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)
  }
};

// Multiple tasks in a list
export const TaskList: Story = {
  render: () => (
    <div className="bg-base-100 rounded-lg border border-base-200 divide-y divide-base-200">
      <TaskItem
        task={sampleTask}
        showTime={true}
        onToggleComplete={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
        onEdit={(id) => console.log(`Edit task ${id}`)}
        onDelete={(id) => console.log(`Delete task ${id}`)}
      />
      <TaskItem
        task={completedTask}
        showTime={true}
        onToggleComplete={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
        onEdit={(id) => console.log(`Edit task ${id}`)}
        onDelete={(id) => console.log(`Delete task ${id}`)}
      />
      <TaskItem
        task={overdueTask}
        showTime={true}
        showDueDate={true}
        showPriority={true}
        onToggleComplete={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
        onEdit={(id) => console.log(`Edit task ${id}`)}
        onDelete={(id) => console.log(`Delete task ${id}`)}
      />
    </div>
  )
};

// Different priorities
export const PriorityVariations: Story = {
  render: () => (
    <div className="space-y-2">
      <h3 className="font-bold">Priority Variations</h3>
      <div className="bg-base-100 rounded-lg border border-base-200 divide-y divide-base-200">
        <TaskItem
          task={{ ...sampleTask, priority: 'LOW' }}
          showPriority={true}
          onToggleComplete={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
        />
        <TaskItem
          task={{ ...sampleTask, id: '2', priority: 'MEDIUM' }}
          showPriority={true}
          onToggleComplete={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
        />
        <TaskItem
          task={{ ...sampleTask, id: '3', priority: 'HIGH' }}
          showPriority={true}
          onToggleComplete={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
        />
        <TaskItem
          task={{ ...sampleTask, id: '4', priority: 'URGENT' }}
          showPriority={true}
          onToggleComplete={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
        />
      </div>
    </div>
  )
};