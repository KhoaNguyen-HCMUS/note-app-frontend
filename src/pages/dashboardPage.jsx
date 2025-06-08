import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDashboard } from '../hooks/useDashboard';

import {
  FaStickyNote,
  FaTasks,
  FaPlus,
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaCalendarAlt,
} from 'react-icons/fa';
import axiosClient from '../api/axiosClient';
import { toast } from 'react-toastify';
import AddNoteModal from '../components/common/notes/addNoteModal';
import AddTaskModal from '../components/common/tasks/addTaskModal';
import LoadingSpinner from '../components/common/loadingSpinner';
import StatCard from '../components/common/dashboard/statCard';
import QuickActionCard from '../components/common/dashboard/quickActionCard';
import RecentNotes from '../components/common/dashboard/recentNotes';
import RecentTasks from '../components/common/dashboard/recentTasks';
import UpcomingTasks from '../components/common/dashboard/upcomingTasks';

const DashboardPage = () => {
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const { t } = useTranslation();
  const navigate = useNavigate();

  const { stats, recentNotes, recentTasks, upcomingTasks, loading, refetch } = useDashboard();

  const handleAddNote = async (noteData) => {
    try {
      await axiosClient.post('/notes', noteData);
      setShowAddNoteModal(false);
      toast.success(t('notes.success.noteCreated'));
      await refetch();
    } catch (err) {
      console.error('Error adding note:', err);
      toast.error(t('notes.errors.addError'));
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await axiosClient.post('/tasks', taskData);
      setShowAddTaskModal(false);
      toast.success(t('tasks.success.taskCreated'));
      await refetch();
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error(t('tasks.errors.addError'));
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
          <RecentNotes recentNotes={recentNotes} />

          <RecentTasks recentTasks={recentTasks} />

          <UpcomingTasks upcomingTasks={upcomingTasks} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
