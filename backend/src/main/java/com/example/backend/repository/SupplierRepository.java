package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.entity.Supplier;
import org.springframework.stereotype.Repository;
@Repository
public  interface SupplierRepository extends JpaRepository<Supplier, Integer>{

     
}