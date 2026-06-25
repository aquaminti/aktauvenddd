import { useEffect, useState, useCallback } from 'react';
import { fetchMachines } from '../services/api';
import fallbackMachines from '../data/machines.json';

function buildPhotos(machine) {
  const count = machine.photosCount || 0;
  const folder = machine.photosFolder || String(machine.id || machine.machineId);
  return Array.from({ length: count }, (_, i) => `/images/${folder}/${folder}.${i + 1}.png`);
}

export function useMachines(options = {}) {
  const { autoLoad = true } = options;
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(autoLoad);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [sortBy, setSortBy] = useState('id-asc');
  const [reloadKey, setReloadKey] = useState(0);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    if (!autoLoad) return undefined;
    let isMounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const data = await fetchMachines();
        if (isMounted) {
          setMachines(data.machines);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          const withPhotos = fallbackMachines.map((m) => ({
            ...m,
            photos: buildPhotos(m),
          }));
          setMachines(withPhotos);
          setError('Используются сохранённые данные — сервер временно недоступен');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [autoLoad, reloadKey]);

  const districts = [...new Set(machines.map((m) => m.district))].sort();

  let filteredMachines = machines;

  if (districtFilter !== 'all') {
    filteredMachines = filteredMachines.filter((m) => m.district === districtFilter);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    filteredMachines = filteredMachines.filter(
      (m) =>
        m.address.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q) ||
        (m.description || '').toLowerCase().includes(q)
    );
  }

  filteredMachines = [...filteredMachines];
  switch (sortBy) {
    case 'id-asc':
      filteredMachines.sort((a, b) => a.id - b.id);
      break;
    case 'address-asc':
      filteredMachines.sort((a, b) => a.address.localeCompare(b.address, 'ru'));
      break;
    case 'photos-desc':
      filteredMachines.sort((a, b) => b.photosCount - a.photosCount);
      break;
    default:
      break;
  }

  const findMachineById = useCallback(
    (id) => machines.find((m) => m.id === Number(id)),
    [machines]
  );

  return {
    machines,
    filteredMachines,
    districts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    districtFilter,
    setDistrictFilter,
    sortBy,
    setSortBy,
    findMachineById,
    reload,
    setMachines,
  };
}
