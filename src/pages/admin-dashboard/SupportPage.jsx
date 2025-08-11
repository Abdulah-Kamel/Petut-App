import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import SupportTicketsTable from '../../components/admindash/SupportTicketsTable';
import { RiCustomerService2Line, RiMessage3Line, RiTimeLine, RiCheckLine } from 'react-icons/ri';

export default function SupportPage() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    const q = query(collection(db, 'support_tickets'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => doc.data());
      
      setStats({
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length
      });
    });

    return () => unsubscribe();
  }, []);

  const statCards = [
    {
      title: 'Total Tickets',
      value: stats.total,
      icon: RiCustomerService2Line,
      color: 'bg-blue-500'
    },
    {
      title: 'Open Tickets',
      value: stats.open,
      icon: RiMessage3Line,
      color: 'bg-red-500'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: RiTimeLine,
      color: 'bg-yellow-500'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: RiCheckLine,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Support Management
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <div className={`${stat.color} p-3 rounded-full`}>
                <stat.icon className="text-2xl text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support Tickets Table */}
      <SupportTicketsTable />
    </div>
  );
}