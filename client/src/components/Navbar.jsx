import {
  Link,
  useNavigate
} from "react-router-dom";

function Navbar() {

  const navigate =
    useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") ||
    "null"
  );


  const logout = () => {

    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  };


  return (
    <nav className="navbar">

      <Link
        to="/wallet"
        className="logo"
      >
        CRYPTO WALLET
      </Link>

      <div className="nav-links">

        <Link to="/wallet">
          Wallet
        </Link>

        <Link to="/send">
          Send
        </Link>

        <Link to="/receive">
          Receive
        </Link>

        <Link to="/profile">
          Profile
        </Link>

        {user && (
          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>
        )}

      </div>

    </nav>
  );
}

export default Navbar;