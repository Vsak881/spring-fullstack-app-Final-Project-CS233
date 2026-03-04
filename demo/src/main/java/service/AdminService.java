package com.finalprojectcs233.demo.service;

import com.finalprojectcs233.demo.model.Order;
import com.finalprojectcs233.demo.model.Product;
import com.finalprojectcs233.demo.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {
    @Autowired
    private ProductService productService;
    @Autowired
    private OrderService orderService;
    @Autowired
    private UserService userService;

    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}