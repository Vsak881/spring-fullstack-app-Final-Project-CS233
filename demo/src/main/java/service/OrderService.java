package com.finalprojectcs233.demo.service;

import com.finalprojectcs233.demo.model.Order;
import com.finalprojectcs233.demo.model.OrderItem;
import com.finalprojectcs233.demo.repository.OrderRepository;
import com.finalprojectcs233.demo.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;

    public Order createOrder(Order order) {
        order.setOrderedAt(LocalDateTime.now());
        order.setStatus("PENDING");
        return orderRepository.save(order);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public OrderItem addOrderItem(OrderItem item) {
        return orderItemRepository.save(item);
    }

    public List<OrderItem> getOrderItems(Long orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }
}