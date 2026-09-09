import { Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "../components/Navbar";

function Receive() {
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const copyEmail = async () => {
    if (!user?.email) return;

    try {
      await navigator.clipboard.writeText(user.email);
      alert("Email copied!");
    } catch {
      alert("Unable to copy email.");
    }
  };

  return (
    <div>
      <Navbar />

      <main className="form-page">
        <div className="form-card receive-card">

          <Link to="/wallet" className="back-link">
            ← Back to Wallet
          </Link>

          <h1>Receive Money</h1>

          <p className="auth-subtitle">
            Share your email or scan the QR code to receive money.
          </p>

          <div className="receive-box">

            <p>Your Wallet Email</p>

            <h2>{user?.email}</h2>

            <div className="qr-section">

              <div className="qr-wrapper">
                <QRCodeSVG
                  value={user?.email || ""}
                  size={210}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                />
              </div>

              <h3>Scan to Receive</h3>

              <p className="qr-description">
                Scan this QR code to get the wallet email
                address.
              </p>

            </div>

            <button
              className="primary-button"
              onClick={copyEmail}
            >
              Copy Email
            </button>

          </div>

          <p className="receive-note">
            The sender can scan this QR code or use your email
            address from the Send Money page.
          </p>

        </div>
      </main>
    </div>
  );
}

export default Receive;