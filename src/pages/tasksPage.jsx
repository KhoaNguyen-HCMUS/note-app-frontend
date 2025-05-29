import { useEffect, useState } from 'react';
import { FaPlus, FaSearch, FaSpinner, FaFilter, FaSort } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';

import TaskCard from '../components/common/tasks/taskCard.jsx';
import TaskFilters from '../components/common/tasks/taskFilters.jsx';
import axiosClient from '../api/axiosClient';
import EmptyTasks from '../components/common/tasks/emptyTasks';
import AddTaskModal from '../components/common/tasks/addTaskModal';
import EditTaskModal from '../components/common/tasks/editTaskModal';
import TaskStatsCards from '../components/common/tasks/taskStatsCards';

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [searching, setSearching] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 500);
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [priorityFilter, setPriorityFilter] = useState(searchParams.get('priority') || '');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const { t } = useTranslation();

  const fetchTasks = async () => {
    if (initialLoading || statusFilter || priorityFilter) setInitialLoading(true);
    else setSearching(true);

    try {
      const params = new URLSearchParams();
      if (keyword) params.append('keyword', keyword);
      if (statusFilter) params.append('status', statusFilter);
      if (priorityFilter) params.append('priority', priorityFilter);

      const res = await axiosClient.get(`/tasks?${params.toString()}`);
      const tasksData = res.data?.data || res.data;

      if (Array.isArray(tasksData)) {
        setTasks(tasksData);
      } else {
        setTasks([]);
        setError(t('tasks.errors.invalidFormat'));
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(t('tasks.errors.fetchError'));
      setTasks([]);
    } finally {
      setInitialLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (debouncedKeyword) params.set('keyword', debouncedKeyword);
    else params.delete('keyword');
    if (statusFilter) params.set('status', statusFilter);
    else params.delete('status');
    if (priorityFilter) params.set('priority', priorityFilter);
    else params.delete('priority');
    setSearchParams(params);
  }, [debouncedKeyword, statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [debouncedKeyword, statusFilter, priorityFilter]);

  const handleAddTask = async (taskData) => {
    try {
      const response = await axiosClient.post('/tasks', taskData);
      setTasks([response.data, ...tasks]);
      setShowModal(false);
      toast.success(t('tasks.success.taskCreated'));
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error(t('tasks.errors.addError'));
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (updatedTask) => {
    try {
      await axiosClient.put(`/tasks/${selectedTask._id}`, updatedTask);
      await fetchTasks();
      setShowEditModal(false);
      setSelectedTask(null);
      toast.success(t('tasks.success.taskUpdated'));
    } catch (err) {
      toast.error(t('tasks.errors.updateError'));
      console.error('Error updating task:', err);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      await axiosClient.put(`/tasks/${taskId}/status`, { status: newStatus });
      await fetchTasks();
      toast.success(t('tasks.success.statusUpdated'));
    } catch (err) {
      toast.error(t('tasks.errors.statusUpdateError'));
      console.error('Error updating task status:', err);
    }
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'createdAt' || sortBy === 'dueDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getTaskStats = () => {
    return {
      total: tasks.length,
      pending: tasks.filter((task) => task.status === 'pending').length,
      inProgress: tasks.filter((task) => task.status === 'in-progress').length,
      completed: tasks.filter((task) => task.status === 'completed').length,
    };
  };

  if (initialLoading) {
    return (
      <div className='bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex flex-col items-center justify-center'>
        <div className='flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-lg'>
          <FaSpinner className='text-indigo-600 animate-spin text-2xl' />
          <span className='text-gray-700 text-xl font-medium'>{t('tasks.loading')}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='container mx-auto mt-8 px-4'>
        <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg'>{error}</div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header Section */}
        <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4'>
          <div>
            <h1 className='text-4xl font-bold text-gray-800 mb-2'>{t('tasks.title')}</h1>
            <p className='text-gray-600'>{t('tasks.subtitle')}</p>
          </div>
          <button
            className='flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            onClick={() => setShowModal(true)}
          >
            <FaPlus className='text-sm' />
            {t('tasks.addButton')}
          </button>
        </div>

        {/* Stats Cards */}
        <TaskStatsCards stats={getTaskStats()} />

        {/* Search and Filters Section */}
        <div className='bg-white rounded-xl shadow-lg p-6 mb-8'>
          <div className='flex flex-col lg:flex-row gap-4 mb-4'>
            {/* Search Input */}
            <div className='flex-1 relative'>
              <input
                type='text'
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={t('tasks.searchPlaceholder')}
                className='w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300'
              />
              {searching ? (
                <FaSpinner className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 animate-spin' />
              ) : (
                <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400' />
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all duration-300 ${
                showFilters
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
              }`}
            >
              <FaFilter className='text-sm' />
              {t('tasks.filter')}
            </button>

            {/* Sort Dropdown */}
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortBy(field);
                setSortOrder(order);
              }}
              className='px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            >
              <option value='createdAt-desc'>{t('tasks.sort.newest')}</option>
              <option value='createdAt-asc'>{t('tasks.sort.oldest')}</option>
              <option value='dueDate-asc'>{t('tasks.sort.dueDateAsc')}</option>
              <option value='dueDate-desc'>{t('tasks.sort.dueDateDesc')}</option>
              <option value='title-asc'>{t('tasks.sort.titleAsc')}</option>
              <option value='title-desc'>{t('tasks.sort.titleDesc')}</option>
            </select>
          </div>

          {/* Expandable Filters */}
          {showFilters && (
            <TaskFilters
              statusFilter={statusFilter}
              priorityFilter={priorityFilter}
              onStatusChange={setStatusFilter}
              onPriorityChange={setPriorityFilter}
            />
          )}
        </div>

        {/* Tasks Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onUpdate={fetchTasks}
                onEdit={() => handleEditClick(task)}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          ) : (
            <div className='col-span-full'>
              <EmptyTasks />
            </div>
          )}
        </div>

        {/* Modals */}
        <AddTaskModal show={showModal} onClose={() => setShowModal(false)} onSubmit={handleAddTask} />

        <EditTaskModal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onSubmit={handleEditSubmit}
        />
      </div>
    </div>
  );
}
