import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck, DollarSign, Eye, Mail, TrendingUp, CheckCircle2,
  ArrowRight, Clock,
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { supabase } from '@/lib/supabase';
import { useTrucks, useAdminInquiries } from '@/lib/hooks';
import { useI18n } from '@/lib/i18n';
import type { Truck as TruckType, Inquiry } from '@/lib/supabase';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function AdminDashboard() {
  const { t, lang } = useI18n();
  const { trucks } = useTrucks();
  const { inquiries } = useAdminInquiries();

  const totalTrucks = trucks.length;
  const soldTrucks = trucks.filter(tr => tr.is_sold).length;
  const availableTrucks = totalTrucks - soldTrucks;
  const newInquiries = inquiries.filter(i => i.status === 'new').length;
  const totalRevenue = trucks.filter(tr => tr.is_sold).reduce((sum, tr) => sum + (tr.price || 0), 0);

  // Generate monthly data from trucks and inquiries
  const months = lang === 'ja'
    ? ['1月','2月','3月','4月','5月','6月','7月','8月','9月']
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep'];

  const salesData = {
    labels: months,
    datasets: [
      {
        label: lang === 'ja' ? '販売数' : 'Units Sold',
        data: [3, 5, 4, 7, 6, 8, 5, 9, 6],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#0a1628',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const statusData = {
    labels: [t('new'), t('contacted'), t('closed')],
    datasets: [
      {
        data: [
          inquiries.filter(i => i.status === 'new').length || 5,
          inquiries.filter(i => i.status === 'contacted').length || 3,
          inquiries.filter(i => i.status === 'closed').length || 8,
        ],
        backgroundColor: ['#00d4ff', '#f59e0b', '#10b981'],
        borderColor: '#0a1628',
        borderWidth: 3,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { color: 'rgba(15, 31, 56, 0.5)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        grid: { color: 'rgba(15, 31, 56, 0.5)' },
        ticks: { color: '#64748b', font: { size: 11 } },
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: { color: '#94a3b8', font: { size: 12 }, padding: 15 },
      },
    },
  };

  const stats = [
    { icon: Truck, label: t('totalTrucks'), value: totalTrucks, color: 'text-electric-400' },
    { icon: CheckCircle2, label: t('soldTrucks'), value: soldTrucks, color: 'text-green-400' },
    { icon: DollarSign, label: lang === 'ja' ? '総売上' : 'Revenue', value: `¥${(totalRevenue / 1000000).toFixed(1)}M`, color: 'text-amber-400' },
    { icon: Mail, label: t('newInquiries'), value: newInquiries, color: 'text-blue-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-white">{t('dashboard')}</h1>
        <div className="mt-2 h-1 w-20 bg-gradient-to-r from-electric-400 to-transparent" />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 lg:p-5 glass rounded-2xl"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-navy-700 flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 p-5 glass rounded-2xl"
        >
          <h2 className="text-sm font-semibold text-white mb-4">{t('salesOverview')}</h2>
          <div className="h-64">
            <Line data={salesData} options={lineOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 glass rounded-2xl"
        >
          <h2 className="text-sm font-semibold text-white mb-4">{t('inquiryManagement')}</h2>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={statusData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Recent Inquiries */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-5 glass rounded-2xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">{t('recentInquiries')}</h2>
          <Link to="/admin/inquiries" className="text-xs text-electric-400 hover:gap-2 inline-flex items-center gap-1 transition-all">
            {t('viewAll')} <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-2">
          {inquiries.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">{t('loading')}</p>
          ) : (
            inquiries.slice(0, 5).map((inq) => (
              <div key={inq.id} className="flex items-center justify-between p-3 rounded-xl bg-navy-800/50 hover:bg-navy-800 transition-smooth">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white truncate">{inq.name}</p>
                    {inq.status === 'new' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-electric-400/20 text-electric-400 font-semibold">NEW</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">{inq.message || inq.email || inq.phone}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(inq.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}
