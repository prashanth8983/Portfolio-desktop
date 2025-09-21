import React from 'react';

export const AboutThisMac: React.FC = () => {
  const systemInfo = {
    modelName: 'MacBook Air',
    modelYear: '13-inch, M3, 2024',
    chip: 'Apple M3',
    memory: '16 GB',
    serialNumber: 'MT99WX9X4',
    macosVersion: 'Sequoia 15.6.1'
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full h-full flex flex-col items-center justify-center px-8 py-12">
      {/* Laptop Image */}
      <div className="mb-8">
        <div className="relative">
          {/* Laptop illustration */}
          <div className="w-48 h-32 bg-gradient-to-b from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-t-2xl relative">
            {/* Screen */}
            <div className="absolute inset-2 bg-gradient-to-b from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
              <div className="w-2 h-1 bg-gray-800 rounded-full"></div>
            </div>
          </div>
          {/* Base */}
          <div className="w-52 h-4 bg-gradient-to-b from-gray-200 to-gray-300 dark:from-gray-500 dark:to-gray-600 rounded-b-3xl mx-auto relative">
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-transparent via-gray-400 dark:via-gray-400 to-transparent rounded-b-3xl"></div>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-2xl font-light text-gray-900 dark:text-white">{systemInfo.modelName}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{systemInfo.modelYear}</p>
      </div>

      {/* System Details */}
      <div className="space-y-2 text-center max-w-xs">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Chip</span>
          <span className="text-sm font-medium">{systemInfo.chip}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
          <span className="text-sm font-medium">{systemInfo.memory}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">Serial number</span>
          <span className="text-sm font-medium">{systemInfo.serialNumber}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600 dark:text-gray-400">macOS</span>
          <span className="text-sm font-medium">{systemInfo.macosVersion}</span>
        </div>
      </div>

      {/* More Info Button */}
      <div className="mt-8">
        <button
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg transition-colors"
          onClick={() => {
            alert('System Information would open here in a real Mac.');
          }}
        >
          More Info...
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">Regulatory Certification</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">™ and © 1983-2025 Apple Inc.</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">All Rights Reserved.</p>
      </div>
    </div>
  );
};