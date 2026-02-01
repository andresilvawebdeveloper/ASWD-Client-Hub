import React from 'react';

interface LogoProps {
  className?: string;
}

export const Logo = ({ className = "h-8 w-auto" }: LogoProps) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Aqui é inserido o logo que você especificou */}
      <img 
        src="/logo.png" 
        alt="Logo Plataforma" 
        className="object-contain"
      />
      <span className="font-bold text-xl tracking-tight text-slate-900">
        WebManager
      </span>
    </div>
  );
};