import React from 'react';

export const Logo = ({ className = "h-32" }: { className?: string }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/logo.png" 
        alt="ASWD Logo" 
        // O h-full garante que a imagem preencha a altura definida no className
        className="h-full w-auto object-contain"
      />
    </div>
  );
};