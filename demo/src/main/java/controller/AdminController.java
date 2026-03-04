package com.finalprojectcs233.demo.controller;

import com.finalprojectcs233.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {
    @Autowired
    private AdminService adminService;

    @GetMapping("/products")
    public Object getAllProducts() {
        return adminService.getAllProducts();
    }

    @GetMapping("/orders")
    public Object getAllOrders() {
        return adminService.getAllOrders();
    }

    @GetMapping("/users")
    public Object getAllUsers() {
        return adminService.getAllUsers();
    }
}