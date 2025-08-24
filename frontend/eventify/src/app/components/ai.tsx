'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, X, Minimize2, MessageCircle, Sparkles, Zap, Heart, Calendar, Users, MapPin } from 'lucide-react';
import { model, fetchEvents } from '../firebase'; // Adjust path as needed

interface Event {
  title: string;
  clubName: string;
  startDate: string;
  endDate: string;
  location: string;
  shortDescription: string;
  longDescription: string;
  eventImageUrl: string;
  attendies: number;
  interested: number;
  createdAt: string;
}

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const FloatingAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi! I'm ClubBot 🤖 Your AI assistant for club management. I can help you with events, club information, and more!", sender: 'bot', timestamp: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [robotPosition, setRobotPosition] = useState({ x: 50, y: 50 });
  const [targetPosition, setTargetPosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const robotRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load events on component mount
  useEffect(() => {
    const loadEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const eventsData = await fetchEvents();
        setEvents(eventsData);
        console.log('Events loaded:', eventsData.length);
      } catch (error) {
        console.error('Error loading events:', error);
      } finally {
        setIsLoadingEvents(false);
      }
    };
    
    loadEvents();
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Floating animation logic
  useEffect(() => {
    if (isOpen) return;

    const moveRobot = () => {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const robotSize = 80;
      
      const newX = Math.random() * (windowWidth - robotSize - 100) + 50;
      const newY = Math.random() * (windowHeight - robotSize - 200) + 100;
      
      setTargetPosition({ x: newX, y: newY });
      setTimeout(moveRobot, 3000 + Math.random() * 4000);
    };

    setTimeout(moveRobot, 2000);
  }, [isOpen]);

  // Smooth position interpolation
  useEffect(() => {
    const animate = () => {
      setRobotPosition(prev => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.02,
        y: prev.y + (targetPosition.y - prev.y) * 0.02
      }));
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [targetPosition]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Create context with events data using the correct structure
      const eventsContext = events.map(event => {
        const startDate = new Date(event.startDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        const endDate = new Date(event.endDate).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
        
        return `Event: "${event.title}"
Club: ${event.clubName}
Start: ${startDate}
End: ${endDate}
Location: ${event.location}
Description: ${event.shortDescription}
Details: ${event.longDescription}
Attendees: ${event.attendies} registered, ${event.interested} interested
Status: ${new Date(event.startDate) > new Date() ? 'Upcoming' : 'Past'}`;
      }).join('\n\n');

      const currentDate = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      const prompt = `
        You are ClubBot, an AI assistant for a university club management system called "Eventify". You are helpful, friendly, and knowledgeable about clubs and events.
        
        Current Date: ${currentDate}
        
        Available University Clubs:
        - Photography Club: Creative space for capturing moments and storytelling through photography
        - Cultural Club: Celebrates diversity, creativity, and tradition through art, music, dance, and drama
        - Sports Club: Fosters teamwork, discipline, and healthy competition through various sports
        - Robotics Club: Space for creativity, innovation, and hands-on learning in robotics and AI
        - Programming Club: Community for students passionate about coding and technology
        
        Current Events Data:
        ${eventsContext || 'No events currently available.'}
        
        User Question: ${userMessage}
        
        Instructions:
        - Be conversational, helpful, and enthusiastic
        - Use appropriate emojis to make responses engaging
        - When discussing events, mention specific details like dates, locations, attendee counts
        - If asked about upcoming events, focus on events with start dates in the future
        - If asked about past events, mention completed events
        - Provide registration/interest information when relevant
        - If you don't have specific information, be honest but still helpful
        - Keep responses concise but informative (2-4 sentences max)
        - Use a friendly tone suitable for university students
        - When mentioning events, include key details like date, location, and club name
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm having trouble connecting right now, but I'm still here to help! Try asking me about our clubs or events. 🤖✨";
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(currentInput);
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. But I'm still here to help with any club or event questions! 🤖💫",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = async (actionText: string) => {
    setInputText('');
    
    const newMessage: Message = {
      id: Date.now(),
      text: actionText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);

    try {
      const aiResponse = await generateAIResponse(actionText);
      
      const botResponse: Message = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: Date.now() + 1,
        text: "I'm having some trouble, but I can still help you with club information! 🤖",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { text: "Show upcoming events", icon: "📅" },
    { text: "Which clubs are most active?", icon: "🏆" },
    { text: "How do I join a club?", icon: "🤝" },
    { text: "Events in Dhaka", icon: "📍" }
  ];

  return (
    <>
      {/* Floating Robot */}
      {!isOpen && (
        <div
          ref={robotRef}
          className="fixed z-50 cursor-pointer"
          style={{
            left: `${robotPosition.x}px`,
            top: `${robotPosition.y}px`,
            transition: 'transform 0.3s ease',
            transform: `scale(${isHovered ? 1.1 : 1}) rotate(${Math.sin(Date.now() * 0.002) * 5}deg)`
          }}
          onClick={() => setIsOpen(true)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 rounded-full blur-xl opacity-60 animate-pulse" />
          
          {/* Robot Body */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-full flex items-center justify-center border-4 border-white/20 shadow-2xl backdrop-blur-sm">
            {/* Robot Face */}
            <div className="relative">
              {/* Eyes */}
              <div className="flex space-x-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
              </div>
              {/* Mouth */}
              <div className="w-6 h-1 bg-white/80 rounded-full" />
            </div>
            
            {/* Antenna */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-0.5 h-4 bg-white/60" />
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
            </div>
          </div>

          {/* Floating Particles */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-70"
              style={{
                left: `${20 + i * 8}px`,
                top: `${15 + Math.sin(Date.now() * 0.003 + i) * 10}px`,
                animation: `float ${1 + i * 0.2}s ease-in-out infinite`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}

          {/* Speech Bubble Hint */}
          {isHovered && (
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium shadow-lg animate-bounce">
              Ask me anything! 💬
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white" />
            </div>
          )}
        </div>
      )}

      {/* Chatbox */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${isMinimized ? 'scale-95' : 'scale-100'}`}>
          <div className="bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-2xl w-96 max-w-[90vw]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-gradient-to-r from-purple-600/20 via-blue-500/20 to-cyan-400/20 rounded-t-2xl">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">ClubBot AI</h3>
                  <p className="text-gray-400 text-sm flex items-center">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {isLoadingEvents ? 'Loading events...' : `${events.length} events loaded`}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="h-65 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white'
                            : 'bg-gray-800/80 text-gray-200 border border-gray-700/50'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800/80 border border-gray-700/50 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                <div className="px-4 py-2 border-t border-gray-700/50">
                  <p className="text-gray-400 text-xs mb-2">Quick actions:</p>
                  <div className="flex flex-wrap gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAction(action.text)}
                        disabled={isTyping}
                        className="text-xs px-3 py-1 bg-gray-800/60 hover:bg-purple-600/30 text-gray-300 hover:text-white rounded-full border border-gray-700/50 hover:border-purple-500/50 transition-all duration-200 flex items-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{action.icon}</span>
                        <span>{action.text}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-700/50">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSendMessage()}
                      placeholder={isTyping ? "ClubBot is thinking..." : "Ask me anything..."}
                      disabled={isTyping}
                      className="flex-1 bg-gray-800/80 border border-gray-700/50 rounded-xl px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/25 transition-all disabled:opacity-50"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputText.trim() || isTyping}
                      className="p-2 bg-gradient-to-r from-purple-600 to-cyan-400 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .scrollbar-thin {
          scrollbar-width: thin;
        }
        
        .scrollbar-thumb-purple-600 {
          scrollbar-color: rgb(147, 51, 234) rgb(31, 41, 55);
        }
        
        .scrollbar-track-gray-800 {
          scrollbar-color: rgb(31, 41, 55) transparent;
        }
      `}</style>
    </>
  );
};

export default FloatingAIAssistant;