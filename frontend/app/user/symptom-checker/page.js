"use client";

import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SymptomChecker() {
    const router = useRouter();
    const [symptoms, setSymptoms] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const analyzeSymptomsWithGemini = async (symptomsText) => {
        const GEMINI_API_KEY = 'AIzaSyBDi2OIpCR6FiynU_WUIbmGcs0N__clVmk';
        
        const prompt = `You are a medical AI assistant. A patient has reported the following symptoms: "${symptomsText}"

Please analyze these symptoms and provide:
1. Possible diseases or conditions (list 3-5 most likely)
2. Severity level (Mild, Moderate, Severe, Emergency)
3. Recommended actions
4. When to see a doctor
5. General advice

Format your response in a clear, structured way. Remember to always advise consulting a healthcare professional for accurate diagnosis.

IMPORTANT: This is for informational purposes only and not a substitute for professional medical advice.`;

        try {
            // Using the correct Gemini API v1beta endpoint with gemini-pro model
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: prompt
                            }]
                        }]
                    })
                }
            );

            console.log('API Response Status:', response.status);

            if (!response.ok) {
                let errorMessage = `API Error: ${response.status}`;
                try {
                    const errorData = await response.json();
                    console.error('Gemini API Error Response:', errorData);
                    errorMessage = errorData.error?.message || errorMessage;
                } catch (e) {
                    const errorText = await response.text();
                    console.error('Gemini API Error Text:', errorText);
                    errorMessage = errorText || errorMessage;
                }
                
                // Provide helpful error messages
                if (response.status === 400) {
                    throw new Error('Invalid API request. Please try again with different symptoms.');
                } else if (response.status === 403) {
                    throw new Error('API key authentication failed. Please check your API key configuration.');
                } else if (response.status === 404) {
                    throw new Error('API endpoint not found. The Gemini API service may be unavailable.');
                } else {
                    throw new Error(errorMessage);
                }
            }

            const data = await response.json();
            console.log('API Response Data:', data);
            
            if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
                console.error('Invalid API response structure:', data);
                throw new Error('Unable to generate analysis. Please try again.');
            }

            const generatedText = data.candidates[0].content.parts[0].text;
            return generatedText;
        } catch (error) {
            console.error('Gemini API Error:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!symptoms.trim()) {
            setError('Please describe your symptoms');
            return;
        }

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const analysis = await analyzeSymptomsWithGemini(symptoms);
            setResult(analysis);
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
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
            {/* Header */}
            <header className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-black">Apollo Health</h1>
                            <p className="text-sm text-black mt-1">AI-Powered Symptom Checker</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link 
                                href="/user/home" 
                                className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition-colors font-medium"
                            >
                                Back to Home
                            </Link>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('userId');
                                    localStorage.removeItem('userName');
                                    router.push('/');
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                {/* Warning Banner */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-lg">
                    <div className="flex items-start">
                        <svg className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-amber-800 font-bold text-lg mb-1">Medical Disclaimer</h3>
                            <p className="text-amber-700 text-sm">
                                This AI symptom checker is for informational purposes only and does not constitute medical advice. 
                                Always consult with a qualified healthcare professional for accurate diagnosis and treatment.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Symptom Input Form */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-teal-100 rounded-lg">
                            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-black">Describe Your Symptoms</h2>
                            <p className="text-black text-sm">Be as detailed as possible for better analysis</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="symptoms" className="block text-black font-semibold mb-3">
                                What symptoms are you experiencing?
                            </label>
                            <textarea
                                id="symptoms"
                                rows="6"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder="Example: I have a fever of 101°F, headache, body aches, and sore throat for the past 2 days..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all text-black placeholder-gray-400"
                                disabled={loading}
                            />
                            <p className="text-sm text-black mt-2">
                                💡 Tip: Include duration, severity, and any other relevant details
                            </p>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                                <p className="text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={loading || !symptoms.trim()}
                                className="flex-1 bg-gradient-to-r from-teal-500 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-3">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Analyzing Symptoms...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                        </svg>
                                        Analyze Symptoms
                                    </span>
                                )}
                            </button>
                            
                            {result && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="px-6 py-4 border-2 border-gray-300 text-black rounded-xl hover:bg-gray-100 font-semibold transition-all"
                                >
                                    New Check
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="bg-white rounded-2xl shadow-lg p-8 animate-fade-in">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-green-100 rounded-lg">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-black">Analysis Results</h2>
                                <p className="text-black text-sm">AI-powered symptom analysis</p>
                            </div>
                        </div>

                        <div className="prose max-w-none">
                            <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                                <div className="text-black whitespace-pre-wrap leading-relaxed">
                                    {result}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t-2 border-gray-200">
                            <h3 className="text-lg font-bold text-black mb-4">What would you like to do next?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Link
                                    href="/user/appointment"
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-semibold shadow-md hover:shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Book an Appointment
                                </Link>
                                <button
                                    onClick={handleReset}
                                    className="flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-black rounded-xl hover:bg-gray-200 transition-all font-semibold"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Check New Symptoms
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Information Cards */}
                {!result && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-black mb-2">Fast Analysis</h3>
                            <p className="text-sm text-black">Get instant AI-powered insights about your symptoms</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-black mb-2">Confidential</h3>
                            <p className="text-sm text-black">Your health information is private and secure</p>
                        </div>

                        <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-black mb-2">Expert Guidance</h3>
                            <p className="text-sm text-black">Book appointments with qualified doctors</p>
                        </div>
                    </div>
                )}
            </main>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s ease-out;
                }
            `}</style>
        </div>
    );
}
