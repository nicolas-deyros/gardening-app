import React, { useState, useEffect } from 'react';

interface WeatherData {
    temp: number;
    condition: string;
    isRainy: boolean;
    weatherCode: number;
    dailyTip: string;
}

export default function LocalIntelligence() {
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [locationName, setLocationName] = useState("Locating...");
    const [error, setError] = useState<string | null>(null);

    // Buenos Aires fallback
    const DEFAULT_LAT = -34.42;
    const DEFAULT_LON = -58.74;

    useEffect(() => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported");
            fetchWeatherData(DEFAULT_LAT, DEFAULT_LON, "Buenos Aires (Default)");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocationName("Your Garden (Detected)");
                fetchWeatherData(latitude, longitude);
            },
            (err) => {
                console.warn("Geolocation denied/failed:", err);
                setError("Location access denied. Using default.");
                fetchWeatherData(DEFAULT_LAT, DEFAULT_LON, "Buenos Aires (Default)");
            }
        );
    }, []);

    const fetchWeatherData = async (lat: number, lon: number, fallbackName?: string) => {
        try {
            const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
            const data = await response.json();
            if (data.error) throw new Error(data.error);
            
            setWeather(data);
            if (fallbackName) setLocationName(fallbackName);
        } catch (err) {
            console.error(err);
            setError("Failed to load weather data.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <article className="glass-panel p-6 border-l-4 border-l-stone-300 animate-pulse">
                <div className="h-4 bg-stone-200 rounded w-1/3 mb-4"></div>
                <div className="h-8 bg-stone-200 rounded w-1/4 mb-4"></div>
                <div className="h-16 bg-stone-200 rounded w-full"></div>
            </article>
        );
    }

    if (!weather) return null;

    return (
        <article className={`glass-panel p-6 border-l-4 ${weather.isRainy ? 'border-l-blue-500' : 'border-l-green-500'}`}>
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-lg font-bold text-stone-800">Local Intelligence</h2>
                    <span className="text-sm text-stone-500 flex items-center gap-1">
                        {locationName}
                    </span>
                    {error && <span className="text-xs text-orange-500 block mt-1">{error}</span>}
                </div>
                <span className="text-3xl" role="img" aria-label="Weather Icon">
                    {weather.isRainy ? "🌧️" : "🌤️"}
                </span>
            </div>

            <div className="flex items-end gap-2 mb-4">
                <span className="text-4xl font-bold text-stone-900">{weather.temp}°C</span>
                <span className="text-stone-600 mb-1">{weather.condition}</span>
            </div>

            <div className={`rounded-lg p-3 text-sm ${weather.isRainy ? 'bg-blue-50 text-blue-900' : 'bg-green-50 text-green-900'}`}>
                <strong>💡 AI Botanist's Insight:</strong>
                <p className="mt-1">{weather.dailyTip}</p>
            </div>
        </article>
    );
}
