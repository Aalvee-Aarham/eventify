import { Calendar, MapPin, Clock, Users } from "lucide-react";

interface TrendingEvent {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
}

interface TrendingEventCardProps {
  event: TrendingEvent;
  rank: string;
}

const TrendingEventCard: React.FC<TrendingEventCardProps> = ({ event, rank }) => {
  return (
    <div
      key={event.id}
      className="event-card bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/25"
      style={{
        animation: `slideInUp 0.6s ease-out ${event.id * 0.1}s both`,
      }}
    >
      {/* Rank Badge */}
      <div className="absolute top-4 left-4 z-20">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {rank}
        </div>
      </div>

      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300">
          {event.title}
        </h3>
        <p className="text-slate-300 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-3">
          <div className="flex items-center text-slate-300 text-sm">
            <Calendar className="w-4 h-4 mr-2 text-blue-400" />
            <span>{event.date}</span>
            <Clock className="w-4 h-4 ml-4 mr-2 text-green-400" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center text-slate-300 text-sm">
            <MapPin className="w-4 h-4 mr-2 text-red-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Event Attendees */}
        <div className="flex items-center text-slate-300 text-sm mt-3">
          <Users className="w-4 h-4 mr-2 text-purple-400" />
          <span>{event.attendees} attendees</span>
        </div>

        {/* Action Button */}
        <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:from-blue-500 hover:to-purple-500 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent">
          Learn More
        </button>
      </div>
    </div>
  );
};

export default TrendingEventCard;
