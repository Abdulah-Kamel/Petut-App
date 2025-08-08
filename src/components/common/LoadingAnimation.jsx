import React, { useEffect } from 'react';

const LoadingAnimation = () => {
  useEffect(() => {
    const scriptId = 'dotlottie-script';
    if (document.getElementById(scriptId)) {
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src =
      'https://unpkg.com/@lottiefiles/dotlottie-wc@0.6.2/dist/dotlottie-wc.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        // Optional: Clean up script if component unmounts, though often not necessary
        // document.body.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '60vh',
      }}
    >
      <dotlottie-wc
        src="https://lottie.host/a4efe5f7-194d-429b-8d14-0f7a4e565fc5/HR3EAogwVr.lottie"
        style={{ width: '300px', height: '300px' }}
        speed="1"
        autoplay
        loop
      ></dotlottie-wc>
    </div>
  );
};

export default LoadingAnimation;
