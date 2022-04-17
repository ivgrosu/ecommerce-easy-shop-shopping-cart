const cartContent = document.querySelector(".card-content");
const cardItems = [...document.querySelectorAll(".card-items")];
let content = JSON.parse(localStorage.getItem("cart"));

cardItems.forEach((item) => {
  item.textContent = JSON.parse(localStorage.getItem("itemsTotal"));
});

// render each item
function renderItem() {
  content.forEach((item) => {
    let html = `
    <tr>
      <td>
        <a href="#"><i class="fa-regular fa-circle-xmark" data-id=${
          item.id
        }></i></a>
      </td>
      <td><img src="${item.image}" alt="" /></td>
      <td>${item.title}</td>
      <td >$<span class='price'>${item.price}</span></td>
      <td><input class='quantity' type="number" value="${
        item.amount
      }" data-id=${item.id} min='1' /></td>
      <td >$<span class='subtot'>${item.price * item.amount}</span></td>
    </tr>`;
    cartContent.insertAdjacentHTML("beforeend", html);
  });
}
renderItem();

// cart quantity
cartContent.addEventListener("change", (event) => {
  if (!event.target.classList.contains("quantity")) return;
  if (event.target.classList.contains("quantity")) {
    let quantity = event.target;
    let id = quantity.dataset.id;
    let itemChange = content.find((item) => item.id === id);
    itemChange.amount = parseFloat(quantity.value);
    localStorage.setItem("cart", JSON.stringify(content));
    cartContent.innerHTML = "";
    renderItem();
    cartTotal();
    setCartValue(content);
  }
});

//remove item
cartContent.addEventListener("click", (event) => {
  event.preventDefault();
  if (!event.target.classList.contains("fa-circle-xmark")) return;
  if (event.target.classList.contains("fa-circle-xmark")) {
    let removeItem = event.target;
    let id = removeItem.dataset.id;
    content = content.filter((item) => item.id !== id);
    setCartValue(content);
    localStorage.setItem("cart", JSON.stringify(content));
    removeItem.parentElement.parentElement.parentElement.remove();
    cartTotal();
  }
});

//cart total
function cartTotal() {
  const cartTotal = [...document.querySelectorAll(".cart-total")];
  const cartSubtotal = [...document.querySelectorAll(".subtot")];

  cartTotal.forEach((item) => {
    let total = 0;
    cartSubtotal.forEach((el) => (total += parseFloat(el.textContent)));
    item.textContent = total;
  });
}
cartTotal();

function setCartValue(container) {
  let itemsTotal = 0;
  container.map((item) => {
    itemsTotal += item.amount;
  });
  cardItems.forEach((item) => {
    item.textContent = itemsTotal;
  });
  localStorage.setItem("itemsTotal", JSON.stringify(itemsTotal));
}
