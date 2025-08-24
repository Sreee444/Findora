const API_URL = import.meta.env.VITE_API_URL || 'https://gotcha-bn3z.onrender.com';

// Get all users (admin)
export async function getAllUsers() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/auth/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return await response.json();
}

// Delete a user (admin)
export async function deleteUser(userId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/auth/users/${userId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to delete user');
  return await response.json();
}

// Get all items (optionally filter by approval/verification)
export async function getPendingItems() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/items`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to fetch items');
  const items = await response.json();
  // Only show items that are not approved/verified
  return items.filter(item => (item.type === 'lost' && !item.approved) || (item.type === 'found' && !item.verified));
}

// Approve a lost item (admin)
export async function approveLostItem(itemId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/items/${itemId}/approve`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to approve item');
  return await response.json();
}

// Verify a found item (admin)
export async function verifyFoundItem(itemId) {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/api/items/${itemId}/verify`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error('Failed to verify item');
  return await response.json();
}

// Signup a new user
export async function signup(email, password, username) {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
  });
  if (!response.ok) {
    throw new Error('Signup failed');
  }
  return await response.json();
}

// Submit a lost or found item (protected route)
export async function submitItem(itemData) {
  const token = localStorage.getItem('token');
  // Convert date to ISO string if it's a date input (yyyy-mm-dd)
  let data = { ...itemData };
  if (data.date && typeof data.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    data.date = new Date(data.date).toISOString();
  }
  const response = await fetch(`${API_URL}/api/items`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to submit item');
  }
  return await response.json();
}

// Forgot password - request reset email
export async function forgotPassword(email) {
  const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!response.ok) {
    throw new Error('Failed to send reset email');
  }
  return await response.json();
}

// Verify reset token
export async function verifyResetToken(token) {
  const response = await fetch(`${API_URL}/api/auth/verify-reset-token/${token}`);
  if (!response.ok) {
    throw new Error('Invalid or expired reset token');
  }
  return await response.json();
}

// Reset password with token
export async function resetPasswordWithToken(token, newPassword) {
  const response = await fetch(`${API_URL}/api/auth/reset-password-with-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword }),
  });
  if (!response.ok) {
    throw new Error('Failed to reset password');
  }
  return await response.json();
}

export async function login(email, password) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  const data = await response.json();
  // Store token in localStorage
  localStorage.setItem('token', data.token);
  return data.token;
}