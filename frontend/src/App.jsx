import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import DashboardHome from "./pages/DashboardHome";
import Predict from "./pages/Predict";


function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#f8f9fa]"> 
        
        <main className="flex-grow w-full">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/predict" element={<Predict />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;