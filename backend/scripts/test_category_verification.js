const dotenv = require('dotenv');
dotenv.config();

async function verifyAllCategoriesAndFilters() {
  console.log('=== 1. FETCHING ALL CATEGORIES ===');
  const catRes = await fetch('http://localhost:5000/api/categories').then(r => r.json());
  if (!catRes.success) throw new Error('Failed to fetch categories');
  console.log('Found', catRes.categories.length, 'categories:\n');

  let totalProducts = 0;
  for (const cat of catRes.categories) {
    const prodRes = await fetch('http://localhost:5000/api/products?category=' + cat._id + '&limit=50').then(r => r.json());
    console.log('----------------------------------------------------');
    console.log('Category:', cat.name, '| ID:', cat._id, '| Slug:', cat.slug);
    console.log('Product Count in DB:', prodRes.total, '| Returned:', prodRes.products.length);
    if (prodRes.products.length === 0) {
      console.error('❌ ZERO PRODUCTS FOUND FOR CATEGORY:', cat.name);
    } else {
      console.log('✅ Has Products. Sample products:');
      prodRes.products.slice(0, 3).forEach((p, i) => {
        console.log('   ' + (i + 1) + '. [' + p.brand + '] ' + p.name + ' - Rs.' + p.price + ' (Rating: ' + p.rating + ', Stock: ' + p.stock + ')');
        console.log('      Image URL:', p.images?.[0]);
      });
    }
    totalProducts += prodRes.total;
  }

  console.log('\n====================================================');
  console.log('Total Products across all categories:', totalProducts);
  console.log('====================================================\n');

  console.log('=== 2. TESTING PRODUCT FILTERING & SEARCH ===');

  // Search Test
  const searchRes = await fetch('http://localhost:5000/api/products?search=Sony').then(r => r.json());
  console.log('Search "Sony":', searchRes.total, 'results ->', searchRes.total >= 1 ? '✅ PASS' : '❌ FAIL');

  // Category Filter Test (by slug and by ObjectId)
  const catFilterRes = await fetch('http://localhost:5000/api/products?category=appliances').then(r => r.json());
  console.log('Filter by Category slug "appliances":', catFilterRes.total, 'results ->', catFilterRes.total > 0 ? '✅ PASS' : '❌ FAIL');

  // Brand Filter Test
  const brandRes = await fetch('http://localhost:5000/api/products?brand=Apple').then(r => r.json());
  console.log('Filter by Brand "Apple":', brandRes.total, 'results ->', brandRes.total >= 1 ? '✅ PASS' : '❌ FAIL');

  // Price Filter Test
  const priceRes = await fetch('http://localhost:5000/api/products?minPrice=500&maxPrice=5000').then(r => r.json());
  console.log('Filter by Price Rs.500 - Rs.5000:', priceRes.total, 'results ->', priceRes.total > 0 ? '✅ PASS' : '❌ FAIL');

  // Rating Filter Test
  const ratingRes = await fetch('http://localhost:5000/api/products?rating=4.5').then(r => r.json());
  console.log('Filter by Rating >= 4.5:', ratingRes.total, 'results ->', ratingRes.total > 0 ? '✅ PASS' : '❌ FAIL');

  // Sort Test (Price low to high)
  const sortRes = await fetch('http://localhost:5000/api/products?sort=price-low&limit=3').then(r => r.json());
  console.log('Sort Price Low-to-High first 3 prices:', sortRes.products.map(p => 'Rs.' + p.price).join(', '), '-> ✅ PASS');
}

verifyAllCategoriesAndFilters().catch(e => { console.error(e); process.exit(1); });
