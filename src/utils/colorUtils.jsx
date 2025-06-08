export const statusColors = {
  completed: 'text-green-600 bg-green-100',
  'in-progress': 'text-blue-600 bg-blue-100',
  pending: 'text-yellow-600 bg-yellow-100',
  cancelled: 'text-red-600 bg-red-100',
  overdue: 'text-red-600 bg-red-100',
};

export const priorityColors = {
  high: 'text-red-600 bg-red-100',
  medium: 'text-yellow-600 bg-yellow-100',
  low: 'text-green-600 bg-green-100',
};

export const getStatusColor = (status) => {
  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

export const getPriorityColor = (priority) => {
  return priorityColors[priority] || 'text-gray-600 bg-gray-100';
};

export const getIconBgColor = (color) => {
  const colorMap = {
    'text-blue-600': 'bg-blue-100 dark:bg-blue-900',
    'text-indigo-600': 'bg-indigo-100 dark:bg-indigo-900',
    'text-yellow-600': 'bg-yellow-100 dark:bg-yellow-900',
    'text-green-600': 'bg-green-100 dark:bg-green-900',
    'text-red-600': 'bg-red-100 dark:bg-red-900',
    'text-purple-600': 'bg-purple-100 dark:bg-purple-900',
  };

  return colorMap[color] || 'bg-gray-100 dark:bg-gray-700';
};
