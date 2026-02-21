import React, { useState } from 'react';
import { predictRisk } from '../services/api';

const RiskForm = () => {
    const [formData, setFormData] = useState({
        age: 30,
        hypertension: 0,
        heart_disease: 0,
        avg_glucose_level: 100,
        bmi: 25,
        gender: 'Female',
        smoking_status: 'never smoked'
    });
    
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);
        
        try {
            // Convert types if necessary or let backend handle simple coercion
            const response = await predictRisk(formData);
            setResult(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to get prediction. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="risk-form-container">
            <h2>Stroke Risk Prediction</h2>
            <form onSubmit={handleSubmit} className="risk-form">
                <div className="form-group">
                    <label>Age:</label>
                    <input 
                        type="number" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>BMI:</label>
                    <input 
                        type="number" 
                        step="0.1" 
                        name="bmi" 
                        value={formData.bmi} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Avg Glucose Level:</label>
                    <input 
                        type="number" 
                        step="0.1" 
                        name="avg_glucose_level" 
                        value={formData.avg_glucose_level} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                
                <div className="form-group">
                    <label>Hypertension:</label>
                    <select name="hypertension" value={formData.hypertension} onChange={handleChange}>
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Heart Disease:</label>
                    <select name="heart_disease" value={formData.heart_disease} onChange={handleChange}>
                        <option value={0}>No</option>
                        <option value={1}>Yes</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Smoking Status:</label>
                    <select name="smoking_status" value={formData.smoking_status} onChange={handleChange}>
                        <option value="never smoked">Never Smoked</option>
                        <option value="formerly smoked">Formerly Smoked</option>
                        <option value="smokes">Smokes</option>
                        <option value="Unknown">Unknown</option>
                    </select>
                </div>
                
                <div className="form-group">
                    <label>Gender:</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                
                <button type="submit" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Predict Risk'}
                </button>
            </form>
            
            {error && <div className="error-message">{error}</div>}
            
            {result && (
                <div className="result-container" style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h3>Prediction Result: {result.risk_level} Risk</h3>
                    <p>Probability: {result.probability_percent}%</p>
                    <p>{result.message}</p>
                </div>
            )}
        </div>
    );
};

export default RiskForm;
