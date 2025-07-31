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