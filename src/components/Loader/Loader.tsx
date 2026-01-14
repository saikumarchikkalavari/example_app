import React from 'react';
import './Loader.css';

type LoaderProps = {
  message?: string;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
};

export default function Loader({ message = 'Loading…', size = 'responsive' }: LoaderProps) {
  return (
    <div className={`app-loader app-loader--${size}`} role="status" aria-live="polite">
      <svg
        className="app-loader__spinner"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          className="app-loader__path"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="5"
        />
      </svg>
      <div className="app-loader__message">{message}</div>
    </div>
  );
}
