const API_BASE_URL = "http://localhost:4040/api";

async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const contentType = response.headers.get("content-type");

    let data;

    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      throw new Error(
        data?.error || data || `Request failed: ${response.status}`
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


// ==================== AUTH ====================

export const signup = (name, email, password) =>
  request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });


export const login = (email, password) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });


// ==================== USER ====================

export const getProfile = (userId) =>
  request(`/user/profile?id=${encodeURIComponent(userId)}`);


// ==================== WALLET ====================

export const getWallet = (userId) =>
  request(`/wallet/me?userId=${encodeURIComponent(userId)}`);


export const deposit = (userId, amount) =>
  request(
    `/wallet/deposit?userId=${encodeURIComponent(
      userId
    )}&amount=${encodeURIComponent(amount)}`,
    {
      method: "POST",
    }
  );


export const withdraw = (userId, amount) =>
  request(
    `/wallet/withdraw?userId=${encodeURIComponent(
      userId
    )}&amount=${encodeURIComponent(amount)}`,
    {
      method: "POST",
    }
  );


export const sendMoney = (userId, receiverEmail, amount) =>
  request(
    `/wallet/send?userId=${encodeURIComponent(
      userId
    )}&receiverEmail=${encodeURIComponent(
      receiverEmail
    )}&amount=${encodeURIComponent(amount)}`,
    {
      method: "POST",
    }
  );