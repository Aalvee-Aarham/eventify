'use client';

import { useState, useEffect } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, Search, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../components/Navbar";
import EventCard from "./EventCard";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; // Import Firebase configuration

const EventPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedType, setSelectedType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch events from Firestore
  useEffect(() => {
    const fetchEvents = async () => {
      const eventsCollection = collection(db, "events");
      const eventSnapshot = await getDocs(eventsCollection);
      const eventList = eventSnapshot.docs.map((doc) => ({
        id: doc.id, // Add the Firestore doc ID
        ...doc.data()
      }));
      setEvents(eventList);
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    gsap.fromTo(
      ".event-card",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.1 }
    );
  }, [events]);

  // Handle pagination
  const handlePagination = (page: number) => {
    setCurrentPage(page);
  };

  // Handle filter and sorting
  const handleFilterSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    const filtered = events.filter((event) =>
      selectedType ? event.type === selectedType : true
    );
    setEvents(filtered);
  };

  const totalItems = events.length;
  const itemsPerPage = 4;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <Navbar />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Discover
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {" "}Amazing Events
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Join extraordinary experiences, connect with like-minded people, and create unforgettable memories.
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search events, locations, or descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex gap-4">
              {["all", "iapc", "cultural", "sports", "idc", "cdc"].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedType(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedType === category
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {category === "all" ? "All Events" : category.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {events
            .filter((event) => {
              if (!searchQuery) return true;
              return (
                event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.location.toLowerCase().includes(searchQuery.toLowerCase())
              );
            })
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                shortDescription={event.description}
                location={event.location}
                startDate={event.date}
                endDate={event.endDate}
                eventImageUrl={event.eventImageUrl}
                interested={event.interested}  // Fetch dynamic "interested" from Firestore
                attendees={event.attendies}  // Fetch dynamic "attendees" from Firestore
                clubName={event.clubName}    // Fetch dynamic "clubName" from Firestore
              />
            ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center space-x-4 mt-8">
          <button
            onClick={() => handlePagination(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-white">{currentPage} / {totalPages}</span>
          <button
            onClick={() => handlePagination(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-all duration-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default EventPage;
