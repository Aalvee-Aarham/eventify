'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth, db } from '../firebase';
import { signOut } from 'firebase/auth';
import { FaUserCircle, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaHome, FaCalendarAlt, FaFire, FaTimes } from 'react-icons/fa';
import { HiMenuAlt3 } from 'react-icons/hi';
import { doc, getDoc } from 'firebase/firestore';

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>(''); // Store user role
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserName(userDocSnap.data().name);
          setUserRole(userDocSnap.data().role); // Set user role
        }
      } else {
        setUser(null);
        setUserName('');
        setUserRole(''); // Reset user role if logged out
      }
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled 
          ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800/50 shadow-2xl' 
          : 'bg-gradient-to-r from-gray-900 via-black to-gray-900'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="group cursor-pointer">
                <h1 className="text-2xl lg:text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:via-blue-500 hover:to-cyan-400 transition-all duration-700 ease-out transform group-hover:scale-105">
                  Eventify
                </h1>
                <div className="h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <div className="ml-10 flex items-center space-x-8">
                <NavLink href="/" icon={<FaHome />} text="Home" />
                <NavLink href="/events" icon={<FaCalendarAlt />} text="Events" />
                <NavLink href="/trending-events" icon={<FaFire />} text="Trending" />
              </div>
            </div>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center space-x-4">
              {!user ? (
                <>
                  <Link href="/log-in">
                    <button className="group relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full overflow-hidden transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/25 transform hover:scale-105">
                      <span className="relative flex items-center">
                        <FaSignInAlt className="mr-2 transition-transform group-hover:rotate-12" />
                        Sign In
                      </span>
                    </button>
                  </Link>
                  <Link href="/create-account">
                    <button className="group relative px-6 py-2.5 text-sm font-semibold text-cyan-400 border border-cyan-500/50 rounded-full hover:bg-cyan-500/10 transition-all duration-300 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transform hover:scale-105">
                      <span className="relative flex items-center">
                        <FaUserPlus className="mr-2 transition-transform group-hover:rotate-12" />
                        Sign Up
                      </span>
                    </button>
                  </Link>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
                    <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                      <FaUserCircle className="text-white text-sm" />
                    </div>
                    <span className="text-sm font-medium text-white">{userName || 'User'}</span>
                  </div>
                  <Link href={userRole === 'admin' ? '/admin/dashboard' : '/student-dashboard'}>
                    <button className="group relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-full hover:from-green-400 hover:to-green-500 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 transform hover:scale-105">
                      <span className="relative flex items-center">
                        <FaUserCircle className="mr-2" />
                        Dashboard
                      </span>
                    </button>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="group relative px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-full hover:from-red-400 hover:to-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 transform hover:scale-105"
                  >
                    <span className="relative flex items-center">
                      <FaSignOutAlt className="mr-2 transition-transform group-hover:-rotate-12" />
                      Logout
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
              >
                <HiMenuAlt3 className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={closeMenu}>
            <div className="absolute right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 via-black to-gray-900 shadow-2xl transform transition-transform duration-300 ease-out">
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                    Menu
                  </h2>
                  <button
                    onClick={closeMenu}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                  >
                    <FaTimes className="h-5 w-5" />
                  </button>
                </div>

                <nav className="space-y-4 mb-8">
                  <MobileNavLink href="/" icon={<FaHome />} text="Home" onClick={closeMenu} />
                  <MobileNavLink href="/events" icon={<FaCalendarAlt />} text="Events" onClick={closeMenu} />
                  <MobileNavLink href="/trending-events" icon={<FaFire />} text="Trending Events" onClick={closeMenu} />
                </nav>

                <div className="border-t border-gray-800 pt-6 space-y-4">
                  {!user ? (
                    <>
                      <Link href="/log-in" onClick={closeMenu}>
                        <button className="w-full group relative px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl transition-all duration-300 hover:from-cyan-400 hover:to-blue-500 transform hover:scale-105">
                          <span className="flex items-center justify-center">
                            <FaSignInAlt className="mr-2" />
                            Sign In
                          </span>
                        </button>
                      </Link>
                      <Link href="/create-account" onClick={closeMenu}>
                        <button className="w-full group relative px-6 py-3 text-sm font-semibold text-cyan-400 border border-cyan-500/50 rounded-xl hover:bg-cyan-500/10 transition-all duration-300 transform hover:scale-105">
                          <span className="flex items-center justify-center">
                            <FaUserPlus className="mr-2" />
                            Sign Up
                          </span>
                        </button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center space-x-3 px-4 py-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                          <FaUserCircle className="text-white text-lg" />
                        </div>
                        <span className="font-medium text-white">{userName || 'User'}</span>
                      </div>
                      <Link href={userRole === 'admin' ? '/admin/dashboard' : '/student-dashboard'}>
                        <button
                          onClick={closeMenu}
                          className="w-full group relative px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-xl hover:from-green-400 hover:to-green-500 transition-all duration-300 transform hover:scale-105"
                        >
                          <span className="flex items-center justify-center">
                            <FaUserCircle className="mr-2" />
                            Dashboard
                          </span>
                        </button>
                      </Link>
                      <button
                        onClick={() => {handleSignOut(); closeMenu();}}
                        className="w-full group relative px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 rounded-xl hover:from-red-400 hover:to-red-500 transition-all duration-300 transform hover:scale-105"
                      >
                        <span className="flex items-center justify-center">
                          <FaSignOutAlt className="mr-2" />
                          Logout
                        </span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

// Desktop Navigation Link Component
const NavLink: React.FC<{ href: string; icon: React.ReactNode; text: string }> = ({ href, icon, text }) => (
  <Link href={href}>
    <div className="group relative px-4 py-2 rounded-xl transition-all duration-300 hover:bg-gray-800/50">
      <div className="flex items-center space-x-2 text-gray-300 group-hover:text-white transition-colors duration-300">
        <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
          {icon}
        </span>
        <span className="font-medium">{text}</span>
      </div>
      <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 group-hover:w-full group-hover:left-0 transition-all duration-300 ease-out rounded-full"></div>
    </div>
  </Link>
);

// Mobile Navigation Link Component
const MobileNavLink: React.FC<{ href: string; icon: React.ReactNode; text: string; onClick: () => void }> = ({ href, icon, text, onClick }) => (
  <Link href={href} onClick={onClick}>
    <div className="group flex items-center space-x-4 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300">
      <span className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
        {icon}
      </span>
      <span className="font-medium">{text}</span>
    </div>
  </Link>
);

export default Navbar;
