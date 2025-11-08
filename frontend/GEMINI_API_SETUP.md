# Gemini API Setup Guide

## Getting a New API Key

The disease prediction feature uses Google's Gemini AI API. If you're seeing API errors, you likely need to generate a new API key.

### Step 1: Get Your API Key

1. Visit **Google AI Studio**: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"** or **"Get API Key"**
4. Copy your new API key (it will look like: `AIzaSy...`)

### Step 2: Configure Your API Key

You have two options:

#### Option A: Environment Variable (Recommended)

1. Create a file named `.env.local` in the `frontend` folder
2. Add this line (replace with your actual key):
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=AIzaSy_YOUR_ACTUAL_KEY_HERE
   ```
3. Restart the development server

#### Option B: Update Code Directly

1. Open `frontend/app/disease-prediction/page.js`
2. Find line 14: `const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 'AIzaSy...'`
3. Replace the hardcoded key with your new key

### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart
npm run dev
```

## Troubleshooting

### Error 403: API Key Invalid
- Your API key is wrong, expired, or doesn't have permission
- Generate a new key from the link above

### Error 429: Rate Limit Exceeded
- You've made too many requests
- Wait 1-5 minutes before trying again
- Consider upgrading your quota at Google AI Studio

### Error 400: Bad Request
- Check that you're entering symptoms with enough detail (at least 10 characters)

### Error 404: Not Found
- The model endpoint may have changed
- Contact support or check Google's documentation

## API Limits (Free Tier)

- **Rate Limit**: 60 requests per minute
- **Daily Quota**: Check your quota at Google AI Studio
- For production use, consider upgrading to a paid plan

## Security Notes

- **NEVER** commit your `.env.local` file to Git
- **NEVER** share your API key publicly
- Rotate your API key regularly for security

## Testing Your Setup

After configuring your API key:
1. Go to http://localhost:3000/disease-prediction
2. Enter symptoms: "I have a headache and fever for 3 days"
3. Click "Predict Disease"
4. Check the browser console (F12) for detailed logs

If you see logs showing "Using API Key: AIza...Vlmk", your key is configured!

## Need Help?

- Gemini API Docs: https://ai.google.dev/docs
- Google AI Studio: https://makersuite.google.com
