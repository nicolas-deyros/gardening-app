# 🌿 Green-Tech Garden Architect

**Local-First. Organic. Intelligent.**

The Green-Tech Garden Architect is a local-first, AI-powered gardening assistant designed to help you cultivate a thriving, organic garden. It leverages local intelligence to provide personalized planting advice, weather-aware insights, and pest management solutions without relying on cloud-based data harvesting.

## ✨ Features

- **🏡 Dashboard**: At-a-glance view of your garden's status, weather conditions, and urgent tasks.
- **🤖 AI Botanist Diagnosis**: Advanced Vision API analysis for your plant photos.
- **💬 Interactive Chat**: Talk to a "Green-Tech AI Botanist" persona for organic advice.
- **📍 Local Intelligence**: Real-time weather tips based on your exact geolocation.
- **⚡ Smart Caching**: Instantly loads repeated queries and analysis to save data and speed up the app.
- **📱 Responsive Design**: Fully optimized for mobile and desktop (PWA ready).
- **🔒 Privacy-First**: Location data is never stored on a server; it's used only for real-time context.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    - Copy `.env.example` to `.env` (if available) or ensure your API keys are set if using external services (e.g., Gemini API).
    - *Note: This project uses Google Gemini for AI features.*

### Running the App

Start the local development server:

```bash
npm run dev
```

The application will be available at [http://localhost:4321](http://localhost:4321).

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **UI Components**: React
- **AI**: Google Gemini API
- **Runtime**: Node.js

## 🧞 Commands

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:4321`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally                   |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
