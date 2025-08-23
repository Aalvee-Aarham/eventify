import Navbar from "../components/Navbar";
import TrendingEventCard from "./TrendingEventCard"; // Import the TrendingEventCard component

const trendingEventsData = [
  {
    id: 1,
    title: "AI & Machine Learning Summit",
    description: "Join industry leaders to explore the future of artificial intelligence and its applications.",
    imageUrl: "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg",
    date: "2024-09-15",
    time: "10:00 AM",
    location: "Tech Hub, Bay Area",
    attendees: 1200,
  },
  {
    id: 2,
    title: "Cultural Heritage Festival",
    description: "Celebrate diverse traditions with music, dance, and authentic cuisines from around the world.",
    imageUrl: "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg",
    date: "2024-09-20",
    time: "2:00 PM",
    location: "Central Park Amphitheater",
    attendees: 500,
  },
  {
    id: 3,
    title: "Annual Sports Championship",
    description: "Witness thrilling competitions across multiple sports categories with top athletes.",
    imageUrl: "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg",
    date: "2024-09-25",
    time: "9:00 AM",
    location: "Olympic Sports Complex",
    attendees: 1800,
  },
  {
    id: 4,
    title: "Innovation & Design Conference",
    description: "Discover cutting-edge design thinking and innovative solutions for modern challenges.",
    imageUrl: "https://images.pexels.com/photos/976866/pexels-photo-976866.jpeg",
    date: "2024-09-30",
    time: "11:00 AM",
    location: "Design Center Downtown",
    attendees: 180,
  },
];

const TrendingEventsPage = () => {
  // Sort events by number of attendees (descending order)
  const sortedEvents = [...trendingEventsData].sort((a, b) => b.attendees - a.attendees);
  
  return (
      <><Navbar /><div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 tracking-tight">
          Trending
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {" "}Events
          </span>
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Check out the most popular events based on the number of attendees!
        </p>
      </div>

      {/* Trending Events List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {sortedEvents.map((event, index) => {
            const rank = index === 0 ? "One" : index === 1 ? "Two" : index === 2 ? "Three" : "Four";
            return (
              <TrendingEventCard key={event.id} event={event} rank={rank} />
            );
          })}
        </div>
      </div>
    </div></>
  );
};

export default TrendingEventsPage;
