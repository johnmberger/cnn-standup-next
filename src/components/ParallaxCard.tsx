'use client';

import { useState, useRef, useEffect } from 'react';

interface ParallaxCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ParallaxCard({ children, className = '', style = {} }: ParallaxCardProps) {
  const [cardRef, setCardRef] = useState<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef) return;
    
    // Check if the mouse is over a button or interactive element
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return; // Don't apply parallax effect when hovering over buttons
    }
    
    const rect = cardRef.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate rotation angles (limited to prevent extreme tilting)
    const rotateX = (mouseY / rect.height) * -15; // Max 15 degrees
    const rotateY = (mouseX / rect.width) * 15;   // Max 15 degrees
    
    // Update CSS custom properties
    cardRef.style.setProperty('--mouse-x', `${rotateY}deg`);
    cardRef.style.setProperty('--mouse-y', `${rotateX}deg`);
  };

  const handleMouseLeave = () => {
    if (!cardRef) return;
    
    // Reset to neutral position
    cardRef.style.setProperty('--mouse-x', '0deg');
    cardRef.style.setProperty('--mouse-y', '0deg');
  };

  return (
    <div 
      ref={setCardRef}
      className={`bg-white max-w-2xl w-full border-l-4 shadow-2xl animate-slide-in-up card-3d-hover ${className}`}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
