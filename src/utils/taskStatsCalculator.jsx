import { dateUtils } from './dateUtils';

export class TaskStatsCalculator {
  constructor(tasks = []) {
    this.tasks = tasks;
  }

  getTotalTasks() {
    return this.tasks.length;
  }

  getPendingTasks() {
    return this.tasks.filter((task) => task.status === 'pending').length;
  }

  getCompletedTasks() {
    return this.tasks.filter((task) => task.status === 'completed').length;
  }

  getInProgressTasks() {
    return this.tasks.filter((task) => task.status === 'in-progress').length;
  }

  getCancelledTasks() {
    return this.tasks.filter((task) => task.status === 'cancelled').length;
  }

  getOverdueTasks() {
    return this.tasks.filter((task) => {
      if (!task.dueDate) return false;
      return dateUtils.isOverdue(task.dueDate) && task.status !== 'completed' && task.status !== 'cancelled';
    }).length;
  }

  getTodayTasks() {
    return this.tasks.filter((task) => {
      if (!task.dueDate) return false;
      return dateUtils.isToday(task.dueDate);
    }).length;
  }

  getUpcomingTasks(daysAhead = 7) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    return this.tasks
      .filter((task) => {
        if (!task.dueDate || task.status === 'completed') return false;
        const dueDate = new Date(task.dueDate);
        return dueDate >= today && dueDate <= futureDate;
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }

  getTasksByPriority(priority) {
    return this.tasks.filter((task) => task.priority === priority);
  }

  getTasksByStatus(status) {
    return this.tasks.filter((task) => task.status === status);
  }

  getAllStats() {
    return {
      total: this.getTotalTasks(),
      pendingTasks: this.getPendingTasks(),
      completedTasks: this.getCompletedTasks(),
      inProgress: this.getInProgressTasks(),
      cancelled: this.getCancelledTasks(),
      overdueTasks: this.getOverdueTasks(),
      todayTasks: this.getTodayTasks(),
      upcoming: this.getUpcomingTasks().length,
    };
  }
}

// Hook version
export const useTaskStats = (tasks) => {
  const calculator = new TaskStatsCalculator(tasks);
  return calculator.getAllStats();
};
