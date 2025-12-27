
import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconOnly?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'medium',
      loading = false,
      leftIcon,
      rightIcon,
      iconOnly,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-bold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed border-2 border-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none';
    
    const variants = {
      primary: 'bg-memphis-teal text-black shadow-memphis hover:bg-memphis-teal/90',
      secondary: 'bg-white text-black shadow-memphis hover:bg-gray-50',
      tertiary: 'bg-transparent border-transparent shadow-none hover:bg-black/5 !border-0',
      destructive: 'bg-red-500 text-white shadow-memphis hover:bg-red-600',
    };

    const sizes = {
      small: 'h-8 px-3 text-xs',
      medium: 'h-10 px-4 text-sm',
      large: 'h-12 px-6 text-base',
    };

    const iconSizes = {
      small: 'w-3 h-3',
      medium: 'w-4 h-4',
      large: 'w-5 h-5',
    };

    const iconOnlyStyles = iconOnly ? 'aspect-square px-0' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${iconOnlyStyles} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <Loader2 className={`mr-2 animate-spin ${iconSizes[size]}`} />
        )}

        {!loading && leftIcon && (
          <span className={children ? 'mr-2' : ''}>{leftIcon}</span>
        )}

        {iconOnly ? iconOnly : children}

        {!loading && rightIcon && (
          <span className={children ? 'ml-2' : ''}>{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
