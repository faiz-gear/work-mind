'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'
import { useCreateTask, useTasks } from '@/hooks/useTasks'
import { TaskStatus, Priority } from '@prisma/client'

export default function TestPage() {
  const { user } = useUser()
  const [testResult, setTestResult] = useState<string>('')
  
  const createTaskMutation = useCreateTask()
  const { data: tasksData, refetch: refetchTasks } = useTasks({
    userId: user?.id || ''
  })

  const runBasicTest = async () => {
    setTestResult('Running tests...\n')
    
    try {
      // Test 1: Create a task
      setTestResult(prev => prev + '✓ Testing task creation...\n')
      const newTask = await createTaskMutation.mutateAsync({
        title: 'Test Task ' + Date.now(),
        description: 'This is a test task created by the test suite',
        status: TaskStatus.PENDING,
        priority: Priority.MEDIUM,
        userId: user?.id || '',
      })
      setTestResult(prev => prev + `✓ Task created successfully: ${newTask.data.title}\n`)

      // Test 2: Fetch tasks
      setTestResult(prev => prev + '✓ Testing task retrieval...\n')
      await refetchTasks()
      setTestResult(prev => prev + `✓ Tasks retrieved successfully: ${tasksData?.total || 0} tasks found\n`)

      // Test 3: API connectivity
      setTestResult(prev => prev + '✓ Testing API connectivity...\n')
      const response = await fetch('/api/tasks/stats?userId=' + user?.id)
      if (response.ok) {
        const stats = await response.json()
        setTestResult(prev => prev + `✓ API working: ${JSON.stringify(stats.data)}\n`)
      } else {
        throw new Error('API request failed')
      }

      setTestResult(prev => prev + '\n🎉 All tests passed!\n')
    } catch (error) {
      setTestResult(prev => prev + `❌ Test failed: ${error}\n`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">WorkMind Test Suite</h1>
        
        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">User Information</h2>
          <div className="space-y-2">
            <p><strong>User ID:</strong> {user?.id}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Name:</strong> {user?.name}</p>
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <button
            onClick={runBasicTest}
            disabled={createTaskMutation.isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {createTaskMutation.isPending ? 'Running Tests...' : 'Run Basic Tests'}
          </button>
        </div>

        {/* Test Results */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap font-mono">
            {testResult || 'No tests run yet. Click "Run Basic Tests" to start.'}
          </pre>
        </div>

        {/* Current Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current Tasks</h2>
          {tasksData?.data?.length > 0 ? (
            <div className="space-y-2">
              {tasksData.data.map((task: any) => (
                <div key={task.id} className="border rounded p-3">
                  <h3 className="font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No tasks found.</p>
          )}
        </div>
      </div>
    </div>
  )
}
