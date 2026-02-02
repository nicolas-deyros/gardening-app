# 🌿 Green-Tech Garden Architect

**Local-First. Organic. Intelligent.**

The Green-Tech Garden Architect is a local-first, AI-powered gardening assistant designed to help you cultivate a thriving, organic garden. It leverages local intelligence to provide personalized planting advice, weather-aware insights, and pest management solutions without relying on cloud-based data harvesting.

## ✨ Features

- **🏡 Dashboard**: At-a-glance view of your garden's status, weather conditions, and urgent tasks.
- **🤖 Architect Chat**: Interact with a specialized AI helper for organic gardening advice, companion planting suggestions, and troubleshooting.
- **👁️ Plant Vision**: Upload photos to identify plants or diagnose issues using advanced vision capabilities.
- **🌤️ Local Weather Integration**: Real-time weather data to inform your gardening decisions (e.g., heat alerts, frost warnings).
- **🔒 Local-First**: Your garden data stays on your machine.

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
