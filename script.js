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


/* ================= CART SYSTEM ================= */

let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCart();

function addToCart(name, price) {
  const product = cart.find(item => item.name === name);
  product ? product.qty++ : cart.push({ name, price, qty: 1 });
  saveCart();
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (!cartItems) return;

  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.qty;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="cart-item">
        <strong>${item.name}</strong>
        <div class="cart-controls">
          <button onclick="changeQty(${index}, -1)">➖</button>
          <span>${item.qty}</span>
          <button onclick="changeQty(${index}, 1)">➕</button>
          <button class="remove-btn" onclick="removeItem(${index})">🗑</button>
        </div>
      </div>
    `;
  });

  cartTotal.textContent = total;
  cartCount.textContent = count;
}

function changeQty(index, amount) {
  cart[index].qty += amount;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  saveCart();
  updateCart();
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function toggleCart() {
  document.getElementById("cart-panel").classList.toggle("active");
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

async function sendOrderEmail() {
  if (cart.length === 0) {
    alert("El carrito está vacío");
    return;
  }

  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const messageBox = document.getElementById("cart-message");

  if (!name || !phone) {
    alert("Por favor ingresa tu nombre y teléfono");
    return;
  }

  let orderText = `Nombre: ${name}\nTeléfono: ${phone}\n\nPedido:\n`;
  let total = 0;

  cart.forEach(item => {
    orderText += `• ${item.name} x${item.qty} = L. ${item.price * item.qty}\n`;
    total += item.price * item.qty;
  });

  orderText += `\nTotal: L. ${total}`;

  try {
    const response = await fetch("https://formspree.io/f/mblznzyy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        phone: phone,
        message: orderText
      })
    });

    if (response.ok) {
      cart = [];
      saveCart();
      updateCart();

      document.getElementById("customer-name").value = "";
      document.getElementById("customer-phone").value = "";

      messageBox.style.display = "block";
      setTimeout(() => messageBox.style.display = "none", 4000);
    } else {
      alert("Error al enviar el pedido");
    }
  } catch (err) {
    alert("Error de conexión");
  }
}

