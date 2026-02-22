import React, { useState, useEffect } from 'react';

const Predict = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  
  // Animation state for typing effect
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const steps = [
    // SECTION 1: Patient Information
    { id: 'age', section: 1, label: 'Age', type: 'number', min: 1, max: 100, msg: "Firstly, let's start with Section 1: Patient Information. Please enter your Age (1-100)." },
    { id: 'gender', section: 1, label: 'Gender', type: 'select', options: ['Male', 'Female'], msg: "Great. Now, please select your Gender." },
    { id: 'bmi', section: 1, label: 'BMI', type: 'number', min: 10, max: 60, msg: "What is your BMI? (Usually between 10-60)." },
    { id: 'residence_type', section: 1, label: 'Residence Type', type: 'select', options: ['Urban', 'Rural'], msg: "What is your Residence Type?" },
    { id: 'work_type', section: 1, label: 'Work Type', type: 'select', options: ['Private', 'Self-employed', 'Govt Job', 'Children', 'Never Worked'], msg: "What is your Work Type?" },
    { id: 'ever_married', section: 1, label: 'Ever Married', type: 'select', options: ['Yes', 'No'], msg: "Have you ever been married?" },

    // SECTION 2: Cardiovascular Parameters
    { id: 'cp', section: 2, label: 'Chest Pain Type', type: 'select', options: ['Typical Angina', 'Atypical Angina', 'Non-anginal', 'Asymptomatic'], msg: "Hello there! To start your assessment for Cardiovascular Parameters, please select Chest Pain Type (cp)." },
    { id: 'trestbps', section: 2, label: 'Resting Blood Pressure', type: 'number', min: 80, max: 200, msg: "Please enter your Resting Blood Pressure (trestbps) in mmHg." },
    { id: 'chol', section: 2, label: 'Cholesterol', type: 'number', min: 100, max: 600, msg: "What is your Cholesterol (chol) level in mg/dl?" },
    { id: 'fbs', section: 2, label: 'Fasting Blood Sugar', type: 'select', options: ['True (>120 mg/dl)', 'False'], msg: "Is your Fasting Blood Sugar (fbs) greater than 120 mg/dl?" },
    { id: 'restecg', section: 2, label: 'Rest ECG', type: 'select', options: ['Normal', 'ST-T Wave Abnormality', 'Left Ventricular Hypertrophy'], msg: "What are your Rest ECG results?" },
    { id: 'thalach', section: 2, label: 'Max Heart Rate', type: 'number', min: 60, max: 220, msg: "What is your Maximum Heart Rate achieved (thalach)?" },
    { id: 'exang', section: 2, label: 'Exercise Induced Angina', type: 'select', options: ['Yes', 'No'], msg: "Do you experience Exercise Induced Angina (exang)?" },
    { id: 'oldpeak', section: 2, label: 'ST Depression', type: 'number', min: 0, max: 10, msg: "Enter your ST Depression (oldpeak) value." },
    { id: 'slope', section: 2, label: 'Slope', type: 'select', options: ['Upsloping', 'Flat', 'Downsloping'], msg: "What is the Slope of the peak exercise ST segment?" },
    { id: 'ca', section: 2, label: 'CA', type: 'number', min: 0, max: 4, msg: "Number of major vessels (0-3) colored by flourosopy (ca)?" },
    { id: 'thal', section: 2, label: 'Thal', type: 'select', options: ['Normal', 'Fixed Defect', 'Reversible Defect'], msg: "Finally for this section, select your Thal result." },

    // SECTION 3: Stroke & Lifestyle
    { id: 'hypertension', section: 3, label: 'Hypertension', type: 'select', options: ['Yes', 'No'], msg: "Almost done! For Section 3: Stroke & Lifestyle Risk, do you have Hypertension?" },
    { id: 'heart_disease', section: 3, label: 'Heart Disease History', type: 'select', options: ['Yes', 'No'], msg: "Do you have a history of Heart Disease?" },
    { id: 'avg_glucose_level', section: 3, label: 'Glucose Level', type: 'number', min: 50, max: 300, msg: "Please enter your Average Glucose Level." },
    { id: 'smoking_status', section: 3, label: 'Smoking Status', type: 'select', options: ['Never Smoked', 'Formerly Smoked', 'Smokes', 'Unknown'], msg: "What is your Smoking Status?" },
  ];

  const stepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

// Typing Effect Logic
  useEffect(() => {
    setDisplayedText(""); // Reset text when step changes
    setIsTyping(true);
    let i = 0; // <--- MAKE SURE THIS STARTS AT 0
    const fullText = stepData.msg;
    
    const typingInterval = setInterval(() => {
      // Use fullText.charAt(i) to get every letter including the first one
      setDisplayedText((prev) => prev + fullText.charAt(i));
      i++;
      
      if (i >= fullText.length) {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 30); 

    return () => clearInterval(typingInterval);
  }, [currentStep, stepData.msg]);

  const handleNext = (val) => {
    const value = val || inputValue;
    
    if (stepData.type === 'number') {
      if (!value || value < stepData.min || value > stepData.max) {
        setError(`Please enter a value between ${stepData.min} and ${stepData.max}`);
        return;
      }
    }

    setFormData({ ...formData, [stepData.id]: value });
    setInputValue("");
    setError("");

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      alert("Analysis Submitted!");
    }
  };

  return (
    <div className="min-h-screen animate-dots flex flex-col items-center justify-center p-4">
      {/* 1. Header with Highlighter Effect */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-[#5e17eb] inline-block">
          <span className="highlighter">Welcome to CardioNeuro</span>
        </h1>
      </div>

      <div className="w-full max-w-4xl space-y-12">
        {/* 2. Progress Bar */}
        <div className="w-full bg-[#f3f4f6] rounded-full h-4 overflow-hidden shadow-inner">
          <div 
            className="bg-[#5e17eb] h-full transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_#5e17eb]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* 3. Animated Chat Bubble */}
        <div className="flex flex-col items-start max-w-2xl min-h-[120px]">
          <div className="chat-bubble relative">
            <p className="text-[#374151] text-lg font-medium leading-relaxed">
              {displayedText}
              {isTyping && <span className="inline-block w-1 h-5 ml-1 bg-[#5e17eb] animate-pulse">|</span>}
            </p>
          </div>
          {error && <p className="text-red-500 text-sm mt-2 ml-2 font-semibold italic">⚠️ {error}</p>}
        </div>

        {/* 4. Action Area (Input/Buttons only show when typing is near finished or immediately) */}
        <div className={`flex flex-wrap gap-4 justify-end items-center transition-opacity duration-500 ${isTyping ? 'opacity-50' : 'opacity-100'}`}>
          {stepData.type === 'select' ? (
            stepData.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleNext(opt)}
                className="px-8 py-3 border-2 border-[#5e17eb] text-[#5e17eb] rounded-xl font-semibold text-lg hover:bg-[#5e17eb] hover:text-white transition-all transform active:scale-95 shadow-sm"
              >
                {opt}
              </button>
            ))
          ) : (
            <div className="flex gap-3 w-full md:w-auto">
              <input 
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="border-2 border-gray-200 rounded-xl p-4 text-lg w-full md:w-64 focus:border-[#5e17eb] outline-none shadow-sm"
                placeholder={`Enter ${stepData.label}...`}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                autoFocus
              />
              <button 
                onClick={() => handleNext()}
                className="bg-[#5e17eb] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#4a11b8] shadow-lg transition-all"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Predict;