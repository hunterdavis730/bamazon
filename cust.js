var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require("cli-table")
var admins = [];
var employees = [];
var allProducts = [];
var department_list = [];
var ids = [];
var lowInv = [];
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



// end of supervisor functions

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
                setTimeout(welcome, 500);
                break;
            case "Apply for job":
                applyForJob();
                break;
        }
    })
}

function getAdmins() {
    admins = [];
    employees = [];
    var query = "SELECT * FROM admins";
    connection.query(query, function (err, data) {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            admins.push(data[i])
        }
        for (var i = 0; i < admins.length; i++) {
            employees.push(admins[i].name.toLowerCase().trim());
        }

        inquirer.prompt([{
            type: "input",
            message: "Please enter your full admin name",
            name: "name"
        }]).then(function (resp) {

            if (employees.includes(resp.name.toLowerCase().trim())) {
                var currentAdmin = resp.name;
                inquirer.prompt([{
                    type: "password",
                    message: `Welcome back ${currentAdmin}. Please enter your password to continue`,
                    name: "password"
                }]).then(function (resp) {
                    var password = resp.password;
                    var adminPass;


                    for (var i = 0; i < admins.length; i++) {

                        if (admins[i].name.toLowerCase().trim() === currentAdmin.toLowerCase().trim()) {

                            adminPass = admins[i].password;
                        }
                    }

                    if (password === adminPass) {
                        adminActions()
                    } else {
                        inquirer.prompt([{
                            type: "confirm",
                            message: "That password is incorrect. Try again?",
                            name: "confirm"
                        }]).then(function (resp) {
                            if (resp.confirm) {
                                getAdmins()
                            } else {
                                console.log("Have a nice day")
                                connection.end()
                            }
                        })
                    }
                })
            } else {
                console.log("Sorry we don't have you listed in our records")
                inquirer.prompt([{
                    type: "confirm",
                    message: "Would you like to apply for a job?",
                    name: "confirm"
                }]).then(function (resp) {
                    if (resp.confirm) {
                        applyForJob();
                    } else {
                        connection.end();
                    }
                })
            }
        })
    })
}

function adminActions() {

    inquirer.prompt([{
        type: "list",
        message: `What would you like to do today?`,
        choices: ["View Low Inventory", "View Products for Sale", "Add to Inventory", "Add a Product", "View Product Sales By Department", "Create New Department", "Exit"],
        name: "action"
    }]).then(function (resp) {
        switch (resp.action) {
            case "View Low Inventory":
                viewInv();
                break;
            case "View Products for Sale":
                viewProducts()
                break;
            case "Add to Inventory":
                initTable()
                setTimeout(addInventory, 500);
                break;
            case "Add a Product":
                addProduct()
                break;
            case "View Product Sales By Department":
                salesAction();
                break;
            case "Create New Department":
                createDep()
                break;
            case "Exit":
                console.log("Bye")
                connection.end()
                break;
        }
    })
}

function salesAction() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to view?",
        choices: ["Net Profit", "Gross Profit", "Overhead"],
        name: "profit"
    }]).then(function (resp) {
        var event = resp.profit;
        switch (event) {
            case "Net Profit":
                viewProfit();

                break;
            case "Gross Profit":
                viewGross();
                break;
            case "Overhead":
                viewOverhead()
                break;
        }
    })
}

function viewOverhead() {
    department_list = [];
    var query = "SELECT * FROM departments";
    connection.query(query, function (err, resp) {
        if (err) throw err;
        for (var i = 0; i < resp.length; i++) {
            department_list.push(resp[i].name);
        }

        setTimeout(initOverhead, 500)
    })
}

function initOverhead() {
    inquirer.prompt([{
        type: "list",
        message: "Select which department you wish to view overhead for",
        choices: department_list,
        name: "department"
    }]).then(function (resp) {
        var department = resp.department;
        var query = "SELECT * FROM departments WHERE ?";
        connection.query(query, {
            name: department
        }, function (err, resp) {
            if (err) throw err;
            var table = new Table({
                head: ['Department ID', 'Department Name', 'Overhead'],
                colWidths: [15, 40, 10]
            })

            for (var i = 0; i < resp.length; i++) {
                table.push([`${resp[i].id}`, `${resp[i].name}`, `${resp[i].over_head}`])
            }



            console.log("\n\n" + table.toString() + "\n\n");
            setTimeout(adminActions, 500)
        })
    })
}

function viewGross() {
    department_list = [];
    var query = "SELECT * FROM departments";
    connection.query(query, function (err, resp) {
        if (err) throw err;
        for (var i = 0; i < resp.length; i++) {
            department_list.push(resp[i].name);
        }

        setTimeout(initGross, 500)
    })
}

function initGross() {
    inquirer.prompt([{
        type: "list",
        message: "Select which department you wish to view gross profit for",
        choices: department_list,
        name: "department"
    }]).then(function (resp) {
        var department = resp.department;
        var query = "SELECT * FROM departments WHERE ?";
        connection.query(query, {
            name: department
        }, function (err, resp) {
            if (err) throw err;
            var table = new Table({
                head: ['Department ID', 'Department Name', 'Gross Profit'],
                colWidths: [15, 40, 10]
            })

            for (var i = 0; i < resp.length; i++) {
                table.push([`${resp[i].id}`, `${resp[i].name}`, `${resp[i].product_sales}`])
            }



            console.log("\n\n" + table.toString() + "\n\n");
            setTimeout(adminActions, 500)
        })
    })
}


function viewProfit() {
    department_list = [];
    var query = "SELECT * FROM departments";
    connection.query(query, function (err, resp) {
        if (err) throw err;
        for (var i = 0; i < resp.length; i++) {
            department_list.push(resp[i].name);
        }

        setTimeout(initProfit, 500)
    })

}

function initProfit() {
    inquirer.prompt([{
        type: "list",
        message: "Select which department you wish to view net profit for",
        choices: department_list,
        name: "department"
    }]).then(function (resp) {
        var department = resp.department;
        var query = "SELECT * FROM departments WHERE ?";
        connection.query(query, {
            name: department
        }, function (err, resp) {
            if (err) throw err;
            var table = new Table({
                head: ['Department ID', 'Department Name', 'Net Profit'],
                colWidths: [15, 40, 10]
            })

            for (var i = 0; i < resp.length; i++) {
                table.push([`${resp[i].id}`, `${resp[i].name}`, `${resp[i].total_profit}`])
            }



            console.log("\n\n" + table.toString() + "\n\n");
            setTimeout(adminActions, 500)
        })
    })
}

function createDep() {
    inquirer.prompt([{
        type: "input",
        message: "What would you like to call this new department?",
        name: 'name',
        validate: function val(name) {
            if (name === '' || name === ' ') {
                console.log('Please Enter a department name')
            } else {
                return true;
            }
        }
    }]).then(function (resp) {
        var department = resp.name;
        var overhead = 1200;
        var query = "INSERT INTO departments (name, over_head) VALUES (?,?)";
        var values = [department, overhead];
        connection.query(query, values, function (err, resp) {
            if (err) throw err;
            console.log("Department added!")
            adminActions();
        })

    })
}

function viewInv() {
    lowInv = [];
    var query = "SELECT * FROM products";
    connection.query(query, function (err, resp) {
        if (err) throw err;

        for (var i = 0; i < resp.length; i++) {
            if (resp[i].stock < 5) {
                lowInv.push(resp[i])
            }
        }
        if (lowInv.length > 0) {
            console.log("Here are all the current products with a low inventory")
            var table = new Table({
                head: ['Product ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
                colWidths: [15, 40, 20, 10, 10]
            });
            for (var i = 0; i < lowInv.length; i++) {
                table.push([`${lowInv[i].id}`, `${lowInv[i].name}`, `${lowInv[i].department_name}`, `${lowInv[i].price}`, `${lowInv[i].stock}`])
            };

            console.log("\n\n" + table.toString() + "\n\n");
            adminActions()
        } else {
            console.log("There currently are no products with a low inventory")
            adminActions()
        }

    })
}

function viewProducts() {
    console.log("Here are all the products currently for sale")
    initTable();
    setTimeout(adminActions, 500)
}

function addInventory() {

    inquirer.prompt([{
            type: "input",
            message: "Enter the Product ID of the product you wish to add inventory",
            name: "id",
            validate: function validateId(name) {

                var num = parseInt(name);
                if (!ids.includes(num)) {
                    console.log("\nPlease enter a valid product ID")
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "How many of this product would you like to add?",
            name: "quantity",
            validate: function validateQuant(name) {
                var num = parseInt(name);
                if (isNaN(num) || Math.sign(num) == -1) {
                    console.log("\nPlease enter a valid quantity")
                } else {
                    return true;
                }
            }
        }
    ]).then(function (resp) {
        product = resp.id;
        quantity = resp.quantity
        var query = "SELECT * FROM products WHERE ?";
        connection.query(query, {
            id: product
        }, function (err, resp) {
            if (err) throw err;
            var results = resp[0];
            var newStock = parseInt(resp[0].stock) + parseInt(quantity);
            console.log(newStock)

            initInv(product, newStock)
        })
    })
}

function initInv(id, stock) {
    var query = "UPDATE products SET ? WHERE ?";
    connection.query(query, [{
            stock: stock
        },
        {
            id: id
        }
    ], function (err, resp) {
        if (err) throw err;
        console.log("Inventory Added!")
        adminActions();
    })
}

function addProduct() {
    department_list = [];
    var query = "SELECT * FROM departments";
    connection.query(query, function (err, resp) {
        if (err) throw err;
        for (var i = 0; i < resp.length; i++) {
            department_list.push(resp[i].name);
        }

        setTimeout(product, 600);

    })


}

function product() {
    inquirer.prompt([{
            type: "input",
            message: "Enter the name of the product you want to add",
            name: "name",
            validate: function valName(name) {
                if (name === '' || name === ' ' || name === '  ') {
                    console.log("Please enter a product name");
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "Enter the price you want to sell this product for",
            name: "price",
            validate: function valPrice(name) {
                var num = parseFloat(name);
                if (isNaN(num) || Math.sign(num) == -1) {
                    console.log("\nPlease enter a valid price")
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "How many units of this product do you wish to add to your inventory?",
            name: "stock",
            validate: function valStock(name) {
                var num = parseFloat(name);
                if (isNaN(num) || Math.sign(num) == -1) {
                    console.log("\nPlease enter a number")
                } else {
                    return true;
                }
            }
        },
        {
            type: "list",
            message: "Which department would you like to add this product to?",
            choices: department_list,
            name: "department"
        }
    ]).then(function (resp) {
        var name = resp.name;
        var price = parseFloat(resp.price);
        var department = resp.department;
        var stock = parseInt(resp.stock);

        console.log(name)
        console.log(price)
        console.log(department)
        console.log(stock)

        initProd(name, department, price, stock)
    })
}

function initProd(name, department, price, stock) {
    var query = "INSERT INTO products (name, department_name, price, stock) VALUES(?,?,?,?)";
    var values = [name, department, price, stock];
    connection.query(query, values, function (err, resp) {
        if (err) throw err;
        console.log("Product Added!")
        connection.end()
    })
}

// end of manager actions

function applyForJob() {
    inquirer.prompt([{
            type: "input",
            message: "Thanks for choosing to apply with Bamazon! What is your name?",
            name: "name"
        }

    ]).then(function (resp) {
        if (resp.name === '' || resp.name === ' ') {
            console.log("Oops. You forgot to enter your name")
            applyForJob();
        } else {
            var name = resp.name;
            console.log("Congratulations! You've been accepted for our open Admin position.");
            inquirer.prompt([{
                type: "password",
                message: "Please create an admin password to get access to our admin page",
                name: "password"
            }]).then(function (resp) {
                if (resp.password === '' || resp.password === ' ') {
                    console.log("Oops. You didn't enter a valid password.. We created one for you.");
                    console.log("Your new password is enter123");
                    var password = "enter123";
                    addAdmin(name, password);
                } else {
                    console.log("Password successfully created!")
                    var password = resp.password;
                    addAdmin(name, password);
                }
            })
        }
    })
}

function addAdmin(name, password) {
    var query = 'INSERT INTO admins (name, password) VALUES (?,?)';
    var values = [name, password]

    connection.query(query, values, function (err, resp) {
        if (err) throw err;

        console.log("You have successfully been added to our Admin users!")
        connection.end();
    })
}

function initTable() {
    ids = [];
    var query = "SELECT * FROM products"
    connection.query(query, function (err, data) {
        if (err) throw err;

        var table = new Table({
            head: ['Product ID', 'Product Name', 'Department Name', 'Price', 'Stock'],
            colWidths: [15, 40, 20, 10, 10]
        });
        for (var i = 0; i < data.length; i++) {
            table.push([`${data[i].id}`, `${data[i].name}`, `${data[i].department_name}`, `${data[i].price}`, `${data[i].stock}`])
            ids.push(data[i].id)
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
            name: "product",
            validate: function validateId(name) {

                var num = parseInt(name);
                if (!ids.includes(num)) {
                    console.log("\nPlease enter a valid product ID")
                } else {
                    return true;
                }
            }
        },
        {
            type: "input",
            message: "Enter the quantity you wish to purchase",
            name: "quantity",
            validate: function validateQuant(name) {
                var num = parseInt(name);
                if (isNaN(num) || Math.sign(num) == -1) {
                    console.log("\nPlease enter a valid quantity")
                } else {
                    return true;
                }
            }
        }
    ]).then(function (response) {
        product = response.product;
        quantity = response.quantity;
        processOrder(product, quantity)
    })
}


function configGrossSales(dep) {
    var query = "SELECT * FROM departments WHERE ?"
    connection.query(query, {
        name: dep
    }, function (err, resp) {
        if (err) throw err;

        var sales = resp[0].product_sales;
        var over = resp[0].over_head;
        var gross = sales - over;

        var queryTwo = "UPDATE departments SET ? WHERE ?";
        connection.query(queryTwo, [{
                total_profit: gross
            },
            {
                name: dep
            }
        ], function (err, resp) {
            if (err) throw err;

        })

    })
}



function processOrder(product, quantity) {
    var query = "SELECT * FROM products WHERE ?"
    connection.query(query, {
        id: product
    }, function (err, resp) {
        if (err) throw err;
        var results = resp[0];

        if (results.stock - quantity > -1) {
            var price = quantity * results.price;
            var stockLeft = results.stock - quantity;
            var productName = results.name;
            var department = results.department_name;
            orderSuccess(price, stockLeft, productName, department);

        } else {
            console.log("Insufficient quantity in stock")
            tryAgain();
        }
    })
}

function updateSales(department, price) {

    var query = "SELECT * FROM departments WHERE ?";
    connection.query(query, {
        name: department
    }, function (err, resp) {
        if (err) throw err;
        var results = resp[0];
        var productSales = results.product_sales;
        productSales += price;
        productSales.toFixed(2);
        var queryTwo = "UPDATE departments SET ? WHERE ?";
        connection.query(queryTwo, [{
                product_sales: productSales

            },
            {
                name: department
            }
        ], function (err, resp) {
            if (err) throw err;
            configGrossSales(department)
            setTimeout(newPurchase, 500)
        })

    })

}

function orderSuccess(price, stockLeft, productName, department) {

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
                        name: "perks",
                        validate: function valperk(name) {
                            var num = parseInt(name);
                            if (isNaN(num) || Math.sign(num) == -1) {
                                console.log("\nPlease enter a valid 4-digit number")
                            } else {
                                return true;
                            }
                        }

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
                            updateSales(department, price)

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
                                    updateSales(department, price)

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
                    updateSales(department, price)

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

function newPurchase() {
    inquirer.prompt([{
        type: 'confirm',
        message: "Would you like to make another purchase?",
        name: "confirm"
    }]).then(function (resp) {
        if (resp.confirm) {
            welcome()
        } else {
            console.log("Okay have a great day!")
            connection.end()
        }
    })
}

start()