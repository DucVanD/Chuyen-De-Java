-- SQL Script to Drop Cart Tables
-- Run this in MySQL Workbench or command line if backend fails to start

USE sieuthimini;

-- Drop tables in correct order (foreign keys first)
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;

-- Verify tables are gone
SHOW TABLES LIKE 'cart%';

-- The backend will automatically recreate these tables when it starts
