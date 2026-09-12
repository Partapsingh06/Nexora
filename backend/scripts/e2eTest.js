async function fullTest() {
  const results = {};
  
  // Test 1: All Products
  console.log("=== TEST 1: All Products ===");
  try {
    const r = await fetch("http://localhost:5000/api/products?limit=100");
    const d = await r.json();
    const count = d.total || 0;
    const pageCount = d.products?.length || 0;
    console.log("  Total products:", count, " In response:", pageCount);
    const sample = d.products?.[0];
    if (sample) {
      console.log("  Fields:", Object.keys(sample).join(", "));
      console.log("  Sample:", JSON.stringify({ name: sample.name, price: sample.price, brand: sample.brand, rating: sample.rating }));
    }
    results["All Products"] = count >= 60 ? "PASS" : "FAIL (" + count + " products)";
  } catch(e) { results["All Products"] = "FAIL: " + e.message; }

  // Test 2-6: Category pages
  const categories = ["Appliances", "Beauty & Personal Care", "Electronics", "Fashion", "Home & Kitchen"];
  for (const cat of categories) {
    console.log("\n=== TEST: " + cat + " ===");
    try {
      const r = await fetch("http://localhost:5000/api/products?category=" + encodeURIComponent(cat) + "&limit=100");
      const d = await r.json();
      const count = d.total || 0;
      console.log("  Products count:", count);
      if (d.products?.[0]) {
        const p = d.products[0];
        console.log("  Sample:", JSON.stringify({ name: p.name, price: p.price, brand: p.brand }));
        console.log("  Has images:", Array.isArray(p.images) && p.images.length > 0);
        console.log("  Category:", JSON.stringify(p.category));
      }
      const missing = (d.products || []).filter(p => !p.name || !p.price || (!p.images?.length && !p.image));
      console.log("  Products missing required fields:", missing.length);
      results[cat] = count >= 10 ? "PASS" : "FAIL (" + count + " products)";
    } catch(e) { results[cat] = "FAIL: " + e.message; }
  }

  // Test 7: Search
  console.log("\n=== TEST: Search ===");
  try {
    const r = await fetch("http://localhost:5000/api/products?search=Samsung&limit=100");
    const d = await r.json();
    console.log("  Search 'Samsung' total:", d.total || 0, " returned:", d.products?.length || 0);
    if (d.products?.[0]) console.log("  First result:", d.products[0].name);
    results["Search"] = (d.total || d.products?.length || 0) > 0 ? "PASS" : "FAIL";
  } catch(e) { results["Search"] = "FAIL: " + e.message; }

  // Test 8: Product detail
  console.log("\n=== TEST: Product Detail ===");
  try {
    const allR = await fetch("http://localhost:5000/api/products?limit=1");
    const allD = await allR.json();
    const id = allD.products?.[0]?._id;
    if (id) {
      const r = await fetch("http://localhost:5000/api/products/" + id);
      const d = await r.json();
      const product = d.product || d;
      console.log("  Product detail:", JSON.stringify({ name: product.name, price: product.price, has_images: !!product.images?.length }));
      results["Product Detail"] = product.name ? "PASS" : "FAIL";
    } else {
      results["Product Detail"] = "FAIL: No products found";
    }
  } catch(e) { results["Product Detail"] = "FAIL: " + e.message; }

  // Test 9: Brands
  console.log("\n=== TEST: Brands ===");
  try {
    const r = await fetch("http://localhost:5000/api/products?limit=1000");
    const d = await r.json();
    const brands = [...new Set((d.products || []).map(p => p.brand).filter(Boolean))];
    console.log("  Available brands (" + brands.length + "):", brands.join(", "));
    results["Brands Available"] = brands.length > 3 ? "PASS" : "FAIL (" + brands.length + " brands)";
  } catch(e) { results["Brands Available"] = "FAIL: " + e.message; }

  // Test 10: Brand filter
  console.log("\n=== TEST: Brand Filter ===");
  try {
    const allR = await fetch("http://localhost:5000/api/products?limit=1000");
    const allD = await allR.json();
    const firstBrand = (allD.products || []).find(p => p.brand)?.brand;
    if (firstBrand) {
      const r = await fetch("http://localhost:5000/api/products?brand=" + encodeURIComponent(firstBrand) + "&limit=100");
      const d = await r.json();
      const allMatch = (d.products || []).every(p => p.brand?.toLowerCase() === firstBrand.toLowerCase());
      console.log("  Filter by '" + firstBrand + "': " + (d.total || d.products?.length || 0) + " products, all match: " + allMatch);
      results["Brand Filter"] = (d.total || d.products?.length || 0) > 0 && allMatch ? "PASS" : "FAIL";
    } else {
      results["Brand Filter"] = "FAIL: No brands found";
    }
  } catch(e) { results["Brand Filter"] = "FAIL: " + e.message; }

  // Test 11: Price filter
  console.log("\n=== TEST: Price Filter ===");
  try {
    const r = await fetch("http://localhost:5000/api/products?minPrice=1000&maxPrice=5000&limit=100");
    const d = await r.json();
    const allInRange = (d.products || []).every(p => p.price >= 1000 && p.price <= 5000);
    console.log("  Price range 1000-5000: " + (d.total || d.products?.length || 0) + " products, all in range: " + allInRange);
    results["Price Filter"] = (d.total || d.products?.length || 0) > 0 && allInRange ? "PASS" : "FAIL";
  } catch(e) { results["Price Filter"] = "FAIL: " + e.message; }

  // Test 12: Rating filter
  console.log("\n=== TEST: Rating Filter ===");
  try {
    const r = await fetch("http://localhost:5000/api/products?rating=4&limit=100");
    const d = await r.json();
    const allAbove = (d.products || []).every(p => p.rating >= 4);
    console.log("  Rating >= 4: " + (d.total || d.products?.length || 0) + " products, all above 4: " + allAbove);
    results["Rating Filter"] = (d.total || d.products?.length || 0) > 0 && allAbove ? "PASS" : "FAIL";
  } catch(e) { results["Rating Filter"] = "FAIL: " + e.message; }

  // Test 13: Product Images
  console.log("\n=== TEST: Product Images ===");
  try {
    const r = await fetch("http://localhost:5000/api/products?limit=1000");
    const d = await r.json();
    const withImages = (d.products || []).filter(p => (p.images && p.images.length > 0 && p.images[0].startsWith("http")) || (p.image && p.image.startsWith("http")));
    const total = d.products?.length || 0;
    console.log("  Products with valid image URLs:", withImages.length, "/", total);
    results["Product Images"] = withImages.length === total ? "PASS" : "FAIL (" + (total - withImages.length) + " missing)";
  } catch(e) { results["Product Images"] = "FAIL: " + e.message; }

  // Test 14: Category slug matching
  console.log("\n=== TEST: Category Slug Matching ===");
  const slugTests = [
    { slug: "appliances", expect: "Appliances" },
    { slug: "beauty-personal-care", expect: "Beauty & Personal Care" },
    { slug: "electronics", expect: "Electronics" },
    { slug: "fashion", expect: "Fashion" },
    { slug: "home-kitchen", expect: "Home & Kitchen" },
  ];
  let slugPassed = 0;
  for (const { slug, expect: expName } of slugTests) {
    try {
      const r = await fetch("http://localhost:5000/api/products?category=" + slug + "&limit=100");
      const d = await r.json();
      const count = d.total || d.products?.length || 0;
      console.log("  Slug '" + slug + "': " + count + " products");
      if (count > 0) slugPassed++;
    } catch(e) { console.log("  Slug '" + slug + "': ERROR -", e.message); }
  }
  results["Category Slugs"] = slugPassed === slugTests.length ? "PASS" : "FAIL (" + slugPassed + "/" + slugTests.length + " slugs work)";

  // Test 15: Sort
  console.log("\n=== TEST: Sort ===");
  try {
    const r = await fetch("http://localhost:5000/api/products?sort=price-low&limit=5");
    const d = await r.json();
    const prices = (d.products || []).map(p => p.price);
    const sorted = prices.every((p, i) => i === 0 || p >= prices[i-1]);
    console.log("  Price low-to-high:", prices.join(", "), " sorted:", sorted);
    results["Sort"] = sorted ? "PASS" : "FAIL";
  } catch(e) { results["Sort"] = "FAIL: " + e.message; }

  // Test 16: Frontend pages
  console.log("\n=== TEST: Frontend Pages ===");
  const pages = ["/", "/products", "/products?category=Electronics", "/products?category=Fashion", "/products?category=Appliances"];
  let pagesPassed = 0;
  for (const page of pages) {
    try {
      const r = await fetch("http://localhost:5173" + page);
      console.log("  " + page + ": Status " + r.status);
      if (r.status === 200) pagesPassed++;
    } catch(e) { console.log("  " + page + ": ERROR -", e.message); }
  }
  results["Frontend Pages"] = pagesPassed === pages.length ? "PASS" : "FAIL (" + pagesPassed + "/" + pages.length + ")";

  // Test 17: Categories API
  console.log("\n=== TEST: Categories API ===");
  try {
    const r = await fetch("http://localhost:5000/api/categories");
    const d = await r.json();
    const catNames = (d.categories || []).map(c => c.name);
    console.log("  Categories:", catNames.join(", "));
    results["Categories API"] = catNames.length >= 5 ? "PASS" : "FAIL (" + catNames.length + " categories)";
  } catch(e) { results["Categories API"] = "FAIL: " + e.message; }

  // Summary
  console.log("\n\n========================================");
  console.log("        E2E TEST RESULTS SUMMARY");
  console.log("========================================");
  Object.entries(results).forEach(([k, v]) => {
    const icon = v === "PASS" ? "PASS" : "FAIL";
    console.log("  [" + icon + "] " + k + ": " + v);
  });
  const passed = Object.values(results).filter(v => v === "PASS").length;
  const total = Object.keys(results).length;
  console.log("\n  TOTAL: " + passed + "/" + total + " PASSED");
  if (passed === total) {
    console.log("  ALL TESTS PASSED!");
  } else {
    console.log("  SOME TESTS FAILED - needs attention");
  }
}

fullTest().catch(e => console.error(e));
