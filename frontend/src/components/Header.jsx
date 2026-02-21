import { Link } from "react-router-dom";

const Header = () => {
  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0f1432] backdrop-blur-md shadow-2xl">
      <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center text-white">
        <Link to="/" className="text-xl font-bold font-serif">CardioNeuro</Link>
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="text-sm hover:text-[#8ebae2] transition">Home</Link>
          <Link to="/about" className="text-sm hover:text-[#8ebae2] transition">AboutUs</Link>
          <Link to="/login" className="bg-[#8ebae2] text-[#050a1e] px-6 py-1.5 rounded-lg font-medium hover:bg-[#a5c9eb] transition">
            login
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;