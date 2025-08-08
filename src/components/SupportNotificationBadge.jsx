import { useSupportNotifications } from '../hooks/useSupportNotifications';

export default function SupportNotificationBadge({ userRole = 'user', className = '' }) {
  const { unreadCount } = useSupportNotifications(userRole);

  if (unreadCount === 0) return null;

  return (
    <span className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ${className}`}>
      {unreadCount > 99 ? '99+' : unreadCount}
    </span>
  );
}