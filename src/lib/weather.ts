export interface WeatherData {
    temp: number;
    condition: string;
    isRainy: boolean;
    weatherCode: number;
}

// WMO Weather interpretation codes (http://www.wmo.int/pages/prog/www/IMOP/WMO306/WMO306_vI-1.pdf)
function getWeatherDescription(code: number): string {
    if (code === 0) return 'Clear sky';
    if (code === 1 || code === 2 || code === 3) return 'Mainly clear, partly cloudy, and overcast';
    if (code === 45 || code === 48) return 'Fog and depositing rime fog';
    if (code === 51 || code === 53 || code === 55) return 'Drizzle: Light, moderate, and dense intensity';
    if (code === 56 || code === 57) return 'Freezing Drizzle: Light and dense intensity';
    if (code === 61 || code === 63 || code === 65) return 'Rain: Slight, moderate and heavy intensity';
    if (code === 66 || code === 67) return 'Freezing Rain: Light and heavy intensity';
    if (code === 71 || code === 73 || code === 75) return 'Snow fall: Slight, moderate, and heavy intensity';
    if (code === 77) return 'Snow grains';
    if (code === 80 || code === 81 || code === 82) return 'Rain showers: Slight, moderate, and violent';
    if (code === 85 || code === 86) return 'Snow showers slight and heavy';
    if (code === 95) return 'Thunderstorm: Slight or moderate';
    if (code === 96 || code === 99) return 'Thunderstorm with slight and heavy hail';
    return 'Unknown';
}

function isRainComing(code: number): boolean {
    const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
    return rainCodes.includes(code);
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        const data = await response.json();
        const current = data.current_weather;

        return {
            temp: current.temperature,
            weatherCode: current.weathercode,
            condition: getWeatherDescription(current.weathercode),
            isRainy: isRainComing(current.weathercode)
        };
    } catch (error) {
        console.error("Failed to fetch weather:", error);
        return {
            temp: 0,
            condition: "Unavailable",
            isRainy: false,
            weatherCode: -1
        };
    }
}
