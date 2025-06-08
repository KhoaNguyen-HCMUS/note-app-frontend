// src/hooks/useDashboard.js
import { useState, useEffect } from 'react';
import { DashboardService } from '../services/dashboardService';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

export const useDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalNotes: 0,
      totalTasks: 0,
      pending: 0,
      completed: 0,
      overdue: 0,
      today: 0,
    },
    recentNotes: [],
    recentTasks: [],
    upcomingTasks: [],
  });
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await DashboardService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(t('dashboard.errors.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return {
    ...dashboardData,
    loading,
    refetch: fetchDashboardData,
  };
};
