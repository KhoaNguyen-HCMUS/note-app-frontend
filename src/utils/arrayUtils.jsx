export const arrayUtils = {
  getRecent: (array, count = 5) => {
    return array.slice(0, count);
  },

  sortByCreatedAt: (array, order = 'desc') => {
    return [...array].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return order === 'desc' ? dateB - dateA : dateA - dateB;
    });
  },

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

  filterByMultipleConditions: (array, conditions) => {
    return array.filter((item) => {
      return Object.entries(conditions).every(([key, value]) => {
        if (value === null || value === undefined) return true;
        return item[key] === value;
      });
    });
  },

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
