import React from 'react';
import { Icon } from '@iconify/react';

type HeaderAction = {
  icon?: string;
  label?: string;
  onClick?: () => void;
  variant?: 'button' | 'tag';
  color?: string;
};

interface PanelHeaderProps {
  icon?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: HeaderAction;
  badge?: string | number;
  badgeColor?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({
  icon,
  title,
  subtitle,
  action,
  badge,
  badgeColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  children,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {icon && (
        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
          <Icon icon={icon} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
            {title}
          </h2>
          {badge !== undefined && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${badgeColor}`}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        )}
      </div>
      {children}
      {action && !children && (
        <div className="flex-shrink-0">
          {action.variant === 'tag' ? (
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${action.color || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
              {action.icon && <Icon icon={action.icon} className="w-4 h-4 inline mr-1" />}
              {action.label}
            </span>
          ) : (
            <button
              onClick={action.onClick}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                action.color ||
                'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              }`}
            >
              {action.icon && <Icon icon={action.icon} className="w-4 h-4 inline mr-1" />}
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

interface NavHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  avatar?: string;
  actions?: Array<{
    icon: string;
    label?: string;
    onClick?: () => void;
  }>;
  className?: string;
}

export const NavHeader: React.FC<NavHeaderProps> = ({
  title,
  subtitle,
  icon,
  avatar,
  actions = [],
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {avatar ? (
        <img src={avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
      ) : icon ? (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
          <Icon icon={icon} className="w-5 h-5 text-white" />
        </div>
      ) : null}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
            {subtitle}
          </p>
        )}
      </div>
      {actions.length > 0 && (
        <div className="flex items-center gap-2">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
              title={action.label}
            >
              <Icon icon={action.icon} className="w-5 h-5" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

interface DetailHeaderProps {
  title: string;
  subtitle?: string;
  icon?: string;
  tag?: string;
  tagColor?: string;
  status?: 'success' | 'warning' | 'error' | 'info';
  buttonRow?: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
}

const statusColors = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

export const DetailHeader: React.FC<DetailHeaderProps> = ({
  title,
  subtitle,
  icon,
  tag,
  tagColor = 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  status,
  buttonRow,
  trailing,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-3 ${className} w-full`}>
      <div className="flex items-center gap-4 w-full">
        {icon && (
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(160deg,#fef9ec,#fdf0d0)', border: '1px solid #f6e7bd' }}>
            <Icon icon={icon} className="w-5 h-5" style={{ color: '#f5b13d' } as React.CSSProperties} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[10px] flex-wrap">
            <h1 className="text-[21px] font-bold text-[#0f172a] dark:text-gray-100 tracking-[-0.02em]">
              {title}
            </h1>
            {tag && (
              <span className="text-[11.5px] font-semibold text-[#64748b] bg-[#f1f4f8] border border-[#e6eaf0] px-[9px] py-[3px] rounded-[7px]">
                {tag}
              </span>
            )}
            {status && (
              <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[14px] leading-[1.55] text-[#64748b] dark:text-gray-400 mt-[7px]">
              {subtitle}
            </p>
          )}
        </div>
        {trailing && <div className="flex-shrink-0">{trailing}</div>}
      </div>
      {buttonRow && <div className="flex items-center gap-2">{buttonRow}</div>}
    </div>
  );
};

export default PanelHeader;
