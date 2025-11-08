# Appointment Booking & Payment Integration - Complete Fix

## Issues Fixed

### 1. ✅ Appointment Booking Endpoint (404 Error)
**Problem:** Frontend was calling `/api/appointments/create/` but backend only had `/appointments/book/`

**Solution:** Added alternative endpoint in `urls.py`:
```python
path('api/appointments/create/', views.book_appointment, name='create_appointment'),
```

### 2. ✅ Razorpay API Keys Updated
**Problem:** Old API keys were being used

**Solution:** Updated keys in both backend and frontend:
- Backend: `jango/myapp/views.py` (Line 658-659)
- Frontend: `frontend/app/utils/razorpay.js` (Line 2)

**New Keys:**
- Key ID: `rzp_test_X5OfG2jiWrAzSj`
- Key Secret: `SsCovWWZSwB1TGd1rSoIiwF3`

### 3. ✅ Past Date Filtering
**Already Implemented:** Backend automatically filters out past dates in `get_doctor_time_slots()`:
```python
slots = TimeSlot.objects.filter(
    doctor_id=doctor_id,
    date__gte=today,  # Only future or today's dates
    is_available=True
)
```

### 4. ✅ Booked Slot Filtering
**Already Implemented:** Backend checks `is_slot_available` property which considers:
- Maximum bookings per slot
- Current booking count
- Slot availability status

### 5. ✅ Doctor Availability Display
**Fixed:** Updated frontend to check `available` flag correctly in weekly schedule display

## How The System Works Now

### Booking Flow

1. **User Selects Doctor**
   - Frontend fetches doctor's time slots via `/api/doctor/{id}/timeslots/`
   - Only shows future dates and available slots

2. **User Selects Date & Time**
   - Slots are filtered by selected date
   - Only available slots are shown (not booked)

3. **User Books Appointment**
   - POST to `/api/appointments/create/`
   - Backend creates appointment with status='Pending'
   - Backend creates bill with ₹100 consultation fee
   - Returns: `{ appointment, bill, payment_required: true, amount: 100 }`

4. **Payment Screen Appears**
   - Shows appointment details and bill
   - "Pay with Razorpay" button

5. **User Pays via Razorpay**
   - Creates Razorpay order (₹100 in paise = 10000)
   - Opens Razorpay payment modal
   - User completes payment

6. **Payment Verification**
   - Backend verifies Razorpay signature
   - Updates bill payment_status to 'Paid'
   - Updates appointment status to 'Confirmed'
   - Marks time slot as booked

7. **Success**
   - User sees confirmation message
   - Appointment appears in "My Appointments"

## Files Modified

### Backend (Django)

1. **`jango/myapp/urls.py`**
   - Added `/api/appointments/create/` endpoint (Line 26)

2. **`jango/myapp/views.py`**
   - Updated Razorpay API keys (Lines 658-659)
   - Existing booking logic already handles:
     - Slot availability checking
     - Bill creation (₹100 fee)
     - Payment requirement

### Frontend (Next.js)

1. **`frontend/app/user/appointment/page.js`**
   - Fixed availability endpoint: `/api/doctors/{id}/get-availability/` (Line 84)
   - Updated booking response handling (Lines 260-272)
   - Added console logging for debugging

2. **`frontend/app/utils/razorpay.js`**
   - Updated Razorpay Key ID (Line 2)

3. **`frontend/app/components/PaymentButton.js`**
   - Already properly integrated with Razorpay
   - Handles payment flow and verification

## Testing Checklist

### ✅ Booking Tests
- [ ] Can see all doctors with slot counts
- [ ] Can select a doctor and see their availability
- [ ] Can select a date from dropdown
- [ ] Can see time slots for selected date
- [ ] Can select a time slot
- [ ] Can enter symptoms
- [ ] Can click "Confirm and Book Appointment"

### ✅ Payment Tests
- [ ] Payment screen appears after booking
- [ ] Shows correct amount (₹100)
- [ ] Razorpay modal opens
- [ ] Can complete test payment
- [ ] Success message appears after payment
- [ ] Appointment appears in "My Appointments"

### ✅ Validation Tests
- [ ] Cannot book past dates (backend filters them out)
- [ ] Cannot book already booked slots (shows as unavailable)
- [ ] Cannot book without selecting slot
- [ ] Error messages display correctly

## API Endpoints Reference

### Booking & Slots
- `GET /api/doctors/` - List all doctors
- `GET /api/doctors/{id}/get-availability/` - Get doctor's weekly schedule
- `GET /api/doctor/{id}/timeslots/` - Get available time slots (future only)
- `POST /api/appointments/create/` - Create appointment

### Payment
- `POST /api/create-razorpay-order/` - Create Razorpay order
- `POST /api/verify-payment/` - Verify payment signature
- `GET /api/bills/appointment/{id}/` - Get appointment bill

## Payment Details

- **Consultation Fee:** ₹100 (fixed for all doctors)
- **Payment Gateway:** Razorpay
- **Test Mode:** Yes (using test API keys)
- **Currency:** INR (Indian Rupees)

## Important Notes

1. **Slot Availability Logic:**
   - Slots are automatically marked unavailable when booked
   - Backend checks `is_slot_available` property
   - Frontend only displays available slots

2. **Date Filtering:**
   - Backend automatically filters `date__gte=today`
   - No past dates are returned to frontend
   - Users cannot book historical appointments

3. **Payment Flow:**
   - Appointment created with status='Pending'
   - Payment required before confirmation
   - After successful payment:
     - Appointment status → 'Confirmed'
     - Bill payment_status → 'Paid'
     - Time slot marked as booked

4. **Test Razorpay:**
   - Use test card: 4111 1111 1111 1111
   - Any future expiry date
   - Any CVV

## Console Logs for Debugging

The system now logs:
- Number of slots fetched for each doctor
- Appointment response data
- Payment processing steps

Check browser console (F12) for detailed logs.

## Next Steps

1. Restart Django backend server
2. Refresh frontend page
3. Test complete booking flow
4. Verify payment integration
5. Check appointment appears in user dashboard

## Support

If issues persist:
1. Check browser console for errors
2. Check Django terminal for backend errors
3. Verify Razorpay keys are correct
4. Ensure database has time slots generated
5. Clear browser cache and try again
