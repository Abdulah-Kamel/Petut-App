import { useEffect } from 'react';
import bootstrapCssUrl from 'bootstrap/dist/css/bootstrap.min.css?url';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const useBootstrap = () => {
  useEffect(() => {
    // Create a link element for the Bootstrap CSS
    const bootstrapLink = document.createElement('link');
    bootstrapLink.href = bootstrapCssUrl;
    bootstrapLink.rel = 'stylesheet';
    bootstrapLink.id = 'bootstrap-css'; // Give it an ID for easy removal

    // Append the link to the head
    document.head.appendChild(bootstrapLink);

    // Cleanup function to remove the CSS link when the component unmounts
    return () => {
      const linkToRemove = document.getElementById('bootstrap-css');
      if (linkToRemove) {
        document.head.removeChild(linkToRemove);
      }
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount
};

export default useBootstrap;
