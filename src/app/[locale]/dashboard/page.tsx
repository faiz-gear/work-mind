'use client'

import { useTranslations } from 'next-intl'
import MainLayout from '@/components/layout/MainLayout'
import { useUser } from '@/contexts/UserContext'
import { useTaskStats, useTasks } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { TaskStatus } from '@prisma/client'

export default function DashboardPage() {
  const t = useTranslations('navigation')
  const { user } = useUser()

  // 获取任务统计
  const { data: taskStats, isLoading: statsLoading } = useTaskStats(user?.id || '')

  // 获取最近任务
  const { data: recentTasksData, isLoading: tasksLoading } = useTasks({ userId: user?.id || '' }, 1, 5)

  // 获取项目列表
  const { data: projectsData, isLoading: projectsLoading } = useProjects(user?.id || '')

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    return hours > 0 ? `${hours}h` : `${minutes}m`
  }

  const getCompletionRate = () => {
    if (!taskStats?.data || taskStats.data.total === 0) return 0
    return Math.round((taskStats.data.completed / taskStats.data.total) * 100)
  }

  return (
    <MainLayout title={t('dashboard')}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card card-compact bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title text-xs">Total Tasks</div>
                <div className="stat-value text-2xl">{statsLoading ? '...' : taskStats?.data?.total || 0}</div>
                <div className="stat-desc text-xs">{taskStats?.data?.total === 0 ? 'No tasks yet' : 'All time'}</div>
              </div>
            </div>
          </div>

          <div className="card card-compact bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title text-xs">Completed</div>
                <div className="stat-value text-2xl text-success">
                  {statsLoading ? '...' : taskStats?.data?.completed || 0}
                </div>
                <div className="stat-desc text-xs">{getCompletionRate()}% completion rate</div>
              </div>
            </div>
          </div>

          <div className="card card-compact bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title text-xs">In Progress</div>
                <div className="stat-value text-2xl text-info">
                  {statsLoading ? '...' : taskStats?.data?.inProgress || 0}
                </div>
                <div className="stat-desc text-xs">Active tasks</div>
              </div>
            </div>
          </div>

          <div className="card card-compact bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <div className="stat">
                <div className="stat-title text-xs">Time Spent</div>
                <div className="stat-value text-2xl">
                  {statsLoading ? '...' : formatDuration(taskStats?.data?.totalDuration || 0)}
                </div>
                <div className="stat-desc text-xs">Total time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body">
            <h2 className="card-title text-lg">Recent Tasks</h2>
            {tasksLoading ? (
              <div className="flex justify-center py-8">
                <span className="loading loading-spinner loading-md"></span>
              </div>
            ) : recentTasksData?.data?.length > 0 ? (
              <div className="space-y-3">
                {recentTasksData.data.map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-base-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`badge badge-xs ${
                            task.status === TaskStatus.COMPLETED
                              ? 'badge-success'
                              : task.status === TaskStatus.IN_PROGRESS
                              ? 'badge-info'
                              : task.status === TaskStatus.PENDING
                              ? 'badge-warning'
                              : 'badge-error'
                          }`}
                        >
                          {task.status.toLowerCase()}
                        </span>
                        {task.project && <span className="text-xs text-base-content/60">{task.project.name}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-base-content/60">
                <p>No tasks found. Create your first task to get started!</p>
                <button className="btn btn-primary btn-sm mt-4">Create Task</button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-base">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn btn-outline btn-sm w-full justify-start">+ New Task</button>
                <button className="btn btn-outline btn-sm w-full justify-start">+ New Project</button>
                <button className="btn btn-outline btn-sm w-full justify-start">📊 Generate Summary</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-base">Projects Overview</h3>
              {projectsLoading ? (
                <div className="flex justify-center py-4">
                  <span className="loading loading-spinner loading-sm"></span>
                </div>
              ) : projectsData?.data?.length > 0 ? (
                <div className="space-y-2">
                  {projectsData.data.slice(0, 3).map((project: any) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <span className="text-sm">{project.name}</span>
                      <span className="text-xs text-base-content/60">{project._count.tasks} tasks</span>
                    </div>
                  ))}
                  {projectsData.data.length > 3 && (
                    <div className="text-xs text-base-content/50 text-center pt-2">
                      +{projectsData.data.length - 3} more projects
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-base-content/70">
                  No projects yet. Create your first project to organize your tasks.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
