CREATE DATABASE bamazon_DB;

CREATE TABLE products (
    id INTEGER NOT NULL auto_increment,
    name varchar(60) NOT NULL,
    department_name varchar(60) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER(10)
);


INSERT INTO products(name, department_name, price, stock) VALUES (
    "Used Socks", "Clothing", 7.99, 200
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Heavy Duty Cardboard Box", "Home/Office", 12.95, 5000  
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Self Lacing Shoes", "Shoes", 239.99, 100   
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Mascara For Men", "Health/Beauty", 8.95, 50   
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Lubiderm", "Health/Beauty", 13.95, 85   
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Ripped Previously Unripped Levis", "Clothing", 59.99, 45   
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Pocket Calculator", "Electronics", 4.95, 30   
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Black and White TV", "Electronics", 499.95, 15   
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Nintendo DS", "Electronics", 89.99, 50   
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Lava Lamp", "Home/Office", 14.95, 67   
);

INSERT INTO products(name, department_name, price, stock) VALUES (
    "Yeezy's", "Shoes", 999.99, 10
);




CREATE TABLE admins(
    id INTEGER NOT NULL auto_increment,
    name varchar(60) NOT NULL,
    password varchar(60) NOT NULL,
    PRIMARY KEY(id)
);

INSERT INTO admins(name, password) VALUES("Yannick Illunga", "uglyjumper3");

CREATE TABLE departments(
    id INTEGER NOT NULL auto_increment,
    name varchar(60) NOT NULL,
    over_head DECIMAL(15, 2) NOT NULL,
    product_sales DECIMAL(15, 2) DEFAULT 0,
    total_profit DECIMAL(15, 2) DEFAULT 0, 
    PRIMARY KEY(id),
)

INSERT INTO departments(name, over_head) VALUES("Clothing", 600);

INSERT INTO departments(name, over_head) VALUES("Shoes", 800);

INSERT INTO departments(name, over_head) VALUES("Home/Office", 1000);

INSERT INTO departments(name, over_head) VALUES("Health/Beauty", 700);

INSERT INTO departments(name, over_head) VALUES("Electronics", 1800);