
"use strict";

const products = [
  {
    id: 1,
    name: "Cappuccino clásico",
    category: "Cafés",
    price: 55,
    tag: "Favorito",
    description: "Espresso, leche vaporizada y espuma cremosa.",
    image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 2,
    name: "Latte de vainilla",
    category: "Cafés",
    price: 62,
    tag: "Especial",
    description: "Café suave con leche y un toque de vainilla.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 3,
    name: "Desayuno campestre",
    category: "Desayunos",
    price: 105,
    tag: "Completo",
    description: "Huevos, pan tostado y acompañamiento fresco.",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 4,
    name: "Hot cakes",
    category: "Desayunos",
    price: 89,
    tag: "Dulce",
    description: "Hot cakes esponjosos con fruta y miel.",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 5,
    name: "Hamburguesa Central",
    category: "Comidas",
    price: 135,
    tag: "Popular",
    description: "Carne, queso, vegetales y papas crujientes.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 6,
    name: "Sándwich artesanal",
    category: "Comidas",
    price: 95,
    tag: "Casero",
    description: "Pan artesanal con vegetales y queso.",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 7,
    name: "Pastel de chocolate",
    category: "Postres",
    price: 72,
    tag: "Delicioso",
    description: "Pastel de chocolate suave y cremoso.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 8,
    name: "Cheesecake",
    category: "Postres",
    price: 78,
    tag: "Recomendado",
    description: "Tarta de queso con cubierta dulce.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=700&q=80"
  },
  {
    id: 9,
    name: "Frappé de café",
    category: "Bebidas",
    price: 68,
    tag: "Frío",
    description: "Bebida fría de café, cremosa y refrescante.",
    image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=80"
  }
];

const $ = (selector) => document.querySelector(selector);

const money = (amount) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN"
  }).format(amount);

let activeCategory = "Todos";
let cart = {};
let toastTimeout;

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}

function renderProducts() {
  const search = $("#search").value.trim().toLocaleLowerCase("es-MX");

  const filtered = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Todos" ||
      product.category === activeCategory;

    const matchesSearch =
      `${product.name} ${product.description} ${product.category}`
        .toLocaleLowerCase("es-MX")
        .includes(search);

    return matchesCategory && matchesSearch;
  });

  $("#product-grid").replaceChildren();
  $("#empty-message").hidden = filtered.length > 0;

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const imageBox = document.createElement("div");
    imageBox.className = "product-image";

    const img = document.createElement("img");
    img.src = product.image;
    img.alt = product.name;
    img.loading = "lazy";
    img.onerror = () => {
      img.style.display = "none";
      imageBox.style.background = "#faf5ed";
    };

    const tag = document.createElement("span");
    tag.className = "product-tag";
    tag.textContent = product.tag;

    imageBox.append(img, tag);

    const info = document.createElement("div");
    info.className = "product-info";

    const title = document.createElement("h3");
    title.textContent = product.name;

    const description = document.createElement("p");
    description.textContent = product.description;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = money(product.price);

    const add = document.createElement("button");
    add.className = "add-button";
    add.type = "button";
    add.textContent = "+ Agregar";
    add.setAttribute("aria-label", `Agregar ${product.name} al carrito`);
    add.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, add);
    info.append(title, description, bottom);
    card.append(imageBox, info);
    $("#product-grid").append(card);
  });
}

function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  renderCart();
  showToast("¡Producto agregado a tu carrito! ☕");
}

function changeQuantity(id, delta) {
  const nextQuantity = (cart[id] || 0) + delta;

  if (nextQuantity <= 0) {
    delete cart[id];
  } else {
    cart[id] = nextQuantity;
  }

  renderCart();
}

function getCartTotal() {
  return products.reduce(
    (total, product) =>
      total + product.price * (cart[product.id] || 0),
    0
  );
}

function renderCart() {
  const container = $("#cart-items");
  container.replaceChildren();

  const entries = products.filter((product) => cart[product.id] > 0);

  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  $("#cart-count").textContent = count;
  $("#cart-total").textContent = money(getCartTotal());

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "muted";
    empty.textContent = "Tu carrito está vacío. ¡Elige algo rico!";
    container.append(empty);
    return;
  }

  entries.forEach((product) => {
    const row = document.createElement("div");
    row.className = "cart-item";

    const details = document.createElement("div");
    const name = document.createElement("div");
    name.className = "cart-item-name";
    name.textContent = product.name;

    const price = document.createElement("div");
    price.className = "cart-item-price";
    price.textContent = `${money(product.price)} por unidad`;

    details.append(name, price);

    const subtotal = document.createElement("strong");
    subtotal.textContent = money(product.price * cart[product.id]);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.textContent = "−";
    minus.setAttribute("aria-label", `Quitar una unidad de ${product.name}`);
    minus.addEventListener("click", () => changeQuantity(product.id, -1));

    const quantity = document.createElement("span");
    quantity.textContent = cart[product.id];

    const plus = document.createElement("button");
    plus.type = "button";
    plus.textContent = "+";
    plus.setAttribute("aria-label", `Agregar una unidad de ${product.name}`);
    plus.addEventListener("click", () => changeQuantity(product.id, 1));

    controls.append(minus, quantity, plus);
    row.append(details, subtotal, controls);
    container.append(row);
  });
}

function saveOrder(order) {
  // Demostración local: no reemplaza una base de datos de producción.
  const orders = JSON.parse(localStorage.getItem("cafeOrders") || "[]");
  orders.push(order);
  localStorage.setItem("cafeOrders", JSON.stringify(orders));
}

function getOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem("cafeOrders") || "[]");
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function renderTracking(order) {
  const result = $("#tracking-result");
  result.replaceChildren();
  result.hidden = false;

  const title = document.createElement("h3");
  title.textContent = `Pedido ${order.id}`;

  const status = document.createElement("p");
  status.textContent = `Estado actual: ${order.status}`;

  const total = document.createElement("p");
  total.textContent = `Total: ${money(order.total)}`;

  const steps = document.createElement("div");
  steps.className = "status-steps";

  const states = ["Pendiente", "En preparación", "Listo"];
  const currentIndex = states.indexOf(order.status);

  states.forEach((state, index) => {
    const step = document.createElement("span");
    step.className =
      "status-step" + (index === currentIndex ? " current" : "");
    step.textContent = `${index < currentIndex ? "✓ " : ""}${state}`;
    steps.append(step);
  });

  result.append(title, status, total, steps);
}

$("#categories").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;

  activeCategory = button.dataset.category;

  document.querySelectorAll(".category").forEach((category) => {
    const isActive = category === button;
    category.classList.toggle("active", isActive);
    category.setAttribute("aria-pressed", String(isActive));
  });

  renderProducts();
});

$("#search").addEventListener("input", renderProducts);

$("#open-cart").addEventListener("click", () => {
  $("#pedido").scrollIntoView({ behavior: "smooth" });
});

$("#checkout-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const entries = products.filter((product) => cart[product.id] > 0);

  if (entries.length === 0) {
    showToast("Agrega al menos un producto antes de confirmar.");
    return;
  }

  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const notes = String(form.get("notes") || "").trim();

  if (!name || !phone) {
    showToast("Completa tu nombre y teléfono.");
    return;
  }

  const order = {
    id: `CC-${Date.now().toString().slice(-8)}`,
    name,
    phone,
    notes,
    items: entries.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: cart[product.id]
    })),
    total: getCartTotal(),
    status: "Pendiente",
    createdAt: new Date().toISOString()
  };

  saveOrder(order);

  cart = {};
  renderCart();
  event.currentTarget.reset();

  const result = $("#order-result");
  result.replaceChildren();
  result.hidden = false;

  const title = document.createElement("h3");
  title.textContent = "¡Tu pedido ha sido registrado! ☕";

  const folio = document.createElement("p");
  folio.textContent = `Tu folio es: ${order.id}`;

  const total = document.createElement("p");
  total.textContent = `Total: ${money(order.total)}`;

  const notice = document.createElement("p");
  notice.textContent =
    "Demostración local: la cafetería no ha recibido este pedido.";

  result.append(title, folio, total, notice);

  $("#tracking-code").value = order.id;
  renderTracking(order);
  showToast("Pedido guardado en esta demostración.");

  result.scrollIntoView({ behavior: "smooth", block: "center" });
});

$("#tracking-form").addEventListener("submit", (event) => {
  event.preventDefault();

  const code = $("#tracking-code").value.trim().toUpperCase();
  const order = getOrders().find(
    (item) => String(item.id).toUpperCase() === code
  );

  if (!order) {
    const result = $("#tracking-result");
    result.replaceChildren();

    const message = document.createElement("p");
    message.textContent =
      "No encontramos ese folio en este navegador. Verifica el código o utiliza el dispositivo donde registraste el pedido.";

    result.append(message);
    result.hidden = false;
    return;
  }

  renderTracking(order);
});

$("#year").textContent = new Date().getFullYear();

renderProducts();
renderCart();

