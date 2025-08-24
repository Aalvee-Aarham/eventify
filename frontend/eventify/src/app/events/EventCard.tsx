// EventCard.tsx

import React from 'react';
import { FaMapMarkerAlt, FaCalendarAlt, FaUserCircle, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface EventCardProps {
id: string;
  title: string;
  shortDescription: string;
  location: string;
  startDate: string;
  endDate: string;
  eventImageUrl: string;
  interested: number;
  attendees: number;
  clubName: string;
}

const EventCard: React.FC<EventCardProps> = ({
    id,
  title,
  shortDescription,
  location,
  startDate,
  endDate,
  eventImageUrl,
  interested,
  attendees,
  clubName,
}) => {
  return (
    <motion.div
      className="max-w-xs w-full rounded-lg overflow-hidden shadow-2xl bg-white/10 backdrop-blur-lg transform transition-all duration-700 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/40"
      whileHover={{ scale: 1.05 }}
    >
      <div className="relative w-full h-64 overflow-hidden rounded-lg bg-black">
        <img
          src={eventImageUrl}
          alt={title}
          className="w-full h-full object-cover rounded-t-lg transform transition-all duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20"></div>
      </div>

      <div className="p-6 space-y-4">
        {/* Event Title */}
        <h2 className="text-3xl font-semibold text-white mb-2 transform transition-all duration-300 hover:text-cyan-400">{title}</h2>
        
        {/* Club Name */}
        <p className="text-sm text-gray-400 mb-4">{clubName}</p>
        
        {/* Event Description */}
        <p className="text-sm text-gray-300 mb-4">{shortDescription}</p>

        {/* Event Details - Location & Date */}
        <div className="space-y-3">
          {/* Location */}
          <div className="flex items-center text-gray-300 mb-3">
            <FaMapMarkerAlt className="mr-2 text-cyan-500" />
            <span>{location}</span>
          </div>

          {/* Date */}
          <div className="flex items-center text-gray-300 mb-3">
            <FaCalendarAlt className="mr-2 text-cyan-500" />
            <span>
              {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
            </span>
          </div>

          {/* Interested & Attendees */}
          <div className="flex justify-between items-center text-gray-300">
            <div className="flex items-center">
              <FaUsers className="mr-2 text-cyan-500" />
              <span>{attendees} Attendees</span>
            </div>
            <div className="flex items-center">
              <span>{interested} Interested</span>
            </div>
          </div>
        </div>

        {/* Hover Button */}
        <motion.button
          className="w-full py-2 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transform transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-blue-500/50"
          whileHover={{ scale: 1.05 }}
        >
          Attend Event
        </motion.button>
      </div>
    </motion.div>
  );
};

export default EventCard;
