// ===========================================
// CART DEBUG SCRIPT
// ===========================================
// Copy and paste this into Browser Console (F12)
// while on the cart page

console.log("=== CART DEBUG INFO ===");
console.log("");

// 1. Check Authentication
const token = localStorage.getItem('token');
console.log("1. AUTHENTICATION:");
console.log("   Token exists:", !!token);
if (token) {
    console.log("   Token (first 50 chars):", token.substring(0, 50) + "...");
} else {
    console.log("   ⚠️  NO TOKEN FOUND - You are NOT logged in!");
    console.log("   → Items will only save to localStorage");
    console.log("   → Admin CANNOT see your cart");
}
console.log("");

// 2. Check Cart Items
const cartItems = localStorage.getItem('cartItems');
console.log("2. CART IN LOCALSTORAGE:");
if (cartItems) {
    const items = JSON.parse(cartItems);
    console.log("   Items count:", items.length);
    console.log("   Products:", items.map(i => i.name));
} else {
    console.log("   No items in localStorage");
}
console.log("");

// 3. Check Redux State (if available)
try {
    const state = window.__REDUX_DEVTOOLS_EXTENSION__ ?
        window.__REDUX_DEVTOOLS_EXTENSION__.store.getState() :
        null;
    if (state && state.cart) {
        console.log("3. REDUX CART STATE:");
        console.log("   Items count:", state.cart.items.length);
        console.log("   Status:", state.cart.status);
    }
} catch (e) {
    console.log("3. Redux DevTools not available");
}
console.log("");

// 4. Solution
console.log("=== SOLUTION ===");
if (!token) {
    console.log("%c PROBLEM: You need to LOGIN first!", "color: red; font-weight: bold; font-size: 14px");
    console.log("");
    console.log("Steps to fix:");
    console.log("1. Clear current cart:");
    console.log("   localStorage.removeItem('cartItems')");
    console.log("2. Reload page");
    console.log("3. LOGIN to your account");
    console.log("4. Add products again");
    console.log("5. Check Network tab for: POST /api/cart/add");
    console.log("6. If you see Status 200 → Go to Admin panel!");
} else {
    console.log("%c ✓ You are logged in!", "color: green; font-weight: bold");
    console.log("");
    console.log("Next: Try adding a product and check Network tab");
    console.log("Look for: POST http://localhost:8080/api/cart/add");
}
