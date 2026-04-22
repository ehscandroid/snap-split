import { useState, useRef } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface SectionTabsProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function SectionTabs({ tabs, defaultTab }: SectionTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="rounded-lg overflow-hidden">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 py-3 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 -mb-px z-10'
                : 'bg-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        ref={contentRef}
        className="bg-violet-100 dark:bg-violet-900 -mt-px p-4 min-h-[400px]"
      >
        {tabs.find((t) => t.id === activeTab)?.content}
      </div>
    </div>
  );
}

const Sections = () => {
  const tabs = [
    {
      id: 'notes',
      label: 'Notes',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Notes</h3>
          <textarea
            className="w-full h-64 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            placeholder="Write your notes here..."
          />
        </div>
      ),
    },
    {
      id: 'tasks',
      label: 'Tasks',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Tasks</h3>
          <ul className="space-y-2">
            {['Review project proposal', 'Email client updates', 'Fix bugs'].map((task) => (
              <li key={task} className="flex items-center gap-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-gray-700 dark:text-gray-300">{task}</span>
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      id: 'references',
      label: 'References',
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">References</h3>
          <div className="grid gap-3">
            {['API Documentation', 'Design Guidelines', 'Team Contacts'].map((ref) => (
              <div
                key={ref}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <span className="text-gray-700 dark:text-gray-300">{ref}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Notebook</h1>
      <SectionTabs tabs={tabs} />
    </div>
  );
};

export default Sections;