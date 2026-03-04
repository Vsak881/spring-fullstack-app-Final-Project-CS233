package com.finalprojectcs233.demo.service;

import com.finalprojectcs233.demo.model.User;
import com.finalprojectcs233.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public User register(User user) {
        user.setRole("customer");
        return userRepository.save(user);
    }

    public Optional<User> login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user;
        }
        return Optional.empty();
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }
}