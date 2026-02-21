import React from 'react';
import HeroSection from '../components/HeroSection';
import Feature from '../components/Feature'; // Change 'Features' to 'Feature'
import Header from '../components/Header';

const Landing = () => {
  return (
    <div className="w-full">
      <Header />
      <HeroSection />
      <Feature /> 
    </div>
  );
};

export default Landing;