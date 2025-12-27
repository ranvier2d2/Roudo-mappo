
import React from 'react';

export interface CardProps {
  variant?: 'window' | 'flat';
  color?: 'pink' | 'teal' | 'purple' | 'yellow' | 'white';
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  // Fix: Explicitly allowing key and other potential standard React attributes.
  key?: React.Key;
}

export interface CardHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
  children?: React.ReactNode;
  color?: 'pink' | 'teal' | 'purple' | 'yellow' | 'white';
  onClose?: () => void;
  onClick?: () => void;
}

export interface CardContentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface CardFooterProps {
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  variant = 'window',
  className = '',
  children,
  onClick,
  color: _color, // Destructure to avoid "unused prop" warnings if passed but handled by children
}: CardProps) {
  const baseStyles = 'bg-white border-2 border-black transition-all duration-200 overflow-hidden';
  const variantStyles = {
    window: 'shadow-memphis-lg rounded-none',
    flat: 'shadow-memphis-sm',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${onClick ? 'cursor-pointer' : ''}`} 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  className = '',
  children,
  color = 'pink',
  onClose,
  onClick,
}: CardHeaderProps) {
  const bgColors = {
    pink: 'bg-memphis-pink',
    teal: 'bg-memphis-teal',
    purple: 'bg-memphis-purple',
    yellow: 'bg-memphis-yellow',
    white: 'bg-white',
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div 
      className={`px-4 py-2 border-b-2 border-black flex items-center justify-between transition-colors ${bgColors[color]} ${className} ${onClick ? 'cursor-pointer hover:brightness-95' : ''}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex flex-col min-w-0 flex-1">
        {title && (
          <h3 className="text-sm font-black uppercase tracking-wider text-black truncate">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-[10px] text-black/70 font-mono font-bold truncate">{subtitle}</p>
        )}
        {children}
      </div>
      
      <div className="flex gap-1.5 ml-4 shrink-0 items-center">
        <div className="w-3 h-3 rounded-full border-2 border-black bg-white" aria-hidden="true" />
        <div className="w-3 h-3 rounded-full border-2 border-black bg-black/20" aria-hidden="true" />
        {onClose && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close window"
            className="w-3 h-3 rounded-full border-2 border-black bg-black hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black"
          />
        )}
      </div>
    </div>
  );
}

export function CardContent({ className = '', children }: CardContentProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ className = '', children }: CardFooterProps) {
  return (
    <div className={`px-4 py-3 border-t-2 border-black bg-gray-50/50 ${className}`}>
      {children}
    </div>
  );
}
