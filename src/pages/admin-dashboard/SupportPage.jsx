import { useState, useEffect, Fragment } from 'react';
import { db } from '../../firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
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
      color: 'bg-primary'
    },
    {
      title: 'Open Tickets',
      value: stats.open,
      icon: RiMessage3Line,
      color: 'bg-danger'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: RiTimeLine,
      color: 'bg-warning'
    },
    {
      title: 'Resolved',
      value: stats.resolved,
      icon: RiCheckLine,
      color: 'bg-success'
    }
  ];

  return (
    <Fragment>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="h2 fw-bold">Support Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        {statCards.map((stat, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-3">
            <div className="statistic-card rounded shadow-sm p-4 h-100">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="mb-2 text-secondary">{stat.title}</p>
                  <p className="h3 fw-bold mb-0">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-circle d-flex align-items-center justify-content-center`} style={{ width: '50px', height: '50px' }}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Support Tickets Table */}
      <SupportTicketsTable />
    </Fragment>
  );
}