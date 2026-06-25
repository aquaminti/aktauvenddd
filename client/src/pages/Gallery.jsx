import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Lightbox from '../components/Lightbox';
import { useMachines } from '../hooks/useMachines';
import './Gallery.css';

export default function Gallery() {
  const { filteredMachines, districts, searchQuery, setSearchQuery, districtFilter, setDistrictFilter, isLoading } =
    useMachines();
  const [searchParams] = useSearchParams();
  const [activePhoto, setActivePhoto] = useState(null); 


  useEffect(() => {
    const machineId = searchParams.get('machine');
    if (machineId && filteredMachines.length) {
      const machine = filteredMachines.find((m) => m.id === Number(machineId));
      if (machine) {
        setSearchQuery(machine.address);
      }
    }

  }, [searchParams, filteredMachines.length]);

  const allPhotosFlat = useMemo(() => {
    return filteredMachines.flatMap((machine) =>
      (machine.photos || []).map((photo, idx) => ({
        photo,
        machine,
        captionIndex: idx,
      }))
    );
  }, [filteredMachines]);

  function openLightboxForMachine(machine, startIndex = 0) {
    setActivePhoto({
      photos: machine.photos,
      index: startIndex,
      caption: machine.address,
    });
  }


  return (
    <div className="gallery-page">
      <section className="gallery-header">
        <div className="container">
          <p className="eyebrow">Фотогалерея</p>
          <h1 className="gallery-title">Все автоматы сети в фотографиях</h1>
          <p className="gallery-subtitle">
            {allPhotosFlat.length} фотографий · {filteredMachines.length} точек размещения
          </p>
        </div>
      </section>

      <section className="container gallery-controls">
        <input
          type="search"
          className="map-search-input"
          placeholder="Поиск по адресу…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Поиск по галерее"
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

      <section className="container gallery-groups">
        {isLoading && <p className="gallery-loading">Загружаем фотографии…</p>}

        {!isLoading && filteredMachines.length === 0 && (
          <p className="map-empty-state">Ничего не найдено. Измените запрос или фильтр.</p>
        )}

        {filteredMachines.map((machine) => (
          <div key={machine.id} className="gallery-group">
            <div className="gallery-group-header">
              <div>
                <h2>{machine.address}</h2>
                <p>{machine.description}</p>
              </div>
            </div>

            <div className="gallery-grid">
              {machine.photos.map((photo, idx) => (
                <button
                  key={photo}
                  type="button"
                  className="gallery-thumb"
                  onClick={() => openLightboxForMachine(machine, idx)}
                  aria-label={`Открыть фото ${idx + 1} из ${machine.address}`}
                >
                  <img src={photo} alt={`${machine.address} — фото ${idx + 1}`} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      {activePhoto && (
        <Lightbox
          photos={activePhoto.photos}
          activeIndex={activePhoto.index}
          caption={activePhoto.caption}
          onClose={() => setActivePhoto(null)}
          onNavigate={(newIndex) => setActivePhoto((prev) => ({ ...prev, index: newIndex }))}
        />
      )}
    </div>
  );
}
