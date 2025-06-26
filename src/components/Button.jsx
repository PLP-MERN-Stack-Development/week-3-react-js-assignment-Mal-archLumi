// Button.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick, 
  children,
  className = '',
  type = 'button',
  ...rest 
}) => {
  // Base classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white focus:ring-indigo-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow hover:shadow-md',
    secondary: 'bg-white hover:bg-gray-50 text-gray-800 focus:ring-gray-300 focus:ring-offset-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 dark:focus:ring-gray-600 dark:focus:ring-offset-gray-800 border border-gray-300 dark:border-gray-600 shadow-sm hover:shadow',
    danger: 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white focus:ring-red-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow hover:shadow-md',
    success: 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white focus:ring-green-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow hover:shadow-md',
    warning: 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-white focus:ring-amber-500 focus:ring-offset-white dark:focus:ring-offset-gray-800 shadow hover:shadow-md',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-gray-300 dark:focus:ring-gray-600 focus:ring-offset-white dark:focus:ring-offset-gray-800',
  };
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Disabled classes
  const disabledClasses = disabled 
    ? 'opacity-60 cursor-not-allowed' 
    : 'transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${disabledClasses} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'warning', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

export default Button;