import { useState } from 'react';
import { FaTimes, FaCalendar, FaFlag, FaTags, FaTasks, FaAlignLeft, FaSave, FaPlus } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const AddTaskModal = ({ show, onClose, onSubmit }) => {
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

      // Reset form
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
        dueDate: '',
        tags: '',
        collaborators: [],
      });
      setErrors({});
    } catch (err) {
      console.error('Error in form submission:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      dueDate: '',
      tags: '',
      collaborators: [],
    });
    setErrors({});
    onClose();
  };

  if (!show) return null;

  return (
    <div className='text-primary fixed inset-0 z-50 flex items-center justify-center p-4'>
      <div className='fixed inset-0 bg-gray-700/50' onClick={handleClose}></div>

      <div className='relative w-full max-w-2xl bg-card-bg rounded-lg shadow-xl max-h-[90vh] overflow-y-auto'>
        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 bg-linear-(--gradient-text) rounded-t-lg'>
          <h5 className='flex items-center text-xl font-semibold text-white'>
            <FaPlus className='mr-2' /> {t('addTaskModal.title')}
          </h5>
          <button
            onClick={handleClose}
            className='cursor-pointer text-white hover:text-gray-200 transition-colors'
            aria-label={t('addTaskModal.buttons.cancel')}
          >
            <FaTimes className='text-xl' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='bg-card-bg rounded-b-lg'>
          <div className='p-6 space-y-6'>
            {/* Title Input */}
            <div className='text-primary'>
              <label className='flex items-center mb-2'>
                <FaTasks className='mr-2' />
                <span>{t('tasks.form.title.label')} *</span>
              </label>
              <input
                type='text'
                name='title'
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.title ? 'border-red-500' : 'border-border-light'
                }`}
                value={formData.title}
                onChange={handleChange}
                placeholder={t('tasks.form.title.placeholder')}
                required
              />
              {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title}</p>}
            </div>

            {/* Description Textarea */}
            <div className='text-primary'>
              <label className='flex items-center mb-2'>
                <FaAlignLeft className='mr-2' />
                <span>{t('tasks.form.description.label')} *</span>
              </label>
              <textarea
                name='description'
                className={`w-full px-4 py-2 border rounded-lg ${
                  errors.description ? 'border-red-500' : 'border-border-light'
                }`}
                rows='6'
                value={formData.description}
                onChange={handleChange}
                placeholder={t('tasks.form.description.placeholder')}
                required
              />
              {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description}</p>}
            </div>

            {/* Status and Priority Row */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Status */}
              <div className='text-primary'>
                <label className='flex items-center mb-2'>
                  <FaFlag className='mr-2 text-indigo-600' />
                  <span>{t('tasks.form.status.label')}</span>
                </label>
                <select
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                  className='bg-card-bg text-primary cursor-pointer w-full px-4 py-2 border border-border-light rounded-lg'
                >
                  <option value='pending'>{t('tasks.status.pending')}</option>
                  <option value='in-progress'>{t('tasks.status.inProgress')}</option>
                  <option value='completed'>{t('tasks.status.completed')}</option>
                  <option value='cancelled'>{t('tasks.status.cancelled')}</option>
                </select>
              </div>

              {/* Priority */}
              <div className='text-primary'>
                <label className='flex items-center mb-2'>
                  <FaFlag className='mr-2 text-red-600' />
                  <span>{t('tasks.form.priority.label')}</span>
                </label>
                <select
                  name='priority'
                  value={formData.priority}
                  onChange={handleChange}
                  className='bg-card-bg text-primary cursor-pointer w-full px-4 py-2 border border-border-light rounded-lg'
                >
                  <option value='low'>{t('tasks.priority.low')}</option>
                  <option value='medium'>{t('tasks.priority.medium')}</option>
                  <option value='high'>{t('tasks.priority.high')}</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className='text-primary'>
              <label className='flex items-center mb-2'>
                <FaCalendar className='mr-2 text-blue-600' />
                <span>{t('tasks.form.dueDate.label')}</span>
              </label>
              <input
                type='date'
                name='dueDate'
                value={formData.dueDate}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-border-light rounded-lg'
              />
            </div>

            {/* Tags Input */}
            <div className='text-primary'>
              <label className='flex items-center mb-2'>
                <FaTags className='mr-2 text-green-600' />
                <span>{t('tasks.form.tags.label')}</span>
              </label>
              <input
                type='text'
                name='tags'
                className='w-full px-4 py-2 border border-border-light rounded-lg'
                value={formData.tags}
                onChange={handleChange}
                placeholder={t('tasks.form.tags.placeholder')}
              />
              <small className='text-primary mt-1 block'>{t('tasks.form.tags.example')}</small>
            </div>
          </div>

          {/* Footer */}
          <div className='flex items-center justify-end px-6 py-4 border-t border-border-light rounded-b-lg space-x-4'>
            <button
              type='button'
              className='cursor-pointer flex items-center px-4 py-2 text-primary bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-border-light transition-colors'
              onClick={handleClose}
            >
              <FaTimes className='mr-2' /> {t('addTaskModal.buttons.cancel')}
            </button>
            <button
              type='submit'
              disabled={loading}
              className='cursor-pointer flex items-center px-4 py-2 text-button-text bg-button-bg dark:bg-button-bg-dark rounded-lg hover:bg-button-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              <FaSave className='mr-2' />
              {loading ? t('addTaskModal.buttons.saving') : t('addTaskModal.buttons.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
