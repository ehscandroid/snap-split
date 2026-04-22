export const gradients = [
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-orange-400 to-orange-600',
  'from-green-400 to-green-600',
  'from-teal-400 to-teal-600',
  'from-red-400 to-red-600',
  'from-indigo-400 to-indigo-600',
  'from-yellow-400 to-yellow-600',
  'from-cyan-400 to-cyan-600',
  'from-rose-400 to-rose-600',
  'from-emerald-400 to-emerald-600',
  'from-violet-400 to-violet-600',
  'from-fuchsia-400 to-fuchsia-600',
  'from-lime-400 to-lime-600',
  'from-sky-400 to-sky-600',
];

export interface ImageItem {
  id: number;
  filename: string;
  color: string;
  date: string;
  size: string;
  dimensions: string;
  tags: string[];
}

export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  coverColor: string;
  images: ImageItem[];
}

const makeImage = (id: number, projectIndex: number): ImageItem => ({
  id,
  filename: `IMG_${String(id).padStart(3, '0')}.jpg`,
  color: gradients[(id - 1) % gradients.length],
  date: `March ${10 + projectIndex}, 2026`,
  size: `${(1.2 + (id % 5) * 0.4).toFixed(1)} MB`,
  dimensions: '4032 × 3024',
  tags: ['scan', 'indoor'],
});

export const projects: Project[] = [
  {
    id: 1,
    name: 'Building Survey',
    description: 'Exterior and interior scans of the main building complex.',
    createdAt: 'March 1, 2026',
    coverColor: gradients[0],
    images: [
      makeImage(1, 1),
      makeImage(2, 1),
      makeImage(3, 1),
      makeImage(4, 1),
      makeImage(5, 1),
    ],
  },
  {
    id: 2,
    name: 'Roof Inspection',
    description: 'Detailed roof condition assessment and documentation.',
    createdAt: 'March 5, 2026',
    coverColor: gradients[4],
    images: [
      makeImage(6, 2),
      makeImage(7, 2),
      makeImage(8, 2),
      makeImage(9, 2),
    ],
  },
  {
    id: 3,
    name: 'Facade Analysis',
    description: 'Facade material analysis and crack detection scans.',
    createdAt: 'March 10, 2026',
    coverColor: gradients[7],
    images: [
      makeImage(10, 3),
      makeImage(11, 3),
      makeImage(12, 3),
      makeImage(13, 3),
      makeImage(14, 3),
      makeImage(15, 3),
    ],
  },
  {
    id: 4,
    name: 'Interior Review',
    description: 'Room-by-room interior condition documentation.',
    createdAt: 'March 15, 2026',
    coverColor: gradients[11],
    images: [
      makeImage(16, 4),
      makeImage(17, 4),
      makeImage(18, 4),
    ],
  },
  {
    id: 5,
    name: 'Garden & Outdoor',
    description: 'Landscaping and outdoor area assessment.',
    createdAt: 'March 18, 2026',
    coverColor: gradients[2],
    images: [
      makeImage(19, 5),
      makeImage(20, 5),
      makeImage(21, 5),
      makeImage(22, 5),
    ],
  },
  {
    id: 6,
    name: 'Utility Scan',
    description: 'Electrical and plumbing infrastructure scans.',
    createdAt: 'March 22, 2026',
    coverColor: gradients[9],
    images: [
      makeImage(23, 6),
      makeImage(24, 6),
      makeImage(25, 6),
    ],
  },
];

export const allImages: ImageItem[] = projects.flatMap((p) => p.images);

export const findImageById = (id: number): { image: ImageItem; project: Project } | null => {
  for (const project of projects) {
    const image = project.images.find((img) => img.id === id);
    if (image) return { image, project };
  }
  return null;
};

export const findProjectById = (id: number): Project | undefined => {
  return projects.find((p) => p.id === id);
};
