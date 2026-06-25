import { useEffect, useState } from 'react';
import { fetchPublicStats } from '../services/api';

export function useSiteStats() {
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await fetchPublicStats();
        if (isMounted) setStats(data.stats || []);
      } catch {
        if (isMounted) {
          setStats([
            { key: 'points', label: 'точек размещения', value: 7, suffix: '' },
            { key: 'districts', label: 'районов города', value: 7, suffix: '' },
            { key: 'photos', label: 'фотографий в галерее', value: 28, suffix: '' },
            { key: 'clients', label: 'клиентов в месяц', value: 1200, suffix: '+' },
          ]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { stats, isLoading };
}
