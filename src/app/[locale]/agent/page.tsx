'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import MainLayout from '@/components/layout/MainLayout'
import { useUser } from '@/contexts/UserContext'
import { useGenerateSummary, useGenerateSuggestions, useCachedSuggestions } from '@/hooks/useAI'
import { BotIcon, SparklesIcon, FileTextIcon, MessageSquareIcon } from 'lucide-react'

export default function AgentPage() {
  const t = useTranslations('agent')
  const { user } = useUser()
  
  const [activeTab, setActiveTab] = useState<'suggestions' | 'summary' | 'chat'>('suggestions')
  const [summaryPeriod, setSummaryPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  
  // AI hooks
  const generateSummaryMutation = useGenerateSummary()
  const generateSuggestionsMutation = useGenerateSuggestions()
  const { data: cachedSuggestions, isLoading: suggestionsLoading } = useCachedSuggestions(user?.id || '')

  const handleGenerateSummary = () => {
    if (!user?.id) return
    
    const endDate = new Date()
    const startDate = new Date()
    
    switch (summaryPeriod) {
      case 'daily':
        startDate.setDate(endDate.getDate() - 1)
        break
      case 'weekly':
        startDate.setDate(endDate.getDate() - 7)
        break
      case 'monthly':
        startDate.setMonth(endDate.getMonth() - 1)
        break
    }

    generateSummaryMutation.mutate({
      userId: user.id,
      period: summaryPeriod,
      startDate,
      endDate,
    })
  }

  const handleGenerateSuggestions = () => {
    if (!user?.id) return
    generateSuggestionsMutation.mutate(user.id)
  }

  return (
    <MainLayout title={t('title')}>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <BotIcon size={32} className="text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-base-content/70 max-w-2xl mx-auto">
            Your intelligent productivity assistant. Get personalized insights, suggestions, and summaries to optimize your workflow.
          </p>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-boxed justify-center">
          <button
            className={`tab ${activeTab === 'suggestions' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('suggestions')}
          >
            <SparklesIcon size={16} className="mr-2" />
            {t('suggestions')}
          </button>
          <button
            className={`tab ${activeTab === 'summary' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            <FileTextIcon size={16} className="mr-2" />
            Summary
          </button>
          <button
            className={`tab ${activeTab === 'chat' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            <MessageSquareIcon size={16} className="mr-2" />
            {t('chat')}
          </button>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {/* Suggestions Tab */}
          {activeTab === 'suggestions' && (
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title">Task Suggestions</h2>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleGenerateSuggestions}
                      disabled={generateSuggestionsMutation.isPending}
                    >
                      {generateSuggestionsMutation.isPending ? (
                        <span className="loading loading-spinner loading-sm"></span>
                      ) : (
                        <SparklesIcon size={16} />
                      )}
                      Generate New
                    </button>
                  </div>

                  {suggestionsLoading ? (
                    <div className="flex justify-center py-8">
                      <span className="loading loading-spinner loading-md"></span>
                    </div>
                  ) : cachedSuggestions?.data?.suggestions ? (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-sm">
                        {cachedSuggestions.data.suggestions}
                      </div>
                    </div>
                  ) : generateSuggestionsMutation.data?.data?.suggestions ? (
                    <div className="prose max-w-none">
                      <div className="whitespace-pre-wrap text-sm">
                        {generateSuggestionsMutation.data.data.suggestions}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-base-content/60">
                      <SparklesIcon size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No suggestions yet. Click "Generate New" to get personalized task recommendations.</p>
                    </div>
                  )}

                  {generateSuggestionsMutation.error && (
                    <div className="alert alert-error">
                      <span>Failed to generate suggestions. Please try again.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="card-title">Work Summary</h2>
                    <div className="flex items-center gap-2">
                      <select
                        className="select select-sm select-bordered"
                        value={summaryPeriod}
                        onChange={(e) => setSummaryPeriod(e.target.value as any)}
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={handleGenerateSummary}
                        disabled={generateSummaryMutation.isPending}
                      >
                        {generateSummaryMutation.isPending ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <FileTextIcon size={16} />
                        )}
                        Generate
                      </button>
                    </div>
                  </div>

                  {generateSummaryMutation.data?.data?.summary ? (
                    <div className="space-y-4">
                      <div className="stats stats-horizontal shadow-sm">
                        <div className="stat">
                          <div className="stat-title">Period</div>
                          <div className="stat-value text-lg capitalize">
                            {generateSummaryMutation.data.data.period}
                          </div>
                        </div>
                        <div className="stat">
                          <div className="stat-title">Tasks Analyzed</div>
                          <div className="stat-value text-lg">
                            {generateSummaryMutation.data.data.taskCount}
                          </div>
                        </div>
                      </div>
                      
                      <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-sm">
                          {generateSummaryMutation.data.data.summary}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-base-content/60">
                      <FileTextIcon size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Select a time period and click "Generate" to create your work summary.</p>
                    </div>
                  )}

                  {generateSummaryMutation.error && (
                    <div className="alert alert-error">
                      <span>Failed to generate summary. Please try again.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === 'chat' && (
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body">
                  <h2 className="card-title mb-4">AI Assistant Chat</h2>
                  
                  <div className="text-center py-8 text-base-content/60">
                    <MessageSquareIcon size={48} className="mx-auto mb-4 opacity-50" />
                    <p>Chat functionality coming soon! This will allow you to have conversations with your AI assistant.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
