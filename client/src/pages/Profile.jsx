import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Toast from "../components/Toast";

import { getProfile } from "../services/api";

function Profile() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile(user.id);
        setProfile(data);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      loadProfile();
    }
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="loading-page">
          Loading profile...
        </div>
      </>
    );
  }

  return (
    <div>

      <Navbar />

      <main className="form-page">

        <div className="form-card">

          <Link to="/wallet" className="back-link">
            ← Back to Wallet
          </Link>

          <h1>Profile</h1>

          <Toast
            message={message}
            type="error"
            onClose={() => setMessage("")}
          />

          <div className="profile-info">

            <div className="profile-row">
              <span>Name</span>
              <strong>
                {profile?.name || user?.name}
              </strong>
            </div>

            <div className="profile-row">
              <span>Email</span>
              <strong>
                {profile?.email || user?.email}
              </strong>
            </div>

            <div className="profile-row">
              <span>User ID</span>
              <strong>
                {profile?.id || user?.id}
              </strong>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Profile;