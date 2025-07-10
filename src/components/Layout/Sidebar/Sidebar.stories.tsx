import type {Meta, StoryObj} from '@storybook/nextjs';
import React from 'react';
import {Sidebar} from './Sidebar';
import {NavigationItem, BrandConfig} from './interface';

// Sample navigation items
const sampleNavItems: NavigationItem[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '📊',
        href: '/dashboard',
        isActive: true
    },
    {
        id: 'tasks',
        label: 'Tasks',
        icon: '✅',
        href: '/tasks',
        badge: '12'
    },
    {
        id: 'projects',
        label: 'Projects',
        icon: '📁',
        href: '/projects',
        children: [
            {
                id: 'project-1',
                label: 'WorkMind Dashboard',
                href: '/projects/1'
            },
            {
                id: 'project-2',
                label: 'Authentication System',
                href: '/projects/2'
            }
        ]
    },
    {
        id: 'summary',
        label: 'Summary',
        icon: '📈',
        href: '/summary'
    },
    {
        id: 'ai-agent',
        label: 'AI Agent',
        icon: '🤖',
        href: '/ai-agent',
        badge: 'New'
    },
    {
        id: 'settings',
        label: 'Settings',
        icon: '⚙️',
        href: '/settings'
    }
];

const extendedNavItems: NavigationItem[] = [
    ...sampleNavItems,
    {
        id: 'analytics',
        label: 'Analytics',
        icon: '📊',
        href: '/analytics',
        children: [
            {
                id: 'performance',
                label: 'Performance',
                href: '/analytics/performance'
            },
            {
                id: 'reports',
                label: 'Reports',
                href: '/analytics/reports',
                badge: '3'
            },
            {
                id: 'insights',
                label: 'Insights',
                href: '/analytics/insights'
            }
        ]
    },
    {
        id: 'team',
        label: 'Team',
        icon: '👥',
        href: '/team',
        children: [
            {
                id: 'members',
                label: 'Members',
                href: '/team/members'
            },
            {
                id: 'roles',
                label: 'Roles',
                href: '/team/roles'
            }
        ]
    },
    {
        id: 'integrations',
        label: 'Integrations',
        icon: '🔗',
        href: '/integrations',
        isDisabled: true
    }
];

const sampleBrand: BrandConfig = {
    logo: '🧠',
    title: 'WorkMind',
    href: '/'
};

const meta: Meta<typeof Sidebar> = {
    title: 'Business/Layout/Sidebar',
    component: Sidebar,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'A comprehensive sidebar navigation component with support for collapsing, nested navigation, branding, and responsive behavior.'
            }
        }
    },
    argTypes: {
        items: {
            control: 'object',
            description: 'Array of navigation items'
        },
        brand: {
            control: 'object',
            description: 'Brand configuration object'
        },
        width: {
            control: 'number',
            description: 'Sidebar width in pixels'
        },
        position: {
            control: 'select',
            options: ['left', 'right'],
            description: 'Position of the sidebar'
        },
        isOpen: {
            control: 'boolean',
            description: 'Whether sidebar is open (for mobile/overlay)'
        },
        isCollapsed: {
            control: 'boolean',
            description: 'Whether sidebar is collapsed'
        },
        isCollapsible: {
            control: 'boolean',
            description: 'Whether sidebar can be collapsed'
        },
        isMobile: {
            control: 'boolean',
            description: 'Mobile mode behavior'
        },
        activeItemId: {
            control: 'text',
            description: 'ID of the active navigation item'
        },
        variant: {
            control: 'select',
            options: ['default', 'compact', 'minimal', 'floating'],
            description: 'Visual variant of the sidebar'
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Size of the sidebar'
        },
        showBrand: {
            control: 'boolean',
            description: 'Show brand section'
        },
        showCollapseButton: {
            control: 'boolean',
            description: 'Show collapse button'
        },
        overlay: {
            control: 'boolean',
            description: 'Use overlay behavior'
        },
        collapsedWidth: {
            control: 'number',
            description: 'Width when collapsed'
        },
        onNavigate: {
            action: 'navigate',
            description: 'Callback when navigation item is clicked'
        },
        onBrandClick: {
            action: 'brand-click',
            description: 'Callback when brand is clicked'
        },
        onToggle: {
            action: 'toggle',
            description: 'Callback when sidebar is toggled'
        },
        onClose: {
            action: 'close',
            description: 'Callback when sidebar is closed'
        }
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default story
export const Default: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        activeItemId: 'dashboard',
        onNavigate: (item) => console.log('Navigate to:', item.label),
        onBrandClick: () => console.log('Brand clicked'),
        onToggle: (collapsed) => console.log('Sidebar toggled:', collapsed)
    }
};

// Collapsed state
export const Collapsed: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        activeItemId: 'tasks',
        isCollapsed: true,
        onNavigate: (item) => console.log('Navigate to:', item.label),
        onToggle: (collapsed) => console.log('Sidebar toggled:', collapsed)
    }
};

// With nested navigation
export const WithNestedNav: Story = {
    args: {
        items: extendedNavItems,
        brand: sampleBrand,
        activeItemId: 'performance',
        expandedItems: ['analytics', 'team'],
        onNavigate: (item) => console.log('Navigate to:', item.label),
        onToggle: (collapsed) => console.log('Sidebar toggled:', collapsed)
    }
};

// Mobile overlay
export const MobileOverlay: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        activeItemId: 'dashboard',
        isMobile: true,
        overlay: true,
        isOpen: true,
        onNavigate: (item) => console.log('Navigate to:', item.label),
        onClose: () => console.log('Sidebar closed')
    }
};

// Different variants
export const CompactVariant: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        variant: 'compact',
        activeItemId: 'tasks',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

export const MinimalVariant: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        variant: 'minimal',
        activeItemId: 'summary',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

export const FloatingVariant: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        variant: 'floating',
        activeItemId: 'ai-agent',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

// Different sizes
export const SmallSize: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        size: 'sm',
        width: 200,
        activeItemId: 'dashboard',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

export const LargeSize: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        size: 'lg',
        width: 280,
        activeItemId: 'dashboard',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

// Right positioned
export const RightPositioned: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        position: 'right',
        activeItemId: 'settings',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

// Without brand
export const WithoutBrand: Story = {
    args: {
        items: sampleNavItems,
        showBrand: false,
        activeItemId: 'dashboard',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

// Non-collapsible
export const NonCollapsible: Story = {
    args: {
        items: sampleNavItems,
        brand: sampleBrand,
        isCollapsible: false,
        showCollapseButton: false,
        activeItemId: 'dashboard',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

// Dashboard prototype style
export const DashboardStyle: Story = {
    args: {
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: '📊',
                href: '/dashboard',
                isActive: true
            },
            {
                id: 'tasks',
                label: 'Tasks',
                icon: '✅',
                href: '/tasks'
            },
            {
                id: 'summary',
                label: 'Summary',
                icon: '📈',
                href: '/summary'
            },
            {
                id: 'ai-agent',
                label: 'AI Agent',
                icon: '🤖',
                href: '/ai-agent'
            },
            {
                id: 'settings',
                label: 'Settings',
                icon: '⚙️',
                href: '/settings'
            }
        ],
        brand: sampleBrand,
        width: 240,
        activeItemId: 'dashboard',
        onNavigate: (item) => console.log('Navigate to:', item.label)
    }
};

// Interactive demo
export const InteractiveDemo: Story = {
    render: () => {
        const [isOpen, setIsOpen] = React.useState(true);
        const [isCollapsed, setIsCollapsed] = React.useState(false);
        const [activeItem, setActiveItem] = React.useState('dashboard');

        return (
            <div className="flex h-screen bg-base-200">
                <Sidebar
                    items={sampleNavItems}
                    brand={sampleBrand}
                    isOpen={isOpen}
                    isCollapsed={isCollapsed}
                    activeItemId={activeItem}
                    onNavigate={(item) => {
                        setActiveItem(item.id);
                        console.log('Navigate to:', item.label);
                    }}
                    onToggle={(collapsed) => {
                        setIsCollapsed(collapsed);
                        console.log('Sidebar toggled:', collapsed);
                    }}
                    onClose={() => {
                        setIsOpen(false);
                        console.log('Sidebar closed');
                    }}
                />

                <div className="flex-1 p-6">
                    <div className="bg-base-100 p-6 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold mb-4">Main Content</h1>
                        <p className="text-base-content/70 mb-4">
                            This is the main content area. The sidebar can be collapsed or expanded.
                        </p>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="btn btn-primary btn-sm"
                            >
                                {isOpen ? 'Close' : 'Open'} Sidebar
                            </button>

                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="btn btn-secondary btn-sm"
                            >
                                {isCollapsed ? 'Expand' : 'Collapse'} Sidebar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

// Responsive demo
export const ResponsiveDemo: Story = {
    render: () => {
        const [isMobile, setIsMobile] = React.useState(false);
        const [isOpen, setIsOpen] = React.useState(true);

        React.useEffect(() => {
            const handleResize = () => {
                setIsMobile(window.innerWidth < 768);
            };

            handleResize();
            window.addEventListener('resize', handleResize);

            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return (
            <div className="flex h-screen bg-base-200">
                <Sidebar
                    items={sampleNavItems}
                    brand={sampleBrand}
                    isMobile={isMobile}
                    overlay={isMobile}
                    isOpen={isOpen}
                    activeItemId="dashboard"
                    onNavigate={(item) => {
                        console.log('Navigate to:', item.label);
                    }}
                    onClose={() => {
                        setIsOpen(false);
                    }}
                />

                <div className="flex-1 p-6">
                    <div className="bg-base-100 p-6 rounded-lg shadow-sm">
                        <h1 className="text-2xl font-bold mb-4">Responsive Sidebar Demo</h1>
                        <p className="text-base-content/70 mb-4">
                            Resize the window to see responsive behavior.
                            On mobile, the sidebar becomes an overlay.
                        </p>

                        <div className="mb-4">
                            <p className="text-sm text-base-content/60">
                                Current mode: {isMobile ? 'Mobile' : 'Desktop'}
                            </p>
                        </div>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="btn btn-primary btn-sm"
                        >
                            {isOpen ? 'Close' : 'Open'} Sidebar
                        </button>
                    </div>
                </div>
            </div>
        );
    }
};