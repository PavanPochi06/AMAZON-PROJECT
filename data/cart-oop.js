function Cart(localStroageKey){
    const cart = {
    cartItems: undefined,
    loadFromStorage(){
    this.cartItems = JSON.parse(localStorage.getItem("cart-oop"));

      if(!this.cartItems){
          this.cartItems = [{
          productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
          quantity: 2,
          deliveryOptionId: "1"
        },
        {
          productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
          quantity: 1,
          deliveryOptionId: "2"
        }];
      }
    },
    saveToStorage(){
      localStorage.setItem(localStroageKey, JSON.stringify(this.cartItems));
    },
    addToCart(productId){
      let matchedItem;

        this.cartItems.forEach((cartItem) => {
          if(productId === cartItem.productId){
            matchedItem = cartItem;
          }
        });

          if(matchedItem){
            matchedItem.quantity += 1;``
          }else{
            this.cartItems.push({
            productId: productId, 
            quantity: 1,
            deliveryOptionId: "1"
          });
        }
    
        this.saveToStorage();
    },
    removeFromCart(productId){
      const newCart = [];
      this.cartItems.forEach((cartItem) => {
        if(cartItem.productId !== productId){
          newCart.push(cartItem);
        } 
      });

      this.cartItems = newCart;
      this.saveToStorage();
    },
    updateDelieryOption(productId, deliveryOptionId){
      let matchedItem;

      this.cartItems.forEach((cartItem) => {
        if(productId === cartItem.productId){
          matchedItem = cartItem;
        }
      });

      matchedItem.deliveryOptionId = deliveryOptionId;
      this.saveToStorage();
    }
  };
  return cart;
}

const cart = Cart("cart-oop");
const businessCart = Cart("cart-business");


cart.loadFromStorage();

businessCart.loadFromStorage();

console.log(cart);
console.log(businessCart);