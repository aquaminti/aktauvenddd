import { useEffect, useState } from 'react';
import { fetchWeather } from '../services/api';

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchWeather();
        if (isMounted) setWeather(data);
      } catch (err) {
        if (isMounted) setError(err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { weather, isLoading, error };
}
