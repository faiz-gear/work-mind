'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import MainLayout from '@/components/layout/MainLayout'
import { useUser } from '@/contexts/UserContext'
import { useTaskStats } from '@/hooks/useTasks'
import { useGenerateSummary } from '@/hooks/useAI'
import { CalendarIcon, TrendingUpIcon, ClockIcon, TargetIcon } from 'lucide-react'

export default function SummaryPage() {
  const t = useTranslations('summary')
  const { user } = useUser()
  
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('weekly')
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 7) // Default to last week
    return { start, end }
  })

  // 获取任务统计
  const { data: statsData, isLoading: statsLoading } = useTaskStats(
    user?.id || '',
    dateRange.start,
    dateRange.end
  )

  // AI总结生成
  const generateSummaryMutation = useGenerateSummary()

  const handlePeriodChange = (period: 'daily' | 'weekly' | 'monthly') => {
    setSelectedPeriod(period)
    const end = new Date()
    const start = new Date()
    
    switch (period) {
      case 'daily':
        start.setDate(end.getDate() - 1)
        break
      case 'weekly':
        start.setDate(end.getDate() - 7)
        break
      case 'monthly':
        start.setMonth(end.getMonth() - 1)
        break
    }
    
    setDateRange({ start, end })
  }

  const handleGenerateSummary = () => {
    if (!user?.id) return
    
    generateSummaryMutation.mutate({
      userId: user.id,
      period: selectedPeriod,
      startDate: dateRange.start,
      endDate: dateRange.end,
    })
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const getCompletionRate = () => {
    if (!statsData?.data || statsData.data.total === 0) return 0
    return Math.round((statsData.data.completed / statsData.data.total) * 100)
  }

  return (
    <MainLayout title={t('title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('title')}</h1>
            <p className="text-base-content/70 mt-1">
              Analyze your productivity and generate insights
            </p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleGenerateSummary}
            disabled={generateSummaryMutation.isPending}
          >
            {generateSummaryMutation.isPending ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              <TrendingUpIcon size={16} />
            )}
            {t('generate')}
          </button>
        </div>

        {/* Period Selection */}
        <div className="card bg-base-100 shadow-sm border border-base-300">
          <div className="card-body p-4">
            <div className="flex items-center gap-4">
              <CalendarIcon size={20} />
              <span className="font-medium">Time Period:</span>
              <div className="tabs tabs-boxed tabs-sm">
                <button
                  className={`tab ${selectedPeriod === 'daily' ? 'tab-active' : ''}`}
                  onClick={() => handlePeriodChange('daily')}
                >
                  {t('daily')}
                </button>
                <button
                  className={`tab ${selectedPeriod === 'weekly' ? 'tab-active' : ''}`}
                  onClick={() => handlePeriodChange('weekly')}
                >
                  {t('weekly')}
                </button>
                <button
                  className={`tab ${selectedPeriod === 'monthly' ? 'tab-active' : ''}`}
                  onClick={() => handlePeriodChange('monthly')}
                >
                  {t('monthly')}
                </button>
              </div>
              <span className="text-sm text-base-content/60">
                {dateRange.start.toLocaleDateString()} - {dateRange.end.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <TargetIcon size={24} />
                </div>
                <div className="stat-title text-xs">{t('totalTasks')}</div>
                <div className="stat-value text-2xl">
                  {statsLoading ? '...' : statsData?.data?.total || 0}
                </div>
                <div className="stat-desc">
                  {selectedPeriod} period
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="stat">
                <div className="stat-figure text-success">
                  <div className="radial-progress text-success" style={{"--value": getCompletionRate()} as any}>
                    {getCompletionRate()}%
                  </div>
                </div>
                <div className="stat-title text-xs">{t('completedTasks')}</div>
                <div className="stat-value text-2xl text-success">
                  {statsLoading ? '...' : statsData?.data?.completed || 0}
                </div>
                <div className="stat-desc">
                  {getCompletionRate()}% completion rate
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="stat">
                <div className="stat-figure text-info">
                  <ClockIcon size={24} />
                </div>
                <div className="stat-title text-xs">{t('totalTime')}</div>
                <div className="stat-value text-2xl">
                  {statsLoading ? '...' : formatDuration(statsData?.data?.totalDuration || 0)}
                </div>
                <div className="stat-desc">
                  Time invested
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body p-4">
              <div className="stat">
                <div className="stat-figure text-warning">
                  <TrendingUpIcon size={24} />
                </div>
                <div className="stat-title text-xs">{t('averageTime')}</div>
                <div className="stat-value text-2xl">
                  {statsLoading ? '...' : formatDuration(statsData?.data?.averageDuration || 0)}
                </div>
                <div className="stat-desc">
                  Per completed task
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Generated Summary */}
        {generateSummaryMutation.data?.data?.summary && (
          <div className="card bg-base-100 shadow-sm border border-base-300">
            <div className="card-body">
              <h2 className="card-title">AI-Generated Summary</h2>
              <div className="prose max-w-none">
                <div className="whitespace-pre-wrap text-sm">
                  {generateSummaryMutation.data.data.summary}
                </div>
              </div>
              <div className="text-xs text-base-content/50 mt-4">
                Generated on {new Date(generateSummaryMutation.data.data.generatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {generateSummaryMutation.error && (
          <div className="alert alert-error">
            <span>Failed to generate summary. Please try again.</span>
          </div>
        )}

        {/* Task Breakdown */}
        {statsData?.data && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-base">Task Status Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      Completed
                    </span>
                    <span className="font-medium">{statsData.data.completed}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-info rounded-full"></div>
                      In Progress
                    </span>
                    <span className="font-medium">{statsData.data.inProgress}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      Pending
                    </span>
                    <span className="font-medium">{statsData.data.pending}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-error rounded-full"></div>
                      Canceled
                    </span>
                    <span className="font-medium">{statsData.data.canceled}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-300">
              <div className="card-body">
                <h3 className="card-title text-base">Productivity Insights</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Completion Rate:</span>
                    <span className="font-medium">{getCompletionRate()}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Time Spent:</span>
                    <span className="font-medium">{formatDuration(statsData.data.totalDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Task Duration:</span>
                    <span className="font-medium">{formatDuration(statsData.data.averageDuration)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasks per Day:</span>
                    <span className="font-medium">
                      {selectedPeriod === 'daily' ? statsData.data.total : 
                       selectedPeriod === 'weekly' ? Math.round(statsData.data.total / 7 * 10) / 10 :
                       Math.round(statsData.data.total / 30 * 10) / 10}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
