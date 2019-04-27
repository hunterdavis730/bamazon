var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require("cli-table")
var admins = [];
var employees = [];
var quantity;
var product;
var connection = mysql.createConnection({
    host: "localhost",
    port: "3306",
    user: "root",
    password: "Midwestpest1!",
    database: "bamazon_DB"
});

connection.connect((err) => {
    if (err) throw err;

});

function start() {
    console.log("Welcome to Bamazon");
    inquirer.prompt([{
        type: "list",
        message: "Choose Your Login Type",
        choices: ["User", "Admin"],
        name: "userType"
    }]).then(function (resp) {
        switch (resp.userType) {
            case "User":
                userPurpose();


                break;
            case "Admin":
                getAdmins()
                break;
        }
    })
};

function userPurpose() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do today?",
        choices: ["Make a purchase", "Apply for job"],
        name: "purpose"
    }]).then(function (resp) {
        switch (resp.purpose) {
            case "Make a purchase":
                initTable();
                return welcome();
            case "Apply for job":
                return console.log("Coming soon");
        }
    })
}

function getAdmins() {
    var query = "SELECT * FROM admins";
    connection.query(query, function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            admins.push(data[i])
        }
        for (var i = 0; i < admins.length; i++) {
            employees.push(admins[i].name);
        }
        inquirer.prompt([{
            type: "input",
            message: "Please enter your full admin name",
            name: "name"
        }]).then(function (resp) {
            console.log(resp.name)
            if (employees.includes(resp.name)) {
                var currentAdmin = resp.name;
                inquirer.prompt([{
                    type: "password",
                    message: `Welcome back ${currentAdmin}. Please enter your password to continue`,
                    name: "password"
                }]).then(function (resp) {
                    var password = resp.password;
                    console.log(password)
                })
            } else {
                console.log("Sorry we don't have you listed in our records")
                connection.end();
            }
        })
    })
}

function initTable() {

    var query = "SELECT * FROM products"
    connection.query(query, function (err, data) {
        if (err) throw err;

        var table = new Table({
            head: ['Product ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
            colWidths: [15, 40, 20, 10, 10]
        });
        for (var i = 0; i < data.length; i++) {
            table.push([`${data[i].id}`, `${data[i].name}`, `${data[i].department_name}`, `${data[i].price}`, `${data[i].stock}`])
        };

        console.log("\n\n" + table.toString() + "\n\n");
    })
}

function welcome() {
    product = 0;
    quantity = 0;
    inquirer.prompt([{
            type: "input",
            message: "Please Enter the ID of the product you wish to purchase!",
            name: "product"
        },
        {
            type: "input",
            message: "Enter the quantity you wish to purchase",
            name: "quantity"
        }
    ]).then(function (response) {
        product = response.product;
        quantity = response.quantity;
        processOrder(product, quantity)
    })
}

function processOrder(product, quantity) {
    var query = "SELECT * FROM products WHERE ?"
    connection.query(query, {
        id: product
    }, function (err, resp) {
        if (err) throw err;
        var results = resp[0];

        if (results.stock - quantity > 0) {
            var price = quantity * results.price;
            var stockLeft = results.stock - quantity;
            var productName = results.name;
            orderSuccess(price, stockLeft, productName);

        } else {
            console.log("Insufficient quantity in stock")
            tryAgain();
        }
    })
}

function orderSuccess(price, stockLeft, productName) {
    inquirer.prompt([{
        type: "confirm",
        message: `Your total is $${price.toFixed(2)}. Are you sure you wish to continue?`,
        name: "confirm"
    }]).then(function (resp) {
        if (resp.confirm) {
            inquirer.prompt([{
                type: "confirm",
                message: "Do you have a perks id with Bamazon?",
                name: "confirm"
            }]).then(function (resp) {
                if (resp.confirm) {
                    inquirer.prompt([{
                        type: "input",
                        message: "Please enter your 4-digit perks id",
                        name: "perks"
                    }]).then(function (resp) {
                        if (resp.perks.length === 4) {
                            var discount = price * .05;
                            price -= discount;
                            console.log(`Thanks for your loyalty. You saved ${discount.toFixed(2)} on your purchase!`)
                            console.log("Order Successful!")
                            console.log(`You purchased ${quantity} ${productName}(s)`)
                            console.log(`Your grand total came out to $${price.toFixed(2)}`)
                            var query = "UPDATE products SET ? WHERE ?";
                            connection.query(query, [{
                                    stock: stockLeft
                                },
                                {
                                    id: product
                                }
                            ], function (err, resp) {
                                if (err) throw err;

                            })
                            connection.end()
                        } else {
                            console.log("Your perks ID was invalid")
                            inquirer.prompt([{
                                type: "confirm",
                                message: "Do you wish to continue your purchase?",
                                name: "confirm"
                            }]).then(function (resp) {
                                if (resp.confirm) {
                                    console.log("Order Successful!")
                                    console.log(`You purchased ${quantity} ${productName}(s)`)
                                    console.log(`Your grand total came out to $${price.toFixed(2)}`)
                                    var query = "UPDATE products SET ? WHERE ?";
                                    connection.query(query, [{
                                            stock: stockLeft
                                        },
                                        {
                                            id: product
                                        }
                                    ], function (err, resp) {
                                        if (err) throw err;

                                    })
                                    connection.end()
                                } else {
                                    tryAgain();
                                }
                            })
                        }
                    })
                } else {
                    console.log("Order Successful!")
                    console.log(`You purchased ${quantity} ${productName}(s)`)
                    console.log(`Your grand total came out to $${price.toFixed(2)}`)
                    var query = "UPDATE products SET ? WHERE ?";
                    connection.query(query, [{
                            stock: stockLeft
                        },
                        {
                            id: product
                        }
                    ], function (err, resp) {
                        if (err) throw err;

                    })
                }
            })
        } else {
            tryAgain();
        }
    })
}

function tryAgain() {
    inquirer.prompt([{
        type: "confirm",
        message: "Would you like to try again?",
        name: "confirm"
    }]).then(function (res) {
        if (res.confirm) {

            welcome();
        } else {
            console.log("Okay have a great day!")
            connection.end()
        }
    })
}

start()