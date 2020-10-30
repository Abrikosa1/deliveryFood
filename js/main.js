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
      cardsMenu = document.querySelector('.cards-menu'),
      restaurantTitle = document.querySelector('.restaurant-title'),
      restaurantRating = document.querySelector('.rating'),
      restaurantPrice = document.querySelector('.price'),
      restaurantCategory = document.querySelector('.category'),
      inputSearch = document.querySelector('.input-search');
      
let login = localStorage.getItem('deliveryFood');

const getData = async (url) => {
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка  по адресу ${url},
                      статус ошибка ${response.status}!`);  
  }
  return await response.json();
}

const valedateName = (str) => {
  const regExp = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/;
  return regExp.test(str);
};

const toggleModal = () => {
  modal.classList.toggle('is-open');
};

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
    if(valedateName(loginInput.value)) {
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

const createCardRestaurant = (restaurant) => {
  const { 
    image, 
    kitchen, 
    name, 
    price, 
    stars, 
    products, 
    time_of_delivery: timeOfDelivery, 
  } = restaurant;

  const cardRestaurant = document.createElement('a');
  cardRestaurant.className = 'card card-restaurant';
  cardRestaurant.products = products;
  cardRestaurant.info = { kitchen, name, price, stars };

  const card = `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title">${name}</h3>
        <span class="card-tag tag">${timeOfDelivery}</span>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="rating">
          ${stars}
        </div>
        <div class="price">От ${price} ₽</div>
        <div class="category">${kitchen}</div>
      </div>
      <!-- /.card-info -->
    </div>
    <!-- /.card-text -->
  `;
  cardRestaurant.insertAdjacentHTML('beforeend', card);
  cardsRestaurants.insertAdjacentElement('beforeend', cardRestaurant);
}

const createGoodCard = (goods) => {
  const {
    description, 
    id, 
    image,
    name,
    price,
  } = goods;

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend',`
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
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
      

      const { name, kitchen, price, stars } = restaurant.info;

      restaurantTitle.textContent = name;
      restaurantRating.textContent = stars;
      restaurantPrice.textContent = `От ${price} ₽`;
      restaurantCategory.textContent = kitchen;
      
      console.dir(restaurant);
      getData(`./db/${restaurant.products}`).then(data => {
        console.log(data);
        data.forEach(createGoodCard);
      });
    }
  }

};

const init = () => {

  getData('./db/partners.json').then(data => {
    data.forEach(createCardRestaurant);
  })

  cartButton.addEventListener('click', toggleModal);

  close.addEventListener('click', toggleModal);

  cardsRestaurants.addEventListener('click', openGoods)

  logo.addEventListener('click', () => {
      containerPromo.classList.remove('hide');
      restaurants.classList.remove('hide');
      menu.classList.add('hide');
  });


  checkAuth();

  inputSearch.addEventListener('keypress', (e) => {
    if(e.charCode === 13) {

      const value = e.target.value.trim();

      if(!value) {
        e.target.style.backgroundColor = 'red';
        e.target.value = '';
        setTimeout(() => {
          e.target.style.backgroundColor = '';
        }, 1500);
        return;
      }

      getData('./db/partners.json')
      .then(data =>{
        return data.map(partner => {
          return partner.products;
        });
      })
      .then(linksProducts => {
        cardsMenu.textContent = '';
        linksProducts.forEach(link => {
          getData(`./db/${link}`)
          .then(data => {

            const searchResult = data.filter(item => {
              const name = item.name.toLowerCase();
              return name.includes(value.toLowerCase());
            });

            containerPromo.classList.add('hide');
            restaurants.classList.add('hide');
            menu.classList.remove('hide');
        
            restaurantTitle.textContent = 'Результат поиска';
            restaurantRating.textContent =  '';
            restaurantPrice.textContent = '';
            restaurantCategory.textContent = '';
            searchResult.forEach(createGoodCard);
          })
        })
      })
    }
  });


//Slider
  new Swiper('.swiper-container', {
    sliderPerView: 1,
    loop: true,
    autoplay: true,
    grabCursor: true,
    effect: 'coverflow',


    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
  });

};


init();