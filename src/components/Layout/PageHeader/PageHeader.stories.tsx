import type {Meta, StoryObj} from '@storybook/nextjs';
import {PageHeader} from './PageHeader';
import {BreadcrumbItem, HeaderAction, UserProfile, LanguageOption} from './interface';

// Sample data
const sampleUser: UserProfile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://via.placeholder.com/32',
    role: 'Admin'
};

const sampleBreadcrumbs: BreadcrumbItem[] = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: '📊'
    },
    {
        label: 'Projects',
        href: '/projects',
        icon: '📁'
    },
    {
        label: 'WorkMind Dashboard',
        isActive: true
    }
];

const sampleActions: HeaderAction[] = [
    {
        label: 'Export',
        icon: '📥',
        onClick: () => console.log('Export clicked'),
        variant: 'outline'
    },
    {
        label: 'Settings',
        icon: '⚙️',
        onClick: () => console.log('Settings clicked'),
        variant: 'ghost'
    },
    {
        label: 'New Item',
        icon: '➕',
        onClick: () => console.log('New item clicked'),
        variant: 'primary'
    }
];

const sampleLanguages: LanguageOption[] = [
    {code: 'en', label: 'English', flag: '🇺🇸'},
    {code: 'zh', label: '中文', flag: '🇨🇳'},
    {code: 'es', label: 'Español', flag: '🇪🇸'},
    {code: 'fr', label: 'Français', flag: '🇫🇷'}
];

const meta: Meta<typeof PageHeader> = {
    title: 'Business/Layout/PageHeader',
    component: PageHeader,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'A comprehensive page header component with breadcrumbs, actions, user menu, and language selector.'
            }
        }
    },
    argTypes: {
        title: {
            control: 'text',
            description: 'Main page title'
        },
        subtitle: {
            control: 'text',
            description: 'Subtitle displayed below title'
        },
        description: {
            control: 'text',
            description: 'Description text'
        },
        icon: {
            control: 'text',
            description: 'Icon displayed next to title'
        },
        breadcrumbs: {
            control: 'object',
            description: 'Array of breadcrumb items'
        },
        actions: {
            control: 'object',
            description: 'Array of action buttons'
        },
        user: {
            control: 'object',
            description: 'User profile information'
        },
        showUserMenu: {
            control: 'boolean',
            description: 'Show user menu dropdown'
        },
        showLanguageSelector: {
            control: 'boolean',
            description: 'Show language selector'
        },
        languages: {
            control: 'object',
            description: 'Available languages'
        },
        currentLanguage: {
            control: 'text',
            description: 'Current language code'
        },
        variant: {
            control: 'select',
            options: ['default', 'compact', 'minimal', 'detailed'],
            description: 'Visual variant'
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the header'
        },
        alignment: {
            control: 'select',
            options: ['left', 'center', 'between'],
            description: 'Content alignment'
        },
        sticky: {
            control: 'boolean',
            description: 'Make header sticky'
        },
        bordered: {
            control: 'boolean',
            description: 'Show bottom border'
        },
        shadow: {
            control: 'boolean',
            description: 'Show shadow'
        },
        showDivider: {
            control: 'boolean',
            description: 'Show divider line'
        },
        isLoading: {
            control: 'boolean',
            description: 'Show loading state'
        },
        hasError: {
            control: 'boolean',
            description: 'Show error state'
        },
        onTitleClick: {
            action: 'title-click',
            description: 'Callback when title is clicked'
        },
        onBreadcrumbClick: {
            action: 'breadcrumb-click',
            description: 'Callback when breadcrumb is clicked'
        },
        onRefresh: {
            action: 'refresh',
            description: 'Callback when refresh is clicked'
        },
        onBack: {
            action: 'back',
            description: 'Callback when back is clicked'
        },
        onLanguageChange: {
            action: 'language-change',
            description: 'Callback when language is changed'
        },
        onUserMenuClick: {
            action: 'user-menu-click',
            description: 'Callback when user menu is clicked'
        },
        onLogout: {
            action: 'logout',
            description: 'Callback when logout is clicked'
        }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
    args: {
        title: 'Dashboard',
        subtitle: 'Overview of your workspace',
        description: 'Monitor your tasks, projects, and team performance in one place.',
        icon: '📊',
        actions: sampleActions,
        user: sampleUser,
        onTitleClick: () => console.log('Title clicked'),
        onLanguageChange: (lang) => console.log('Language changed to:', lang),
        onUserMenuClick: () => console.log('User menu clicked'),
        onLogout: () => console.log('Logout clicked')
    }
};

// With breadcrumbs
export const WithBreadcrumbs: Story = {
    args: {
        title: 'WorkMind Dashboard',
        subtitle: 'Project management workspace',
        breadcrumbs: sampleBreadcrumbs,
        actions: sampleActions,
        user: sampleUser,
        onBreadcrumbClick: (item) => console.log('Breadcrumb clicked:', item.label),
        onBack: () => console.log('Back clicked')
    }
};

// With language selector
export const WithLanguageSelector: Story = {
    args: {
        title: 'Settings',
        subtitle: 'Manage your preferences',
        actions: sampleActions,
        user: sampleUser,
        showLanguageSelector: true,
        languages: sampleLanguages,
        currentLanguage: 'en',
        onLanguageChange: (lang) => console.log('Language changed to:', lang)
    }
};

// Dashboard style (matching prototype)
export const DashboardStyle: Story = {
    args: {
        title: 'Dashboard',
        showUserMenu: true,
        showLanguageSelector: true,
        languages: [
            {code: 'en', label: 'English'},
            {code: 'zh', label: '中文'}
        ],
        currentLanguage: 'en',
        user: sampleUser,
        variant: 'default',
        bordered: true,
        onLanguageChange: (lang) => console.log('Language changed to:', lang),
        onUserMenuClick: () => console.log('User menu clicked'),
        onLogout: () => console.log('Logout clicked')
    }
};

// Different variants
export const CompactVariant: Story = {
    args: {
        title: 'Compact Header',
        subtitle: 'Less spacing',
        variant: 'compact',
        actions: sampleActions.slice(0, 2),
        user: sampleUser
    }
};

export const MinimalVariant: Story = {
    args: {
        title: 'Minimal Header',
        variant: 'minimal',
        showDivider: false,
        actions: [sampleActions[2]],
        user: sampleUser
    }
};

export const DetailedVariant: Story = {
    args: {
        title: 'Detailed Header',
        subtitle: 'More spacing and content',
        description: 'This is a detailed header with more information and spacing for complex pages.',
        variant: 'detailed',
        icon: '📋',
        breadcrumbs: sampleBreadcrumbs,
        actions: sampleActions,
        user: sampleUser
    }
};

// Different sizes
export const SmallSize: Story = {
    args: {
        title: 'Small Header',
        size: 'sm',
        actions: sampleActions.slice(0, 2),
        user: sampleUser
    }
};

export const LargeSize: Story = {
    args: {
        title: 'Large Header',
        subtitle: 'More prominent display',
        size: 'lg',
        icon: '🏠',
        actions: sampleActions,
        user: sampleUser
    }
};

// Different alignments
export const LeftAligned: Story = {
    args: {
        title: 'Left Aligned',
        subtitle: 'Everything aligned to the left',
        alignment: 'left',
        actions: sampleActions.slice(0, 2),
        user: sampleUser
    }
};

export const CenterAligned: Story = {
    args: {
        title: 'Center Aligned',
        subtitle: 'Content centered',
        alignment: 'center',
        actions: sampleActions.slice(0, 1),
        user: sampleUser
    }
};

// With special features
export const StickyHeader: Story = {
    args: {
        title: 'Sticky Header',
        subtitle: 'This header sticks to the top',
        sticky: true,
        shadow: true,
        actions: sampleActions,
        user: sampleUser
    }
};

export const BorderedHeader: Story = {
    args: {
        title: 'Bordered Header',
        subtitle: 'With bottom border',
        bordered: true,
        actions: sampleActions,
        user: sampleUser
    }
};

// Different states
export const LoadingState: Story = {
    args: {
        title: 'Loading...',
        isLoading: true,
        actions: sampleActions,
        user: sampleUser
    }
};

export const ErrorState: Story = {
    args: {
        title: 'Error Page',
        hasError: true,
        errorMessage: 'Failed to load page data',
        actions: sampleActions,
        user: sampleUser,
        onRefresh: () => console.log('Refresh clicked')
    }
};

// With custom actions
export const ManyActions: Story = {
    args: {
        title: 'Multiple Actions',
        subtitle: 'Header with many action buttons',
        actions: [
            ...sampleActions,
            {
                label: 'Share',
                icon: '📤',
                onClick: () => console.log('Share clicked'),
                variant: 'outline'
            },
            {
                label: 'Archive',
                icon: '📁',
                onClick: () => console.log('Archive clicked'),
                variant: 'ghost'
            },
            {
                label: 'Delete',
                icon: '🗑️',
                onClick: () => console.log('Delete clicked'),
                variant: 'outline'
            }
        ],
        user: sampleUser
    }
};

// Without user menu
export const NoUserMenu: Story = {
    args: {
        title: 'No User Menu',
        subtitle: 'Header without user menu',
        showUserMenu: false,
        actions: sampleActions,
        breadcrumbs: sampleBreadcrumbs
    }
};

// With custom content
export const WithCustomContent: Story = {
    args: {
        title: 'Custom Content',
        subtitle: 'Header with additional content',
        actions: sampleActions,
        user: sampleUser,
        children: (
            <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <h3 className="font-medium mb-2">Additional Information</h3>
                <p className="text-sm text-base-content/70">
                    This is custom content added to the header. It can contain any React components.
                </p>
                <div className="flex gap-2 mt-2">
                    <div className="badge badge-primary">Status: Active</div>
                    <div className="badge badge-outline">Version: 1.0.0</div>
                </div>
            </div>
        )
    }
};

// Real-world examples
export const TaskDetailPage: Story = {
    args: {
        title: 'Complete project documentation',
        subtitle: 'Task #1234 • High Priority',
        icon: '✅',
        breadcrumbs: [
            {label: 'Dashboard', href: '/dashboard'},
            {label: 'Tasks', href: '/tasks'},
            {label: 'Task Details', isActive: true}
        ],
        actions: [
            {
                label: 'Edit',
                icon: '✏️',
                onClick: () => console.log('Edit task'),
                variant: 'outline'
            },
            {
                label: 'Complete',
                icon: '✓',
                onClick: () => console.log('Complete task'),
                variant: 'primary'
            }
        ],
        user: sampleUser,
        bordered: true
    }
};

export const ProjectOverview: Story = {
    args: {
        title: 'WorkMind Dashboard',
        subtitle: 'Active • 12 tasks remaining',
        description: 'A comprehensive task management and productivity tracking application built with Next.js and TypeScript.',
        icon: '📊',
        breadcrumbs: [
            {label: 'Dashboard', href: '/dashboard'},
            {label: 'Projects', href: '/projects'},
            {label: 'WorkMind Dashboard', isActive: true}
        ],
        actions: [
            {
                label: 'Invite Team',
                icon: '👥',
                onClick: () => console.log('Invite team'),
                variant: 'outline'
            },
            {
                label: 'Settings',
                icon: '⚙️',
                onClick: () => console.log('Project settings'),
                variant: 'ghost'
            }
        ],
        user: sampleUser,
        showLanguageSelector: true,
        languages: sampleLanguages,
        currentLanguage: 'en',
        variant: 'detailed',
        shadow: true
    }
};