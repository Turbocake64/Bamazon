// requiring inquirer and mysql for the node app BamazonCustomer to work
var inquirer = require("inquirer");
var mysql = require("mysql");

// creating a connection to mysql
var connection = mysql.createConnection({
    host: "localhost",
  
    // as is standard, using port 3306 for mysql
    port: 3306,
  
    // my username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazonDB"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    // console logging a message with the connection id when we connect to mysql
    console.log("connected as id " + connection.threadId + "\n");
    // calling the welcome function to run as soon as we are connected
    welcome()
});

// The welcome function welcomes the user, brings up the Bamazon catalogue, and starts the prompt shopping function
function welcome(){
    // making a query to pull only the item id, product name, and price from the bamazon database
    connection.query(
      "SELECT item_id, product_name, price FROM bamazonDB.products",
      function (err, res) {
        // console logging any errors that may occur 
        if (err) {
          console.log("ERROR: " + err)
          return connection.end();
          // a welcome message to the user in the console log & a callback to the shopping prompt
        } else {
          console.log("Welcome to Bamazon!")
          console.table(res);
          // promptShopping call back
          promptShopping();
        }
      },
    );
};

// declaring the remaining stock variable globaly before it is needed further down
var remainingStock = 0;
// declaring the itemId variable globaly before it is needed further down
var itemId = 0;

// the reduce stock function 
function reduceStock(){
  // an update query that sts the stock quantity to remaining stock for the item selected by the user
  var query = "UPDATE products SET ? WHERE ?"
  connection.query(query, [{stock_quantity: remainingStock},{item_id: itemId}], function(err, res){
  })
};

function promptShopping(){
  // starts with a confirmation inquirer prompt asking if the user wants to make a purchase
  inquirer.prompt([{
      name: "interested",
      type: "confirm",
      message: "Would you like to make a purchase?"
    }])
    .then(function (answer) {
      switch(answer.interested){
        // if they do, we run the shop function
        case true:
        shop();
        break;

        case false:
        // if they don't we end the connection
        console.log("Well, thanks for stopping by!");
        connection.end();
      }
    });
};

function shop(){
  // an input inquirer prompt asking the user which item they would like to buy
  inquirer.prompt([{
    name: "selectItem",
    type: "input",
    message: "Please enter the item id for the product you'd like to purchase.",
    // this validates if the input is a number, but NOT if it is within the item_id range...
    validate: function(value) {
      if (isNaN(value) === false) {
        // we are setting the global variable itemId to the value given
        itemId = value;
        return true
        // if not a number, the user is asked to resubmit
      } else {
        console.log("\nPlease enter a valid ID");
        return false;
    }
  }
  },
  {
    // a second inquirer prompt asking how many of the chosen item they wish to purchase
    name: "amount",
    type: "input",
    message: "How many would you like to purchase?",
    // again validating if this is a number or not
    validate: function(value) {
      if (isNaN(value) === false) {
        return true
      } else {
        console.log("\nPlease enter a valid number");
        return false;
      }
    }

    // then we make enother query to the db based on the item_id chosen by the user
  }]).then(function (answer) {
    var query = "SELECT * FROM products WHERE item_id = ?"
    // we are querying for the item_id that matches the user input in "selectItem" prompt
    connection.query(query, [itemId], function (err, res) {
      // here we redefine remaining stock as the stock_quantity property retrieved by the query - the answer to "amount"
      remainingStock = res[0].stock_quantity - answer.amount;


      // if the answer is less than or equal to stock_quantity, we run the reduceStock() function with the message below
      if (answer.amount <= res[0].stock_quantity){
        console.log("Your purchase has been made! We don't accept payment, so it will be free.");
        reduceStock();
        connection.end();

        // if the answer is greater than stock_quantity, we console log the message below
      } else if (answer.amount > res[0].stock_quantity){
          console.log("Stock is insufficient to honor this purchase.");
          console.log("Unable to process your order. Exiting Bamazon");
          connection.end();

        // logging the results, answer, and remaining stock in case of an error
      } else if (err) throw err;
          console.log("Results", res);
          console.log("Answers: ", answer);
          console.log("Remaining Stock: ", remainingStock); 
    });
    
    });
};

