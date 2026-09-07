import { useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

import { sendMoney } from "../services/api";

function Send() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [receiverEmail, setReceiverEmail] = useState("");
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!receiverEmail || !amount) {
      setMessageType("error");
      setMessage("Please enter receiver email and amount.");
      return;
    }

    if (Number(amount) <= 0) {
      setMessageType("error");
      setMessage("Amount must be greater than zero.");
      return;
    }

    if (receiverEmail === user.email) {
      setMessageType("error");
      setMessage("You cannot send money to yourself.");
      return;
    }

    try {
      setLoading(true);

      const response = await sendMoney(
        user.id,
        receiverEmail,
        amount
      );

      setMessageType("success");
      setMessage(
        response?.message || "Money sent successfully."
      );

      setReceiverEmail("");
      setAmount("");

    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <Navbar />

      <main className="form-page">

        <div className="form-card">

          <Link to="/wallet" className="back-link">
            ← Back to Wallet
          </Link>

          <h1>Send Money</h1>

          <p className="auth-subtitle">
            Send money using the receiver's email address.
          </p>

          <Toast
            message={message}
            type={messageType}
            onClose={() => setMessage("")}
          />

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Receiver Email</label>

              <input
                type="email"
                placeholder="receiver@example.com"
                value={receiverEmail}
                onChange={(e) =>
                  setReceiverEmail(e.target.value)
                }
              />
            </div>

            <div className="form-group">
              <label>Amount</label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />
            </div>

            <button
              type="submit"
              className="primary-button full-width"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Money"}
            </button>

          </form>

        </div>

      </main>

    </div>
  );
}

export default Send;