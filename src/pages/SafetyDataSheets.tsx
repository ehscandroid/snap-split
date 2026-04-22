import { useState } from 'react';
import { useParams } from 'react-router-dom';

const SafetyDataSheets: React.FC = () => {
  const { id } = useParams();
  
  const [chemicalName, setChemicalName] = useState('');
  const [casNumber, setCasNumber] = useState('');

  return (
    <div className="p-4 space-y-6">
      {id ? (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white dark:text-gray-100">Safety Data Sheet #{id}</h2>

          <div>
            <label className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">Chemical Name</label>
            <input
              type="text"
              value={chemicalName}
              onChange={(e) => setChemicalName(e.target.value)}
              placeholder="Enter chemical name"
              className="w-full bg-gray-800 dark:bg-gray-700 border border-gray-600 dark:border-gray-500 rounded-lg px-4 py-2 text-white dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 dark:text-gray-500 mb-1">CAS Number</label>
            <input
              type="text"
              value={casNumber}
              onChange={(e) => setCasNumber(e.target.value)}
              placeholder="Enter CAS number"
              className="w-full bg-gray-800 dark:bg-gray-700 border border-gray-600 dark:border-gray-500 rounded-lg px-4 py-2 text-white dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
          <span className="text-6xl mb-4 opacity-50">⚗️</span>
          <p>Select an item from the sidebar</p>
        </div>
      )}
    </div>
  );
};

export default SafetyDataSheets;