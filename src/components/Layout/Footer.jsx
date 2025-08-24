import React from 'react';
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-center py-2 text-sm mt-auto shadow-inner">
      &copy; {new Date().getFullYear()} Gotcha. All rights reserved.
    </footer>
  );
}