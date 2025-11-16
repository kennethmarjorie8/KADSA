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

