import './MachineCard.css';

export default function MachineCard({ machine, isActive, onSelect, onOpenGallery }) {
  return (
    <article className={`machine-card ${isActive ? 'is-active' : ''}`}>
      <button type="button" className="machine-card-main" onClick={() => onSelect(machine)}>
        <h3 className="machine-card-address">{machine.address}</h3>
      </button>
      <button type="button" className="btn btn-secondary machine-card-gallery-btn" onClick={() => onOpenGallery(machine)}>
        Открыть галерею
      </button>
    </article>
  );
}
