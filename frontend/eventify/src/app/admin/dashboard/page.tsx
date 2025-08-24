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
import Navbar from '@/app/components/Navbar';
import { collection, getDocs } from "firebase/firestore";
import { db } from '@/app/firebase';// Import Firebase configuration
import Link from 'next/link';
import { deleteDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
interface EventData {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  attendies: number;
  interested: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  type: string;
  location: string;
  clubName: string;
  description: string;
  eventImageUrl?: string;
  revenue?: number;
}

interface ClubData {
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

interface CategoryStats {
  name: string;
  value: number;
  color: string;
}

const AdminDashboard: React.FC = () => {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatsData>({
    totalEvents: 0,
    totalClubs: 0,
    totalAttendees: 0,
    ongoingEvents: 0,
    upcomingEvents: 0,
    completedEvents: 0,
  });

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsCollection = collection(db, "events");
        const eventSnapshot = await getDocs(eventsCollection);
        const eventList = eventSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Ensure proper data types
          attendies: doc.data().attendies || 0,
          interested: doc.data().interested || 0,
          revenue: doc.data().revenue || 0,
        })) as EventData[];
        
        setEvents(eventList);
        calculateStats(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const deleteEvent = async (eventId: string) => {
  try {
    // Get a reference to the document in the "events" collection
    const eventRef = doc(db, 'events', eventId);

    // Delete the event document from Firestore
    await deleteDoc(eventRef);

    // After successful deletion, update state to remove the deleted event
    setEvents(events.filter((event) => event.id !== eventId));

    toast.success('Event deleted successfully!');
  } catch (error:any) {
    toast.error('Error deleting event: ' + error.message);
    console.error('Error deleting event:', error);
  }
};

  // Calculate dynamic stats from events data
  const calculateStats = (eventsData: EventData[]) => {
    const now = new Date();
    const totalAttendees = eventsData.reduce((sum, event) => sum + (event.attendies || 0), 0);
    const uniqueClubs = new Set(eventsData.map(event => event.clubName)).size;

    // Calculate event status counts
    let ongoingEvents = 0;
    let upcomingEvents = 0;
    let completedEvents = 0;

    eventsData.forEach(event => {
      const eventDate = new Date(event.date);
      const endDate = event.endDate ? new Date(event.endDate) : eventDate;
      
      if (eventDate <= now && endDate >= now) {
        ongoingEvents++;
      } else if (eventDate > now) {
        upcomingEvents++;
      } else {
        completedEvents++;
      }
    });

    setStats({
      totalEvents: eventsData.length,
      totalClubs: uniqueClubs,
      totalAttendees,
      ongoingEvents,
      upcomingEvents,
      completedEvents,
    });
  };

  // Generate category data from events
  const getCategoryData = (): CategoryStats[] => {
    const categoryColors: { [key: string]: string } = {
      'iapc': '#3B82F6',
      'cultural': '#8B5CF6',
      'sports': '#10B981',
      'idc': '#F59E0B',
      'cdc': '#EF4444',
      'technology': '#06B6D4',
      'business': '#F97316',
      'education': '#84CC16'
    };

    const categoryCount: { [key: string]: number } = {};
    events.forEach(event => {
      const category = event.type?.toLowerCase() || 'other';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    const total = events.length || 1;
    return Object.entries(categoryCount).map(([name, count]) => ({
      name: name.toUpperCase(),
      value: Math.round((count / total) * 100),
      color: categoryColors[name] || '#6B7280'
    }));
  };

  // Generate monthly trend data from events
  const getAttendeesTrendData = () => {
    const monthlyData: { [key: string]: { attendees: number; interested: number; revenue: number; count: number } } = {};
    
    events.forEach(event => {
      const eventDate = new Date(event.date);
      const monthKey = eventDate.toLocaleDateString('en-US', { month: 'short' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { attendees: 0, interested: 0, revenue: 0, count: 0 };
      }
      
      monthlyData[monthKey].attendees += event.attendies || 0;
      monthlyData[monthKey].interested += event.interested || 0;
      monthlyData[monthKey].revenue += event.revenue || 0;
      monthlyData[monthKey].count += 1;
    });

    // Generate last 8 months
    const result = [];
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      result.push({
        month: monthKey,
        attendees: monthlyData[monthKey]?.attendees || 0,
        interested: monthlyData[monthKey]?.interested || 0,
        revenue: monthlyData[monthKey]?.revenue || 0
      });
    }
    
    return result;
  };

  // Generate weekly events data
  const getWeeklyEventsData = () => {
    const weeklyData = [
      { day: 'Mon', events: 0, attendees: 0 },
      { day: 'Tue', events: 0, attendees: 0 },
      { day: 'Wed', events: 0, attendees: 0 },
      { day: 'Thu', events: 0, attendees: 0 },
      { day: 'Fri', events: 0, attendees: 0 },
      { day: 'Sat', events: 0, attendees: 0 },
      { day: 'Sun', events: 0, attendees: 0 }
    ];

    events.forEach(event => {
        try {
      const eventDate = new Date(event.date);
      const dayIndex = eventDate.getDay();
      const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Adjust Sunday to be last
      
      weeklyData[adjustedIndex].events += 1;
      weeklyData[adjustedIndex].attendees += event.attendies || 0
        } catch {}
;
    });

    return weeklyData;
  };

  // Generate top clubs data
  const getTopClubs = (): ClubData[] => {
    const clubStats: { [key: string]: { events: number; attendees: number; types: Set<string> } } = {};
    
    events.forEach(event => {
      const clubName = event.clubName || 'Unknown Club';
      if (!clubStats[clubName]) {
        clubStats[clubName] = { events: 0, attendees: 0, types: new Set() };
      }
      
      clubStats[clubName].events += 1;
      clubStats[clubName].attendees += event.attendies || 0;
      clubStats[clubName].types.add(event.type || 'other');
    });

    return Object.entries(clubStats)
      .map(([name, stats]) => ({
        name,
        events: stats.events,
        members: stats.attendees, // Using attendees as proxy for members
        category: Array.from(stats.types)[0]?.toUpperCase() || 'MIXED',
        rating: Math.min(5.0, 3.5 + (stats.events * 0.1)) // Generate rating based on event count
      }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 4);
  };

  // Determine event status based on dates
  const getEventStatus = (event: EventData): 'upcoming' | 'ongoing' | 'completed' | 'cancelled' => {
    const now = new Date();
    const eventDate = new Date(event.date);
    const endDate = event.endDate ? new Date(event.endDate) : eventDate;
    
    if (eventDate <= now && endDate >= now) {
      return 'ongoing';
    } else if (eventDate > now) {
      return 'upcoming';
    } else {
      return 'completed';
    }
  };

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

  // Get computed data
  const categoryData = getCategoryData();
  const attendeesTrendData = getAttendeesTrendData();
  const weeklyEventsData = getWeeklyEventsData();
  const topClubs = getTopClubs();
  const recentEvents = events.slice(0, 10); // Show last 10 events

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <Navbar />

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
                  <span className="text-green-600 text-sm font-medium">Active</span>
                  <span className="text-slate-500 text-sm ml-1">events system</span>
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
                  <span className="text-green-600 text-sm font-medium">Live data</span>
                  <span className="text-slate-500 text-sm ml-1">from Firestore</span>
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
                  <span className="text-green-600 text-sm font-medium">Unique</span>
                  <span className="text-slate-500 text-sm ml-1">organizations</span>
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
                <p className="text-slate-600 text-sm">Events distribution by day of week</p>
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
                <p className="text-slate-600 text-sm">Most active organizations</p>
              </div>
              <Award className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-4">
              {topClubs.map((club, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
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
                      <span className="text-sm font-medium">{club.rating.toFixed(1)}</span>
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
                <p className="text-slate-600 text-sm">Live data from Firestore database</p>
              </div>
              <div className="flex space-x-3">

                {/* <button className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button> */}
    <Link href="/admin/add-event">
      <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
        <Plus className="w-4 h-4 mr-2" />
        Add Event
      </button>
    </Link>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Club</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">{event.title}</div>
                        <div className="text-sm text-slate-500">{event.type?.toUpperCase()}</div>
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
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(getEventStatus(event))}`}>
                        {getEventStatus(event).charAt(0).toUpperCase() + getEventStatus(event).slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-slate-400 mr-2" />
                        <span className="text-sm font-medium text-slate-900">{(event.attendies || 0).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 text-pink-400 mr-2" />
                        <span className="text-sm font-medium text-slate-900">{(event.interested || 0).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 font-medium">{event.clubName || 'Unknown'}</div>
                      <div className="text-sm text-slate-500">{event.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
<button 
  onClick={() => deleteEvent(event.id)} 
  className="text-red-500 hover:text-red-700 focus:outline-none"
>
  <Trash2 className="w-5 h-5" />
</button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Show message if no events */}
          {events.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <Calendar className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No events found</h3>
              <p className="text-slate-600">Start by adding some events to your Firestore database.</p>
              <button className="mt-4 flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm mx-auto">
                <Plus className="w-4 h-4 mr-2" />
                Add First Event
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;