import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Activity, Apple, Moon, Smile, AlertCircle } from 'lucide-react';

const HealthTips = () => {
  const navigate = useNavigate();

  const tips = [
    {
      icon: <Heart size={32} />,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
      title: 'Monitor Blood Pressure',
      description: 'Keep your blood pressure in check. High blood pressure is a leading risk factor for stroke.',
      tips: [
        'Check blood pressure regularly',
        'Reduce salt intake',
        'Take prescribed medications',
        'Manage stress effectively',
      ],
    },
    {
      icon: <Activity size={32} />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      title: 'Stay Physically Active',
      description: 'Regular exercise strengthens your heart and improves circulation.',
      tips: [
        'Aim for 150 minutes of moderate exercise weekly',
        'Include both cardio and strength training',
        'Take regular walking breaks',
        'Find activities you enjoy',
      ],
    },
    {
      icon: <Apple size={32} />,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      title: 'Eat a Healthy Diet',
      description: 'A balanced diet can significantly reduce stroke risk.',
      tips: [
        'Eat plenty of fruits and vegetables',
        'Choose whole grains over refined',
        'Limit saturated and trans fats',
        'Reduce sugar and processed foods',
      ],
    },
    {
      icon: <Moon size={32} />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
      title: 'Get Quality Sleep',
      description: 'Good sleep is essential for cardiovascular health.',
      tips: [
        'Aim for 7-9 hours per night',
        'Maintain a consistent sleep schedule',
        'Create a relaxing bedtime routine',
        'Address sleep apnea if present',
      ],
    },
    {
      icon: <Smile size={32} />,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
      title: 'Manage Stress',
      description: 'Chronic stress can increase stroke risk over time.',
      tips: [
        'Practice mindfulness or meditation',
        'Engage in hobbies you enjoy',
        'Maintain social connections',
        'Seek professional help if needed',
      ],
    },
    {
      icon: <AlertCircle size={32} />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      title: 'Avoid Risk Factors',
      description: 'Eliminate or reduce known stroke risk factors.',
      tips: [
        'Quit smoking completely',
        'Limit alcohol consumption',
        'Maintain a healthy weight',
        'Control diabetes and cholesterol',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#030616] text-white">
      {/* Header */}
      <div className="bg-[#0f1432] sticky top-0 z-10 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-[#1a1f47] rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-2xl font-bold font-serif">Health Tips & Prevention</h1>
            </div>
            <Heart className="text-[#8ebae2]" size={32} />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-gradient-to-r from-[#8ebae2] to-[#5e17eb] rounded-lg p-8 mb-10">
          <h2 className="text-3xl font-bold mb-3">Take Control of Your Heart Health</h2>
          <p className="text-lg opacity-90 max-w-3xl">
            Small lifestyle changes can make a big difference in reducing your stroke risk. 
            Follow these evidence-based tips to maintain a healthy heart and brain.
          </p>
        </div>

        {/* Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => (
            <div
              key={index}
              className="bg-[#0f1432] rounded-lg p-6 border border-[#1a1f47] hover:border-[#8ebae2] transition"
            >
              <div className={`inline-block p-3 ${tip.bgColor} rounded-lg mb-4`}>
                <div className={tip.color}>{tip.icon}</div>
              </div>
              
              <h3 className="text-xl font-bold mb-2">{tip.title}</h3>
              <p className="text-gray-400 text-sm mb-4">{tip.description}</p>
              
              <ul className="space-y-2">
                {tip.tips.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className={`${tip.color} mt-1`}>•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-10 bg-[#0f1432] rounded-lg p-8 border border-[#1a1f47] text-center">
          <h3 className="text-2xl font-bold mb-3">Ready to Check Your Risk?</h3>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Use our AI-powered prediction tool to assess your stroke risk and get personalized recommendations.
          </p>
          <button
            onClick={() => navigate('/predict')}
            className="bg-[#8ebae2] text-[#030616] px-8 py-3 rounded-lg font-semibold hover:bg-[#a5c9eb] transition inline-flex items-center gap-2"
          >
            <Activity size={20} />
            Start Health Assessment
          </button>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <p className="text-yellow-400 text-sm text-center">
            <strong>Note:</strong> These tips are for educational purposes only and do not replace professional medical advice. 
            Always consult with your healthcare provider for personalized recommendations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthTips;
