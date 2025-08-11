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



