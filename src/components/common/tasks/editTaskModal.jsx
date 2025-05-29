import { useState, useEffect } from 'react';
import { FaTimes, FaCalendar, FaFlag, FaTags, FaUsers } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const EditTaskModal = ({ show, onClose, task, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'medium',
    dueDate: '',
    tags: '',
    collaborators: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    if (task && show) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
        tags: task.tags ? task.tags.join(', ') : '',
        collaborators: task.collaborators || [],
      });
      setErrors({});
    }
  }, [task, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t('tasks.form.title.required');
    }

    if (!formData.description.trim()) {
      newErrors.description = t('tasks.form.description.required');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const taskData = {
        ...formData,
        tags: formData.tags
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag)
          : [],
        dueDate: formData.dueDate || null,
      };

      await onSubmit(taskData);
    } catch (err) {
      console.error('Error in form submission:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  if (!show || !task) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
          <h2 className='text-2xl font-bold text-gray-800'>{t('editTaskModal.title')}</h2>
          <button onClick={handleClose} className='p-2 hover:bg-gray-100 rounded-lg transition-colors'>
            <FaTimes className='text-gray-500' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-6'>
            {/* Title */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>{t('tasks.form.title.label')} *</label>
              <input
                type='text'
                name='title'
                value={formData.title}
                onChange={handleChange}
                placeholder={t('tasks.form.title.placeholder')}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {t('tasks.form.description.label')} *
              </label>
              <textarea
                name='description'
                value={formData.description}
                onChange={handleChange}
                placeholder={t('tasks.form.description.placeholder')}
                rows={4}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
            </div>

            {/* Status and Priority Row */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Status */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                  <FaFlag className='text-indigo-600' />
                  {t('tasks.form.status.label')}
                </label>
                <select
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                >
                  <option value='pending'>{t('tasks.status.pending')}</option>
                  <option value='in-progress'>{t('tasks.status.inProgress')}</option>
                  <option value='completed'>{t('tasks.status.completed')}</option>
                  <option value='cancelled'>{t('tasks.status.cancelled')}</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                  <FaFlag className='text-red-600' />
                  {t('tasks.form.priority.label')}
                </label>
                <select
                  name='priority'
                  value={formData.priority}
                  onChange={handleChange}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                >
                  <option value='low'>{t('tasks.priority.low')}</option>
                  <option value='medium'>{t('tasks.priority.medium')}</option>
                  <option value='high'>{t('tasks.priority.high')}</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                <FaCalendar className='text-blue-600' />
                {t('tasks.form.dueDate.label')}
              </label>
              <input
                type='date'
                name='dueDate'
                value={formData.dueDate}
                onChange={handleChange}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              />
            </div>

            {/* Tags */}
            <div>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                <FaTags className='text-green-600' />
                {t('tasks.form.tags.label')}
              </label>
              <input
                type='text'
                name='tags'
                value={formData.tags}
                onChange={handleChange}
                placeholder={t('tasks.form.tags.placeholder')}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              />
              <p className='text-gray-500 text-sm mt-1'>{t('tasks.form.tags.example')}</p>
            </div>

            {/* Current Collaborators (Read-only display) */}
            {formData.collaborators && formData.collaborators.length > 0 && (
              <div>
                <label className='flex items-center gap-2 text-sm font-medium text-gray-700 mb-2'>
                  <FaUsers className='text-purple-600' />
                  {t('tasks.form.collaborators.label')}
                </label>
                <div className='bg-gray-50 rounded-lg p-4'>
                  <div className='space-y-2'>
                    {formData.collaborators.map((collab, index) => (
                      <div key={index} className='flex items-center justify-between bg-white p-2 rounded'>
                        <span className='text-sm text-gray-700'>
                          {collab.user?.username || collab.user?.email || 'Unknown User'}
                        </span>
                        <span className='text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded'>{collab.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200'>
            <button
              type='button'
              onClick={handleClose}
              className='px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
            >
              {t('editTaskModal.buttons.cancel')}
            </button>
            <button
              type='submit'
              disabled={loading}
              className='px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {loading ? t('editTaskModal.buttons.updating') : t('editTaskModal.buttons.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
