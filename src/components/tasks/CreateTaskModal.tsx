'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useUser } from '@/contexts/UserContext'
import { useCreateTask } from '@/hooks/useTasks'
import { useProjects } from '@/hooks/useProjects'
import { TaskStatus, Priority } from '@prisma/client'
import { XIcon } from 'lucide-react'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const t = useTranslations('tasks')
  const { user } = useUser()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TaskStatus.PENDING,
    priority: Priority.MEDIUM,
    projectId: '',
    startTime: '',
    endTime: '',
  })

  const createTaskMutation = useCreateTask()
  const { data: projectsData } = useProjects(user?.id || '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user?.id || !formData.title.trim()) return

    try {
      await createTaskMutation.mutateAsync({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        status: formData.status,
        priority: formData.priority,
        projectId: formData.projectId || undefined,
        startTime: formData.startTime ? new Date(formData.startTime) : undefined,
        endTime: formData.endTime ? new Date(formData.endTime) : undefined,
        userId: user.id,
      })

      // 重置表单并关闭模态框
      setFormData({
        title: '',
        description: '',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        projectId: '',
        startTime: '',
        endTime: '',
      })
      onClose()
    } catch (error) {
      console.error('Failed to create task:', error)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }))
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/12 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg">{t('newTask')}</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
          >
            <XIcon size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t('taskTitle')} *</span>
            </label>
            <input
              type="text"
              className="input input-bordered input-sm"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter task title..."
              required
            />
          </div>

          {/* Description */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t('taskDescription')}</span>
            </label>
            <textarea
              className="textarea textarea-bordered textarea-sm"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter task description..."
            />
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('status')}</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                <option value={TaskStatus.PENDING}>{t('pending')}</option>
                <option value={TaskStatus.IN_PROGRESS}>{t('inProgress')}</option>
                <option value={TaskStatus.COMPLETED}>{t('completed')}</option>
                <option value={TaskStatus.CANCELED}>{t('canceled')}</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('priority')}</span>
              </label>
              <select
                className="select select-bordered select-sm"
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
              >
                <option value={Priority.LOW}>{t('low')}</option>
                <option value={Priority.MEDIUM}>{t('medium')}</option>
                <option value={Priority.HIGH}>{t('high')}</option>
              </select>
            </div>
          </div>

          {/* Project */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">{t('project')}</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={formData.projectId}
              onChange={(e) => handleChange('projectId', e.target.value)}
            >
              <option value="">No project</option>
              {projectsData?.data?.map((project: any) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('startTime')}</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered input-sm"
                value={formData.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">{t('endTime')}</span>
              </label>
              <input
                type="datetime-local"
                className="input input-bordered input-sm"
                value={formData.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createTaskMutation.isPending || !formData.title.trim()}
            >
              {createTaskMutation.isPending ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : null}
              Create Task
            </button>
          </div>
        </form>

        {createTaskMutation.error && (
          <div className="alert alert-error mt-4">
            <span>Failed to create task. Please try again.</span>
          </div>
        )}
      </div>
    </div>
  )
}
