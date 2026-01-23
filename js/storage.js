const KEY = "smartshop_cart";

export const storage = {

  get(){
    try{
      return JSON.parse(localStorage.getItem(KEY)) || [];
    }catch{
      return [];
    }
  },

  set(cart){
    localStorage.setItem(KEY,JSON.stringify(cart));
  }

};
