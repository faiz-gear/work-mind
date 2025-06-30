'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import MainLayout from '@/components/layout/MainLayout'
import TaskCard from '@/components/tasks/TaskCard'
import CreateTaskModal from '@/components/tasks/CreateTaskModal'
import { useUser } from '@/contexts/UserContext'
import { useTasks, useUpdateTaskStatus } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { TaskStatus, Priority } from '@prisma/client'
import { PlusIcon, FilterIcon } from 'lucide-react'

export default function TasksPage() {
  const t = useTranslations('tasks')
  const { user } = useUser()

  // 状态管理
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // 过滤状态
  const [filters, setFilters] = useState({
    status: undefined as TaskStatus | undefined,
    priority: undefined as Priority | undefined,
    projectId: undefined as string | undefined,
    search: ''
  })

  // 获取数据
  const { data: tasksData, isLoading: tasksLoading } = useTasks({
    userId: user?.id || '',
    ...filters
  })

  const { data: projectsData } = useProjects(user?.id || '')

  // 更新任务状态
  const updateTaskStatusMutation = useUpdateTaskStatus()

  const handleStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatusMutation.mutate({
      id: taskId,
      status,
      userId: user?.id || ''
    })
  }

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === 'all' ? undefined : value
    }))
  }

  return (
    <MainLayout title={t('title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-base-content/70 mt-1">Manage and track your tasks efficiently</p>
          </div>
          <button className="btn btn-primary btn-sm" onClick={() => setIsCreateModalOpen(true)}>
            <PlusIcon size={16} />
            {t('newTask')}
          </button>
        </div>

        {/* Filters */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <FilterIcon size={16} />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              {/* Search */}
              <div className="form-control">
                <input
                  type="text"
                  placeholder={t('search') || 'Search tasks...'}
                  className="input input-sm input-bordered w-64"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <div className="form-control">
                <select
                  className="select select-sm select-bordered"
                  value={filters.status || 'all'}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value={TaskStatus.PENDING}>{t('pending')}</option>
                  <option value={TaskStatus.IN_PROGRESS}>{t('inProgress')}</option>
                  <option value={TaskStatus.COMPLETED}>{t('completed')}</option>
                  <option value={TaskStatus.CANCELED}>{t('canceled')}</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="form-control">
                <select
                  className="select select-sm select-bordered"
                  value={filters.priority || 'all'}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                >
                  <option value="all">All Priority</option>
                  <option value={Priority.HIGH}>{t('high')}</option>
                  <option value={Priority.MEDIUM}>{t('medium')}</option>
                  <option value={Priority.LOW}>{t('low')}</option>
                </select>
              </div>

              {/* Project Filter */}
              <div className="form-control">
                <select
                  className="select select-sm select-bordered"
                  value={filters.projectId || 'all'}
                  onChange={(e) => handleFilterChange('projectId', e.target.value)}
                >
                  <option value="all">All Projects</option>
                  {projectsData?.data?.map((project: any) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              <button
                className="btn btn-ghost btn-sm"
                onClick={() =>
                  setFilters({
                    status: undefined,
                    priority: undefined,
                    projectId: undefined,
                    search: ''
                  })
                }
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Tasks Grid */}
        <div className="space-y-4">
          {tasksLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : tasksData?.data?.length > 0 ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-base-content/70">{tasksData.total} tasks found</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tasksData.data.map((task: any) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onEdit={(taskId) => {
                      // TODO: Open edit modal
                      console.log('Edit task:', taskId)
                    }}
                    onDelete={(taskId) => {
                      // TODO: Open delete confirmation
                      console.log('Delete task:', taskId)
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
              {tasksData.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="join">
                    <button className="join-item btn btn-sm">«</button>
                    <button className="join-item btn btn-sm btn-active">1</button>
                    <button className="join-item btn btn-sm">2</button>
                    <button className="join-item btn btn-sm">»</button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
                <p className="text-base-content/70 mb-6">
                  {filters.search || filters.status || filters.priority || filters.projectId
                    ? 'Try adjusting your filters or create a new task.'
                    : 'Get started by creating your first task.'}
                </p>
                <button className="btn btn-primary">
                  <PlusIcon size={16} />
                  {t('newTask')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </MainLayout>
  )
}
