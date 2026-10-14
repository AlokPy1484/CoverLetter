'use client';

import './GlitchText.css';

const GlitchText = ({ children, speed = 0.5, enableShadows = true, enableOnHover = false, inline = false, className = '' }) => {
  const inlineStyles = {
    '--after-duration': `${speed * 3}s`,
    '--before-duration': `${speed * 2}s`,
    '--after-shadow': enableShadows ? (inline ? '-1.5px 0 red' : '-5px 0 red') : 'none',
    '--before-shadow': enableShadows ? (inline ? '1.5px 0 cyan' : '5px 0 cyan') : 'none'
  };

  const hoverClass = enableOnHover ? 'enable-on-hover' : '';

  return (
    <span className={`glitch ${inline ? 'glitch--inline' : ''} ${hoverClass} ${className}`} style={inlineStyles} data-text={children}>
      {children}
    </span>
  );
};

export default GlitchText;
