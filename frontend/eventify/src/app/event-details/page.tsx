'use client';
import React, { useEffect, useState, useRef } from 'react';
import { Calendar, MapPin, Clock, Users, Heart, ChevronDown, Star, Share2, Bookmark, User, X, LogIn, UserPlus, Sparkles, Check } from 'lucide-react';
import Navbar from '../components/Navbar';
import { auth, db } from '../firebase'; // Import auth here
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from 'firebase/firestore'; // Import Firestore functions
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-hot-toast';

const EVENT_ID = "IxVCFZ4tiOvug0eLzQEs"; // Replace with your actual event ID

const EventDetailsPage = () => {
  const [user, setUser] = useState<any>(null); // Add user state
  const [eventData, setEventData] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isInterested, setIsInterested] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const organizerRef = useRef<HTMLDivElement>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch event data from Firestore
  useEffect(() => {
    const fetchEventData = async () => {
      const docRef = doc(db, "events", EVENT_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setEventData(docSnap.data());
      } else {
        setEventData(null);
        console.log("No such document!");
      }
    };
    fetchEventData();
  }, []);

  // Check if user already registered/interested
  useEffect(() => {
    if (!user || !eventData) {
      setIsRegistered(false);
      setIsInterested(false);
      return;
    }
    const fetchUserStatus = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setIsRegistered(
          Array.isArray(data.registeredEvents) &&
          data.registeredEvents.some((e: any) => e.id === EVENT_ID)
        );
        setIsInterested(
          Array.isArray(data.interestedEvents) &&
          data.interestedEvents.some((e: any) => e.id === EVENT_ID)
        );
      }
    };
    fetchUserStatus();
  }, [user, eventData]);

  // Calculate event duration in days
  const calculateEventDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // GSAP Animations
  useEffect(() => {
    const loadGSAP = async () => {
      const gsapModule = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      const gsap = gsapModule.default || gsapModule;

      gsap.registerPlugin(ScrollTrigger);

      gsap.to(heroRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

      gsap.fromTo(contentRef.current, { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: contentRef.current, start: "top 85%" }
      });

      gsap.fromTo(descriptionRef.current, { x: -40, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: descriptionRef.current, start: "top 85%" }
      });

      gsap.fromTo(locationRef.current, { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: locationRef.current, start: "top 85%" }
      });

      gsap.fromTo(organizerRef.current, { x: 40, opacity: 0 }, {
        x: 0, opacity: 1, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: organizerRef.current, start: "top 85%" }
      });
    };

    loadGSAP();
  }, []);

  const handleRegister = async () => {
    if (!user) {
      setShowLoginModal(true);
      toast.error("Please log in or register first.");
      return;
    }
    setLoading(true);
    const eventRef = doc(db, "events", EVENT_ID);
    const userRef = doc(db, "users", user.uid);
    const eventObj = {
      id: EVENT_ID,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
    };
    try {
      if (!isRegistered) {
        await updateDoc(eventRef, { attendees: increment(1) });
        await updateDoc(userRef, { registeredEvents: arrayUnion(eventObj) });
        setIsRegistered(true);
        toast.success("Registered for event!");
      } else {
        await updateDoc(eventRef, { attendees: increment(-1) });
        await updateDoc(userRef, { registeredEvents: arrayRemove(eventObj) });
        setIsRegistered(false);
        toast("Unregistered from event.");
      }
    } catch (e) {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  const handleInterest = async () => {
    if (!user) {
      setShowLoginModal(true);
      toast.error("Please log in or register first.");
      return;
    }
    setLoading(true);
    const eventRef = doc(db, "events", EVENT_ID);
    const userRef = doc(db, "users", user.uid);
    const eventObj = {
      id: EVENT_ID,
      startDate: eventData.startDate,
      endDate: eventData.endDate,
    };
    try {
      if (!isInterested) {
        await updateDoc(eventRef, { interested: increment(1) });
        await updateDoc(userRef, { interestedEvents: arrayUnion(eventObj) });
        setIsInterested(true);
        toast.success("Marked as interested!");
      } else {
        await updateDoc(eventRef, { interested: increment(-1) });
        await updateDoc(userRef, { interestedEvents: arrayRemove(eventObj) });
        setIsInterested(false);
        toast("Interest removed.");
      }
    } catch (e) {
      toast.error("Something went wrong.");
    }
    setLoading(false);
  };

  if (!eventData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-300 text-lg">Loading amazing content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse absolute"></div>
        <div className="bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse absolute delay-1000"></div>
        <div className="top-1/2 left-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse absolute delay-500"></div>
      </div>

      {/* Navigation placeholder */}
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-end overflow-hidden">
        <div ref={heroRef} className="absolute inset-0 w-full h-full">
          <img
            src={eventData.eventImageUrl}
            alt={eventData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/40 to-blue-900/40"></div>
        </div>

        <div className="relative z-10 w-full px-8 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Calendar className="w-4 h-4 text-purple-300" />
                <span className="text-purple-200 font-medium text-sm">
                  {new Date(eventData.startDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span className="text-yellow-200 font-medium text-sm">Featured Event</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
                {eventData.title}
              </span>
            </h1>

            <p className="text-xl text-gray-200 max-w-3xl font-light leading-relaxed mb-8">
              {eventData.shortDescription}
            </p>

          </div>
        </div>

        <div className="reletive bottom-6 left-1/2 transform -translate-x-1/2 text-white/70 animate-bounce">
          <ChevronDown className="w-8 h-8" />
        </div>
      </div>

      {/* Main Content */}
      <div ref={contentRef} className="relative z-20 -mt-20">
        <div className="max-w-6xl mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div ref={descriptionRef} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  About This Event
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">
                  {eventData.longDescription}
                </p>

                <div className="flex flex-wrap gap-3">
                  {['AI & Machine Learning', 'Blockchain', 'Sustainable Tech', 'Innovation', 'Networking', 'Future Tech'].map((tag, index) => (
                    <span
                      key={tag}
                      className={`px-4 py-2 rounded-full text-sm font-medium border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                        index % 3 === 0 ? 'bg-purple-500/20 border-purple-500/30 text-purple-200' :
                          index % 3 === 1 ? 'bg-blue-500/20 border-blue-500/30 text-blue-200' :
                            'bg-pink-500/20 border-pink-500/30 text-pink-200'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div ref={locationRef} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-500">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  Event Location
                </h3>

                <div className="flex items-start gap-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                    <MapPin className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-xl mb-2">San Francisco Convention Center</h4>
                    <p className="text-gray-300 mb-4">{eventData.location}</p>
                    <button className="text-blue-400 font-medium hover:text-blue-300 transition-colors flex items-center gap-2 group">
                      View on Map
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </button>
                  </div>
                </div>

                <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10">
                  <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                    alt="Venue"
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-8">
              {/* Organizer */}
              <div ref={organizerRef} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                <h3 className="font-bold text-white mb-4">Organized by</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    TC
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white text-lg">{eventData.clubName}</h4>
                    <p className="text-gray-400 text-sm">150+ events hosted</p>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                      <span className="text-gray-400 text-sm ml-2">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleRegister}
                  disabled={loading}
                  className={`w-full py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 ${
                    isRegistered
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-500/25'
                      : 'bg-gradient-to-r from-purple-500 via-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                  } ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl'}`}
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : isRegistered ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Star className="w-5 h-5" />
                  )}
                  {isRegistered ? 'Unregister' : 'Register Now'}
                </button>

                <button
                  onClick={handleInterest}
                  disabled={loading}
                  className={`w-full py-3 px-8 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 ${
                    isInterested
                      ? 'bg-gradient-to-r from-pink-500/20 to-pink-600/20 border border-pink-500/50 text-pink-300'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInterested ? 'text-pink-400 fill-current' : ''}`} />
                  {isInterested ? 'Interested' : 'Show Interest'}
                </button>

                <button className="w-full py-3 px-8 rounded-xl bg-white/5 border border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3">
                  <Bookmark className="w-5 h-5" />
                  Save Event
                </button>
              </div>

              {/* Related Events */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-500">
                <h3 className="font-bold text-white mb-4">You might also like</h3>
                <div className="space-y-4">
                  {[
                    { title: "AI Workshop 2025", date: "March 21, 2025", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=100&q=80" },
                    { title: "Blockchain Summit", date: "March 25, 2025", image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=100&q=80" }
                  ].map((event, index) => (
                    <div key={index} className="flex gap-4 p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-14 h-14 rounded-lg object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-white group-hover:text-purple-300 transition-colors">{event.title}</h4>
                        <p className="text-gray-400 text-sm">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default EventDetailsPage;