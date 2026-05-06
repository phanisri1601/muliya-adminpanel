import React, { useEffect, useMemo, useState } from 'react';
import { IndianRupee, ShoppingBag, Clock, CheckCircle, XCircle, Package, Truck, AlertCircle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api, endpoints } from '../api';
import './Dashboard.css';

const fallbackChartData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const fallbackRecentOrders = [
  { id: '#ORD-001', customer: 'Emma Watson', item: 'Diamond Solitaire Ring', total: '₹ 1,50,000', status: 'Processing' },
  { id: '#ORD-002', customer: 'John Doe', item: 'Gold Tennis Bracelet', total: '₹ 85,000', status: 'Shipped' },
  { id: '#ORD-003', customer: 'Sarah Smith', item: 'Sapphire Necklace', total: '₹ 2,10,000', status: 'Delivered' },
  { id: '#ORD-004', customer: 'Priya Patel', item: 'Platinum Wedding Band', total: '₹ 65,000', status: 'Processing' },
];

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    api
      .get(endpoints.dashboard)
      .then((res) => {
        const normalized = res?.data ?? res?.Data ?? res?.result ?? res?.Result ?? res;
        if (isMounted) setDashboardData(normalized);
      })
      .catch(() => {
        if (isMounted) setDashboardData(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = useMemo(() => {
    const candidate = dashboardData?.revenueOverview ?? dashboardData?.chartData ?? dashboardData?.data;
    if (Array.isArray(candidate)) return candidate;

    const last7 = dashboardData?.last7DaysAmount;
    if (last7 && typeof last7 === 'object') {
      const order = ['thu', 'fri', 'sat', 'sun', 'mon', 'tue', 'wed'];
      const labelMap = { thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun', mon: 'Mon', tue: 'Tue', wed: 'Wed' };
      const mapped = order
        .filter((k) => Object.prototype.hasOwnProperty.call(last7, k))
        .map((k) => ({ name: labelMap[k] ?? k, revenue: Number(last7[k] ?? 0) }));
      if (mapped.length > 0) return mapped;
    }

    const chartYears = dashboardData?.chartYears;
    if (chartYears && typeof chartYears === 'object') {
      const order = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const labelMap = {
        january: 'Jan',
        february: 'Feb',
        march: 'Mar',
        april: 'Apr',
        may: 'May',
        june: 'Jun',
        july: 'Jul',
        august: 'Aug',
        september: 'Sep',
        october: 'Oct',
        november: 'Nov',
        december: 'Dec',
      };
      const mapped = order
        .filter((k) => Object.prototype.hasOwnProperty.call(chartYears, k))
        .map((k) => ({ name: labelMap[k] ?? k, revenue: Number(chartYears[k] ?? 0) }));
      if (mapped.length > 0) return mapped;
    }

    return fallbackChartData;
  }, [dashboardData]);

  const recentOrders = useMemo(() => {
    const candidate = dashboardData?.recentOrders ?? dashboardData?.orders;
    return Array.isArray(candidate) ? candidate : fallbackRecentOrders;
  }, [dashboardData]);

  const metrics = useMemo(() => {
    const m = dashboardData?.metrics;
    const orders = dashboardData?.orders;
    const sales = dashboardData?.sales;

    const totalAmount =
      orders?.total_order?.total_amount ??
      orders?.months_order?.total_amount ??
      orders?.yearly_order?.total_amount;

    const activeOrdersCount =
      sales?.processing_order ??
      sales?.confirmed_order ??
      orders?.today_order?.order_count ??
      sales?.pending_order;

    const revenueValue =
      m?.totalRevenue ??
      (typeof totalAmount === 'number' ? `₹ ${Number(totalAmount).toLocaleString('en-IN')}` : undefined);

    const activeOrdersValue = m?.activeOrders ?? (activeOrdersCount != null ? String(activeOrdersCount) : undefined);

    return {
      totalRevenue: revenueValue ?? '—',
      activeOrders: activeOrdersValue ?? '—',
      totalCustomers: m?.totalCustomers ?? (dashboardData?.customers?.count != null ? String(dashboardData.customers.count) : '—'),
      conversionRate: m?.conversionRate ?? (dashboardData?.conversionRate != null ? String(dashboardData.conversionRate) : '—'),
      totalRevenueChange: m?.totalRevenueChange,
      activeOrdersChange: m?.activeOrdersChange,
      totalCustomersChange: m?.totalCustomersChange,
      conversionRateChange: m?.conversionRateChange,
    };
  }, [dashboardData]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <MetricCard title="Today's Revenue" value={`₹ ${dashboardData?.orders?.today_order?.total_amount?.toLocaleString('en-IN') ?? 0}`} icon={IndianRupee} delay="0.1s" />
        <MetricCard title="Active Processing" value={dashboardData?.sales?.processing_order ?? 0} icon={Clock} delay="0.2s" />
        <MetricCard title="Confirmed Orders" value={dashboardData?.sales?.confirmed_order ?? 0} icon={CheckCircle} delay="0.3s" />
        <MetricCard title="Total Monthly" value={`₹ ${dashboardData?.orders?.months_order?.total_amount?.toLocaleString('en-IN') ?? 0}`} icon={Package} delay="0.4s" />
      </div>

      <div className="dashboard-charts">
        <div className="glass-panel chart-panel animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
          <h3 className="chart-title">Revenue Overview</h3>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E92247" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E92247" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#868e96" tickLine={false} axisLine={false} />
                <YAxis stroke="#868e96" tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} width={50} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid rgba(233, 34, 71, 0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#212529' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#E92247" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel chart-panel animate-fade-in status-breakdown-panel" style={{ animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards' }}>
          <h3 className="chart-title">Sales Status Breakdown</h3>
          <div className="status-grid">
            <div className="status-item">
              <span className="status-label"><Package size={16} /> Preparing</span>
              <span className="status-count">{dashboardData?.sales?.preparing_order ?? 0}</span>
            </div>
            <div className="status-item">
              <span className="status-label"><Truck size={16} /> Out for Delivery</span>
              <span className="status-count">{dashboardData?.sales?.['out for delivery_order'] ?? 0}</span>
            </div>
            <div className="status-item">
              <span className="status-label"><CheckCircle size={16} /> Delivered</span>
              <span className="status-count">{dashboardData?.sales?.delivered_order ?? 0}</span>
            </div>
            <div className="status-item">
              <span className="status-label"><XCircle size={16} /> Cancelled</span>
              <span className="status-count">{dashboardData?.sales?.cancelled_order ?? 0}</span>
            </div>
            <div className="status-item">
              <span className="status-label"><AlertCircle size={16} /> Refunded</span>
              <span className="status-count">{dashboardData?.sales?.refunded_order ?? 0}</span>
            </div>
            <div className="status-item">
              <span className="status-label"><Clock size={16} /> On Hold</span>
              <span className="status-count">{dashboardData?.sales?.['on hold_order'] ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
