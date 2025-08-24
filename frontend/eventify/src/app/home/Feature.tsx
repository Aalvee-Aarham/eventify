'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Camera, Palette, Zap, Bot, Code, Trophy, Users, ChevronRight } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [visibleCards, setVisibleCards] = useState<number[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Check which cards are visible
      if (sectionRef.current) {
        const sectionTop = sectionRef.current.offsetTop;
        const sectionHeight = sectionRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const scrollPosition = window.scrollY;
        
        cardRefs.current.forEach((card, index) => {
          if (card) {
            const cardTop = card.offsetTop;
            const cardHeight = card.offsetHeight;
            
            if (scrollPosition + viewportHeight > cardTop + 100 && 
                scrollPosition < cardTop + cardHeight) {
              if (!visibleCards.includes(index)) {
                setVisibleCards(prev => [...prev, index]);
              }
            }
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleCards]);

  const clubs = [
    {
      icon: Camera,
      title: "Photography Club",
      description: "Photography Club is a creative space for those passionate about capturing moments and telling stories through the lens. We explore the art of photography, from basics to advanced techniques, while encouraging creativity and self-expression. Through photo walks, exhibitions, and workshops, the club helps members sharpen their skills and see the world from new perspectives.",
      gradient: "from-purple-600 via-pink-500 to-rose-400",
      hoverGradient: "hover:from-purple-600 hover:via-blue-500 hover:to-cyan-400",
      features: ["Photo Walks", "Exhibitions", "Workshops", "Creative Projects"]
    },
    {
      icon: Palette,
      title: "Cultural Club",
      description: "Cultural Club celebrates diversity, creativity, and tradition through art, music, dance, and drama. It provides a platform for students to showcase their talents, explore different cultures, and express themselves freely. By organizing festivals, performances, and creative events, the club brings people together and keeps cultural spirit alive.",
      gradient: "from-indigo-600 via-purple-500 to-pink-400",
      hoverGradient: "hover:from-purple-600 hover:via-blue-500 hover:to-cyan-400",
      features: ["Festivals", "Performances", "Art Shows", "Cultural Events"]
    },
    {
      icon: Trophy,
      title: "Sports Club",
      description: "Sports Club is a place to foster teamwork, discipline, and a spirit of healthy competition. We engage in a variety of sports and fitness activities that promote both physical and mental well-being. Through tournaments, practice sessions, and fun events, the club encourages students to stay active, build skills, and enjoy the power of sports together.",
      gradient: "from-blue-600 via-indigo-500 to-purple-400",
      hoverGradient: "hover:from-purple-600 hover:via-blue-500 hover:to-cyan-400",
      features: ["Tournaments", "Training", "Team Building", "Fitness Events"]
    },
    {
      icon: Bot,
      title: "Robotics Club",
      description: "Robotics Club is a space for creativity, innovation, and hands-on learning in the world of robotics. We design, build, and program robots while exploring automation, AI, and modern technology. Through projects, competitions, and teamwork, members gain practical skills and turn ideas into real-life solutions.",
      gradient: "from-cyan-600 via-blue-500 to-indigo-400",
      hoverGradient: "hover:from-purple-600 hover:via-blue-500 hover:to-cyan-400",
      features: ["Robot Building", "AI Projects", "Competitions", "Innovation Labs"]
    },
    {
      icon: Code,
      title: "Programming Club",
      description: "Programming and Information Club is a community for students passionate about coding and technology. Our goal is to build skills in programming, problem-solving, and IT through interactive workshops, projects, and events. By learning and working together, we inspire innovation and create opportunities for growth in the digital world.",
      gradient: "from-emerald-600 via-cyan-500 to-blue-400",
      hoverGradient: "hover:from-purple-600 hover:via-blue-500 hover:to-cyan-400",
      features: ["Coding Workshops", "Hackathons", "Tech Talks", "Open Source"]
    }
  ];

  const parallaxOffset = scrollY * 0.1;

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen bg-black py-20 overflow-hidden"
      id="features"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              transform: `translateY(${scrollY * (0.05 + Math.random() * 0.1)}px)`,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute opacity-5"
            style={{
              left: `${10 + i * 20}%`,
              top: `${20 + i * 15}%`,
              transform: `translateY(${parallaxOffset * (1 + i * 0.3)}px) rotate(${scrollY * 0.05}deg)`,
            }}
          >
            <div className={`w-32 h-32 border-2 border-gradient-to-r from-purple-400 to-cyan-400 ${i % 2 === 0 ? 'rounded-full' : 'rounded-lg rotate-45'}`} />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <h2 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
              EXPLORE CLUBS
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-cyan-400 mx-auto mb-6" />
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover your passion and connect with like-minded students through our diverse range of clubs and organizations.
          </p>
        </div>

        {/* Club Cards Grid */}
        <div className="grid gap-8 md:gap-12">
          {clubs.map((club, index) => (
            <div
              key={club.title}
ref={el => { cardRefs.current[index] = el; }}
              className={`group relative transition-all duration-1000 ${
                visibleCards.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ 
                transitionDelay: `${index * 200}ms`,
                transform: `translateY(${scrollY * 0.02 * (index + 1)}px)`
              }}
            >
              {/* Card Background with Gradient */}
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${club.gradient} p-[1px] ${club.hoverGradient} transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-purple-500/25`}>
                <div className="bg-gray-900/95 backdrop-blur-sm rounded-2xl p-8 md:p-12 h-full">
                  
                  {/* Card Content */}
                  <div className="flex flex-col lg:flex-row items-start gap-8">
                    
                    {/* Icon Section */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-lg" />
                        <div className={`relative z-10 p-6 rounded-2xl bg-gradient-to-r ${club.gradient} group-hover:rotate-6 transition-transform duration-300`}>
                          <club.icon className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-6">
                      <div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 group-hover:bg-clip-text transition-all duration-300">
                          {club.title}
                        </h3>
                        <p className="text-gray-300 text-lg leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                          {club.description}
                        </p>
                      </div>

                      {/* Features List */}
                      <div className="grid grid-cols-2 gap-3">
                        {club.features.map((feature, featureIndex) => (
                          <div 
                            key={feature}
                            className="flex items-center space-x-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500"
                            style={{ transitionDelay: `${featureIndex * 100}ms` }}
                          >
                            <ChevronRight className="w-4 h-4 text-cyan-400" />
                            <span className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Video Section */}
                    <div className="flex-shrink-0 flex flex-col items-center space-y-4">
                      <div className="relative group/video">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 rounded-xl opacity-60 group-hover:opacity-80 transition-opacity duration-300 blur-sm" />
                        <div className="relative overflow-hidden rounded-xl bg-black/50 backdrop-blur-sm border border-purple-500/30 group-hover:border-cyan-400/50 transition-all duration-300">
                          <video
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-48 h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                          >
                            <source 
                              src={`https://player.vimeo.com/external/${[
                                '434045526',
                                '454975361',
                                '429225984',
                                '456317763',
                                '471837543'
                              ][index]}.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=165`} 
                              type="video/mp4" 
                            />
                          </video>
                          
                          {/* Video Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/video:opacity-100 transition-opacity duration-300" />
                          
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/video:opacity-100 transition-all duration-300">
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                              <div className="w-0 h-0 border-l-4 border-l-white border-y-2 border-y-transparent ml-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                      

                    </div>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 rounded-2xl blur-xl" />
                  </div>
                </div>
              </div>

              {/* Floating Elements around cards */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-0 group-hover:opacity-60 group-hover:scale-150 transition-all duration-500 pointer-events-none" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-40 group-hover:scale-125 transition-all duration-700 pointer-events-none" />
            </div>
          ))}
        </div>

        
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;