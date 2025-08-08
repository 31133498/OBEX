// Test script to check forgot password endpoint
const testForgotPassword = async () => {
  const email = 'test@example.com'; // Replace with your email
  
  try {
    console.log('Testing forgot password endpoint...');
    console.log('Email:', email);
    
    const response = await fetch('https://primus-lite.onrender.com/api/users/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Forgot password request successful!');
      console.log('Message:', data.message);
    } else {
      console.log('❌ Forgot password request failed!');
      console.log('Error:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};

// Run the test
testForgotPassword();
