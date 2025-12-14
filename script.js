const images = ["./kadsa/earing1.jpg", "./kadsa/earing2.jpg", "./kadsa/earing3.jpg"];
let index = 0;

function showImage() {
  document.getElementById("slider-image").src = images[index];
}

function nextImage() {
  index = (index + 1) % images.length;
  showImage();
}

function prevImage() {
  index = (index - 1 + images.length) % images.length;
  showImage();
}

/* ___________________________________________________________________ */
function openModal(src) {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  modal.style.display = 'flex';
  modalImg.src = src;
}

function closeModal() {
  document.getElementById('modal').style.display = 'none';
}

/* _____________________________________________________________________ */

/* Closing the pictures */
document.addEventListener('keydown', function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

/* _______________________________________________________________________ */
/* Form */
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Ocultar el mensaje al inicio
formMessage.style.display = 'none';
formMessage.style.opacity = '0';
formMessage.style.transition = 'opacity 0.6s ease';

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  const response = await fetch(form.action, {
    method: form.method,
    body: data,
    headers: { 'Accept': 'application/json' }
  });

  if (response.ok) {
    form.reset();
    formMessage.style.display = 'block';
    setTimeout(() => formMessage.style.opacity = '1', 50);
  } else {
    formMessage.textContent = '❌ Ocurrió un error. Por favor intenta de nuevo.';
    formMessage.style.color = 'red';
    formMessage.style.display = 'block';
    setTimeout(() => formMessage.style.opacity = '1', 50);
  }
});


/* ______________________________________________________ */
/* Nav bar */
function toggleMenu() {
  const nav = document.getElementById('nav-menu');
  nav.classList.toggle('active');
}

// Close menu when clicking outside
document.addEventListener("click", function (event) {
  const nav = document.getElementById("nav-menu");
  const burger = document.querySelector(".burger");

  // If menu is open and you click outside nav + outside burger → close it
  if (nav.classList.contains("active") &&
    !nav.contains(event.target) &&
    !burger.contains(event.target)) {
    nav.classList.remove("active");
  }
});



/* ______________________________________________________ */
/* fade */
const elements = document.querySelectorAll('.fade');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
});

elements.forEach(el => observer.observe(el));

/* =====================================================
   CART LOGIC – ADD / REMOVE / + / - / TRASH / FORMSPREE
===================================================== */

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  const cartPanel = document.getElementById("cart-panel");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  const orderForm = document.getElementById("order-form");
  const orderDetails = document.getElementById("order-details");
  const successMsg = document.getElementById("order-success");
  const cartIcon = document.querySelector(".cart-icon");

  /* =====================
     TOGGLE CART
  ===================== */
  window.toggleCart = function () {
    cartPanel.classList.toggle("active");
  };

  /* =====================
     CLOSE CART ON OUTSIDE CLICK
     (EXCEPT + / - / 🗑)
  ===================== */
  document.addEventListener("click", (e) => {
    const isInsideCart = cartPanel.contains(e.target);
    const isCartIcon = cartIcon.contains(e.target);
    const isQtyButton = e.target.closest(".cart-controls button");
    const isTrashButton = e.target.closest(".cart-trash");

    if (
      cartPanel.classList.contains("active") &&
      !isInsideCart &&
      !isCartIcon &&
      !isQtyButton &&
      !isTrashButton
    ) {
      cartPanel.classList.remove("active");
    }
  });

  /* =====================
     ADD TO CART
  ===================== */
  window.addToCart = function (name, price) {
    const existing = cart.find(item => item.name === name);

    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, qty: 1 });
    }

    updateCart();
    cartPanel.classList.add("active"); // auto open cart
    showCartMessage(name);

  };

  /* =====================
     QUANTITY CONTROLS
  ===================== */
  window.increaseQty = function (index) {
    cart[index].qty++;
    updateCart();
  };

  window.decreaseQty = function (index) {
    cart[index].qty--;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    updateCart();
  };

  /* =====================
     REMOVE ITEM (TRASH)
  ===================== */
  window.removeItem = function (index) {
    cart.splice(index, 1);
    updateCart();
  };

  /* =====================
     UPDATE CART UI
  ===================== */
  function updateCart() {
    cartItems.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach((item, index) => {
      total += item.price * item.qty;
      count += item.qty;

      const div = document.createElement("div");
      div.className = "cart-item";

      div.innerHTML = `
        <span class="cart-item-name">${item.name}</span>

        <div class="cart-controls">
          <button type="button" onclick="decreaseQty(${index})">−</button>
          <strong>${item.qty}</strong>
          <button type="button" onclick="increaseQty(${index})">+</button>
        </div>

        <button
          type="button"
          class="cart-trash"
          onclick="removeItem(${index})"
          aria-label="Eliminar producto"
        >
          🗑
        </button>
      `;

      cartItems.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = count;

    orderDetails.value =
      cart.map(i => `${i.name} x${i.qty} – L.${(i.price * i.qty).toFixed(2)}`).join("\n") +
      `\nTotal: L.${total.toFixed(2)}`;
  }

  /* =====================
     SEND ORDER (FORMSPREE)
  ===================== */
  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    const data = new FormData(orderForm);

    try {
      const response = await fetch(orderForm.action, {
        method: "POST",
        body: data,
        headers: { "Accept": "application/json" }
      });

      if (response.ok) {
        // reset everything
        orderForm.reset();
        cart = [];
        updateCart();

        // show success message briefly
        successMsg.style.display = "block";

        setTimeout(() => {
          successMsg.style.display = "none";
        }, 4000);
      } else {
        alert("Error al enviar la orden.");
      }
    } catch {
      alert("Error de conexión.");
    }
  });

});


function showCartMessage(productName = "") {
  const msg = document.getElementById("cart-message");

  if (!msg) return;

  msg.textContent = productName
    ? `🛒 ${productName} agregado al carrito`
    : "🛒 Producto agregado al carrito";

  msg.classList.add("show");

  setTimeout(() => {
    msg.classList.remove("show");
  }, 2300);
}
