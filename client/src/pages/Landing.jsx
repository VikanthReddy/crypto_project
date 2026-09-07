import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing-page">

      <nav className="navbar landing-nav">
        <Link to="/" className="logo">
          Crypto Wallet
        </Link>

        <div className="nav-links">
          <Link to="/login">Login</Link>
          <Link to="/signup" className="nav-signup">
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="hero">

        <div className="hero-content">
          <p className="hero-label">
            SIMPLE • SECURE • DIGITAL
          </p>

          <h1>
            Your Digital Wallet,
            <br />
            <span>Made Simple.</span>
          </h1>

          <p className="hero-description">
            Manage your digital balance, send money,
            receive money and keep track of your wallet
            from one simple application.
          </p>

          <div className="hero-buttons">
            <Link to="/signup" className="primary-button">
              Create Account
            </Link>

            <Link to="/login" className="secondary-button">
              Login
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Landing;