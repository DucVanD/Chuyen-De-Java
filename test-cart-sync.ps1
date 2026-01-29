# Cart API Test Script
# Run this in PowerShell after logging in to get a token

Write-Host "=== CART SYNCHRONIZATION TEST ===" -ForegroundColor Green
Write-Host ""

# Step 1: Test GET all carts (Admin only - will fail without auth)
Write-Host "1. Testing Admin Carts Endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/api/admin/carts" -Method GET
    Write-Host "   SUCCESS: Got carts list" -ForegroundColor Green
    $response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5
} catch {
    Write-Host "   EXPECTED: 401 Unauthorized (need admin token)" -ForegroundColor Cyan
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "2. Checking if Backend is Running..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:8080/actuator/health" -Method GET -ErrorAction SilentlyContinue
    Write-Host "   ✓ Backend is UP!" -ForegroundColor Green
} catch {
    try {
        # Try a different endpoint
        Invoke-WebRequest -Uri "http://localhost:8080/api/products" -Method GET -ErrorAction Stop | Out-Null
        Write-Host "   ✓ Backend is UP (verified via /api/products)!" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Backend might be down or not accessible" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "3. Checking Frontend..." -ForegroundColor Yellow
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 2
    Write-Host "   ✓ Frontend is running!" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Frontend not accessible at http://localhost:5173" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== MANUAL TEST STEPS ===" -ForegroundColor Green
Write-Host ""
Write-Host "TO SEE CARTS IN ADMIN PANEL:" -ForegroundColor Cyan
Write-Host "1. Open http://localhost:5173 in browser" -ForegroundColor White
Write-Host "2. LOGIN with a USER account (not admin)" -ForegroundColor White
Write-Host "3. Add a product to cart" -ForegroundColor White
Write-Host "4. Open DevTools (F12) -> Network tab" -ForegroundColor White
Write-Host "5. Look for: POST /api/cart/add?productId=...&quantity=..." -ForegroundColor White
Write-Host "6. If status is 200 -> SUCCESS!" -ForegroundColor White
Write-Host "7. Logout -> Login as ADMIN" -ForegroundColor White
Write-Host "8. Go to /admin/carts" -ForegroundColor White
Write-Host "9. You should see the cart!" -ForegroundColor White
Write-Host ""
Write-Host "IMPORTANT: If not logged in, cart is saved to localStorage only!" -ForegroundColor Red
