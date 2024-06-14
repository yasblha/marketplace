ROLLBACK;

-- Création de la table Utilisateur
CREATE TABLE "User" (
                        ID SERIAL PRIMARY KEY,
                        FirstName VARCHAR(255),
                        LastName VARCHAR(255),
                        Email VARCHAR(255),
                        Password VARCHAR(255),
                        Role VARCHAR(50)
);

-- Création de la table Produit
CREATE TABLE "Product" (
                           ID SERIAL PRIMARY KEY,
                           Name VARCHAR(255),
                           Description TEXT,
                           Category VARCHAR(100),
                           Brand VARCHAR(100),
                           Price DECIMAL(10, 2),
                           StockAvailable INTEGER,
                           Status VARCHAR(50),
                           Image VARCHAR(255)
);

-- Création de la table Commande
CREATE TABLE "Order" (
                         ID SERIAL PRIMARY KEY,
                         UserID INTEGER REFERENCES "User"(ID),
                         DateOrder DATE,
                         StatutsOrder VARCHAR(50),
                         TotalAmount DECIMAL(10, 2)
);

-- Création de la table Détail de la commande
CREATE TABLE "OrderDetail" (
                               ID SERIAL PRIMARY KEY,
                               OrderID INTEGER REFERENCES "Order"(ID),
                               ProductID INTEGER REFERENCES "Product"(ID),
                               Quantity INTEGER,
                               UnitPrice DECIMAL(10, 2)
);

-- Création de la table Alertes
CREATE TABLE "Alerts" (
                          ID SERIAL PRIMARY KEY,
                          UserID INTEGER REFERENCES "User"(ID),
                          AlertType VARCHAR(50),
                          ProductID INTEGER REFERENCES "Product"(ID),
                          Status VARCHAR(50)
);

-- Création de la table Panier
CREATE TABLE "Cart" (
                        ID SERIAL PRIMARY KEY,
                        UserID INTEGER REFERENCES "User"(ID),
                        ProductID INTEGER REFERENCES "Product"(ID),
                        Quantity INTEGER
);

-- Création de la table Adresse de livraison
CREATE TABLE "DeliveryAdress" (
                                  ID SERIAL PRIMARY KEY,
                                  UserID INTEGER REFERENCES "User"(ID),
                                  FullName VARCHAR(255),
                                  Adress VARCHAR(255),
                                  City VARCHAR(100),
                                  PostalCode VARCHAR(20),
                                  Department VARCHAR(100),
                                  Country VARCHAR(100) DEFAULT 'France'
);