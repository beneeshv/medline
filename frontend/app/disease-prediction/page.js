"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function DiseasePrediction() {
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const predictDisease = async (symptomsText) => {
        try {
            // Call Django backend API instead of Gemini directly
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
            
            console.log('Making request to backend API...');
            
            const response = await fetch(`${API_BASE_URL}/api/disease-prediction/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    symptoms: symptomsText
                })
            });

            console.log('Backend API Response Status:', response.status);

            const data = await response.json();
            
            if (!response.ok) {
                // Handle error responses from backend
                const errorMessage = data.error || 'Failed to analyze symptoms';
                
                if (response.status === 400) {
                    throw new Error(`Bad Request: ${errorMessage}`);
                } else if (response.status === 403) {
                    throw new Error(`API Key Error: ${errorMessage}`);
                } else if (response.status === 404) {
                    throw new Error(`Not Found: ${errorMessage}`);
                } else if (response.status === 429) {
                    throw new Error(`Rate Limit: ${errorMessage}`);
                } else if (response.status >= 500) {
                    throw new Error(`Server Error: ${errorMessage}`);
                } else {
                    throw new Error(errorMessage);
                }
            }
            
            if (!data.success || !data.prediction) {
                console.error('Invalid API response structure:', data);
                throw new Error('Unable to generate prediction. Please try again.');
            }

            console.log('Disease prediction successful');
            return data.prediction;
            
        } catch (error) {
            console.error('Disease Prediction Error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!symptoms.trim()) {
            setError('Please describe your symptoms in detail');
            return;
        }

        if (symptoms.trim().length < 10) {
            setError('Please provide more detailed information about your symptoms');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const prediction = await predictDisease(symptoms);
            setResult(prediction);
        } catch (err) {
            setError(err.message || 'Failed to analyze symptoms. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setSymptoms('');
        setResult(null);
        setError('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
            {/* Header */}
            <header className="bg-white shadow-lg border-b-4 border-purple-500">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-bold text-black flex items-center gap-3 justify-center md:justify-start">
                                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                AI Disease Prediction
                            </h1>
                            <p className="text-black mt-2 text-lg">Powered by Google Gemini AI</p>
                        </div>
                        <Link 
                            href="/" 
                            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* Critical Warning Banner */}
                <div className="bg-red-50 border-l-4 border-red-500 p-6 mb-8 rounded-lg shadow-md">
                    <div className="flex items-start">
                        <svg className="w-8 h-8 text-red-500 mr-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-red-800 font-bold text-xl mb-2">⚠️ MEDICAL DISCLAIMER</h3>
                            <p className="text-red-700 mb-2">
                                <strong>This AI tool is for INFORMATIONAL PURPOSES ONLY.</strong>
                            </p>
                            <ul className="text-red-700 text-sm space-y-1 list-disc list-inside">
                                <li>This is NOT a medical diagnosis</li>
                                <li>This does NOT replace professional medical advice</li>
                                <li>Always consult a qualified healthcare provider</li>
                                <li>In case of emergency, call emergency services immediately</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Input Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-purple-200">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-black">Describe Your Symptoms</h2>
                            <p className="text-black text-sm mt-1">Provide detailed information for accurate analysis</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="symptoms" className="block text-black font-bold mb-3 text-lg">
                                What symptoms are you experiencing?
                            </label>
                            <textarea
                                id="symptoms"
                                rows="8"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Example: I have been experiencing a high fever (102°F) for the past 3 days, along with severe headache, body aches, fatigue, and loss of appetite. I also have a dry cough and mild sore throat. The symptoms started suddenly and have been getting worse..."
                                className="w-full px-5 py-4 border-2 border-purple-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-200 transition-all text-black placeholder-gray-400 text-lg"
                                disabled={loading}
                            />
                            <div className="mt-3 flex items-start gap-2 text-sm text-black bg-purple-50 p-3 rounded-lg">
                                <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="font-semibold mb-1">💡 Tips for better results:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Include symptom duration (how long you've had them)</li>
                                        <li>Mention severity (mild, moderate, severe)</li>
                                        <li>Note any patterns (worse at certain times, etc.)</li>
                                        <li>Include relevant medical history if applicable</li>
                                        <li>Mention any medications you're currently taking</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-red-700 font-semibold">{error}</p>
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading || !symptoms.trim()}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-5 rounded-xl font-bold text-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Analyzing with AI...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                        Predict Disease
                                    </span>
                                )}
                            </button>
                            
                            {result && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-8 py-5 border-2 border-purple-300 text-black rounded-xl hover:bg-purple-50 font-bold transition-all"
                                >
                                    New Analysis
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-200 animate-fade-in">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-black">AI Analysis Results</h2>
                                <p className="text-black text-sm mt-1">Generated by Google Gemini AI</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-gray-200">
                            <div className="prose max-w-none text-black whitespace-pre-wrap leading-relaxed text-lg">
                                {result}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t-2 border-gray-200">
                            <h3 className="text-xl font-bold text-black mb-4">📋 What's Next?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Link
                                    href="/user/appointment"
                                    className="flex flex-col items-center justify-center gap-3 px-6 py-6 bg-gradient-to-br from-teal-500 to-blue-500 text-white rounded-xl hover:from-teal-600 hover:to-blue-600 transition-all font-semibold shadow-lg hover:shadow-xl text-center"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Book Doctor Appointment
                                </Link>
                                <button
                                    onClick={handleReset}
                                    className="flex flex-col items-center justify-center gap-3 px-6 py-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all font-semibold shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    New Symptom Check
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="flex flex-col items-center justify-center gap-3 px-6 py-6 bg-gradient-to-br from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all font-semibold shadow-lg hover:shadow-xl"
                                >
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Print Results
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Information Cards */}
                {!result && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-100 hover:border-purple-300 transition-all">
                            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-black text-xl mb-2">AI-Powered Analysis</h3>
                            <p className="text-sm text-black">Advanced machine learning algorithms analyze your symptoms instantly</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-100 hover:border-green-300 transition-all">
                            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-black text-xl mb-2">100% Confidential</h3>
                            <p className="text-sm text-black">Your health information is completely private and secure</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-100 hover:border-blue-300 transition-all">
                            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-black text-xl mb-2">Expert Guidance</h3>
                            <p className="text-sm text-black">Get recommendations on which specialist to consult</p>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                @media print {
                    header, button {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}
