// Simple test script to verify notifications work
// Run this in browser console after logging in

async function testNotifications() {
  const API_URL = 'http://localhost:5000';
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.error('No token found. Please login first.');
    return;
  }
  
  try {
    console.log('Testing notifications endpoint...');
    const response = await fetch(`${API_URL}/api/notifications`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      console.error('Response not OK:', response.status, response.statusText);
      const error = await response.text();
      console.error('Error details:', error);
      return;
    }
    
    const notifications = await response.json();
    console.log('✅ Notifications fetched successfully:', notifications);
    
    if (notifications.length === 0) {
      console.log('No notifications found. This is normal for new users.');
    }
    
  } catch (error) {
    console.error('❌ Error fetching notifications:', error);
  }
}

// Run the test
testNotifications();
