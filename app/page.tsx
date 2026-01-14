'use client';

import { useState } from 'react';

type TaskStatus = 'Pending' | 'Running' | 'Completed';

interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
}

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  subTasks: SubTask[];
  isExpanded: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingSubTaskId, setEditingSubTaskId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      status: 'Pending',
      subTasks: [],
      isExpanded: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
    setEditingSubTaskId(null);
  };

  const saveTaskEdit = (taskId: string) => {
    if (!editingTitle.trim()) return;
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, title: editingTitle } : task
    ));
    setEditingTaskId(null);
    setEditingTitle('');
  };

  const toggleTaskExpanded = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isExpanded: !task.isExpanded } : task
    ));
  };

  const addSubTask = (taskId: string, subTaskTitle: string) => {
    if (!subTaskTitle.trim()) return;
    const newSubTask: SubTask = {
      id: Date.now().toString(),
      title: subTaskTitle,
      status: 'Pending',
    };
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subTasks: [...task.subTasks, newSubTask] }
        : task
    ));
  };

  const deleteSubTask = (taskId: string, subTaskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? { ...task, subTasks: task.subTasks.filter(st => st.id !== subTaskId) }
        : task
    ));
  };

  const updateSubTaskStatus = (taskId: string, subTaskId: string, status: TaskStatus) => {
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.map(st =>
              st.id === subTaskId ? { ...st, status } : st
            ),
          }
        : task
    ));
  };

  const startEditingSubTask = (subTask: SubTask) => {
    setEditingSubTaskId(subTask.id);
    setEditingTitle(subTask.title);
    setEditingTaskId(null);
  };

  const saveSubTaskEdit = (taskId: string, subTaskId: string) => {
    if (!editingTitle.trim()) return;
    setTasks(tasks.map(task =>
      task.id === taskId
        ? {
            ...task,
            subTasks: task.subTasks.map(st =>
              st.id === subTaskId ? { ...st, title: editingTitle } : st
            ),
          }
        : task
    ));
    setEditingSubTaskId(null);
    setEditingTitle('');
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'Running':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
      case 'Completed':
        return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">TODO管理アプリ</h1>

        {/* Add Task */}
        <div className="mb-8 flex gap-2">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="新しいタスクを入力..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            追加
          </button>
        </div>

        {/* Task List */}
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTaskExpanded(task.id)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  {task.isExpanded ? '▼' : '▶'}
                </button>

                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && saveTaskEdit(task.id)}
                    onBlur={() => saveTaskEdit(task.id)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-1 text-lg font-medium ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-black dark:text-white'}`}
                    onDoubleClick={() => startEditingTask(task)}
                  >
                    {task.title}
                  </span>
                )}

                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Running">Running</option>
                  <option value="Completed">Completed</option>
                </select>

                <button
                  onClick={() => startEditingTask(task)}
                  className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  編集
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                >
                  削除
                </button>
              </div>

              {/* SubTasks */}
              {task.isExpanded && (
                <div className="mt-4 ml-8 space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="サブタスクを追加..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = e.target as HTMLInputElement;
                          addSubTask(task.id, input.value);
                          input.value = '';
                        }
                      }}
                      className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {task.subTasks.map(subTask => (
                    <div key={subTask.id} className="flex items-center gap-3 pl-4 border-l-2 border-gray-300 dark:border-gray-700">
                      {editingSubTaskId === subTask.id ? (
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && saveSubTaskEdit(task.id, subTask.id)}
                          onBlur={() => saveSubTaskEdit(task.id, subTask.id)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                          autoFocus
                        />
                      ) : (
                        <span
                          className={`flex-1 text-sm ${subTask.status === 'Completed' ? 'line-through text-gray-500' : 'text-black dark:text-white'}`}
                          onDoubleClick={() => startEditingSubTask(subTask)}
                        >
                          {subTask.title}
                        </span>
                      )}

                      <select
                        value={subTask.status}
                        onChange={(e) => updateSubTaskStatus(task.id, subTask.id, e.target.value as TaskStatus)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subTask.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Running">Running</option>
                        <option value="Completed">Completed</option>
                      </select>

                      <button
                        onClick={() => startEditingSubTask(subTask)}
                        className="px-2 py-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => deleteSubTask(task.id, subTask.id)}
                        className="px-2 py-1 text-xs text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        削除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
            タスクがありません。上のフィールドから新しいタスクを追加してください。
          </div>
        )}
      </div>
    </div>
  );
}
