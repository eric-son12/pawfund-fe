import React from "react";

import "./Footer.scss";

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="footer-info">
        <p className="title">
          Donation your animals and pets will be appreciated
        </p>

        <div>
          <p className="bread-cum">Home / Login / Register / Setting</p>
          <div className="socials">
            <img src="/icons/ico-instagram.svg" alt="instagram" />
            <img src="/icons/ico-facebook.svg" alt="facebook" />
            <img src="/icons/ico-twitter.svg" alt="twitter" />
            <img src="/icons/ico-google.svg" alt="google" />
          </div>
        </div>
      </div>

      <div className="copyright">
        <div>
          <p>Privacy policy</p>
          <p>Term of service</p>
          <p>Language</p>
        </div>

        <p>© 2024 PawFund. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
