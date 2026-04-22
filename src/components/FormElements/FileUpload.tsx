interface FileUploadProps {
  title: string;
  subtitle?: string;
  size?: string;
  date?: string;
  icon?: string;
  onDelete?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  title, 
  subtitle = 'Document', 
  size = '1.0 MB', 
  date = 'Jan 15, 2025',
  icon = '📄',
  onDelete 
}) => {
  return (
    <div className="flex items-center gap-4 border border-gray-300 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer">
      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center text-2xl">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{title}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">{size} • Uploaded {date}</div>
      </div>
      {onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-red-500 dark:hover:text-red-400"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default FileUpload;
