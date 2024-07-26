BEGIN;

-- Supprimer d'abord les tables qui ont des clés étrangères
DROP TABLE IF EXISTS "OrderDetails";
DROP TABLE IF EXISTS "Orders";
DROP TABLE IF EXISTS favorite;
DROP TABLE IF EXISTS "Cart";
DROP TABLE IF EXISTS "Alerts";
DROP TABLE IF EXISTS "DeliveryAdress";
DROP TABLE IF EXISTS "Media";

-- Ensuite, supprimer les tables principales
DROP TABLE IF EXISTS "Product";
DROP TABLE IF EXISTS "Clients";

-- Supprimer les tables indépendantes
DROP TABLE IF EXISTS "Section";
DROP TABLE IF EXISTS "SequelizeMeta";

-- Enfin, supprimer la séquence
DROP SEQUENCE IF EXISTS "User_id_seq";

-- Drop and recreate sequence for Clients table
DROP SEQUENCE IF EXISTS "User_id_seq";
CREATE SEQUENCE IF NOT EXISTS "User_id_seq";

-- Drop and recreate Clients table
DROP TABLE IF EXISTS "Clients";
CREATE TABLE IF NOT EXISTS "Clients" (
                                         id integer DEFAULT nextval('"User_id_seq"'::regclass) NOT NULL CONSTRAINT "User_pkey" PRIMARY KEY,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role VARCHAR(50),
    confirmed BOOLEAN DEFAULT false,
    reset_token TEXT,
    reset_token_expiry TIMESTAMP,
    confirmation_token VARCHAR,
    confirmation_token_expiry TIMESTAMP DEFAULT CURRENT_DATE,
    password_last_changed DATE,
    account_created_at DATE DEFAULT now()
    );

-- Drop and recreate Product table
DROP TABLE IF EXISTS "Product";
CREATE TABLE IF NOT EXISTS "Product" (
                                         id SERIAL PRIMARY KEY,
                                         name VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    brand VARCHAR(100),
    price NUMERIC(10,2),
    stock_available INTEGER,
    status VARCHAR(50),
    image VARCHAR(255)
    );

-- Drop and recreate Alerts table
DROP TABLE IF EXISTS "Alerts";
CREATE TABLE IF NOT EXISTS "Alerts" (
                                        id SERIAL PRIMARY KEY,
                                        userid INTEGER REFERENCES "Clients",
                                        alerttype VARCHAR(50),
    productid INTEGER REFERENCES "Product",
    status VARCHAR(50)
    );

-- Drop and recreate Cart table
DROP TABLE IF EXISTS "Cart";
CREATE TABLE IF NOT EXISTS "Cart" (
                                      id SERIAL PRIMARY KEY,
                                      userid INTEGER REFERENCES "Clients",
                                      productid INTEGER REFERENCES "Product",
                                      quantity INTEGER,
                                      "sessionId" VARCHAR(255),
    "reservedUntil" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Drop and recreate DeliveryAdress table
DROP TABLE IF EXISTS "DeliveryAdress";
CREATE TABLE IF NOT EXISTS "DeliveryAdress" (
                                                id SERIAL PRIMARY KEY,
                                                userid INTEGER REFERENCES "Clients",
                                                adress VARCHAR(255),
    city VARCHAR(100),
    postalcode VARCHAR(20),
    department VARCHAR(100),
    country VARCHAR(100) DEFAULT 'France',
    address TEXT NOT NULL
    );

-- Drop and recreate SequelizeMeta table
DROP TABLE IF EXISTS "SequelizeMeta";
CREATE TABLE IF NOT EXISTS "SequelizeMeta" (
                                               name VARCHAR(255) NOT NULL PRIMARY KEY
    );

-- Drop and recreate Media table
DROP TABLE IF EXISTS "Media";
CREATE TABLE IF NOT EXISTS "Media" (
                                       id SERIAL PRIMARY KEY,
                                       "productId" INTEGER REFERENCES "Product" ON DELETE CASCADE,
                                       path VARCHAR(255) NOT NULL
    );

-- Drop and recreate Section table
DROP TABLE IF EXISTS "Section";
CREATE TABLE IF NOT EXISTS "Section" (
                                         id SERIAL PRIMARY KEY,
                                         name VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
                              );

-- Drop and recreate favorite table
DROP TABLE IF EXISTS favorite;
CREATE TABLE IF NOT EXISTS favorite (
                                        id SERIAL PRIMARY KEY,
                                        userid INTEGER NOT NULL REFERENCES "Clients",
                                        productids INTEGER[] DEFAULT ARRAY[]::INTEGER[],
                                        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                                        "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Drop and recreate Orders table
DROP TABLE IF EXISTS "Orders";
CREATE TABLE IF NOT EXISTS "Orders" (
                                        id SERIAL PRIMARY KEY,
                                        "dateOrder" TIMESTAMP WITH TIME ZONE NOT NULL,
                                        "statusOrder" VARCHAR(255) NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES "Clients",
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
                              );

-- Drop and recreate OrderDetails table
DROP TABLE IF EXISTS "OrderDetails";
CREATE TABLE IF NOT EXISTS "OrderDetails" (
                                              "orderId" INTEGER NOT NULL REFERENCES "Orders" ON DELETE CASCADE,
                                              "productId" INTEGER NOT NULL REFERENCES "Product" ON DELETE CASCADE,
                                              "productName" VARCHAR(500) NOT NULL,
    "productDescription" VARCHAR(10000) NOT NULL,
    "productCategory" VARCHAR(2555) NOT NULL,
    "productBrand" VARCHAR(255) NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    quantity INTEGER NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL,
                              id SERIAL PRIMARY KEY
                              );


END;