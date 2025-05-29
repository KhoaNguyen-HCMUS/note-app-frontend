import { useState } from 'react';
import { FaEdit, FaTrash, FaClock, FaUser, FaUsers, FaFlag } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import axiosClient from '../../../api/axiosClient';

const TaskCard = ({ task, onUpdate, onEdit, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-green-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[priority] || 'text-gray-600';
  };

  const handleDelete = async () => {
    if (!window.confirm(t('tasks.confirmDelete'))) return;

    setLoading(true);
    try {
      await axiosClient.delete(`/tasks/${task._id}`);
      onUpdate();
      toast.success(t('tasks.success.taskDeleted'));
    } catch {
      toast.error(t('tasks.errors.deleteError'));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    onStatusUpdate(task._id, newStatus);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'completed' && task.status !== 'cancelled';
  };

  return (
    <div className='bg-card-bg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-border-light'>
      <div className='p-6'>
        {/* Header */}
        <div className='flex justify-between items-start mb-4'>
          <div className='flex-1 mr-4'>
            <h3 className='text-xl font-semibold text-text-header mb-2 line-clamp-2'>{task.title}</h3>
            <p className='text-text-body text-sm line-clamp-3 mb-3'>{task.description}</p>
          </div>

          {/* Priority Flag */}
          <div className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
            <FaFlag className='text-xs' />
            <span className='text-xs font-medium capitalize'>{task.priority}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className='mb-4'>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all duration-300 ${getStatusColor(
              task.status
            )}`}
          >
            <option value='pending'>{t('tasks.status.pending')}</option>
            <option value='in-progress'>{t('tasks.status.inProgress')}</option>
            <option value='completed'>{t('tasks.status.completed')}</option>
            <option value='cancelled'>{t('tasks.status.cancelled')}</option>
          </select>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div
            className={`flex items-center gap-2 mb-3 text-sm ${
              isOverdue(task.dueDate) ? 'text-red-600' : 'text-text-header'
            }`}
          >
            <FaClock className='text-xs' />
            <span>
              {t('tasks.dueDate')}: {formatDate(task.dueDate)}
              {isOverdue(task.dueDate) && <span className='ml-2 text-red-600 font-medium'>({t('tasks.overdue')})</span>}
            </span>
          </div>
        )}

        {/* Owner */}
        <div className='flex items-center gap-2 mb-3 text-sm text-text-header'>
          <FaUser className='text-xs' />
          <span>
            {t('tasks.owner')}: {task.user?.username || 'Unknown'}
          </span>
        </div>

        {/* Collaborators */}
        {task.collaborators && task.collaborators.length > 0 && (
          <div className='flex items-center gap-2 mb-4 text-sm text-text-header'>
            <FaUsers className='text-xs' />
            <span>
              {task.collaborators.length} {t('tasks.collaborators')}
            </span>
          </div>
        )}

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className='flex flex-wrap gap-1 mb-4'>
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className='px-2 py-1 bg-indigo-100 dark:bg-gray-600/50 text-primary text-xs rounded-full'
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className='flex justify-end gap-2 pt-4 border-t border-border-light'>
          <button
            onClick={() => onEdit(task)}
            className='cursor-pointer flex items-center px-3 py-1.5 text-button-bg border button-bg rounded hover:bg-button-hover-light transition-colors disabled:opacity-50'
          >
            <FaEdit className='text-xs' />
            <span className='text-sm'>{t('common.edit')}</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={loading}
            className='cursor-pointer flex items-center px-3 py-1.5 text-button-red-bg  border border-button-red-bg  rounded hover:bg-button-red-hover-light transition-colors disabled:opacity-50'
          >
            <FaTrash className='text-xs' />
            <span className='text-sm'>{t('common.delete')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
