import { useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import './Lightbox.css';

export default function Lightbox({ photos, activeIndex, onClose, onNavigate, caption }) {
  const goNext = useCallback(() => {
    onNavigate((activeIndex + 1) % photos.length);
  }, [activeIndex, photos.length, onNavigate]);

  const goPrev = useCallback(() => {
    onNavigate((activeIndex - 1 + photos.length) % photos.length);
  }, [activeIndex, photos.length, onNavigate]);


  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose, goNext, goPrev]);

  if (activeIndex === null || activeIndex === undefined) return null;







  return createPortal(
    <div className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Просмотр фотографии">
      <button type="button" className="lightbox-close" onClick={onClose} aria-label="Закрыть просмотр">
        ×
      </button>

      <button type="button" className="lightbox-nav lightbox-prev" onClick={goPrev} aria-label="Предыдущее фото">
        ‹
      </button>

      <div className="lightbox-stage">
        <img src={photos[activeIndex]} alt={caption || `Фотография ${activeIndex + 1}`} className="lightbox-image" />
        <div className="lightbox-meta">
          <span>{caption}</span>
          <span className="lightbox-counter">
            {activeIndex + 1} / {photos.length}
          </span>
        </div>
      </div>

      <button type="button" className="lightbox-nav lightbox-next" onClick={goNext} aria-label="Следующее фото">
        ›
      </button>

      <div className="lightbox-thumbs">
        {photos.map((photo, idx) => (
          <button
            key={photo}
            type="button"
            className={`lightbox-thumb ${idx === activeIndex ? 'is-active' : ''}`}
            onClick={() => onNavigate(idx)}
            aria-label={`Перейти к фото ${idx + 1}`}
          >
            <img src={photo} alt="" />
          </button>
        ))}
      </div>
    </div>,
    document.body
  );
}
