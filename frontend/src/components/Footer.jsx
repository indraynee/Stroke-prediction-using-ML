import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#9FA7BF] text-white py-16 px-6 md:px-20 mt-auto">
      <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="col-span-1">
          <span className="font-bold text-2xl block mb-6">CardioNeuro</span>
          <p className="text-white/80 text-sm">Stay in the loop with our latest AI medical updates.</p>
        </div>
        <div>
          <h4 className="font-bold mb-6">Company</h4>
          <ul className="text-white/80 space-y-3 text-sm">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Support</h4>
          <ul className="text-white/80 space-y-3 text-sm">
            <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            <li><Link to="/help" className="hover:text-white transition">Help Centre</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-6">Social</h4>
          <ul className="text-white/80 space-y-3 text-sm">
            <li><a href="#" className="hover:text-white">Instagram</a></li>
            <li><a href="#" className="hover:text-white">LinkedIn</a></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-white/20 text-xs text-white/60 flex justify-between">
        <span>© 2026 CardioNeuro. All Rights Reserved</span>
        <div className="flex gap-4">
          <span>Privacy Policy</span>
          <span>Terms</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;