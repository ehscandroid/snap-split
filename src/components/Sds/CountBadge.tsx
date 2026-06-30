interface CountBadgeProps {
  count: number
}

export const CountBadge: React.FC<CountBadgeProps> = ({ count }) => (
  <span className="px-1.5 py-0.5 rounded text-[10px] leading-none font-medium text-gray-500 dark:text-gray-400 bg-gray-200/70 dark:bg-white/10">
    {count}
  </span>
)

export default CountBadge
