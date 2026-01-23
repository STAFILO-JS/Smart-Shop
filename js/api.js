const BASE = "https://fakestoreapi.com";

export const api = {

  async getProducts(){
    const r = await fetch(`${BASE}/products`);
    if(!r.ok) throw "nope";
    return r.json();
  },

  async getCategories(){
    const r = await fetch(`${BASE}/products/categories`);
    if(!r.ok) throw "nope";
    return r.json();
  }

};
