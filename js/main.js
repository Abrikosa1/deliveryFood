'use strict';

const cartButton = document.querySelector('#cart-button'),
      modal = document.querySelector('.modal'),
      close = document.querySelector('.close'),      
      buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      loginForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out'),
      cardsRestaurants = document.querySelector('.cards-restaurants'),
      containerPromo = document.querySelector('.container-promo'),
      restaurants = document.querySelector('.restaurants'),
      menu = document.querySelector('.menu'),
      logo = document.querySelector('.logo'),
      cardsMenu = document.querySelector('.cards-menu');
      
let login = localStorage.getItem('deliveryFood');

const toggleModal = () => {
  modal.classList.toggle('is-open');
}

const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
  loginInput.style.borderColor = '';
  
  //block scroll
  if(modalAuth.classList.contains('is-open'))  {
    disableScroll();
  } else {
    enableScroll();
  }
};

const authorized = () => {

  const logOut = () => {
    login = null;
    localStorage.removeItem('deliveryFood')
    buttonAuth.style.display = '';
    buttonOut.style.display = '';
    userName.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
  }
  console.log('Authorized');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'inline';
  userName.style.display = 'block';

  buttonOut.addEventListener('click', logOut);
};

const unAuthorized = () => {
  console.log('Unauthorized');

  const logIn = (e) => {
    e.preventDefault();
    if(loginInput.value.trim()) {
      login = loginInput.value;
      localStorage.setItem('deliveryFood', login);
      toggleModalAuth();

      buttonAuth.removeEventListener('click', toggleModalAuth);
      closeAuth.removeEventListener('click', toggleModalAuth);
      loginForm.removeEventListener('submit', logIn);
      loginForm.reset();
      checkAuth();
    } else {
      loginInput.style.borderColor = '#ff0000';
      loginInput.value = '';
    }

  }  
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener('submit', logIn);
  modalAuth.addEventListener('click', (e) => {
    if(e.target.classList.contains('is-open')) {
      toggleModalAuth();
    }
  });
};

const checkAuth = () => {
  if(login) {
    authorized();
  } else { 
    unAuthorized(); 
  }
}

const createCardRestaurant = () => {
  const card = `
    <a class="card card-restaurant">
      <img src="img/pizza-plus/preview.jpg" alt="image" class="card-image"/>
      <div class="card-text">
        <div class="card-heading">
          <h3 class="card-title">Пицца плюс</h3>
          <span class="card-tag tag">50 мин</span>
        </div>
        <!-- /.card-heading -->
        <div class="card-info">
          <div class="rating">
            4.5
          </div>
          <div class="price">От 900 ₽</div>
          <div class="category">Пицца</div>
        </div>
        <!-- /.card-info -->
      </div>
      <!-- /.card-text -->
    </a>
  `;

  cardsRestaurants.insertAdjacentHTML('beforeend', card);
}

const createGoodCard = () => {
  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend',`
    <img src="img/pizza-plus/pizza-hawaiian.jpg" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">Пицца Гавайская</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">Соус томатный, сыр «Моцарелла», ветчина, ананасы</div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">440 ₽</strong>
      </div>
    </div>
    <!-- /.card-text -->
  `);
  cardsMenu.insertAdjacentElement('beforeend', card);
};

const openGoods = (e) => {
  if(!login) {
    toggleModalAuth();
  } else {
    const target = e.target;

    const restaurant = target.closest('.card-restaurant');

    if(restaurant) {
      containerPromo.classList.add('hide');
      restaurants.classList.add('hide');
      menu.classList.remove('hide');

      cardsMenu.textContent = '';

      createGoodCard();
      createGoodCard();
      createGoodCard();
    }
  }

};


cartButton.addEventListener('click', toggleModal);

close.addEventListener('click', toggleModal);

cardsRestaurants.addEventListener('click', openGoods)

logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
});


checkAuth();
createCardRestaurant();
createCardRestaurant();
createCardRestaurant();