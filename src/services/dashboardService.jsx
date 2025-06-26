import axiosClient from '../api/axiosClient';
import { TaskStatsCalculator } from '../utils/taskStatsCalculator';
import { arrayUtils } from '../utils/arrayUtils';

export class DashboardService {
  static async fetchAllData() {
    try {
      const [notesResponse, tasksResponse] = await Promise.all([axiosClient.get('/notes'), axiosClient.get('/tasks')]);

      const notes = notesResponse.data || [];
      const tasks = tasksResponse.data || [];

      return { notes, tasks };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  }

  static calculateStats(notes, tasks) {
    const taskCalculator = new TaskStatsCalculator(tasks);

    return {
      totalNotes: notes.length,
      totalTasks: tasks.length,
      ...taskCalculator.getAllStats(),
    };
  }

  static getRecentItems(notes, tasks, count = 5) {
    const sortedNotes = arrayUtils.sortByCreatedAt(notes);
    const sortedTasks = arrayUtils.sortByCreatedAt(tasks);

    return {
      recentNotes: arrayUtils.getRecent(sortedNotes, count),
      recentTasks: arrayUtils.getRecent(sortedTasks, count),
    };
  }

  static getUpcomingTasks(tasks, daysAhead = 7, count = 5) {
    const taskCalculator = new TaskStatsCalculator(tasks);
    const upcoming = taskCalculator.getUpcomingTasks(daysAhead);
    return arrayUtils.getRecent(upcoming, count);
  }

  static async getDashboardData() {
    const { notes, tasks } = await this.fetchAllData();
    const stats = this.calculateStats(notes, tasks);
    const { recentNotes, recentTasks } = this.getRecentItems(notes, tasks);
    const upcomingTasks = this.getUpcomingTasks(tasks);

    return {
      stats,
      recentNotes,
      recentTasks,
      upcomingTasks,
    };
  }

  static getTasksByStatus(tasks) {
    return arrayUtils.groupBy(tasks, 'status');
  }

  static getTasksByPriority(tasks) {
    return arrayUtils.groupBy(tasks, 'priority');
  }

  static getFilteredTasks(tasks, filters) {
    return arrayUtils.filterByMultipleConditions(tasks, filters);
  }
}
