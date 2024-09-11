import Bool "mo:base/Bool";
import Nat64 "mo:base/Nat64";
import Order "mo:base/Order";
import Text "mo:base/Text";
import Timer "mo:base/Timer";

import Array "mo:base/Array";
import Float "mo:base/Float";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Option "mo:base/Option";
import Time "mo:base/Time";

actor {
  // Types
  type Drink = {
    id: Nat;
    name: Text;
    ingredients: [Text];
    price: Float;
    description: ?Text;
  };

  type Order = {
    id: Nat;
    drinkId: Nat;
    status: Text;
    completionTime: ?Int;
  };

  // Stable variables
  stable var drinkMenu: [Drink] = [
    { id = 0; name = "Mojito"; ingredients = ["Rum", "Mint", "Lime", "Sugar", "Soda"]; price = 8.99; description = ?"Refreshing Cuban cocktail" },
    { id = 1; name = "Margarita"; ingredients = ["Tequila", "Triple Sec", "Lime Juice"]; price = 9.99; description = ?"Classic Mexican cocktail" },
    { id = 2; name = "Old Fashioned"; ingredients = ["Bourbon", "Sugar", "Bitters"]; price = 10.99; description = ?"Timeless whiskey cocktail" }
  ];

  // Mutable variables
  var orderQueue: List.List<Order> = List.nil();
  var bartenderStatus: Text = "idle";
  var nextOrderId: Nat = 0;

  // Public functions
  public query func getDrinkMenu(): async [Drink] {
    drinkMenu
  };

  public func orderDrink(drinkId: Nat): async Text {
    switch (Array.find(drinkMenu, func(d: Drink): Bool { d.id == drinkId })) {
      case (null) {
        return "Drink not found";
      };
      case (?drink) {
        let order: Order = {
          id = nextOrderId;
          drinkId = drinkId;
          status = "pending";
          completionTime = null;
        };
        orderQueue := List.push(order, orderQueue);
        nextOrderId += 1;
        bartenderStatus := "preparing";
        return "Order placed for " # drink.name # ". Your order number is " # Nat.toText(order.id);
      };
    };
  };

  public query func getBartenderStatus(): async Text {
    bartenderStatus
  };

  // Helper functions
  func updateOrderStatus(): async () {
    switch (List.pop(orderQueue)) {
      case (null, _) {
        bartenderStatus := "idle";
      };
      case (?order, remainingOrders) {
        let updatedOrder = {
          id = order.id;
          drinkId = order.drinkId;
          status = "completed";
          completionTime = ?Time.now();
        };
        orderQueue := remainingOrders;
        bartenderStatus := "idle";
      };
    };
  };

  // Simulate order processing
  system func timer(setTimer : Nat64 -> ()) : async () {
    setTimer(5_000_000_000);
    await updateOrderStatus();
  };
};
