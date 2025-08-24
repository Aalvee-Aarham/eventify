'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, Users, Calendar, Trophy, Zap } from 'lucide-react';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger initial animation
    setTimeout(() => setIsVisible(true), 500);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const parallaxOffset = scrollY * 0.5;
  const fadeOffset = Math.min(scrollY * 0.002, 1);

  return (
    <section className="relative h-screen overflow-hidden bg-black">
      {/* Background Video */}
      <div 
        className="absolute inset-0 z-0"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 z-10"></div>
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover opacity-60"
        >
          <source src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=165&oauth2_token_id=57447761" type="video/mp4" />
        </video>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              transform: `translateY(${scrollY * (0.1 + Math.random() * 0.3)}px)`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-30 h-full flex items-center justify-center px-4">
        <div 
          className="text-center max-w-5xl mx-auto"
          style={{ 
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: 1 - fadeOffset 
          }}
        >
          {/* Main Title */}
          <div className="mb-8">
            <h1 
              className={`text-6xl md:text-8xl font-black mb-6 transition-all duration-1500 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-20 opacity-0'
              }`}
              style={{ transitionDelay: '300ms' }}
            >
              <span className=" bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:via-blue-500 hover:to-cyan-400 transition-all duration-700 ease-out transform group-hover:scale-105">
                Mangage
              </span>
              <br />
              <span className="text-white">Clubs</span>
            </h1>
            
            <div 
              className={`w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-600 mx-auto mb-8 transition-all duration-1000 ${
                isVisible 
                  ? 'scale-x-100 opacity-100' 
                  : 'scale-x-0 opacity-0'
              }`}
              style={{ transitionDelay: '800ms' }}
            />
          </div>

          {/* Subtitle */}
          <p 
            className={`text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1200 ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '600ms' }}
          >
            Revolutionize your university experience. Connect, manage, and thrive with the most advanced club management platform.
          </p>

          {/* Feature Icons */}
          <div 
            className={`flex justify-center space-x-8 mb-12 transition-all duration-1500 ${
              isVisible 
                ? 'translate-y-0 opacity-100' 
                : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '900ms' }}
          >
            {[
              { icon: Users, label: 'Connect', color: 'text-cyan-400' },
              { icon: Calendar, label: 'Organize', color: 'text-purple-600' },
              { icon: Trophy, label: 'Achieve', color: 'text-cyan-300' },
              { icon: Zap, label: 'Innovate', color: 'text-green-300' }
            ].map((item, index) => (
              <div 
                key={item.label}
                className="group cursor-pointer transition-transform duration-300 hover:scale-110"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-800 to-blue-500 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-300 blur-md"></div>
                  <item.icon 
                    className={`w-12 h-12 ${item.color} relative z-10 group-hover:rotate-12 transition-transform duration-300`}
                  />
                </div>
                <p className="text-sm text-gray-400 mt-2 group-hover:text-white transition-colors duration-300">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}

        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-64 h-64 border border-cyan-400/10 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${20 + i * 20}%`,
              transform: `translateY(${scrollY * (0.2 + i * 0.1)}px) rotate(${scrollY * 0.1}deg)`,
              animation: `float ${4 + i}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 transition-all duration-2000 ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : 'translate-y-10 opacity-0'
        }`}
        style={{ 
          transitionDelay: '1500ms',
          opacity: 1 - fadeOffset * 2 
        }}
      >
        <div className="flex flex-col items-center space-y-2 text-cyan-400 animate-bounce">
          <span className="text-sm font-medium">Scroll to explore</span>
          <ChevronDown className="w-6 h-6" />
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;