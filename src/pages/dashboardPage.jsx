/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaStickyNote,
  FaTasks,
  FaPlus,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
  FaUser,
  FaArrowRight,
  FaSpinner,
} from 'react-icons/fa';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import AddNoteModal from '../components/common/notes/addNoteModal';
import AddTaskModal from '../components/common/tasks/addTaskModal';
import LoadingSpinner from '../components/common/loadingSpinner';
import StatCard from '../components/common/dashboard/statCard';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalTasks: 0,
    pendingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    todayTasks: 0,
  });
  const [recentNotes, setRecentNotes] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch notes and tasks data
      const [notesResponse, tasksResponse] = await Promise.all([axiosClient.get('/notes'), axiosClient.get('/tasks')]);

      const notes = notesResponse.data || [];
      const tasks = tasksResponse.data || [];

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const pendingTasks = tasks.filter((task) => task.status === 'pending').length;
      const completedTasks = tasks.filter((task) => task.status === 'completed').length;
      const overdueTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate < today && task.status !== 'completed' && task.status !== 'cancelled';
      }).length;

      const todayTasks = tasks.filter((task) => {
        if (!task.dueDate) return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate < tomorrow;
      }).length;

      setStats({
        totalNotes: notes.length,
        totalTasks: tasks.length,
        pendingTasks,
        completedTasks,
        overdueTasks,
        todayTasks,
      });

      // Get recent items (last 5)
      setRecentNotes(notes.slice(0, 5));
      setRecentTasks(tasks.slice(0, 5));

      // Get upcoming tasks (next 7 days)
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);

      const upcoming = tasks
        .filter((task) => {
          if (!task.dueDate || task.status === 'completed') return false;
          const dueDate = new Date(task.dueDate);
          return dueDate >= today && dueDate <= nextWeek;
        })
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);

      setUpcomingTasks(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle Add Note
  const handleAddNote = async (noteData) => {
    try {
      await axiosClient.post('/notes', noteData);
      setShowAddNoteModal(false);
      toast.success(t('notes.success.noteCreated'));
      await fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error adding note:', err);
      toast.error(t('notes.errors.addError'));
    }
  };

  // Handle Add Task
  const handleAddTask = async (taskData) => {
    try {
      await axiosClient.post('/tasks', taskData);
      setShowAddTaskModal(false);
      toast.success(t('tasks.success.taskCreated'));
      await fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error(t('tasks.errors.addError'));
    }
  };

  const QuickActionCard = ({ icon: Icon, title, description, color, onClick }) => (
    <div
      className='bg-card-bg border border-border-light rounded-xl p-6 cursor-pointer hover:shadow-lg transition-all duration-300 hover:border-indigo-300'
      onClick={onClick}
    >
      <div className='flex items-center mb-4'>
        <div className={`p-3 rounded-full ${color} bg-opacity-20 mr-4`}>
          <Icon className={`text-xl ${color}`} />
        </div>
        <div>
          <h3 className='font-semibold text-primary'>{title}</h3>
          <p className='text-sm text-text-body'>{description}</p>
        </div>
      </div>
      <div className='flex items-center text-button-bg text-sm font-medium'>
        {t('dashboard.quickActions')} <FaArrowRight className='ml-2' />
      </div>
    </div>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('tasks.today');
    if (diffDays === 1) return t('tasks.tomorrow');
    if (diffDays === -1) return t('tasks.yesterday');
    if (diffDays < 0) return `${Math.abs(diffDays)} ${t('tasks.daysOverdue')}`;
    return `${diffDays} ${t('tasks.daysLeft')}`;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-text-body';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in-progress':
        return 'text-blue-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-text-body';
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className='w-full min-h-screen bg-linear-(--gradient-primary)'>
      <div className='container mx-auto px-4 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-primary mb-2'>{t('dashboard.welcome')}</h1>
          <p className='text-text-body'>{t('dashboard.subtitle')}</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
          <StatCard
            icon={FaStickyNote}
            title={t('dashboard.totalNotes')}
            value={stats.totalNotes}
            color='text-blue-600'
            bgColor='bg-card-bg'
            onClick={() => navigate('/notes')}
          />
          <StatCard
            icon={FaTasks}
            title={t('dashboard.totalTasks')}
            value={stats.totalTasks}
            color='text-indigo-600'
            bgColor='bg-card-bg'
            onClick={() => navigate('/tasks')}
          />
          <StatCard
            icon={FaClock}
            title={t('dashboard.pendingTasks')}
            value={stats.pendingTasks}
            color='text-yellow-600'
            bgColor='bg-card-bg'
            onClick={() => navigate('/tasks?status=pending')}
          />
          <StatCard
            icon={FaCheckCircle}
            title={t('dashboard.completedTasks')}
            value={stats.completedTasks}
            color='text-green-600'
            bgColor='bg-card-bg'
            onClick={() => navigate('/tasks?status=completed')}
          />
        </div>

        {/* Additional Stats */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <StatCard
            icon={FaExclamationCircle}
            title={t('dashboard.overdueTasks')}
            value={stats.overdueTasks}
            color='text-red-600'
            bgColor='bg-card-bg'
            onClick={() => navigate('/tasks')}
          />
          <StatCard
            icon={FaCalendarAlt}
            title={t('dashboard.todayTasks')}
            value={stats.todayTasks}
            color='text-purple-600'
            bgColor='bg-card-bg'
            onClick={() => navigate('/tasks')}
          />
        </div>

        {/* Quick Actions */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <QuickActionCard
            icon={FaPlus}
            title={t('dashboard.createNote')}
            description={t('dashboard.createNoteDesc')}
            color='text-blue-600'
            onClick={() => setShowAddNoteModal(true)}
          />
          <QuickActionCard
            icon={FaPlus}
            title={t('dashboard.createTask')}
            description={t('dashboard.createTaskDesc')}
            color='text-indigo-600'
            onClick={() => setShowAddTaskModal(true)}
          />
        </div>

        <AddNoteModal show={showAddNoteModal} onClose={() => setShowAddNoteModal(false)} onSubmit={handleAddNote} />

        <AddTaskModal show={showAddTaskModal} onClose={() => setShowAddTaskModal(false)} onSubmit={handleAddTask} />

        {/* Content Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Recent Notes */}
          <div className='bg-card-bg border border-border-light rounded-xl p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-primary flex items-center'>
                <FaStickyNote className='mr-2 text-blue-600' />
                {t('dashboard.recentNotes')}
              </h2>
              <button
                onClick={() => navigate('/notes')}
                className='cursor-pointer text-button-bg hover:text-button-hover text-sm font-medium transition-colors'
              >
                {t('dashboard.viewAll')}
              </button>
            </div>
            <div className='space-y-3'>
              {recentNotes.length > 0 ? (
                recentNotes.map((note) => (
                  <div
                    key={note._id}
                    className='p-3 bg-card-bg border border-border-light rounded-lg hover:shadow-md transition-all cursor-pointer'
                  >
                    <h3 className='font-medium text-primary truncate'>{note.title}</h3>
                    <p className='text-sm text-text-body mt-1 line-clamp-2'>{note.content}</p>
                    <div className='flex items-center justify-between mt-2'>
                      <div className='flex flex-wrap gap-1'>
                        {note.tags?.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className='px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs rounded'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className='text-xs text-text-body'>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-text-body text-center py-8'>{t('dashboard.noRecentNotes')}</p>
              )}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className='bg-card-bg border border-border-light rounded-xl p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-primary flex items-center'>
                <FaTasks className='mr-2 text-indigo-600' />
                {t('dashboard.recentTasks')}
              </h2>
              <button
                onClick={() => navigate('/tasks')}
                className='cursor-pointer text-button-bg hover:text-button-hover text-sm font-medium transition-colors'
              >
                {t('dashboard.viewAll')}
              </button>
            </div>
            <div className='space-y-3'>
              {recentTasks.length > 0 ? (
                recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className='p-3 bg-card-bg border border-border-light rounded-lg hover:shadow-md transition-all cursor-pointer'
                  >
                    <h3 className='font-medium text-primary truncate'>{task.title}</h3>
                    <p className='text-sm text-text-body mt-1 line-clamp-2'>{task.description}</p>
                    <div className='flex items-center justify-between mt-2'>
                      <div className='flex items-center gap-2'>
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)} bg-opacity-20`}>
                          {t(`tasks.status.${task.status}`)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)} bg-opacity-20`}>
                          {t(`tasks.priority.${task.priority}`)}
                        </span>
                      </div>
                      {task.dueDate && <span className='text-xs text-text-body'>{formatDate(task.dueDate)}</span>}
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-text-body text-center py-8'>{t('dashboard.noRecentTasks')}</p>
              )}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className='bg-card-bg border border-border-light rounded-xl p-6'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-primary flex items-center'>
                <FaCalendarAlt className='mr-2 text-purple-600' />
                {t('dashboard.upcomingTasks')}
              </h2>
              <button
                onClick={() => navigate('/tasks')}
                className='cursor-pointer text-button-bg hover:text-button-hover text-sm font-medium transition-colors'
              >
                {t('dashboard.viewAll')}
              </button>
            </div>
            <div className='space-y-3'>
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => (
                  <div
                    key={task._id}
                    className='p-3 bg-card-bg border border-border-light rounded-lg hover:shadow-md transition-all cursor-pointer'
                  >
                    <h3 className='font-medium text-primary truncate'>{task.title}</h3>
                    <div className='flex items-center justify-between mt-2'>
                      <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)} bg-opacity-20`}>
                        {t(`tasks.priority.${task.priority}`)}
                      </span>
                      <span className='text-xs text-red-600 font-medium'>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className='text-text-body text-center py-8'>{t('dashboard.noUpcomingTasks')}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
