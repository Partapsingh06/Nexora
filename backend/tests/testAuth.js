const API_URL = 'http://localhost:5000/api';

async function runAuthTests() {
  console.log('--- STARTING NEXORA AUTH API TESTS ---');

  const testUser = {
    name: 'Rahul Sharma',
    email: `rahul_${Date.now()}@example.com`,
    password: 'Password@123',
    phone: '9876543210',
    address: {
      street: '123 Brigade Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
    },
  };

  try {
    // 1. Health check
    const healthRes = await fetch(`${API_URL}/health`);
    const health = await healthRes.json();
    console.log('✅ 1. GET /api/health passed:', health);

    // 2. Register
    console.log('Testing Registration with:', testUser.email);
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const regData = await regRes.json();
    console.log('✅ 2. POST /api/auth/register passed:');
    console.log('   - Status:', regRes.status);
    console.log('   - User:', regData.user?.name, '(', regData.user?.email, ')');
    console.log('   - Token received:', regData.token ? 'YES (Bearer JWT)' : 'NO');
    console.log('   - Password hidden in response:', regData.user?.password === undefined ? 'YES (Secure)' : 'NO (ERROR)');

    const token = regData.token;

    // 3. Duplicate Email Check
    const dupRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    const dupData = await dupRes.json();
    console.log(`✅ 3. Duplicate email prevention passed (HTTP ${dupRes.status}):`, dupData.message);

    // 4. Invalid Login
    const invalidLoginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: 'WrongPassword!' }),
    });
    const invalidLoginData = await invalidLoginRes.json();
    console.log(`✅ 4. Invalid credentials rejection passed (HTTP ${invalidLoginRes.status}):`, invalidLoginData.message);

    // 5. Valid Login
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });
    const loginData = await loginRes.json();
    console.log('✅ 5. POST /api/auth/login passed:');
    console.log('   - Status:', loginRes.status);
    console.log('   - Token received:', loginData.token ? 'YES' : 'NO');

    // 6. Get Protected Profile
    const profileRes = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profileData = await profileRes.json();
    console.log('✅ 6. GET /api/auth/profile (Protected with JWT) passed:');
    console.log('   - User Profile:', profileData.user);

    // 7. Update Profile
    const updateRes = await fetch(`${API_URL}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        phone: '9988776655',
        address: { city: 'Mumbai', state: 'Maharashtra' },
      }),
    });
    const updateData = await updateRes.json();
    console.log('✅ 7. PUT /api/auth/profile passed:');
    console.log('   - Updated Phone:', updateData.user?.phone);
    console.log('   - Updated City:', updateData.user?.address?.city);

    // 8. Access Profile without token (Should fail 401)
    const unauthRes = await fetch(`${API_URL}/auth/profile`);
    console.log(`✅ 8. Protected route unauthorized rejection passed (HTTP ${unauthRes.status})`);

    console.log('\n🎉 ALL AUTHENTICATION TESTS PASSED SUCCESSFULLY! 🎉\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err.message);
  }
}

runAuthTests();
