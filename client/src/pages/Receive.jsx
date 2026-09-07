import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";

function Receive() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const copyEmail = async () => {
    if (!user?.email) return;

    await navigator.clipboard.writeText(user.email);

    alert("Email copied!");
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
            Share your registered email address with
            the person who wants to send you money.
          </p>

          <div className="receive-box">

            <p>Your Wallet Email</p>

            <h2>
              {user?.email}
            </h2>

            <button
              className="primary-button"
              onClick={copyEmail}
            >
              Copy Email
            </button>

          </div>

          <p className="receive-note">
            The sender can use this email address
            from the Send Money page.
          </p>

        </div>

      </main>

    </div>
  );
}

export default Receive;