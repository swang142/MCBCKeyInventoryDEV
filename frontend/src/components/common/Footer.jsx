import React from 'react';
import './Footer.css'; 

// Functional component representing the Footer
const Footer = () => {
  return (
    <footer className="footer"> {/* Main footer container */}
      <div className="footer-content"> {/* Container for footer content */}
        <p>Copyright &copy; Markham Chinese Baptist Church. All Rights Reserved.</p> {/* Footer text */}
      </div>
    </footer>
  );
};

export default Footer; // Export the Footer component for use in other parts of the application
