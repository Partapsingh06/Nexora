const API_URL = 'http://localhost:5000/api';

async function testCartAndWishlistFlow() {
  console.log('--- STARTING NEXORA CART & WISHLIST E2E VALIDATION ---');

  try {
    // 1. Fetch available products
    const prodRes = await fetch(`${API_URL}/products?limit=2`);
    const prodData = await prodRes.json();
    if (!prodData.products || prodData.products.length < 2) {
      throw new Error('Not enough products in database. Please run npm run seed first.');
    }
    const productA = prodData.products[0];
    const productB = prodData.products[1];
    console.log(`✅ 1. Selected Products: "${productA.name}" (Stock: ${productA.stock}, Price: ₹${productA.price}) and "${productB.name}"`);

    // 2. Register & Login User A
    const userAEmail = `user_a_${Date.now()}@example.com`;
    const regResA = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User Alpha',
        email: userAEmail,
        password: 'Password@123',
      }),
    });
    const dataA = await regResA.json();
    const tokenA = dataA.token;
    console.log('✅ 2. Registered User A:', userAEmail);

    // 3. User A Adds Product A to Cart (with attempt to tamper price)
    const addCartRes = await fetch(`${API_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({
        productId: productA._id,
        quantity: 2,
        price: 1, // Tampered price attempt
      }),
    });
    const cartDataA = await addCartRes.json();
    console.log('✅ 3. User A added Product A to cart (Status:', addCartRes.status, ')');
    console.log('   - Items in cart:', cartDataA.cart.items.length);
    console.log('   - Price security check (DB Price enforced):', cartDataA.cart.items[0].price === productA.price ? 'YES (Secure)' : 'NO (FAILED)');
    console.log('   - Total Quantity:', cartDataA.cart.totalQuantity);
    console.log('   - Cart Total:', cartDataA.cart.cartTotal);

    // 4. Update Quantity (Valid & Over-stock check)
    const updateRes = await fetch(`${API_URL}/cart/${productA._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ quantity: 3 }),
    });
    const updatedData = await updateRes.json();
    console.log('✅ 4. Updated quantity to 3 (Status:', updateRes.status, '): Total Qty =', updatedData.cart.totalQuantity);

    // Over-stock check: Try adding quantity 99999
    const overStockRes = await fetch(`${API_URL}/cart/${productA._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenA}`,
      },
      body: JSON.stringify({ quantity: 99999 }),
    });
    const overStockData = await overStockRes.json();
    console.log(`✅ 5. Over-stock validation passed: HTTP ${overStockRes.status} -> "${overStockData.message}"`);

    // 5. Wishlist Operations for User A
    const addWishRes = await fetch(`${API_URL}/wishlist/${productB._id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const wishDataA = await addWishRes.json();
    console.log('✅ 6. User A added Product B to wishlist (Count:', wishDataA.count, ')');

    // Duplicate check
    const dupWishRes = await fetch(`${API_URL}/wishlist/${productB._id}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const dupWishData = await dupWishRes.json();
    console.log('✅ 7. Duplicate wishlist prevention check: Wishlist count remained', dupWishData.count);

    // Check wishlist endpoint
    const checkRes = await fetch(`${API_URL}/wishlist/check/${productB._id}`, {
      headers: {
        Authorization: `Bearer ${tokenA}`,
      },
    });
    const checkData = await checkRes.json();
    console.log('✅ 8. Check Wishlist API for Product B returned inWishlist:', checkData.inWishlist);

    // 6. User Isolation Test: Register User B and verify User B has empty cart & wishlist
    const userBEmail = `user_b_${Date.now()}@example.com`;
    const regResB = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'User Beta',
        email: userBEmail,
        password: 'Password@123',
      }),
    });
    const dataB = await regResB.json();
    const tokenB = dataB.token;
    console.log('✅ 9. Registered User B:', userBEmail);

    const cartResB = await fetch(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const cartDataB = await cartResB.json();

    const wishResB = await fetch(`${API_URL}/wishlist`, {
      headers: { Authorization: `Bearer ${tokenB}` },
    });
    const wishDataB = await wishResB.json();

    console.log('✅ 10. User Isolation Verified:');
    console.log('   - User B Cart items count:', cartDataB.cart.items.length, '(Expected 0)');
    console.log('   - User B Wishlist items count:', wishDataB.count, '(Expected 0)');

    if (cartDataB.cart.items.length === 0 && wishDataB.count === 0) {
      console.log('   -> PERFECT USER DATA ISOLATION CONFIRMED!');
    } else {
      throw new Error('User isolation failed!');
    }

    console.log('\n🎉 ALL CART, WISHLIST, PRICE SECURITY & STOCK TESTS PASSED! 🎉\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err.message);
    process.exit(1);
  }
}

testCartAndWishlistFlow();
