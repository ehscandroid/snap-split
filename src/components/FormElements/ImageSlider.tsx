import { useState } from 'react';

interface ImageSliderProps {
  images: string[];
}

export const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800">
        <img
          src={images[activeIndex]}
          alt={`Slide ${activeIndex + 1}`}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setActiveIndex(i => i > 0 ? i - 1 : images.length - 1)}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800"
        >
          ‹
        </button>
        <button
          onClick={() => setActiveIndex(i => i < images.length - 1 ? i + 1 : 0)}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 dark:bg-gray-800/80 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-gray-800"
        >
          ›
        </button>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`w-2 h-2 rounded-full ${i === activeIndex ? 'bg-blue-500' : 'bg-white/60 dark:bg-gray-700/60'}`} />
          ))}
        </div>
      </div>
      <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-800">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-16 h-12 rounded overflow-hidden border-2 ${i === activeIndex ? 'border-blue-500' : 'border-transparent'}`}
          >
            <img src={img} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;
