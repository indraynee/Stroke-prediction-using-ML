import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="w-full sticky top-0 z-50 bg-[#0f1432] backdrop-blur-md shadow-2xl">
      <div className="w-full px-6 md:px-12 py-4 flex justify-between items-center text-white">
        <Link to="/" className="text-xl font-bold font-serif">CardioNeuro</Link>
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="text-sm hover:text-[#8ebae2] transition">Home</Link>
          <Link to="/about" className="text-sm hover:text-[#8ebae2] transition">AboutUs</Link>
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#8ebae2] font-medium hidden md:inline">Hi, {username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500/20 text-red-100 border border-red-500/30 px-6 py-1.5 rounded-lg font-medium hover:bg-red-500/30 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-[#8ebae2] text-[#050a1e] px-6 py-1.5 rounded-lg font-medium hover:bg-[#a5c9eb] transition">
              login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;