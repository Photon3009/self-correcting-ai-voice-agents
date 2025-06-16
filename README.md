# Self-Correcting AI Voice Agent Platform

A real-time voice AI agent platform built with Next.js and LiveKit that provides intelligent voice interactions with self-correction capabilities.

## Features

- 🎙️ Real-time voice communication
- 🤖 AI-powered voice agent with self-correction
- 🔄 Automatic error detection and correction

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 18 or higher)
- npm or yarn package manager
- Git

## LiveKit Setup

### 1. Create a LiveKit Account

1. Go to [LiveKit Cloud](https://cloud.livekit.io/)
2. Sign up for a free account or log in if you already have one
3. Create a new project

### 2. Get Your LiveKit Credentials

After creating your project, you'll need to obtain three key values:

#### LIVEKIT_API_KEY
- Navigate to your project dashboard
- Go to **Settings** → **Keys**
- Copy the **API Key** (starts with `API`)

#### LIVEKIT_API_SECRET
- In the same **Keys** section
- Copy the **Secret Key** (long alphanumeric string)

#### LIVEKIT_URL
- From your project dashboard
- Copy the **WebSocket URL**
- Format: `wss://your-project-name.livekit.cloud`
- Replace `your-project-name` with your actual project subdomain

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ai-voice-agent-platform.git
cd ai-voice-agent-platform
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Create Environment File

Create a `.env.local` file in the root directory of your project:

```bash
touch .env.local
```

### 4. Add Environment Variables

Open `.env.local` in your text editor and add the following variables with your actual LiveKit credentials:

```env
# LiveKit Configuration
LIVEKIT_API_KEY=your_actual_api_key_here
LIVEKIT_API_SECRET=your_actual_secret_key_here
LIVEKIT_URL=wss://your-project-subdomain.livekit.cloud

# Optional: Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Example with sample values:**
```env
LIVEKIT_API_KEY=APIKEYxxxxxxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=abcd1234567890efghijklmnopqrstuvwxyz
LIVEKIT_URL=wss://my-voice-agent.livekit.cloud
```

### 5. Verify Your Setup

## Running the Application

### Development Mode

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Production Build

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `LIVEKIT_API_KEY` | Your LiveKit API key | ✅ | `APIKEYxxxxxxxxxxxx` |
| `LIVEKIT_API_SECRET` | Your LiveKit secret key | ✅ | `abcd1234567890...` |
| `LIVEKIT_URL` | Your LiveKit WebSocket URL | ✅ | `wss://project.livekit.cloud` |

## Troubleshooting

### Common Issues

**1. LiveKit Connection Failed**
- Verify your `LIVEKIT_URL` format (must start with `wss://`)
- Check that your API key and secret are correct
- Ensure your LiveKit project is active

**2. Environment Variables Not Loading**
- Make sure `.env.local` is in the root directory
- Restart your development server after adding variables
- Check for typos in variable names

**3. Microphone Access Denied**
- Ensure you're running on `https://` or `localhost`
- Check browser permissions for microphone access
- Try a different browser if issues persist

### Getting Help

If you encounter issues:

1. Check the [LiveKit Documentation](https://docs.livekit.io/)
2. Verify your environment variables are set correctly
3. Check the browser console for error messages
4. Review the server logs in your terminal

## Features Overview

### Self-Correction Capabilities
- Real-time speech recognition error detection
- Automatic context-aware corrections
- Learning from conversation patterns
- Confidence scoring for responses

### Voice Processing
- Low-latency audio processing
- Noise cancellation
- Echo suppression
- Multiple audio codec support


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

