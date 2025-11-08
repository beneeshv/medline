'use client';

import { useState } from 'react';
import { loadRazorpayScript, createRazorpayOrder, initializeRazorpayPayment } from '../utils/razorpay';

export default function PaymentButton({ bill, onPaymentSuccess, onPaymentError }) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = async () => {
        setIsProcessing(true);
        
        try {
            // Load Razorpay script
            const scriptLoaded = await loadRazorpayScript();
            if (!scriptLoaded) {
                throw new Error('Failed to load Razorpay script');
            }

            // Create order on backend
            const orderData = await createRazorpayOrder(bill.total_amount, bill.id);
            
            // Get user info from localStorage
            const userId = localStorage.getItem('userId');
            const userName = localStorage.getItem('userName') || 'User';
            const userEmail = localStorage.getItem('userEmail') || '';
            const userPhone = localStorage.getItem('userPhone') || '';

            // Initialize Razorpay payment
            const paymentResponse = await initializeRazorpayPayment({
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.id,
                description: `Bill Payment for Dr. ${bill.appointment?.doctor?.name || 'Unknown'}`,
                prefill: {
                    name: userName,
                    email: userEmail,
                    contact: userPhone,
                },
            });

            // Verify payment on backend
            const verificationResponse = await fetch('http://localhost:8000/api/verify-payment/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    razorpay_order_id: paymentResponse.razorpay_order_id,
                    razorpay_payment_id: paymentResponse.razorpay_payment_id,
                    razorpay_signature: paymentResponse.razorpay_signature,
                    bill_id: bill.id,
                }),
            });

            if (verificationResponse.ok) {
                const result = await verificationResponse.json();
                if (result.status === 'success') {
                    onPaymentSuccess(bill.id, paymentResponse);
                } else {
                    throw new Error('Payment verification failed');
                }
            } else {
                throw new Error('Payment verification failed');
            }

        } catch (error) {
            console.error('Payment error:', error);
            onPaymentError(error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
                isProcessing
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
        >
            {isProcessing ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                </div>
            ) : (
                'Pay with Razorpay'
            )}
        </button>
    );
}
