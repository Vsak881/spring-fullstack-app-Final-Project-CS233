package com.finalprojectcs233.demo.controller;
import com.finalprojectcs233.demo.model.Product;
import com.finalprojectcs233.demo.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/seller/{sellerId}")
    public List<Product> getProductsBySeller(@PathVariable Long sellerId) {
        return productService.getProductsBySeller(sellerId);
    }

    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return productService.addProduct(product);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, @RequestParam Long sellerId) {
        Product product = productService.getProductById(id);
        if (product == null) return ResponseEntity.notFound().build();
        if (product.getSellerId() != null && !product.getSellerId().equals(sellerId)) {
            return ResponseEntity.status(403).body("Not your product");
        }
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
}