import ReactMarkdown from 'react-markdown'
import content from '../Classifier.md?raw'

const MarkdownPage: React.FC = () => {

    return (
        <div className="p-4">
            <ReactMarkdown
                components={{
                    h1: ({ children }) => <h1 className="text-2xl font-bold text-white dark:text-gray-100 mb-4 mt-6 first:mt-0 pb-2 border-b border-gray-700 dark:border-gray-600">{children}</h1>,
                    h2: ({ children }) => <h2 className="text-xl font-semibold text-gray-200 dark:text-gray-300 mb-3 mt-5 pb-1 border-b border-gray-700 dark:border-gray-600">{children}</h2>,
                    h3: ({ children }) => <h3 className="text-lg font-medium text-gray-300 dark:text-gray-400 mb-2 mt-4">{children}</h3>,
                    p: ({ children }) => <p className="text-gray-400 dark:text-gray-500 mb-3 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside text-gray-400 dark:text-gray-500 mb-3 space-y-1">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside text-gray-400 dark:text-gray-500 mb-3 space-y-1">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-400 dark:text-gray-500">{children}</li>,
                    code: ({ className, children }) => {
                        const isInline = !className;
                        if (isInline) {
                            return <code className="bg-gray-800 dark:bg-gray-700 text-amber-300 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>;
                        }
                        return <code className={className}>{children}</code>;
                    },
                    pre: ({ children }) => <pre className="bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 rounded-md p-4 overflow-x-auto mb-4 text-gray-200 dark:text-gray-300 font-mono text-sm">{children}</pre>,
                    blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-500 pl-4 py-2 my-4 bg-gray-800/50 dark:bg-gray-700/50 italic text-gray-400 dark:text-gray-500 rounded-r">{children}</blockquote>,
                    a: ({ href, children }) => <a href={href} className="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                    table: ({ children }) => <div className="overflow-x-auto mb-4"><table className="min-w-full border-collapse">{children}</table></div>,
                    th: ({ children }) => <th className="border border-gray-700 dark:border-gray-600 bg-gray-800 dark:bg-gray-700 px-4 py-2 text-left text-gray-200 dark:text-gray-300 font-semibold">{children}</th>,
                    td: ({ children }) => <td className="border border-gray-700 dark:border-gray-600 px-4 py-2 text-gray-400 dark:text-gray-500">{children}</td>,
                    tr: ({ children }) => <tr className="hover:bg-gray-800 dark:hover:bg-gray-700">{children}</tr>,
                    hr: () => <hr className="border-gray-700 dark:border-gray-600 my-6" />,
                    strong: ({ children }) => <strong className="font-semibold text-white dark:text-gray-100">{children}</strong>,
                    em: ({ children }) => <em className="italic text-gray-500 dark:text-gray-600">{children}</em>,
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )

};

export default MarkdownPage;