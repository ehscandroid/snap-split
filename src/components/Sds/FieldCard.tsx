interface FieldCardProps {
  label: string
  editable: boolean
  trailing?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export const FieldCard: React.FC<FieldCardProps> = ({ label, editable: _editable, trailing, className = '', children }) => (
  <div className={`rounded-lg px-3 py-2 transition-colors duration-200 bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 ${className}`}>
    <div className="flex items-center gap-2 mb-1">
      <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
      {trailing}
    </div>
    {children}
  </div>
)

export default FieldCard
