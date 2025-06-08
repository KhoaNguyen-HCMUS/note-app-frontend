import { useTranslation } from 'react-i18next';

export const useDateUtils = () => {
  const { t } = useTranslation();

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('common.date.today');
    if (diffDays === 1) return t('common.date.tomorrow');
    if (diffDays === -1) return t('common.date.yesterday');
    if (diffDays < 0) return `${Math.abs(diffDays)} ${t('common.date.daysOverdue')}`;
    return `${diffDays} ${t('common.date.daysLeft')}`;
  };

  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (dateString) => {
    const date = new Date(dateString);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const isOverdue = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const getDaysBetween = (date1, date2) => {
    const diffTime = Math.abs(date2 - date1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDisplayDate = (dateString, format = 'short') => {
    const date = new Date(dateString);

    if (format === 'short') {
      return date.toLocaleDateString();
    }

    if (format === 'long') {
      return date.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }

    return date.toLocaleDateString();
  };

  return {
    formatRelativeDate,
    isToday,
    isTomorrow,
    isOverdue,
    getDaysBetween,
    formatDisplayDate,
  };
};

// Export non-hook functions
export const dateUtils = {
  formatRelativeDate: (dateString, t) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t('common.date.today');
    if (diffDays === 1) return t('common.date.tomorrow');
    if (diffDays === -1) return t('common.date.yesterday');
    if (diffDays < 0) return `${Math.abs(diffDays)} ${t('common.date.daysOverdue')}`;
    return `${diffDays} ${t('common.date.daysLeft')}`;
  },

  isToday: (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },

  isOverdue: (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  },
};
