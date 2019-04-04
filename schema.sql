CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
item_id INT AUTO_INCREMENT NOT NULL,
product_name VARCHAR(30) NULL,
department_name VARCHAR(30) NULL,
price DECIMAL(6,3) NOT NULL,
stock_quantity INT(4) NOT NULL,
PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Paper Lamp", "Interior", 37.99, 10),
("Gummie Bears", "Food", 8.75, 30),
("Nintendont Swap", "Electronics", 39.99, 15),
("Shampoo", "Toiletries", 12.99, 40),
("Clicky Pens", "Stationary", 8.50, 100),
("Bookshelf", "Interior", 48.79, 20),
("Brown Rice", "Food", 16.99, 20),
("Stony Playstop", "Electronics", 279.99, 45),
("Tooth Brush", "Toiletries", 3.99, 95),
("Princess Ruler", "Stationary", 1.99, 30);