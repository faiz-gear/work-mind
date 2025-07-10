import type {Meta, StoryObj} from '@storybook/nextjs';
import {TaskList} from './TaskList';
import {TaskData} from '../TaskItem/interface';

// Sample task data
const sampleTasks: TaskData[] = [
    {
        id: '1',
        title: 'Complete project documentation',
        description: 'Write comprehensive documentation for the new project features.',
        status: 'TODO',
        priority: 'HIGH',
        timeTracked: '2h 30m',
        dueDate: new Date('2024-12-31'),
        projectName: 'WorkMind Dashboard',
        tags: ['documentation', 'urgent']
    },
    {
        id: '2',
        title: 'Review code changes',
        description: 'Review the pull request for the new authentication system.',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        timeTracked: '1h 15m',
        projectName: 'Authentication System',
        tags: ['review', 'code']
    },
    {
        id: '3',
        title: 'Team meeting preparation',
        description: 'Prepare agenda and materials for the weekly team meeting.',
        status: 'TODO',
        priority: 'URGENT',
        timeTracked: '45m',
        dueDate: new Date('2024-01-01'), // Past date
        projectName: 'Team Management',
        tags: ['meeting', 'preparation']
    },
    {
        id: '4',
        title: 'Update project timeline',
        description: 'Update the project timeline with the new milestones.',
        status: 'COMPLETED',
        priority: 'LOW',
        timeTracked: '30m',
        projectName: 'Project Management',
        tags: ['timeline', 'planning']
    },
    {
        id: '5',
        title: 'Fix bug in user authentication',
        description: 'Address the issue with user login not working on mobile devices.',
        status: 'TODO',
        priority: 'HIGH',
        timeTracked: '1h 20m',
        dueDate: new Date('2024-12-25'),
        projectName: 'Authentication System',
        tags: ['bug', 'mobile', 'authentication']
    }
];

const meta: Meta<typeof TaskList> = {
    title: 'Business/Task/TaskList',
    component: TaskList,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A comprehensive task list component that displays multiple tasks with filtering, sorting, and grouping capabilities.'
            }
        }
    },
    argTypes: {
        tasks: {
            control: 'object',
            description: 'Array of task data objects'
        },
        title: {
            control: 'text',
            description: 'Title for the task list'
        },
        showHeader: {
            control: 'boolean',
            description: 'Show the header with title and actions'
        },
        showActions: {
            control: 'boolean',
            description: 'Show action buttons in header'
        },
        showTime: {
            control: 'boolean',
            description: 'Show time tracking in task items'
        },
        showStatus: {
            control: 'boolean',
            description: 'Show status badges in task items'
        },
        showPriority: {
            control: 'boolean',
            description: 'Show priority badges in task items'
        },
        showProject: {
            control: 'boolean',
            description: 'Show project names in task items'
        },
        showDueDate: {
            control: 'boolean',
            description: 'Show due dates in task items'
        },
        maxItems: {
            control: 'number',
            description: 'Maximum number of items to display'
        },
        groupBy: {
            control: 'select',
            options: ['none', 'status', 'priority', 'project', 'dueDate'],
            description: 'Group tasks by field'
        },
        variant: {
            control: 'select',
            options: ['default', 'compact', 'detailed'],
            description: 'Visual variant of the task list'
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the task list items'
        },
        isLoading: {
            control: 'boolean',
            description: 'Show loading state'
        },
        emptyMessage: {
            control: 'text',
            description: 'Message to show when no tasks are found'
        },
        onTaskToggle: {
            action: 'task-toggle',
            description: 'Callback when task completion is toggled'
        },
        onTaskEdit: {
            action: 'task-edit',
            description: 'Callback when task edit is clicked'
        },
        onTaskDelete: {
            action: 'task-delete',
            description: 'Callback when task delete is clicked'
        },
        onTaskClick: {
            action: 'task-click',
            description: 'Callback when task is clicked'
        },
        onNewTask: {
            action: 'new-task',
            description: 'Callback when new task button is clicked'
        },
        onViewAll: {
            action: 'view-all',
            description: 'Callback when view all button is clicked'
        }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Recent Tasks',
        showTime: true,
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onTaskEdit: (id) => console.log(`Edit task ${id}`),
        onTaskDelete: (id) => console.log(`Delete task ${id}`),
        onTaskClick: (id) => console.log(`Clicked task ${id}`),
        onNewTask: () => console.log('New task clicked'),
        onViewAll: () => console.log('View all clicked')
    }
};

// With all features enabled
export const WithAllFeatures: Story = {
    args: {
        tasks: sampleTasks,
        title: 'All Tasks',
        showTime: true,
        showStatus: true,
        showPriority: true,
        showProject: true,
        showDueDate: true,
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onTaskEdit: (id) => console.log(`Edit task ${id}`),
        onTaskDelete: (id) => console.log(`Delete task ${id}`),
        onTaskClick: (id) => console.log(`Clicked task ${id}`),
        onNewTask: () => console.log('New task clicked'),
        onViewAll: () => console.log('View all clicked')
    }
};

// Limited items with view all
export const LimitedItems: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Recent Tasks',
        maxItems: 3,
        showTime: true,
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onNewTask: () => console.log('New task clicked'),
        onViewAll: () => console.log('View all clicked')
    }
};

// Grouped by status
export const GroupedByStatus: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Tasks by Status',
        groupBy: 'status',
        showTime: true,
        showPriority: true,
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onTaskEdit: (id) => console.log(`Edit task ${id}`),
        onTaskDelete: (id) => console.log(`Delete task ${id}`)
    }
};

// Grouped by priority
export const GroupedByPriority: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Tasks by Priority',
        groupBy: 'priority',
        showTime: true,
        showStatus: true,
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onTaskEdit: (id) => console.log(`Edit task ${id}`),
        onTaskDelete: (id) => console.log(`Delete task ${id}`)
    }
};

// Grouped by project
export const GroupedByProject: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Tasks by Project',
        groupBy: 'project',
        showTime: true,
        showStatus: true,
        showPriority: true,
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onTaskEdit: (id) => console.log(`Edit task ${id}`),
        onTaskDelete: (id) => console.log(`Delete task ${id}`)
    }
};

// Grouped by due date
export const GroupedByDueDate: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Tasks by Due Date',
        groupBy: 'dueDate',
        showTime: true,
        showStatus: true,
        showPriority: true,
        showDueDate: true,
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onTaskEdit: (id) => console.log(`Edit task ${id}`),
        onTaskDelete: (id) => console.log(`Delete task ${id}`)
    }
};

// Compact variant
export const Compact: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Compact Task List',
        variant: 'compact',
        size: 'sm',
        showTime: true,
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onNewTask: () => console.log('New task clicked')
    }
};

// Loading state
export const Loading: Story = {
    args: {
        tasks: [],
        title: 'Loading Tasks',
        isLoading: true
    }
};

// Empty state
export const Empty: Story = {
    args: {
        tasks: [],
        title: 'No Tasks',
        emptyMessage: 'No tasks found. Create your first task to get started!',
        onNewTask: () => console.log('New task clicked')
    }
};

// With custom actions
export const WithCustomActions: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Tasks with Custom Actions',
        showTime: true,
        actions: [
            {
                label: 'Export',
                icon: '📥',
                onClick: () => console.log('Export clicked'),
                variant: 'ghost'
            },
            {
                label: 'Archive',
                icon: '📁',
                onClick: () => console.log('Archive clicked'),
                variant: 'secondary'
            }
        ],
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onTaskEdit: (id) => console.log(`Edit task ${id}`),
        onTaskDelete: (id) => console.log(`Delete task ${id}`),
        onNewTask: () => console.log('New task clicked')
    }
};

// Dashboard style (like the prototype)
export const DashboardStyle: Story = {
    args: {
        tasks: sampleTasks.slice(0, 4),
        title: 'Recent Tasks',
        showTime: true,
        maxItems: 4,
        actions: [
            {
                label: '+ New Task',
                onClick: () => console.log('New task clicked'),
                variant: 'primary'
            },
            {
                label: 'View All',
                onClick: () => console.log('View all clicked'),
                variant: 'secondary'
            }
        ],
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onTaskEdit: (id) => console.log(`Edit task ${id}`),
        onTaskDelete: (id) => console.log(`Delete task ${id}`),
        onTaskClick: (id) => console.log(`Clicked task ${id}`)
    }
};

// With sorting
export const WithSorting: Story = {
    args: {
        tasks: sampleTasks,
        title: 'Sortable Tasks',
        showTime: true,
        showStatus: true,
        showPriority: true,
        sortOptions: {
            field: 'priority',
            direction: 'desc'
        },
        onTaskToggle: (id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`),
        onSort: (sortOptions) => console.log('Sort changed:', sortOptions),
        onNewTask: () => console.log('New task clicked')
    }
};

// Multiple lists comparison
export const MultipleLists: Story = {
    render: () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TaskList
                tasks={sampleTasks.filter(t => t.status === 'TODO')}
                title="To Do"
                showTime={true}
                showPriority={true}
                onTaskToggle={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
                onNewTask={() => console.log('New task clicked')}
            />
            <TaskList
                tasks={sampleTasks.filter(t => t.status === 'IN_PROGRESS')}
                title="In Progress"
                showTime={true}
                showPriority={true}
                onTaskToggle={(id, completed) => console.log(`Task ${id} ${completed ? 'completed' : 'uncompleted'}`)}
                onNewTask={() => console.log('New task clicked')}
            />
        </div>
    )
};