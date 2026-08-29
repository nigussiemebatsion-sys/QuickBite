-- QuickBite Database Schema
-- Run this file first to create all tables.
-- Safe to re-run: uses IF NOT EXISTS.

-- ─────────────────────────────────────────────────────────────
-- foods
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS foods (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)   NOT NULL,
    description TEXT,
    price       NUMERIC(10, 2) NOT NULL,
    available   BOOLEAN        DEFAULT true,
    image       VARCHAR(255)
);

-- ─────────────────────────────────────────────────────────────
-- orders
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
    id               SERIAL PRIMARY KEY,
    customer_name    VARCHAR(100),
    phone            VARCHAR(20),
    delivery_address TEXT,
    total            NUMERIC(10, 2) NOT NULL,
    status           VARCHAR(30)    DEFAULT 'pending',
    created_at       TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT phone_digits_only CHECK (phone IS NULL OR phone ~ '^[0-9]+$')
);

-- ─────────────────────────────────────────────────────────────
-- order_items
-- ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
    id       SERIAL PRIMARY KEY,
    order_id INTEGER        NOT NULL REFERENCES orders(id),
    food_id  INTEGER        NOT NULL REFERENCES foods(id),
    quantity INTEGER        NOT NULL,
    price    NUMERIC(10, 2) NOT NULL
);
