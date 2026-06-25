import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MachineMap from '../components/MachineMap';
import MachineCard from '../components/MachineCard';
import { useMachines } from '../hooks/useMachines';
import './MapPage.css';

export default function MapPage() {
  const {
    filteredMachines,
    districts,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    districtFilter,
    setDistrictFilter,
  } = useMachines();
  const [selectedMachine, setSelectedMachine] = useState(null);
  const navigate = useNavigate();

  function handleOpenGallery(machine) {
    navigate(`/gallery?machine=${machine.id}`);
  }

  return (
    <div className="map-page">
      <section className="map-page-header">
        <div className="container">
          <p className="eyebrow">Карта сети</p>
          <h1 className="map-page-title">Точки размещения автоматов питьевой воды в Актау</h1>
          <p className="map-page-subtitle">
            Найдите ближайший автомат по адресу или району, нажмите на маркер, чтобы увидеть фото и описание.
          </p>
        </div>
      </section>

      <section className="container map-page-controls">
        <input
          type="search"
          className="map-search-input"
          placeholder="Поиск по адресу или району…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Поиск автоматов по адресу"
        />
        <select
          className="map-district-select"
          value={districtFilter}
          onChange={(e) => setDistrictFilter(e.target.value)}
          aria-label="Фильтр по району"
        >
          <option value="all">Все районы</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </section>

      {error && (
        <div className="container">
          <div className="map-warning">{error}</div>
        </div>
      )}

      <section className="container map-page-layout">
        <div className="map-page-map">
          {isLoading ? (
            <div className="map-loading">
              <div className="spinner" />
              <span>Загружаем карту автоматов…</span>
            </div>
          ) : (
            <MachineMap
              machines={filteredMachines}
              selectedMachine={selectedMachine}
              onSelectMachine={setSelectedMachine}
              onOpenGallery={handleOpenGallery}
            />
          )}
        </div>

        <div className="map-page-list">
          <div className="map-page-list-header">
            <span>{filteredMachines.length} {filteredMachines.length === 1 ? 'точка' : 'точек'} найдено</span>
          </div>
          <div className="map-page-list-items">
            {filteredMachines.map((machine) => (
              <MachineCard
                key={machine.id}
                machine={machine}
                isActive={selectedMachine?.id === machine.id}
                onSelect={setSelectedMachine}
                onOpenGallery={handleOpenGallery}
              />
            ))}
            {filteredMachines.length === 0 && !isLoading && (
              <p className="map-empty-state">По вашему запросу автоматы не найдены. Попробуйте изменить фильтр.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
