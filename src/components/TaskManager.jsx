// TaskManager.jsx
import React, { useState, useEffect } from 'react';
import Button from './Button';

const useLocalStorageTasks = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (text) => {
    if (text.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text,
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return { tasks, addTask, toggleTask, deleteTask };
};

const useApiData = () => {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5');
      if (!response.ok) throw new Error('Failed to fetch data');
      const data = await response.json();
      setApiData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { apiData, loading, error, fetchData };
};

const TaskManager = () => {
  const { tasks, addTask, toggleTask, deleteTask } = useLocalStorageTasks();
  const { apiData, loading, error, fetchData } = useApiData();
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState('all');

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(newTaskText);
    setNewTaskText('');
  };

  return (
    <div className="space-y-8">
      {/* Task Manager Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              My Tasks
            </h2>
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
              {tasks.filter(t => !t.completed).length} remaining
            </span>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex gap-3">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="What needs to be done?"
                className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
              />
              <Button 
                type="submit" 
                variant="primary"
                className="px-6 py-3 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button
              variant={filter === 'all' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('all')}
              className="flex-1 sm:flex-none"
            >
              All ({tasks.length})
            </Button>
            <Button
              variant={filter === 'active' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('active')}
              className="flex-1 sm:flex-none"
            >
              Active ({tasks.filter(t => !t.completed).length})
            </Button>
            <Button
              variant={filter === 'completed' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFilter('completed')}
              className="flex-1 sm:flex-none"
            >
              Completed ({tasks.filter(t => t.completed).length})
            </Button>
          </div>

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                  {filter === 'all' 
                    ? "No tasks yet"
                    : filter === 'active'
                    ? "All tasks completed!"
                    : "No completed tasks yet"}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {filter === 'all' 
                    ? "Get started by adding your first task above"
                    : filter === 'active'
                    ? "You've completed all your tasks. Great work!"
                    : "Completed tasks will appear here"}
                </p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-200 ${
                    task.completed 
                      ? 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600' 
                      : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        task.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-500 hover:border-indigo-500'
                      }`}
                    >
                      {task.completed && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`${
                        task.completed 
                          ? 'line-through text-gray-500 dark:text-gray-400' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {task.text}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTask(task.id)}
                    aria-label="Delete task"
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* API Integration Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Sample Tasks from API
            </h2>
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              JSONPlaceholder
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Button 
                onClick={fetchData} 
                variant="primary"
                disabled={loading}
                className="flex items-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Fetch Sample Tasks
                  </>
                )}
              </Button>
              {apiData && (
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => setApiData(null)}
                >
                  Clear
                </Button>
              )}
            </div>
            
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-200">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Error: {error}</span>
                </div>
              </div>
            )}

            {apiData && (
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {apiData.length} sample tasks from JSONPlaceholder API:
                </p>
                {apiData.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center p-4 rounded-lg border transition-all duration-200 ${
                      item.completed 
                        ? 'bg-gray-50 border-gray-200 dark:bg-gray-700/50 dark:border-gray-600' 
                        : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-grow">
                      <span className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center ${
                        item.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 dark:border-gray-500'
                      }`}>
                        {item.completed && (
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                      <span className={`${
                        item.completed 
                          ? 'line-through text-gray-500 dark:text-gray-400' 
                          : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {item.title}
                      </span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300">
                      #{item.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;