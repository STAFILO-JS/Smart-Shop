import { api } from "./api.js";
import { storage } from "./storage.js";
import { ui } from "./ui.js";


const grid = document.getElementById("productsGrid");
const status = document.getElementById("statusText");

const search = document.getElementById("searchInput");
const catSel = document.getElementById("categorySelect");
const sortSel = document.getElementById("sortSelect");

const cartBtn = document.getElementById("cartBtn");
const modal = document.getElementById("cartModal");
const closeBtn = document.getElementById("closeCartBtn");

const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

const form = document.getElementById("checkoutForm");
const nameI = document.getElementById("nameInput");
const mailI = document.getElementById("emailInput");
const addrI = document.getElementById("addressInput");
const err = document.getElementById("formError");


let all = [];
let view = [];
let cart = storage.get();


init();


async function init(){

  ui.status(status,"Loading...");

  sync();

  try{

    const [p,c] = await Promise.all([
      api.getProducts(),
      api.getCategories()
    ]);

    all = p;
    view = p;

    ui.renderProducts(grid,view);
    ui.renderCategories(catSel,c);

    ui.status(status,"");

    events();

  }catch{
    ui.status(status,"Failed.");
  }

}


function events(){

  grid.addEventListener("click",e=>{
    const b = e.target.closest("[data-add]");
    if(b) add(+b.dataset.add);
  });


  search.addEventListener("input",filter);
  catSel.addEventListener("change",filter);
  sortSel.addEventListener("change",filter);


  cartBtn.onclick = ()=> open();
  closeBtn.onclick = ()=> close();


  modal.onclick = e=>{
    if(e.target === modal) close();
  };


  cartItems.addEventListener("click",e=>{

    const i = e.target.closest("[data-inc]");
    const d = e.target.closest("[data-dec]");
    const r = e.target.closest("[data-remove]");

    if(i) qty(+i.dataset.inc,1);
    if(d) qty(+d.dataset.dec,-1);
    if(r) remove(+r.dataset.remove);

  });


  form.addEventListener("submit",send);

}


function filter(){

  const q = search.value.toLowerCase();
  const c = catSel.value;
  const s = sortSel.value;


  let f = all.filter(p=>{
    return p.title.toLowerCase().includes(q)
      && (c==="all" || p.category===c);
  });


  if(s==="price-low") f.sort((a,b)=>a.price-b.price);
  if(s==="price-high") f.sort((a,b)=>b.price-a.price);


  view = f;

  ui.renderProducts(grid,view);

  ui.status(status, f.length ? "" : "Nothing.");

}


function add(id){

  const p = all.find(x=>x.id===id);
  if(!p) return;


  const ex = cart.find(x=>x.id===id);

  if(ex) ex.qty++;
  else{
    cart.push({
      id:p.id,
      title:p.title,
      price:p.price,
      image:p.image,
      qty:1
    });
  }

  save();

}


function qty(id,d){

  const it = cart.find(x=>x.id===id);
  if(!it) return;

  it.qty += d;

  if(it.qty<=0)
    cart = cart.filter(x=>x.id!==id);

  save();

}


function remove(id){
  cart = cart.filter(x=>x.id!==id);
  save();
}


function save(){
  storage.set(cart);
  sync();
}


function sync(){
  ui.count(cartCount,cart);
  ui.renderCart(cartItems,cart);
  ui.total(cartTotal,cart);
}


function open(){
  modal.classList.remove("hidden");
  sync();
}


function close(){
  modal.classList.add("hidden");
  err.textContent="";
}


function send(e){

  e.preventDefault();

  err.textContent="";


  if(!cart.length){
    err.textContent="Empty.";
    return;
  }


  const name = nameI.value.trim();
  const mail = mailI.value.trim();
  const addr = addrI.value.trim();


  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);


  if(!name) return err.textContent="Name.";
  if(!ok) return err.textContent="Email.";
  if(!addr) return err.textContent="Address.";


  alert("Order placed.");

  cart = [];
  save();

  form.reset();
  close();

}
