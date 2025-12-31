package com.example.backend.controller.user;

import com.example.backend.dto.ProductDto;
import com.example.backend.service.ProductService;

import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAll() {
        return ResponseEntity.ok(productService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(productService.getById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> create(@RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDto> update(
            @PathVariable Integer id,
            @RequestBody ProductDto dto) {
        return ResponseEntity.ok(productService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductDto>> search(
            @RequestParam String keyword) {
        return ResponseEntity.ok(productService.search(keyword));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<ProductDto>> filter(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer brandId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean hasPromotion) {
        return ResponseEntity.ok(productService.filter(categoryId, brandId, status, minPrice, maxPrice, hasPromotion));
    }

    // ✅ HATEOAS
    @GetMapping("/{id}/hateoas")
    public EntityModel<ProductDto> getByIdHateoas(@PathVariable Integer id) {

        ProductDto dto = productService.getById(id);

        return EntityModel.of(dto,
                linkTo(methodOn(ProductController.class).getById(id)).withSelfRel(),
                linkTo(methodOn(ProductController.class).update(id, null)).withRel("update"),
                linkTo(methodOn(ProductController.class).delete(id)).withRel("delete"),
                linkTo(methodOn(ProductController.class).getAll()).withRel("all"));
    }
}
