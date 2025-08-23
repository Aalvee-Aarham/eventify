import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center text-white">
        <div className="font-bold text-3xl tracking-wider hover:text-yellow-300 cursor-pointer">
          Logo
        </div>
        <ul className="flex space-x-8 font-semibold">
          <li>
            <Link href="/" className="hover:text-yellow-300 transition-all duration-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/events" className="hover:text-yellow-300 transition-all duration-300">
              Events
            </Link>
          </li>
          <li>
            <Link href="/trending-events" className="hover:text-yellow-300 transition-all duration-300">
              Trending Events
            </Link>
          </li>
          <li>
            <Link href="#upcoming-events" className="hover:text-yellow-300 transition-all duration-300">
              Upcoming Events
            </Link>
          </li>
          <li>
            <Link href="#signin">
              <span className="px-4 py-2 bg-yellow-300 text-gray-800 rounded-full hover:bg-yellow-400 transition-all duration-300">
                Sign In
              </span>
            </Link>
          </li>
          <li>
            <Link href="/create-account">
              <span className="px-4 py-2 bg-transparent border-2 border-yellow-300 text-yellow-300 rounded-full hover:bg-yellow-300 hover:text-gray-800 transition-all duration-300">
                Sign Up
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
