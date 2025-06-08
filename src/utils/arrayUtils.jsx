export const arrayUtils = {
  // Lấy items mới nhất
  getRecent: (array, count = 5) => {
    return array.slice(0, count);
  },

  // Sort theo ngày tạo
  sortByCreatedAt: (array, order = 'desc') => {
    return [...array].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  },

  // Sort theo ngày due
  sortByDueDate: (array, order = 'asc') => {
    return [...array].sort((a, b) => {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;

      const dateA = new Date(a.dueDate);
      const dateB = new Date(b.dueDate);
      return order === 'asc' ? dateA - dateB : dateB - dateA;
    });
  },

  // Filter theo nhiều điều kiện
  filterByMultipleConditions: (array, conditions) => {
    return array.filter((item) => {
      return Object.entries(conditions).every(([key, value]) => {
        if (value === null || value === undefined) return true;
        return item[key] === value;
      });
    });
  },

  // Group theo key
  groupBy: (array, key) => {
    return array.reduce((groups, item) => {
      const groupKey = item[key];
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(item);
      return groups;
    }, {});
  },
};
