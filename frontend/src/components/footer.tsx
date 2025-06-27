import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full relative py-8 px-4 mt-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-yellow-300 bg-gradient-to-br from-yellow-200 via-yellow-300 to-yellow-400 overflow-hidden">
      {/* Cube background effect */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg width="100%" height="100%" className="opacity-20" style={{ position: 'absolute', top: 0, left: 0 }}>
          <defs>
            <pattern id="cubePattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="40" height="40" fill="none" />
              <rect x="0" y="0" width="20" height="20" fill="#fff8db" />
              <rect x="20" y="20" width="20" height="20" fill="#fff8db" />
              <rect x="0" y="20" width="20" height="20" fill="#ffe066" />
              <rect x="20" y="0" width="20" height="20" fill="#ffe066" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cubePattern)" />
        </svg>
      </div>
      <div className="flex flex-col items-start z-10">
        <span className="font-bold text-lg text-yellow-900 drop-shadow">Sri Sai Ram 5 Star Inventory</span>
        <span className="text-sm mt-1 text-yellow-800">Sri Sairam Engineering College Backside, Chennai</span>
        <span className="text-sm text-yellow-800">Contact: <a href="tel:9790146623" className="underline">9790146623</a></span>
      </div>
      <div className="flex items-center gap-6 mt-2 md:mt-0 z-10">
        {/* Instagram SVG */}
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg className="h-8 w-8 hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#fff" />
            <path d="M16.5 7.5C16.7761 7.5 17 7.72386 17 8C17 8.27614 16.7761 8.5 16.5 8.5C16.2239 8.5 16 8.27614 16 8C16 7.72386 16.2239 7.5 16.5 7.5Z" fill="#FDCB5D"/>
            <rect x="7" y="7" width="10" height="10" rx="5" stroke="#FDCB5D" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="#FDCB5D" strokeWidth="2"/>
          </svg>
        </a>
        {/* Facebook SVG */}
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg className="h-8 w-8 hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#fff" />
            <path d="M15.5 8.5H14V7.5C14 7.22386 13.7761 7 13.5 7H12.5C12.2239 7 12 7.22386 12 7.5V8.5H11C10.7239 8.5 10.5 8.72386 10.5 9V10C10.5 10.2761 10.7239 10.5 11 10.5H12V16C12 16.2761 12.2239 16.5 12.5 16.5H13.5C13.7761 16.5 14 16.2761 14 16V10.5H15C15.2761 10.5 15.5 10.2761 15.5 10V9C15.5 8.72386 15.2761 8.5 15 8.5H14V8.5Z" fill="#3B5998"/>
          </svg>
        </a>
        {/* Email SVG */}
        <a href="mailto:contact@5starinventory.com" aria-label="Email">
          <svg className="h-8 w-8 hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="6" fill="#fff" />
            <path d="M6 8.5L12 13L18 8.5" stroke="#FDCB5D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="6" y="8" width="12" height="8" rx="2" stroke="#FDCB5D" strokeWidth="2"/>
          </svg>
        </a>
      </div>
      <div className="text-xs text-yellow-900 mt-2 md:mt-0 z-10 font-semibold drop-shadow">&copy; {new Date().getFullYear()} Sri Sai Ram 5 Star Inventory. All rights reserved.</div>
    </footer>
  );
} 