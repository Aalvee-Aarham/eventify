'use client'; // Add this at the very top
import { db } from '../firebase'; // Firestore instance
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Heart,
  Users,
  Clock,
  MapPin,
  Star,
  Edit3,
  Settings,
  Bell,
  Search,
  Filter,
  Plus,
  Eye,
  Share2,
  Bookmark,
  User,
  Mail,
  Phone,
  Badge,
  Award,
  TrendingUp,
  Camera,
  Music,
  Gamepad2,
  Code,
  Trophy,
  CheckCircle,
  XCircle,
  Calendar as CalendarIcon,
  Clock3,
  ArrowRight,
  ExternalLink,
  Download,
  MoreHorizontal,
  Menu,
  Home
} from 'lucide-react';
import Navbar from '../components/Navbar';



interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  interests: string[];
  joinDate: string;
  eventsAttended: number;
  points: number;
  level: string;
  achievements: string[];
}

interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  attendees: number;
  maxAttendees: number;
  organizer: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isRegistered?: boolean;
  isInterested?: boolean;
  rating?: number;
}

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('all');

  // Mock student profile data
  const [studentProfile, setStudentProfile] = useState<StudentProfile>({
    id: 'student_123',
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    avatar: 'https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg',
    interests: ['programming', 'photography', 'music', 'sports'],
    joinDate: '2023-09-01',
    eventsAttended: 24,
    points: 1250,
    level: 'Event Explorer',
    achievements: ['First Event', 'Tech Enthusiast', 'Social Butterfly', 'Early Bird']
  });

  // Interest options with icons
  const interestOptions = [
    { id: 'all', name: 'All Interests', icon: Star, color: 'bg-gray-500' },
    { id: 'programming', name: 'Programming', icon: Code, color: 'bg-blue-500' },
    { id: 'gaming', name: 'Gaming', icon: Gamepad2, color: 'bg-purple-500' },
    { id: 'photography', name: 'Photography', icon: Camera, color: 'bg-green-500' },
    { id: 'sports', name: 'Sports', icon: Trophy, color: 'bg-red-500' },
    { id: 'music', name: 'Music', icon: Music, color: 'bg-yellow-500' }
  ];

    const fetchUserData = async (userId: string) => {
    console.log('Fetching user data from Firestore:', userId);
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      console.log('User data fetched:', userData);
      setStudentProfile((prevProfile) => ({
        ...prevProfile,
        name: userData?.name || '', // Update name from Firestore
      }));
    } else {
      console.log('User data does not exist in Firestore');
    }
  };

  // Check if the user is logged in and fetch data when the component is mounted
  useEffect(() => {
    const isClient = typeof window !== 'undefined'; // Check if client-side
    if (!isClient) return; // Wait for client-side mounting

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('User fetched from localStorage:', parsedUser);
      fetchUserData(parsedUser.uid);
    } else {
      console.log('No user found in localStorage');
    }
  }, []);

  // Mock events data
  const [registeredEvents] = useState<Event[]>([
    {
      id: 1,
      title: "AI & Machine Learning Summit",
      description: "Deep dive into the latest AI technologies and applications",
      image: "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg",
      date: "2024-09-15",
      time: "10:00 AM",
      location: "Tech Hub Convention Center",
      category: "programming",
      price: 299,
      attendees: 1247,
      maxAttendees: 1500,
      organizer: "Tech Events Global",
      status: "upcoming",
      isRegistered: true
    },
    {
      id: 2,
      title: "Photography Workshop",
      description: "Master the art of portrait and landscape photography",
      image: "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
      date: "2024-09-20",
      time: "2:00 PM",
      location: "Creative Arts Center",
      category: "photography",
      price: 150,
      attendees: 85,
      maxAttendees: 100,
      organizer: "Photography Club",
      status: "upcoming",
      isRegistered: true
    }
  ]);

  const [interestedEvents] = useState<Event[]>([
    {
      id: 3,
      title: "Gaming Tournament 2024",
      description: "Compete in multiple gaming categories and win prizes",
      image: "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
      date: "2024-09-25",
      time: "1:00 PM",
      location: "Gaming Arena",
      category: "gaming",
      price: 50,
      attendees: 250,
      maxAttendees: 300,
      organizer: "Gaming Society",
      status: "upcoming",
      isInterested: true
    },
    {
      id: 4,
      title: "Music Festival",
      description: "Live performances by student bands and guest artists",
      image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg",
      date: "2024-10-05",
      time: "6:00 PM",
      location: "University Amphitheater",
      category: "music",
      price: 25,
      attendees: 800,
      maxAttendees: 1000,
      organizer: "Music Club",
      status: "upcoming",
      isInterested: true
    },
    {
      id: 5,
      title: "Sports Day Championship",
      description: "Inter-college sports competition across various disciplines",
      image: "https://images.pexels.com/photos/209841/pexels-photo-209841.jpeg",
      date: "2024-10-12",
      time: "8:00 AM",
      location: "Sports Complex",
      category: "sports",
      price: 0,
      attendees: 1200,
      maxAttendees: 1500,
      organizer: "Sports Committee",
      status: "upcoming",
      isInterested: true
    }
  ]);

  const [pastEvents] = useState<Event[]>([
    {
      id: 6,
      title: "Coding Bootcamp",
      description: "Intensive programming workshop for beginners",
      image: "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg",
      date: "2024-08-15",
      time: "9:00 AM",
      location: "Computer Lab",
      category: "programming",
      price: 200,
      attendees: 120,
      maxAttendees: 150,
      organizer: "CS Department",
      status: "completed",
      rating: 4.5
    },
    {
      id: 7,
      title: "Street Photography Walk",
      description: "Explore the city and capture stunning street photographs",
      image: "https://images.pexels.com/photos/1002638/pexels-photo-1002638.jpeg",
      date: "2024-08-10",
      time: "7:00 AM",
      location: "City Downtown",
      category: "photography",
      price: 30,
      attendees: 25,
      maxAttendees: 30,
      organizer: "Photography Society",
      status: "completed",
      rating: 4.8
    },
    {
      id: 8,
      title: "Basketball Tournament",
      description: "College basketball championship finals",
      image: "https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg",
      date: "2024-07-20",
      time: "3:00 PM",
      location: "Sports Arena",
      category: "sports",
      price: 15,
      attendees: 500,
      maxAttendees: 600,
      organizer: "Basketball Club",
      status: "completed",
      rating: 4.2
    }
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const generateCertificate = (event: Event) => {
    // Create a canvas for the certificate
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 1200;
    canvas.height = 800;
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add decorative border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);
    
    // Inner border
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, canvas.width - 120, canvas.height - 120);
    
    // Certificate content
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    
    // Title
    ctx.font = 'bold 48px serif';
    ctx.fillText('CERTIFICATE OF PARTICIPATION', canvas.width / 2, 180);
    
    // Subtitle
    ctx.font = '24px serif';
    ctx.fillText('This is to certify that', canvas.width / 2, 240);
    
    // Student name
    ctx.font = 'bold 42px serif';
    ctx.fillText(studentProfile.name, canvas.width / 2, 320);
    
    // Event participation text
    ctx.font = '24px serif';
    ctx.fillText('has successfully participated in', canvas.width / 2, 380);
    
    // Event name
    ctx.font = 'bold 36px serif';
    const maxWidth = canvas.width - 200;
    const words = event.title.split(' ');
    let line = '';
    let y = 440;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 40;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);
    
    // Date and location
    ctx.font = '20px serif';
    ctx.fillText(`Held on ${formatDate(event.date)} at ${event.location}`, canvas.width / 2, y + 80);
    
    // Rating if available
    if (event.rating) {
      ctx.fillText(`Performance Rating: ${event.rating}/5`, canvas.width / 2, y + 120);
    }
    
    // Signature section
    ctx.font = '18px serif';
    ctx.fillText('Event Organizer', 300, canvas.height - 120);
    ctx.fillText(`${event.organizer}`, 300, canvas.height - 100);
    
    ctx.fillText('Date of Completion', 900, canvas.height - 120);
    ctx.fillText(formatDate(event.date), 900, canvas.height - 100);
    
    // Add some decorative elements
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    
    // Signature lines
    ctx.beginPath();
    ctx.moveTo(200, canvas.height - 80);
    ctx.lineTo(400, canvas.height - 80);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(800, canvas.height - 80);
    ctx.lineTo(1000, canvas.height - 80);
    ctx.stroke();
    
    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    }, 'image/png');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInterestIcon = (category: string) => {
    const interest = interestOptions.find(opt => opt.id === category);
    return interest?.icon || Star;
  };

  const getInterestColor = (category: string) => {
    const interest = interestOptions.find(opt => opt.id === category);
    return interest?.color || 'bg-gray-500';
  };

  const renderEventCard = (event: Event, showActions = true, isPastEvent = false) => {
    const IconComponent = getInterestIcon(event.category);
    
    return (
      <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="relative h-48">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <div className={`${getInterestColor(event.category)} text-white px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
              <IconComponent className="w-3 h-3 mr-1" />
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </div>
          </div>

          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(event.status)}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>

          {/* Registration/Interest Indicator */}
          {event.isRegistered && (
            <div className="absolute bottom-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <CheckCircle className="w-3 h-3 mr-1" />
              Registered
            </div>
          )}
          {event.isInterested && (
            <div className="absolute bottom-3 right-3 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Heart className="w-3 h-3 mr-1" />
              Interested
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-slate-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-slate-600 text-sm mb-4 line-clamp-2">{event.description}</p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-slate-500 text-sm">
              <Calendar className="w-4 h-4 mr-2" />
              <span>{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex items-center text-slate-500 text-sm">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{event.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-slate-500 text-sm">
                <Users className="w-4 h-4 mr-2" />
                <span>{event.attendees} attendees</span>
              </div>
              {event.price > 0 ? (
                <span className="text-lg font-semibold text-slate-900">${event.price}</span>
              ) : (
                <span className="text-green-600 font-semibold">Free</span>
              )}
            </div>
          </div>

          {/* Rating for past events */}
          {event.rating && (
            <div className="flex items-center mb-4">
              <span className="text-sm text-slate-600 mr-2">Your rating:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(event.rating!) ? 'text-yellow-400 fill-current' : 'text-slate-300'
                    }`}
                  />
                ))}
                <span className="text-sm text-slate-600 ml-2">{event.rating}</span>
              </div>
            </div>
          )}

          {/* Certificate button for past events */}
          {isPastEvent && (
            <div className="mb-4">
              <button
                onClick={() => generateCertificate(event)}
                className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate Certificate
              </button>
            </div>
          )}

          {showActions && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button className="flex items-center text-slate-600 hover:text-blue-600 text-sm transition-colors">
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </button>
              <div className="flex items-center space-x-3">
                <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                  <Share2 className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                  <Bookmark className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
                <button className="p-1 hover:bg-slate-100 rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <Navbar />
      <div className="p-6">
        {/* Profile Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Events Attended</p>
                <p className="text-2xl font-bold">{studentProfile.eventsAttended}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Registered Events</p>
                <p className="text-2xl font-bold">{registeredEvents.length}</p>
              </div>
              <CalendarIcon className="w-8 h-8 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Interested Events</p>
                <p className="text-2xl font-bold">{interestedEvents.length}</p>
              </div>
              <Heart className="w-8 h-8 text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Achievement Points</p>
                <p className="text-2xl font-bold">{studentProfile.points.toLocaleString()}</p>
              </div>
              <Award className="w-8 h-8 text-green-200" />
            </div>
          </div>
        </div>

        {/* Interests Filter */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Interests</h3>
          <div className="flex flex-wrap gap-3">
            {interestOptions.map((interest) => {
              const IconComponent = interest.icon;
              const isSelected = selectedInterest === interest.id;
              const isUserInterest = studentProfile.interests.includes(interest.id) || interest.id === 'all';
              
              return (
                <button
                  key={interest.id}
                  onClick={() => setSelectedInterest(interest.id)}
                  disabled={!isUserInterest && interest.id !== 'all'}
                  className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? `${interest.color} text-white shadow-lg`
                      : isUserInterest
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {interest.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8">
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: TrendingUp },
                { id: 'registered', name: 'Registered Events', icon: CheckCircle, count: registeredEvents.length },
                { id: 'interested', name: 'Interested Events', icon: Heart, count: interestedEvents.length },
                { id: 'past', name: 'Past Events', icon: Clock3, count: pastEvents.length },
                { id: 'profile', name: 'Profile', icon: User }
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {tab.name}
                    {tab.count && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Activity Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{registeredEvents.length}</p>
                  <p className="text-slate-600 text-sm">Upcoming Events</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{interestedEvents.length}</p>
                  <p className="text-slate-600 text-sm">Events to Explore</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-900">{studentProfile.achievements.length}</p>
                  <p className="text-slate-600 text-sm">Achievements Earned</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    action: 'Registered for AI & Machine Learning Summit',
                    time: '2 hours ago',
                    type: 'register',
                    icon: CheckCircle,
                    color: 'text-green-600'
                  },
                  {
                    action: 'Showed interest in Gaming Tournament 2024',
                    time: '1 day ago',
                    type: 'interest',
                    icon: Heart,
                    color: 'text-red-600'
                  },
                  {
                    action: 'Attended Photography Workshop',
                    time: '3 days ago',
                    type: 'attend',
                    icon: Camera,
                    color: 'text-blue-600'
                  },
                  {
                    action: 'Earned "Tech Enthusiast" achievement',
                    time: '1 week ago',
                    type: 'achievement',
                    icon: Award,
                    color: 'text-yellow-600'
                  }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium">{activity.action}</p>
                      <p className="text-slate-500 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {studentProfile.achievements.map((achievement, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-slate-900 text-sm">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'registered' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Your Registered Events</h2>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Find More Events
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registeredEvents.map(event => renderEventCard(event))}
            </div>
            {registeredEvents.length === 0 && (
              <div className="text-center py-12">
                <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No registered events yet</h3>
                <p className="text-slate-600 mb-6">Register for events to see them here!</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Events
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'interested' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Events You're Interested In</h2>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 mr-2" />
                Find More Events
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {interestedEvents.map(event => renderEventCard(event))}
            </div>
            {interestedEvents.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No interested events yet</h3>
                <p className="text-slate-600 mb-6">Mark events as interesting to see them here!</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Events
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Past Events</h2>
              <button className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map(event => renderEventCard(event, false, true))}
            </div>
            {pastEvents.length === 0 && (
              <div className="text-center py-12">
                <Clock3 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No past events yet</h3>
                <p className="text-slate-600 mb-6">Check back later for completed events!</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Browse Events
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-8">

            {/* Profile Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{studentProfile.eventsAttended}</h3>
                <p className="text-slate-600">Events Attended</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{studentProfile.points}</h3>
                <p className="text-slate-600">Total Points</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{studentProfile.achievements.length}</h3>
                <p className="text-slate-600">Achievements</p>
              </div>
            </div>

            {/* Interests */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Interests</h3>
              <div className="flex flex-wrap gap-3">
                {studentProfile.interests.map((interest) => {
                  const interestOption = interestOptions.find(opt => opt.id === interest);
                  if (!interestOption) return null;
                  const IconComponent = interestOption.icon;
                  
                  return (
                    <div
                      key={interest}
                      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium text-white ${interestOption.color}`}
                    >
                      <IconComponent className="w-4 h-4 mr-2" />
                      {interestOption.name}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {studentProfile.achievements.map((achievement, index) => (
                  <div key={index} className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-slate-900 text-sm">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity Timeline</h3>
              <div className="space-y-4">
                {[
                  { date: '2024-08-15', event: 'Completed Coding Bootcamp', type: 'completed' },
                  { date: '2024-08-10', event: 'Attended Street Photography Walk', type: 'attended' },
                  { date: '2024-07-20', event: 'Participated in Basketball Tournament', type: 'participated' },
                  { date: '2024-07-15', event: 'Earned "Tech Enthusiast" badge', type: 'achievement' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-slate-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium">{activity.event}</p>
                      <p className="text-slate-500 text-sm">{formatDate(activity.date)}</p>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      activity.type === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.type === 'attended' ? 'bg-blue-100 text-blue-800' :
                      activity.type === 'participated' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;