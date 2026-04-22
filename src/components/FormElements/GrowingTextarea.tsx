import { useRef } from 'react';

interface GrowingTextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const GrowingTextarea: React.FC<GrowingTextareaProps> = ({ value, onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  };

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden group focus-within:border-blue-500 dark:focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-200 dark:focus-within:ring-blue-800">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => { onChange(e.target.value); adjustHeight(); }}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-transparent focus:outline-none resize-none overflow-hidden text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
        rows={1}
      />
    </div>
  );
};

export default GrowingTextarea;
