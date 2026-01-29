package com.example.backend.service;

import com.example.backend.entity.Cart;
import com.example.backend.entity.CartItem;

import java.util.List;

public interface CartService {
    Cart getCartByUserId(Integer userId);

    Cart addToCart(Integer userId, Integer productId, int quantity);

    Cart updateCartItem(Integer userId, Long cartItemId, int quantity);

    void removeCartItem(Integer userId, Long cartItemId);

    void clearCart(Integer userId);

    // For Admin
    List<Cart> getAllCarts();

    Cart getCartById(Long cartId);
}
