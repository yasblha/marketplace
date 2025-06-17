BEGIN;

CREATE TABLE IF NOT EXISTS "Section" (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Product" (
    id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    description text,
    category varchar(100),
    brand varchar(100),
    price numeric(10,2),
    stock_available integer,
    status varchar(50),
    image varchar(255),
    "sectionId" integer REFERENCES "Section"(id)
);

CREATE TABLE IF NOT EXISTS "Media" (
    id serial PRIMARY KEY,
    "productId" integer REFERENCES "Product"(id) ON DELETE CASCADE,
    path varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "Clients" (
    id serial PRIMARY KEY,
    firstname varchar(255),
    lastname varchar(255),
    email varchar(255),
    password varchar(255),
    role varchar(50),
    confirmed boolean DEFAULT false,
    reset_token text,
    reset_token_expiry timestamp,
    confirmation_token varchar,
    confirmation_token_expiry timestamp DEFAULT CURRENT_DATE,
    password_last_changed date,
    account_created_at date DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Client_Product" (
    "userId" integer REFERENCES "Clients"(id),
    "productId" integer REFERENCES "Product"(id),
    PRIMARY KEY ("userId","productId")
);

CREATE TABLE IF NOT EXISTS "Alerts" (
    id serial PRIMARY KEY,
    "userId" integer REFERENCES "Clients"(id),
    alerttype varchar(50),
    "productId" integer REFERENCES "Product"(id),
    status varchar(50)
);

CREATE TABLE IF NOT EXISTS "StockAlert" (
    id serial PRIMARY KEY,
    "productId" integer REFERENCES "Product"(id),
    "userId" integer REFERENCES "Clients"(id),
    threshold integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "Cart" (
    id serial PRIMARY KEY,
    userid integer REFERENCES "Clients"(id),
    productid integer REFERENCES "Product"(id),
    quantity integer,
    "sessionId" varchar(255),
    "reservedUntil" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favorite (
    id serial PRIMARY KEY,
    userid integer REFERENCES "Clients"(id),
    productids integer[] DEFAULT ARRAY[]::integer[],
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "Orders" (
    id serial PRIMARY KEY,
    date_order timestamp with time zone NOT NULL,
    status_order varchar(255) NOT NULL,
    total_amount double precision NOT NULL,
    "userId" integer NOT NULL REFERENCES "Clients"(id) ON UPDATE CASCADE ON DELETE CASCADE,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "OrderDetails" (
    id serial PRIMARY KEY,
    "orderId" integer NOT NULL REFERENCES "Orders"(id) ON UPDATE CASCADE ON DELETE CASCADE,
    "productId" integer NOT NULL REFERENCES "Product"(id),
    "productName" varchar(255) NOT NULL,
    "productDescription" varchar(255) NOT NULL,
    "productCategory" varchar(255) NOT NULL,
    "productBrand" varchar(255) NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

CREATE TABLE IF NOT EXISTS "DeliveryAdress" (
    id serial PRIMARY KEY,
    userid integer REFERENCES "Clients"(id),
    address varchar(255) NOT NULL,
    city varchar(100) NOT NULL,
    postalcode varchar(20) NOT NULL,
    department varchar(100),
    country varchar(100) DEFAULT 'France'
);

CREATE TABLE IF NOT EXISTS "Payments" (
    id serial PRIMARY KEY,
    "orderId" integer REFERENCES "Orders"(id),
    "userId" integer REFERENCES "Clients"(id),
    amount numeric(10,2) NOT NULL,
    paymentMethod varchar(255) NOT NULL,
    status varchar(255) NOT NULL,
    transactionId varchar(255),
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Returns" (
    id serial PRIMARY KEY,
    "orderId" integer REFERENCES "Orders"(id),
    "productId" integer REFERENCES "Product"(id),
    "userId" integer REFERENCES "Clients"(id),
    reason text NOT NULL,
    status varchar(255) NOT NULL,
    created_at timestamp DEFAULT now(),
    updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "StockHistory" (
    id serial PRIMARY KEY,
    "productId" integer REFERENCES "Product"(id),
    quantity integer NOT NULL,
    "createdAt" timestamp DEFAULT now()
);

END;
