# 🌟 Connectree

## Create beautiful, shareable profile pages in seconds with AI-powered avatars and short URLs

## ✨ Features

- 🎨 **Beautiful Profile Pages** - Create stunning, mobile-responsive profile pages
- 🤖 **AI-Powered Avatars** - Automatic fallback avatar generation using Google AI
- 🔗 **Short URLs** - Generate short, shareable links like `https://connectree-sigma.vercel.app/p/fr2db2`

- 🎯 **Link in Bio** - Perfect replacement for Linktree, Bio.link, and similar services
- 🌙 **Dark/Light Mode** - Built-in theme switching
- 📱 **Mobile-First** - Responsive design that works on all devices
- 💾 **Client-Side Storage** - No database required, works entirely in the browser
- 🆓 **100% Free** - No subscriptions, no limits, deploy anywhere
- ⚡ **Instant Deployment** - Deploy to Vercel with zero configuration
- 🧹 **Auto Cleanup** - Automatically manages storage and cleans up old profiles

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/pratham-prog861/connectree.git
cd connectree
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google AI API Key (for avatar generation)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key_here
```

> **Note:** You can get a free Google AI API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

## 🌐 Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy! 🎉

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/connectree)

## 📖 How It Works

### Profile Creation

1. Fill out your name, bio, and links
2. Upload an avatar or provide a URL (AI fallback if none provided)
3. Click "Generate JSON" to create your profile data
4. Hit "Go Live & Share" to get your short URL

### Storage System

- Profiles are stored in browser localStorage
- Each profile gets a unique 6-character hash
- Short URLs like `/p/abc123` redirect to full profile pages
- Automatic cleanup removes profiles older than 30 days

### URL Structure

```bash
yoursite.com/p/abc123  →  Short URL (redirects to profile)
yoursite.com/profile?data=... →  Full profile page
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15.3.3 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Forms:** React Hook Form + Zod validation
- **AI:** Google Genkit for avatar generation
- **Icons:** Lucide React
- **Deployment:** Vercel-optimized

## 📁 Project Structure

```bash
src/
├── app/
│   ├── p/[hash]/          # Short URL handlers
│   ├── profile/           # Profile viewer page
│   ├── actions.ts         # Server actions
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Main profile creator
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   ├── profile-storage.ts # Client-side storage utilities
│   └── utils.ts          # Utility functions
└── ai/
    ├── flows/            # AI avatar generation
    └── genkit.ts         # Genkit configuration
```

## 🎨 Customization

### Themes

The app supports both light and dark modes out of the box. Customize colors in:

- `src/app/globals.css` - CSS variables
- `tailwind.config.ts` - Tailwind configuration

### Components
All UI components are from shadcn/ui and can be customized:

- `src/components/ui/` - Individual component files
- Modify styling, behavior, or add new components

### Storage
Customize storage behavior in `src/lib/profile-storage.ts`:

- Change cleanup interval (default: 30 days)
- Modify hash generation algorithm
- Add encryption or compression

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server on port 9002
npm run genkit:dev   # Start Genkit development server
npm run genkit:watch # Start Genkit with file watching

# Production
npm run build        # Build for production
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
```

## 🤖 AI Avatar Generation

Connectree uses Google's Genkit AI to generate fallback avatars when:

- No avatar URL is provided
- The provided URL is invalid or inaccessible
- User uploads a file that can't be processed

The AI creates personalized avatars based on the user's name and profile information.

## 🔒 Privacy & Data

- **No Server Storage:** All data is stored in the user's browser
- **No Tracking:** No analytics or user tracking
- **No Database:** Profiles exist only in localStorage
- **Self-Hosted:** Deploy anywhere you want

## 📱 Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide](https://lucide.dev/) for the icon set
- [Vercel](https://vercel.com/) for seamless deployment
- [Google AI](https://ai.google.dev/) for avatar generation

## 💡 Use Cases

- **Personal Branding:** Create a professional link-in-bio page
- **Social Media:** Share all your links in one place
- **Events:** Quick profile pages for speakers or attendees
- **Teams:** Company directory or team member profiles
- **Students:** Academic and project portfolios
- **Creators:** Centralized hub for all content links

## 🐛 Issues & Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/connectree/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

<div align="center">
  <strong>Made with ❤️ by Pratham Darji</strong>
  <br>
  <a href="https://github.com/Pratham-Prog861">GitHub</a> •
  <a href="https://www.linkedin.com/in/pratham-darji-b704092a2/">LinkedIn</a>
</div>

---
