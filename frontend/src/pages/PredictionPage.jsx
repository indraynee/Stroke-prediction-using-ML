import React from 'react';
import RiskForm from '../components/RiskForm';

const PredictionPage = () => {
    return (
        <div className="prediction-page">
            <h1>Heart & Stroke Risk Prediction</h1>
            <p>Enter your health details below to get a risk assessment.</p>
            <RiskForm />
        </div>
    );
};

export default PredictionPage;
