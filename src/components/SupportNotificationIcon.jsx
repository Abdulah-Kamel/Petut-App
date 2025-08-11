import { RiMessage3Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useNewSupportMessages } from '../hooks/useNewSupportMessages';

export default function SupportNotificationIcon() {
  const { hasNewMessages, newMessagesCount } = useNewSupportMessages();

  return (
    <Link 
      to="/my-tickets" 
      className="relative p-2 text-gray-600 hover:text-primary_app transition-colors"
      title="Support Messages"
    >
      <RiMessage3Line size={24} />
      {hasNewMessages && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {newMessagesCount > 9 ? '9+' : newMessagesCount}
        </span>
      )}
    </Link>
  );
}