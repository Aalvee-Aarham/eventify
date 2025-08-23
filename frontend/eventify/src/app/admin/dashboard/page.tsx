'use client'; // Add this at the very top

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  Calendar,
  Users,
  Building2,
  TrendingUp,
  Eye,
  Heart,
  Clock,
  MapPin,
  Star,
  Plus,
  Search,
  Filter,
  Download,
  Bell,
  Settings,
  MoreVertical,
  ChevronDown,
  Activity,
  DollarSign,
  Award,
  Target,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Edit, Trash2 } from 'lucide-react';

interface EventData {
  id: number;
  name: string;
  date: string;
  attendees: number;
  interested: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  category: string;
  revenue: number;
}

interface ClubData {
  id: number;
  name: string;
  events: number;
  members: number;
  category: string;
  rating: number;
}

interface StatsData {
  totalEvents: number;
  totalClubs: number;
  totalAttendees: number;
  ongoingEvents: number;
  upcomingEvents: number;
  completedEvents: number;
}

const AdminDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedView, setSelectedView] = useState('overview');

  // Mock data - replace with actual API calls
  const [stats] = useState<StatsData>({
    totalEvents: 156,
    totalClubs: 24,
    totalAttendees: 8924,
    ongoingEvents: 12,
    upcomingEvents: 28,
    completedEvents: 98,
  });

  const [recentEvents] = useState<EventData[]>([
    {
      id: 1,
      name: "AI & Machine Learning Summit",
      date: "2024-09-15",
      attendees: 1247,
      interested: 2340,
      status: "upcoming",
      category: "Technology",
      revenue: 12500
    },
    {
      id: 2,
      name: "Cultural Heritage Festival",
      date: "2024-09-10",
      attendees: 856,
      interested: 1120,
      status: "ongoing",
      category: "Cultural",
      revenue: 8900
    },
    {
      id: 3,
      name: "Sports Championship",
      date: "2024-09-05",
      attendees: 2100,
      interested: 3200,
      status: "completed",
      category: "Sports",
      revenue: 18500
    },
    {
      id: 4,
      name: "Innovation Workshop",
      date: "2024-08-28",
      attendees: 340,
      interested: 450,
      status: "cancelled",
      category: "Education",
      revenue: 0
    }
  ]);

  const [topClubs] = useState<ClubData[]>([
    { id: 1, name: "Tech Innovators", events: 24, members: 450, category: "Technology", rating: 4.8 },
    { id: 2, name: "Cultural Society", events: 18, members: 320, category: "Cultural", rating: 4.6 },
    { id: 3, name: "Sports Club", events: 32, members: 680, category: "Sports", rating: 4.9 },
    { id: 4, name: "Business Network", events: 15, members: 280, category: "Business", rating: 4.4 }
  ]);

  // Chart data
  const attendeesTrendData = [
    { month: 'Jan', attendees: 2400, interested: 3200, revenue: 18000 },
    { month: 'Feb', attendees: 1398, interested: 2100, revenue: 14500 },
    { month: 'Mar', attendees: 3800, interested: 4500, revenue: 28000 },
    { month: 'Apr', attendees: 3908, interested: 4200, revenue: 32000 },
    { month: 'May', attendees: 4800, interested: 5100, revenue: 38500 },
    { month: 'Jun', attendees: 3800, interested: 4300, revenue: 29000 },
    { month: 'Jul', attendees: 4300, interested: 4800, revenue: 34000 },
    { month: 'Aug', attendees: 5200, interested: 5900, revenue: 42000 }
  ];

  const categoryData = [
    { name: 'Technology', value: 35, color: '#3B82F6' },
    { name: 'Cultural', value: 25, color: '#8B5CF6' },
    { name: 'Sports', value: 20, color: '#10B981' },
    { name: 'Business', value: 12, color: '#F59E0B' },
    { name: 'Education', value: 8, color: '#EF4444' }
  ];

  const weeklyEventsData = [
    { day: 'Mon', events: 12, attendees: 340 },
    { day: 'Tue', events: 19, attendees: 520 },
    { day: 'Wed', events: 8, attendees: 280 },
    { day: 'Thu', events: 15, attendees: 450 },
    { day: 'Fri', events: 22, attendees: 680 },
    { day: 'Sat', events: 18, attendees: 590 },
    { day: 'Sun', events: 14, attendees: 420 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200/60 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Event Management Dashboard</h1>
              <p className="text-slate-600 mt-1">Monitor and manage your events efficiently</p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search events, clubs..."
                  className="pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>

              {/* Period Selector */}
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 3 months</option>
                <option value="1y">Last year</option>
              </select>

              {/* Notifications */}
              <button className="relative p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
              </button>

              {/* Profile */}
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg"
                  alt="Admin"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900">Admin User</p>
                  <p className="text-xs text-slate-500">Super Admin</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Total Events */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Events</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalEvents}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+12.5%</span>
                  <span className="text-slate-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Attendees */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Attendees</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{formatNumber(stats.totalAttendees)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+18.2%</span>
                  <span className="text-slate-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>



          {/* Active Clubs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active Clubs</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalClubs}</p>
                <div className="flex items-center mt-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600 text-sm font-medium">+5.4%</span>
                  <span className="text-slate-500 text-sm ml-1">vs last month</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-xl">
                <Building2 className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Upcoming Events</p>
                <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Ongoing Events</p>
                <p className="text-2xl font-bold">{stats.ongoingEvents}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100 text-sm">Completed Events</p>
                <p className="text-2xl font-bold">{stats.completedEvents}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-200" />
            </div>
          </div>


        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Attendees Trend Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Attendees & Interest Trends</h3>
                <p className="text-slate-600 text-sm">Monthly growth overview</p>
              </div>
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-600">Attendees</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                  <span className="text-sm text-slate-600">Interested</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={attendeesTrendData}>
                <defs>
                  <linearGradient id="colorAttendees" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInterested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendees"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorAttendees)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="interested"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorInterested)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Event Categories Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Event Categories</h3>
                <p className="text-slate-600 text-sm">Distribution by category</p>
              </div>
              <PieChartIcon className="w-6 h-6 text-slate-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={60}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {categoryData.map((category, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-slate-600">{category.name}</span>
                  <span className="text-sm text-slate-900 font-medium ml-auto">{category.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Events Bar Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Weekly Event Activity</h3>
                <p className="text-slate-600 text-sm">Events and attendance by day</p>
              </div>
              <BarChart3 className="w-6 h-6 text-slate-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyEventsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="events" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Performing Clubs */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Top Clubs</h3>
                <p className="text-slate-600 text-sm">Best performing clubs</p>
              </div>
              <Award className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-4">
              {topClubs.map((club, index) => (
                <div key={club.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{club.name}</p>
                      <p className="text-xs text-slate-600">{club.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-medium">{club.rating}</span>
                    </div>
                    <p className="text-xs text-slate-600">{club.events} events</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Events Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Recent Events</h3>
                <p className="text-slate-600 text-sm">Latest event activities and status</p>
              </div>
              <div className="flex space-x-3">
                <button className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
                <button className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Event
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Event</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Attendees</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Interested</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{event.name}</div>
                        <div className="text-sm text-slate-500">{event.category}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-900">{event.attendees.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-pink-400 mr-2" />
                        <span className="text-sm font-medium text-slate-900">{event.interested.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-sm text-slate-900">${event.revenue.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-500 hover:text-blue-700 focus:outline-none">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button className="text-red-500 hover:text-red-700 focus:outline-none">
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button className="text-green-500 hover:text-green-700 focus:outline-none">
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
