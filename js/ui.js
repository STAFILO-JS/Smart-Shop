export const ui = {

  renderProducts(el,list){

    el.innerHTML = list.map(p=>`

      <article class="card">

        <img src="${p.image}" />

        <h3>${safe(p.title)}</h3>

        <div class="meta">

          <div>
            <div class="price">$${p.price.toFixed(2)}</div>
            <div class="kicker">${safe(p.category)}</div>
          </div>

          <button class="btn primary" data-add="${p.id}">
            Add
          </button>

        </div>

      </article>

    `).join("");

  },


  renderCategories(el,list){

    el.innerHTML =
      `<option value="all">All</option>` +
      list.map(c=>`
        <option value="${c}">${c}</option>
      `).join("");

  },


  renderCart(el,items){

    if(!items.length){
      el.innerHTML = `<p class="status">Empty.</p>`;
      return;
    }

    el.innerHTML = items.map(i=>`

      <div class="cart-item">

        <img src="${i.image}" />

        <div>

          <div class="cart-title">${safe(i.title)}</div>
          <div class="cart-sub">$${i.price}</div>

          <button
            class="btn"
            data-remove="${i.id}"
            style="margin-top:8px"
          >
            Remove
          </button>

        </div>


        <div class="qty">

          <button class="btn" data-dec="${i.id}">-</button>

          <span>${i.qty}</span>

          <button class="btn" data-inc="${i.id}">+</button>

        </div>

      </div>

    `).join("");

  },


  count(el,cart){
    el.textContent =
      cart.reduce((s,i)=>s+i.qty,0);
  },


  total(el,cart){
    const t =
      cart.reduce((s,i)=>s+i.price*i.qty,0);
    el.textContent = `$${t.toFixed(2)}`;
  },


  status(el,msg){
    el.textContent = msg || "";
  }

};


function safe(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}
