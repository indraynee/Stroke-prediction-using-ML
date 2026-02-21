import React from 'react';

// Icons import
import heartIcon from '../assets/features_heart.png';
import explainableIcon from '../assets/explainable_ai.png';
import riskIcon from '../assets/features_risk_percentage.png';
import healthIcon from '../assets/health_recommendation.png';
import dataIcon from '../assets/data_visualisation.png';
import userIcon from '../assets/user_login.png';

const Features = () => {
  const featureData = [
    { title: "Heart & Stroke Dashboard", desc: "Unified AI system predicting cardiovascular risk.", img: heartIcon },
    { title: "Explainable AI", desc: "Transparent predictions showing key risk factors.", img: explainableIcon },
    { title: "Risk Percentage Score", desc: "Get 0–100% probability instead of simple yes/no.", img: riskIcon },
    { title: "Health Recommendations", desc: "Personalized diet, exercise, and lifestyle guidance.", img: healthIcon },
    { title: "Data Visualization", desc: "Interactive charts and real-time health risk tracking.", img: dataIcon },
    { title: "User Login & History", desc: "Secure profiles with encrypted data monitoring.", img: userIcon },
  ];

  return (
    <section className="w-full py-20 px-6 md:px-20 bg-white">
      <div className="w-full"> 
        <h2 className="text-4xl font-serif mb-12 text-gray-900">Features</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {featureData.map((feature, index) => (
            <div
              key={index}
              className="w-full p-8 rounded-[2rem] border border-gray-100 bg-white text-gray-900 transition-all duration-300 cursor-pointer group shadow-sm hover:bg-[#050A30] hover:text-white hover:shadow-xl hover:-translate-y-2"
            >
              <div className="mb-4">
                <img 
                  src={feature.img} 
                  alt={feature.title} 
                  className="w-10 h-10 object-contain group-hover:brightness-200 transition-all duration-300"
                />
              </div>
              <h3 className="text-xl font-bold mb-3 leading-tight">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500 group-hover:text-gray-300 transition-colors">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Features;