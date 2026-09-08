const API_BASE_URL = "http://localhost:4040/api";

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  // Add JWT to every request when available
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    const contentType =
      response.headers.get("content-type");

    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // JWT expired or invalid
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";

      throw new Error(
        "Session expired. Please login again."
      );
    }

    // User authenticated but not authorized
    if (response.status === 403) {
      throw new Error(
        "You are not authorized."
      );
    }

    if (!response.ok) {
      throw new Error(
        data?.error ||
        data ||
        `Request failed: ${response.status}`
      );
    }

    return data;

  } catch (error) {

    if (error instanceof TypeError) {
      throw new Error(
        "Cannot connect to server. Make sure Spring Boot is running on port 4040."
      );
    }

    throw error;
  }
}


/* =========================
   AUTH
========================= */

export const signup = (
  name,
  email,
  password
) => {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });
};


export const login = (
  email,
  password
) => {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};


/* =========================
   PROFILE
========================= */

export const getProfile = () => {
  return request("/user/profile");
};


/* =========================
   WALLET
========================= */

export const getWallet = () => {
  return request("/wallet/me");
};


export const deposit = (amount) => {
  return request(
    `/wallet/deposit?amount=${encodeURIComponent(amount)}`,
    {
      method: "POST",
    }
  );
};


export const withdraw = (amount) => {
  return request(
    `/wallet/withdraw?amount=${encodeURIComponent(amount)}`,
    {
      method: "POST",
    }
  );
};


export const sendMoney = (
  receiverEmail,
  amount
) => {
  return request(
    `/wallet/send?receiverEmail=${encodeURIComponent(
      receiverEmail
    )}&amount=${encodeURIComponent(amount)}`,
    {
      method: "POST",
    }
  );
};