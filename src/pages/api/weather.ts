import type { APIRoute } from 'astro';
import { fetchWeather } from '../../lib/weather';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const latParam = url.searchParams.get('lat');
  const lonParam = url.searchParams.get('lon');

  if (!latParam || !lonParam) {
    return new Response(JSON.stringify({ error: 'Latitude and Longitude required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const lat = parseFloat(latParam);
  const lon = parseFloat(lonParam);

  if (isNaN(lat) || isNaN(lon)) {
    return new Response(JSON.stringify({ error: 'Invalid coordinates' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const weather = await fetchWeather(lat, lon);
    
    // Generate simple tip logic on server side to keep frontend dumb
    let dailyTip = "Conditions are stable. Good day for pruning and general maintenance.";
    if (weather.isRainy) {
        dailyTip = "Rain is coming/here! Perfect time for transplanting - let nature water the roots in.";
    } else if (weather.temp > 30) {
        dailyTip = "Heat alert! ☀️ Avoid planting today and ensure everything is well-mulched.";
    }

    return new Response(JSON.stringify({ ...weather, dailyTip }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch weather' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
