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

  // Separate amounts for Deposit and Withdraw
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  const loadWallet = async () => {
    try {
      setLoading(true);

      // JWT identifies the logged-in user
      const data = await getWallet();

      setWallet(data);
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWallet();
    }
  }, []);

  // =========================
  // DEPOSIT
  // =========================

  const handleDeposit = async () => {
    if (!depositAmount || Number(depositAmount) <= 0) {
      setMessageType("error");
      setMessage("Enter a valid amount.");
      return;
    }

    try {
      setActionLoading(true);

      const updatedWallet = await deposit(depositAmount);

      setWallet(updatedWallet);

      // Clear only Deposit input
      setDepositAmount("");

      setMessageType("success");
      setMessage("Deposit successful.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // WITHDRAW
  // =========================

  const handleWithdraw = async () => {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      setMessageType("error");
      setMessage("Enter a valid amount.");
      return;
    }

    try {
      setActionLoading(true);

      const updatedWallet = await withdraw(withdrawAmount);

      setWallet(updatedWallet);

      // Clear only Withdraw input
      setWithdrawAmount("");

      setMessageType("success");
      setMessage("Withdrawal successful.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message);
    } finally {
      setActionLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loading-page">
          <div className="loading-spinner"></div>
          <p>Loading your wallet...</p>
        </div>
      </>
    );
  }

  return (
    <div className="wallet-page">

      <Navbar />

      <main className="dashboard">

        {/* =========================
            HEADER
        ========================= */}

        <section className="dashboard-header">

          <div>
            <p className="small-label">
              YOUR WALLET
            </p>

            <h1>
              Welcome, {wallet?.userName || user?.name}
            </h1>

            <p className="dashboard-subtitle">
              Manage your crypto wallet securely.
            </p>
          </div>

        </section>

        {/* =========================
            TOAST
        ========================= */}

        <Toast
          message={message}
          type={messageType}
          onClose={() => setMessage("")}
        />

        {/* =========================
            BALANCE
        ========================= */}

        <section className="balance-card">

          <div className="balance-top">

            <div>

              <p className="balance-label">
                AVAILABLE BALANCE
              </p>

              <h2>
                ₹{Number(wallet?.balance || 0).toFixed(2)}
              </h2>

              <p className="wallet-email">
                {wallet?.email || user?.email}
              </p>

            </div>

            <div className="wallet-icon">
              ₿
            </div>

          </div>

          <div className="balance-line"></div>

          <p className="balance-status">
            ● Wallet active
          </p>

        </section>

        {/* =========================
            ACTIONS
        ========================= */}

        <section className="action-grid">

          {/* =========================
              DEPOSIT
          ========================= */}

          <div className="action-card deposit-card">

            <div className="card-icon">
              +
            </div>

            <div className="card-content">

              <h3>
                Add Money
              </h3>

              <p>
                Deposit money into your wallet.
              </p>

            </div>

            <div className="action-form">

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={depositAmount}
                onChange={(e) =>
                  setDepositAmount(e.target.value)
                }
              />

              <button
                className="primary-button"
                onClick={handleDeposit}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Deposit"}
              </button>

            </div>

          </div>

          {/* =========================
              WITHDRAW
          ========================= */}

          <div className="action-card withdraw-card">

            <div className="card-icon">
              −
            </div>

            <div className="card-content">

              <h3>
                Withdraw
              </h3>

              <p>
                Withdraw money from your wallet.
              </p>

            </div>

            <div className="action-form">

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter amount"
                value={withdrawAmount}
                onChange={(e) =>
                  setWithdrawAmount(e.target.value)
                }
              />

              <button
                className="secondary-button"
                onClick={handleWithdraw}
                disabled={actionLoading}
              >
                {actionLoading
                  ? "Processing..."
                  : "Withdraw"}
              </button>

            </div>

          </div>

          {/* =========================
              SEND
          ========================= */}

          <div className="action-card send-card">

            <div className="card-icon">
              ↑
            </div>

            <div className="card-content">

              <h3>
                Send Money
              </h3>

              <p>
                Send money to another user's email.
              </p>

            </div>

            <Link
              to="/send"
              className="card-button primary-button"
            >
              Send Money
            </Link>

          </div>

          {/* =========================
              RECEIVE
          ========================= */}

          <div className="action-card receive-card">

            <div className="card-icon">
              ↓
            </div>

            <div className="card-content">

              <h3>
                Receive
              </h3>

              <p>
                Share your wallet information to receive money.
              </p>

            </div>

            <Link
              to="/receive"
              className="card-button secondary-button"
            >
              Receive Money
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Wallet;