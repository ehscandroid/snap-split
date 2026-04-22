interface SegmentedControlProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  content?: Record<T, React.ReactNode>;
}

export function SegmentedControl<T extends string>({ 
  options, 
  value, 
  onChange, 
  content 
}: SegmentedControlProps<T>) {
  return (
    <div className="space-y-3">
      <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
              value === option.value
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
      {content && content[value] && (
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-white dark:bg-gray-800">
          {content[value]}
        </div>
      )}
    </div>
  );
}

export default SegmentedControl;
