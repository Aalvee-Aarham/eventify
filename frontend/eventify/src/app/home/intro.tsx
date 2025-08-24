'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Play, Volume2, VolumeX } from 'lucide-react';

const VideoIntroPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVideoComplete, setIsVideoComplete] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [isPermanentlyHidden, setIsPermanentlyHidden] = useState(false);
  const [particles, setParticles] = useState<Array<{id: number, left: string, top: string, duration: string, delay: string}>>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Generate particles only on client side to avoid hydration mismatch
  useEffect(() => {
    const generatedParticles = [...Array(20)].map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${2 + Math.random() * 3}s`,
      delay: `${Math.random() * 2}s`,
    }));
    setParticles(generatedParticles);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollProgress = Math.min(scrollPosition / (windowHeight * 0.3), 1);
      
      setScrollY(scrollPosition);

      // Start playing video when user scrolls down a bit
      if (scrollProgress > 0.1 && !isVideoPlaying && !isVideoComplete && videoRef.current) {
        videoRef.current.play();
        setIsVideoPlaying(true);
        setShowSkip(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isVideoPlaying, isVideoComplete]);

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (video.duration) {
        const progress = (video.currentTime / video.duration) * 100;
        setVideoProgress(progress);
      }
    };

    const handleVideoEnd = () => {
      setIsVideoComplete(true);
      setIsVideoPlaying(false);
      // Auto scroll to next section after video ends
      setTimeout(() => {
        window.scrollTo({
          top: window.innerHeight * 1.2,
          behavior: 'smooth'
        });
      }, 800);
    };

    const handleLoadedData = () => {
      setVideoLoaded(true);
    };

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('ended', handleVideoEnd);
    video.addEventListener('loadeddata', handleLoadedData);

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('ended', handleVideoEnd);
      video.removeEventListener('loadeddata', handleLoadedData);
    };
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const skipVideo = () => {
    setIsVideoComplete(true);
    setIsVideoPlaying(false);
    // Immediately hide when skipped
    setTimeout(() => {
      setIsPermanentlyHidden(true);
    }, 500);
    window.scrollTo({
      top: window.innerHeight * 1.5,
      behavior: 'smooth'
    });
  };

  // Calculate video transform based on scroll and completion
  const getVideoTransform = () => {
    if (isPermanentlyHidden) {
      return { display: 'none' };
    }
    
    if (isVideoComplete) {
      const disappearProgress = Math.min((scrollY - window.innerHeight) / (window.innerHeight * 0.3), 1);
      
      // Permanently hide when fully scrolled away
      if (disappearProgress >= 1) {
        setTimeout(() => setIsPermanentlyHidden(true), 100);
      }
      
      return {
        transform: `translateY(${-disappearProgress * 120}vh) scale(${1 - disappearProgress * 0.5})`,
        opacity: Math.max(1 - disappearProgress * 1.5, 0)
      };
    }
    return {
      transform: 'translateY(0) scale(1)',
      opacity: 1
    };
  };

  return (
    <div className="relative">
      {/* Video Intro Section */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-40 flex items-center justify-center bg-black overflow-hidden"
        style={getVideoTransform()}
      >
        {/* Loading State */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-50">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white text-xl font-semibold">Loading Experience...</p>
              <p className="text-gray-400 text-sm mt-2">Preparing something amazing</p>
            </div>
          </div>
        )}

        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-transparent to-cyan-900/30 z-10" />

        {/* Video Element */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted={isMuted}
          playsInline
          preload="metadata"
        >
          <source 
            src="/intro_eventify.webm"
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>

        {/* Video Controls Overlay */}
        {videoLoaded && (
          <div className="absolute inset-0 z-20">
            
            {/* Progress Bar */}
            {isVideoPlaying && (
              <div className="absolute top-8 left-8 right-8">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white text-sm font-medium opacity-80">
                    Club Nexus Introduction
                  </div>
                  <div className="text-white text-sm opacity-80">
                    {Math.round(videoProgress)}%
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-1 backdrop-blur-sm">
                  <div 
                    className="bg-gradient-to-r from-purple-400 to-cyan-400 h-1 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Control Buttons */}
            {isVideoPlaying && (
              <div className="absolute top-8 right-8 flex space-x-3">
                <button
                  onClick={toggleMute}
                  className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-white hover:bg-black/50 transition-all duration-200 border border-white/20"
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                {showSkip && (
                  <button
                    onClick={skipVideo}
                    className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all duration-200 border border-white/20 text-sm font-medium"
                  >
                    Skip Intro
                  </button>
                )}
              </div>
            )}

            {/* Initial Play Prompt */}
            {!isVideoPlaying && !isVideoComplete && videoLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-full animate-ping opacity-20" />
                  </div>
                  
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-black text-white">
                      Welcome to
                    </h1>
                    <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      CLUB NEXUS
                    </h2>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                      Your journey into the future of university club management begins here
                    </p>
                  </div>

                  {/* Scroll Indicator */}
                  <div className="flex flex-col items-center space-y-3 animate-bounce">
                    <p className="text-white text-sm font-medium">Scroll to begin experience</p>
                    <ChevronDown className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Video Complete State */}
            {isVideoComplete && scrollY < window.innerHeight && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto">
                    <div className="w-8 h-8 border-l-2 border-b-2 border-white transform rotate-45 translate-x-1" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-3xl font-bold text-white">Ready to Explore?</h3>
                    <p className="text-gray-300">Continue scrolling to discover our features</p>
                  </div>

                  <div className="flex flex-col items-center space-y-2 animate-bounce">
                    <ChevronDown className="w-6 h-6 text-cyan-400" />
                    <ChevronDown className="w-6 h-6 text-cyan-400 -mt-3 opacity-60" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Floating Particles - Only render on client side */}
        {particles.length > 0 && (
          <div className="absolute inset-0 z-15 pointer-events-none">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full opacity-30"
                style={{
                  left: particle.left,
                  top: particle.top,
                  animation: `twinkle ${particle.duration} ease-in-out infinite`,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Spacer to allow scrolling */}
      <div className="h-[250vh]" />

      {/* Next Section Placeholder */}
      <div className="min-h-screen bg-gray-900 flex items-center justify-center relative z-30">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-white">Your Content Continues Here</h2>
          <p className="text-gray-400 text-lg">This is where your Hero, Features, and other components will go</p>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-cyan-400 mx-auto" />
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

export default VideoIntroPage;