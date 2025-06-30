export default function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-base-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">WorkMind Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">Total Tasks</h2>
              <div className="stat-value text-3xl">0</div>
              <div className="stat-desc">No tasks yet</div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">Completed</h2>
              <div className="stat-value text-3xl text-success">0</div>
              <div className="stat-desc">0% completion rate</div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">In Progress</h2>
              <div className="stat-value text-3xl text-info">0</div>
              <div className="stat-desc">Active tasks</div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-lg">Time Spent</h2>
              <div className="stat-value text-3xl">0h</div>
              <div className="stat-desc">This week</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Quick Actions</h2>
              <div className="space-y-2">
                <button className="btn btn-primary btn-block">+ New Task</button>
                <button className="btn btn-secondary btn-block">+ New Project</button>
                <button className="btn btn-accent btn-block">📊 Generate Summary</button>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Recent Activity</h2>
              <p className="text-base-content/70">
                No recent activity. Start by creating your first task!
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">Get Started</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
