import { openai } from '@ai-sdk/openai'
import { generateText, streamText } from 'ai'

// AI 配置
const model = openai('gpt-3.5-turbo')

// 任务总结生成
export async function generateTaskSummary(tasks: any[], period: 'daily' | 'weekly' | 'monthly') {
  const taskData = tasks.map((task) => ({
    title: task.title,
    status: task.status,
    priority: task.priority,
    duration: task.duration,
    project: task.project?.name,
    tags: task.tags.map((tag: any) => tag.name)
  }))

  const prompt = `
    Generate a comprehensive ${period} work summary based on the following tasks:
    
    ${JSON.stringify(taskData, null, 2)}
    
    Please provide:
    1. Overview of completed tasks
    2. Time spent analysis
    3. Productivity insights
    4. Areas for improvement
    5. Recommendations for next ${period === 'daily' ? 'day' : period === 'weekly' ? 'week' : 'month'}
    
    Format the response in a clear, professional manner with bullet points and sections.
  `

  try {
    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 1000
    })

    return text
  } catch (error) {
    console.error('Error generating task summary:', error)
    throw new Error('Failed to generate task summary')
  }
}

// 智能任务建议
export async function generateTaskSuggestions(context: { recentTasks: any[]; projects: any[]; userPreferences?: any }) {
  const prompt = `
    Based on the user's recent work patterns and projects, suggest 3-5 relevant tasks they might want to work on:
    
    Recent Tasks:
    ${JSON.stringify(context.recentTasks.slice(0, 10), null, 2)}
    
    Active Projects:
    ${JSON.stringify(context.projects, null, 2)}
    
    Please suggest tasks that are:
    1. Relevant to their current projects
    2. Follow logical work progression
    3. Consider priority and deadlines
    4. Are actionable and specific
    
    Format each suggestion as:
    - Title: [Task title]
    - Project: [Project name if applicable]
    - Priority: [High/Medium/Low]
    - Reason: [Why this task is suggested]
  `

  try {
    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 800
    })

    return text
  } catch (error) {
    console.error('Error generating task suggestions:', error)
    throw new Error('Failed to generate task suggestions')
  }
}

// 聊天助手
export async function createChatCompletion(messages: any[]) {
  const systemMessage = {
    role: 'system',
    content: `You are WorkMind AI, an intelligent assistant for productivity and task management. 
    You help users:
    - Organize and prioritize their tasks
    - Provide productivity insights
    - Suggest improvements to their workflow
    - Answer questions about time management and productivity
    
    Be helpful, concise, and actionable in your responses. Focus on practical advice.`
  }

  try {
    const result = await streamText({
      model,
      messages: [systemMessage, ...messages],
      maxTokens: 500
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error in chat completion:', error)
    throw new Error('Failed to process chat message')
  }
}

// 工作模式分析
export async function analyzeWorkPatterns(tasks: any[], timeframe: number = 30) {
  const prompt = `
    Analyze the following work patterns and provide insights:
    
    Tasks from the last ${timeframe} days:
    ${JSON.stringify(tasks, null, 2)}
    
    Please analyze:
    1. Most productive time periods
    2. Task completion patterns
    3. Project focus areas
    4. Potential bottlenecks
    5. Recommendations for optimization
    
    Provide actionable insights in a structured format.
  `

  try {
    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 800
    })

    return text
  } catch (error) {
    console.error('Error analyzing work patterns:', error)
    throw new Error('Failed to analyze work patterns')
  }
}

// 优先级建议
export async function suggestTaskPriorities(tasks: any[]) {
  const prompt = `
    Review these tasks and suggest priority adjustments:
    
    ${JSON.stringify(tasks, null, 2)}
    
    Consider:
    1. Deadlines and urgency
    2. Project dependencies
    3. Task complexity and duration
    4. Business impact
    
    Suggest which tasks should be:
    - High priority (urgent and important)
    - Medium priority (important but not urgent)
    - Low priority (nice to have)
    
    Explain your reasoning for each suggestion.
  `

  try {
    const { text } = await generateText({
      model,
      prompt,
      maxTokens: 600
    })

    return text
  } catch (error) {
    console.error('Error suggesting task priorities:', error)
    throw new Error('Failed to suggest task priorities')
  }
}
