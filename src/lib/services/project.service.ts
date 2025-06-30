import { BaseService } from './base.service'
import { 
  ProjectRepository, 
  ProjectWithStats, 
  CreateProjectInput, 
  UpdateProjectInput 
} from '../repositories/project.repository'

export class ProjectService extends BaseService {
  private projectRepository: ProjectRepository

  constructor() {
    super()
    this.projectRepository = new ProjectRepository()
  }

  async createProject(data: CreateProjectInput): Promise<ProjectWithStats> {
    try {
      this.validateRequiredFields(data, ['name', 'userId'])
      
      const sanitizedData = this.sanitizeInput(data) as CreateProjectInput
      
      return await this.projectRepository.create(sanitizedData)
    } catch (error) {
      this.handleError(error, 'ProjectService.createProject')
    }
  }

  async getProjectById(id: string, userId: string): Promise<ProjectWithStats> {
    try {
      const project = await this.projectRepository.findById(id)
      if (!project) {
        throw new Error('Project not found')
      }
      
      this.validateUserAccess(project.userId, userId)
      return project
    } catch (error) {
      this.handleError(error, 'ProjectService.getProjectById')
    }
  }

  async updateProject(id: string, data: UpdateProjectInput, userId: string): Promise<ProjectWithStats> {
    try {
      const existingProject = await this.projectRepository.findById(id)
      if (!existingProject) {
        throw new Error('Project not found')
      }
      
      this.validateUserAccess(existingProject.userId, userId)
      
      const sanitizedData = this.sanitizeInput(data) as UpdateProjectInput
      
      return await this.projectRepository.update(id, sanitizedData)
    } catch (error) {
      this.handleError(error, 'ProjectService.updateProject')
    }
  }

  async deleteProject(id: string, userId: string): Promise<ProjectWithStats> {
    try {
      const existingProject = await this.projectRepository.findById(id)
      if (!existingProject) {
        throw new Error('Project not found')
      }
      
      this.validateUserAccess(existingProject.userId, userId)
      
      return await this.projectRepository.delete(id)
    } catch (error) {
      this.handleError(error, 'ProjectService.deleteProject')
    }
  }

  async getUserProjects(userId: string, includeInactive: boolean = false): Promise<ProjectWithStats[]> {
    try {
      return await this.projectRepository.findByUserId(userId, includeInactive)
    } catch (error) {
      this.handleError(error, 'ProjectService.getUserProjects')
    }
  }

  async getActiveUserProjects(userId: string): Promise<ProjectWithStats[]> {
    try {
      return await this.projectRepository.findActiveByUserId(userId)
    } catch (error) {
      this.handleError(error, 'ProjectService.getActiveUserProjects')
    }
  }

  async toggleProjectStatus(id: string, userId: string): Promise<ProjectWithStats> {
    try {
      const existingProject = await this.projectRepository.findById(id)
      if (!existingProject) {
        throw new Error('Project not found')
      }
      
      this.validateUserAccess(existingProject.userId, userId)
      
      return await this.projectRepository.update(id, {
        isActive: !existingProject.isActive
      })
    } catch (error) {
      this.handleError(error, 'ProjectService.toggleProjectStatus')
    }
  }
}
