package com.finalprojectcs233.demo.service;

import com.finalprojectcs233.demo.model.Cart;
import com.finalprojectcs233.demo.repository.CartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;

    public List<Cart> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    public Cart addToCart(Cart cart) {
        return cartRepository.save(cart);
    }

    public void removeFromCart(Long cartId) {
        cartRepository.deleteById(cartId);
    }

    public void clearCart(Long userId) {
        cartRepository.deleteByUserId(userId);
    }
}