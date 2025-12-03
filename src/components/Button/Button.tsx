import { type ReactNode } from 'react';

type ButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

export function Button({ onClick, children }: ButtonProps) {
  return (
    <button
      className="
        rounded-lg border border-transparent 
        px-5 py-2.5 
        text-base font-medium 
        bg-gray-900 text-white 
        cursor-pointer 
        transition-colors duration-250
        hover:border-indigo-500 hover:bg-gray-800
        focus:outline-none focus:ring-2 focus:ring-indigo-500
      "
      onClick={onClick}
    >
      {children}
    </button>
  );
}
