export const cart = [];

export function addToCart(productId){
      let matchedItem;

    cart.forEach((cartItem) => {
      if(productId === cartItem.productId){
        matchedItem = cartItem;
      }
    });

    if(matchedItem){
      matchedItem.quantity += 1;``
    }else{
      cart.push({
      productId: productId, 
      quantity: 1
    });
    }
}