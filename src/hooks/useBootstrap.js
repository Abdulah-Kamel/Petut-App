import { useEffect } from 'react';
import bootstrapCssUrl from 'bootstrap/dist/css/bootstrap.min.css?url';
import dashboardCssUrl from '../dashboard.css?url'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const useBootstrap = () => {
  useEffect(() => {
    const addStylesheet = (href, id) => {
      const link = document.createElement('link');
      link.href = href;
      link.rel = 'stylesheet';
      link.id = id;
      document.head.appendChild(link);
      return link;
    };

    addStylesheet(bootstrapCssUrl, 'bootstrap-css');
    addStylesheet(dashboardCssUrl, 'dashboard-css');

    return () => {
      const bootstrapLink = document.getElementById('bootstrap-css');
      if (bootstrapLink) {
        document.head.removeChild(bootstrapLink);
      }
      const dashboardLink = document.getElementById('dashboard-css');
      if (dashboardLink) {
        document.head.removeChild(dashboardLink);
      }
    };
  }, []); 

};

export default useBootstrap;
