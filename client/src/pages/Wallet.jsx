import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

import {
  getWallet,
  deposit,
  withdraw,
} from "../services/api";

function Wallet() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const loadWallet = async () => {
    try {
      setLoading(true);

      const data = await getWallet(user.id);

      setWallet(data);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadWallet();
    }
  }, []);

  const handleDeposit = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessageType("error");
      setMessage("Enter a valid amount.");
      return;
    }

    try {
      setActionLoading(true);

      const updatedWallet = await deposit(
        user.id,
        amount
      );

      setWallet(updatedWallet);
      setAmount("");

      setMessageType("success");
      setMessage("Deposit successful.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || Number(amount) <= 0) {
      setMessageType("error");
      setMessage("Enter a valid amount.");
      return;
    }

    try {
      setActionLoading(true);

      const updatedWallet = await withdraw(
        user.id,
        amount
      );

      setWallet(updatedWallet);
      setAmount("");

      setMessageType("success");
      setMessage("Withdrawal successful.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loading-page">
          Loading wallet...
        </div>
      </>
    );
  }

  return (
    <div>

      <Navbar />

      <main className="dashboard">

        <div className="page-header">
          <div>
            <p className="small-label">
              YOUR WALLET
            </p>

            <h1>
              Welcome, {wallet?.userName || user?.name}
            </h1>
          </div>
        </div>

        <Toast
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />

        <section className="balance-card">

          <p>Available Balance</p>

          <h2>
            ₹{Number(wallet?.balance || 0).toFixed(2)}
          </h2>

          <p className="wallet-email">
            {wallet?.email || user?.email}
          </p>

        </section>

        <section className="action-grid">

          <div className="action-card">

            <h3>Add Money</h3>

            <p>
              Deposit money into your wallet.
            </p>

            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <button
              className="primary-button"
              onClick={handleDeposit}
              disabled={actionLoading}
            >
              Deposit
            </button>

          </div>

          <div className="action-card">

            <h3>Withdraw</h3>

            <p>
              Withdraw money from your wallet.
            </p>

            <button
              className="secondary-button"
              onClick={handleWithdraw}
              disabled={actionLoading}
            >
              Withdraw
            </button>

          </div>

          <div className="action-card">

            <h3>Send Money</h3>

            <p>
              Send money to another user's email.
            </p>

            <Link
              to="/send"
              className="primary-button"
            >
              Send
            </Link>

          </div>

          <div className="action-card">

            <h3>Receive</h3>

            <p>
              Share your email to receive money.
            </p>

            <Link
              to="/receive"
              className="secondary-button"
            >
              Receive
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Wallet;