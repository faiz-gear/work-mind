'use client'

import { useTranslations } from 'next-intl'
import { TaskStatus, Priority } from '@prisma/client'
import { 
  ClockIcon, 
  CalendarIcon, 
  FolderIcon, 
  TagIcon,
  MoreVerticalIcon,
  PlayIcon,
  PauseIcon,
  CheckIcon
} from 'lucide-react'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description?: string
    status: TaskStatus
    priority: Priority
    startTime?: Date
    endTime?: Date
    duration?: number
    project?: {
      id: string
      name: string
      color?: string
    }
    tags: {
      id: string
      name: string
      color?: string
    }[]
  }
  onStatusChange?: (taskId: string, status: TaskStatus) => void
  onEdit?: (taskId: string) => void
  onDelete?: (taskId: string) => void
}

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) => {
  const t = useTranslations('tasks')

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return 'badge-warning'
      case TaskStatus.IN_PROGRESS:
        return 'badge-info'
      case TaskStatus.COMPLETED:
        return 'badge-success'
      case TaskStatus.CANCELED:
        return 'badge-error'
      default:
        return 'badge-neutral'
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.HIGH:
        return 'text-error'
      case Priority.MEDIUM:
        return 'text-warning'
      case Priority.LOW:
        return 'text-success'
      default:
        return 'text-base-content'
    }
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return null
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus)
    }
  }

  return (
    <div className="card card-compact bg-base-100 shadow-sm border border-base-300 hover:shadow-md transition-shadow">
      <div className="card-body p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="card-title text-sm font-medium truncate">{task.title}</h3>
            {task.description && (
              <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          
          {/* Actions dropdown */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-square">
              <MoreVerticalIcon size={14} />
            </div>
            <ul tabIndex={0} className="dropdown-content menu menu-xs bg-base-100 rounded-box z-[1] w-32 p-1 shadow border border-base-300">
              <li><button onClick={() => onEdit?.(task.id)} className="text-xs">Edit</button></li>
              <li><button onClick={() => onDelete?.(task.id)} className="text-xs text-error">Delete</button></li>
            </ul>
          </div>
        </div>

        {/* Status and Priority */}
        <div className="flex items-center gap-2 mt-2">
          <span className={`badge badge-xs ${getStatusColor(task.status)}`}>
            {t(task.status.toLowerCase())}
          </span>
          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {t(task.priority.toLowerCase())}
          </span>
        </div>

        {/* Project and Tags */}
        {(task.project || task.tags.length > 0) && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.project && (
              <div className="flex items-center gap-1 text-xs text-base-content/70">
                <FolderIcon size={12} />
                <span className="truncate max-w-20">{task.project.name}</span>
              </div>
            )}
            {task.tags.slice(0, 2).map((tag) => (
              <div key={tag.id} className="flex items-center gap-1 text-xs text-base-content/70">
                <TagIcon size={12} />
                <span className="truncate max-w-16">{tag.name}</span>
              </div>
            ))}
            {task.tags.length > 2 && (
              <span className="text-xs text-base-content/50">+{task.tags.length - 2}</span>
            )}
          </div>
        )}

        {/* Time info */}
        {(task.startTime || task.duration) && (
          <div className="flex items-center gap-3 mt-2 text-xs text-base-content/70">
            {task.startTime && (
              <div className="flex items-center gap-1">
                <CalendarIcon size={12} />
                <span>{new Date(task.startTime).toLocaleDateString()}</span>
              </div>
            )}
            {task.duration && (
              <div className="flex items-center gap-1">
                <ClockIcon size={12} />
                <span>{formatDuration(task.duration)}</span>
              </div>
            )}
          </div>
        )}

        {/* Quick actions */}
        <div className="flex items-center gap-1 mt-3">
          {task.status === TaskStatus.PENDING && (
            <button
              onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
              className="btn btn-xs btn-primary"
            >
              <PlayIcon size={12} />
              Start
            </button>
          )}
          {task.status === TaskStatus.IN_PROGRESS && (
            <>
              <button
                onClick={() => handleStatusChange(TaskStatus.COMPLETED)}
                className="btn btn-xs btn-success"
              >
                <CheckIcon size={12} />
                Complete
              </button>
              <button
                onClick={() => handleStatusChange(TaskStatus.PENDING)}
                className="btn btn-xs btn-outline"
              >
                <PauseIcon size={12} />
                Pause
              </button>
            </>
          )}
          {task.status === TaskStatus.COMPLETED && (
            <button
              onClick={() => handleStatusChange(TaskStatus.IN_PROGRESS)}
              className="btn btn-xs btn-outline"
            >
              Reopen
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard
