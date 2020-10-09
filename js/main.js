const cartButton = document.getElementById('cart-button'),
      modal = document.querySelector('.modal'),
      close = document.querySelector('.close');

const toggleModal = () => {
  modal.classList.toggle('isopen');
}
cartButton.addEventListener("click", toggleModal);
close.addEventListener("click", toggleModal);

new WOW().init();