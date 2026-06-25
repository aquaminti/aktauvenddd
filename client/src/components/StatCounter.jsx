import { useCountUp } from '../hooks/useCountUp';

export default function StatCounter({ value, suffix = '', label }) {
  const { value: animatedValue, ref } = useCountUp(value);

  return (
    <div className="stat-counter" ref={ref}>
      <span className="stat-counter-value">
        {animatedValue}
        {suffix}
      </span>
      <span className="stat-counter-label">{label}</span>
    </div>
  );
}
