import { useEffect, useRef, useState } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import './PageTransition.css';


export default function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();

  const [displayedOutlet, setDisplayedOutlet] = useState(outlet);
  const [displayedKey, setDisplayedKey] = useState(location.pathname);
  const [phase, setPhase] = useState('enter'); // 'enter' | 'exit'
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (location.pathname === displayedKey) return;

    setPhase('exit');

    timeoutRef.current = setTimeout(() => {
      setDisplayedOutlet(outlet);
      setDisplayedKey(location.pathname);
      setPhase('enter');
    }, 180); // длительность fade-out должна совпадать с CSS

    return () => clearTimeout(timeoutRef.current);

  }, [location.pathname]);

  return (
    <div className={`page-transition page-transition-${phase}`} key={displayedKey}>
      {displayedOutlet}
    </div>
  );
}
