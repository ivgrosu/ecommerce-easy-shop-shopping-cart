// hamburger menu
const bar = document.querySelector(".bar");
const closeBtn = document.querySelector(".close");
const nav = document.querySelector(".navbar");

bar.addEventListener("click", () => {
  nav.classList.add("active");
});
closeBtn.addEventListener("click", () => {
  nav.classList.remove("active");
});

// -------shopping cart functionality--------
const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "0etbuodjc081",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "ZYcIbD6SFN3RzrHHNTJ-GCAq-DfuEKhafSRbM8kOP8o",
});

// selectors
const cardItems = [...document.querySelectorAll(".card-items")];
const productsDOM = [
  ...document.querySelectorAll(".product-container-feature"),
];
const productsNewDOM = [...document.querySelectorAll(".product-container-new")];
// cart
let cart = [];

// get the products
class Products {
  constructor(contTypeId) {
    this.contTypeId = contTypeId;
  }
  async getProducts() {
    try {
      const response = await client.getEntries({
        content_type: `${this.contTypeId}`,
      });

      let products = response.items;
      products = products.map((item) => {
        const { title, company, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, company, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  displayProducts(products, containers) {
    products.forEach((product) => {
      let html = `
       <div class="product">
          <img src=${product.image} alt="" />
          <div class="description">
            <span>${product.company}</span>
            <h5>${product.title}</h5>
            <div class="rating">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </div>
            <h4>$${product.price}</h4>
          </div>
          <button class='bag-btn' data-id=${product.id}><i class="fa fa-shopping-cart cart  "></i></button>
         </div>
      `;
      containers.forEach((container) =>
        container.insertAdjacentHTML("beforeend", html)
      );
    });
  }

  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttons.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.style.color = "#db8f00";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.stopImmediatePropagation();
        event.target.style.color = "#db8f00";
        event.target.disabled = true;
        // get product from products LS
        let cartItem = { ...Store.getProduct(id), amount: 1 };
        // add product to cart array
        cart = [...cart, cartItem];
        // save cart to LS
        Store.saveCart(cart);
        // set cart values
        this.setCartValue(cart);
      });
    });
  }

  setCartValue(cart) {
    let itemsTotal = 0;
    cart.map((item) => {
      itemsTotal += item.amount;
    });
    cardItems.forEach((item) => {
      item.textContent = itemsTotal;
    });
    localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
  }

  setupAPP() {
    cart = Store.getCart();
    this.setCartValue(cart);
  }
}

// local storage
class Store {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static saveAllProducts(products, data) {
    let oldData = localStorage.getItem(products);
    if (oldData === null) oldData = [];

    oldData = JSON.parse(oldData);
    localStorage.setItem(products, JSON.stringify(oldData.concat(data)));
  }

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

const ui = new UI();
// fetch display products
const products = new Products("easyShopProducts");
ui.setupAPP();

products
  .getProducts()
  .then((products) => {
    ui.displayProducts(products, productsDOM);
    Store.saveProducts(products);
  })
  .then(() => {
    ui.getBagButtons();
  });

// fetch display productsNew
const productsNew = new Products("easyShopProductsNew");
productsNew
  .getProducts()
  .then((productsNew) => {
    ui.displayProducts(productsNew, productsNewDOM);
    Store.saveAllProducts("products", productsNew);
  })
  .then(() => {
    ui.getBagButtons();
  });
