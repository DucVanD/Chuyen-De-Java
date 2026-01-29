package com.example.backend.controller.user;

import com.example.backend.entity.Cart;
import com.example.backend.entity.User;
import com.example.backend.service.CartService;
import com.example.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    private Integer getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentPrincipalName = authentication.getName();
        // UserService returns UserDto, assuming getByEmail exists and returns UserDto
        com.example.backend.dto.UserDto userDto = userService.getByEmail(currentPrincipalName);
        return userDto.getId();
    }

    @GetMapping
    public ResponseEntity<Cart> getMyCart() {
        return ResponseEntity.ok(cartService.getCartByUserId(getAuthenticatedUserId()));
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestParam Integer productId, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.addToCart(getAuthenticatedUserId(), productId, quantity));
    }

    @PutMapping("/update/{itemId}")
    public ResponseEntity<Cart> updateItem(@PathVariable Long itemId, @RequestParam int quantity) {
        return ResponseEntity.ok(cartService.updateCartItem(getAuthenticatedUserId(), itemId, quantity));
    }

    @DeleteMapping("/remove/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long itemId) {
        cartService.removeCartItem(getAuthenticatedUserId(), itemId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/clear")
    public ResponseEntity<?> clearCart() {
        cartService.clearCart(getAuthenticatedUserId());
        return ResponseEntity.ok().build();
    }
}
