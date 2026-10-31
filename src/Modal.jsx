import React, {useEffect, useRef} from 'react';

export default function Modal({children, onClose, wide = false}) {
  const box = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const first = box.current?.querySelector('button, [href], [tabindex]:not([tabindex="-1"])');
    first?.focus();
    const onKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      previous?.focus?.();
    };
  }, []);
  return <div className="overlay" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div ref={box} className={`dialog${wide ? ' wide' : ''}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title">{children}</div>
  </div>;
}
