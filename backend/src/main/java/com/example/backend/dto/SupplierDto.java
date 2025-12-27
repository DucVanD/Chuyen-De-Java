package com.example.backend.dto;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SupplierDto {
    private Integer id;
    private String name;
    private String supplierCode;
    private String email;
    private String phone;
    private String address;
    private Integer status;
}
