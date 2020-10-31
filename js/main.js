'use strict';

//slider
const swiper = new Swiper('.swiper-container', {
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

//main
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
      inputSearch = document.querySelector('.input-search'),
      modalBody = document.querySelector('.modal-body'),
      modalPrice = document.querySelector('.modal-price-tag'),
      buttonClearCart = document.querySelector('.clear-cart'),
      closeCart = document.querySelector('.close-cart');
      
let login = localStorage.getItem('deliveryFood');

const cart = JSON.parse(localStorage.getItem(`deliveryFood_${login}`)) || [];

const saveCart = () => {
  localStorage.setItem(`deliveryFood_${login}` ,JSON.stringify(cart));
}

const downloadCart = () => {
  if(localStorage.getItem(`deliveryFood_${login}`)) {
    const data = JSON.parse(localStorage.getItem(`deliveryFood_${login}`));
    cart.push(...data);
  }
  
}

const getData = async (url) => {
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка  по адресу ${url},
                      статус ошибка ${response.status}!`);  
  }
  return await response.json();
}

const validateName = (str) => {
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

const returnMain = () => {
  containerPromo.classList.remove('hide');
  swiper.init();
  restaurants.classList.remove('hide');
  menu.classList.add('hide');
}

const authorized = () => {

  const logOut = () => {
    login = null;
    cart.length = 0;
    localStorage.removeItem('deliveryFood')
    buttonAuth.style.display = '';
    buttonOut.style.display = '';
    userName.style.display = '';
    cartButton.style.display = '';
    buttonOut.removeEventListener('click', logOut);
    returnMain();
    checkAuth();
  }
  console.log('Authorized');
  userName.textContent = login;
  buttonAuth.style.display = 'none';
  buttonOut.style.display = 'block';
  userName.style.display = 'inline';
  cartButton.style.display = 'flex';

  buttonOut.addEventListener('click', logOut);
};

const unAuthorized = () => {
  console.log('Unauthorized');
  cartButton.style.display = '';
  const logIn = (e) => {
    e.preventDefault();
    if(validateName(loginInput.value)) {
      login = loginInput.value;
      localStorage.setItem('deliveryFood', login);
      toggleModalAuth();

      downloadCart();

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
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold card-price">${price} ₽</strong>
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
      swiper.destroy(false, false);
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

const addToCart = (e) => {
  const target = e.target;
  const buttonAddToCart = target.closest('.button-add-cart');
  if (buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find((item) => {
      return item.id === id;
    });

    //если еда существует, увеличиваем count,
    //иначе создаем новую позицию
    if (food) {
      food.count += 1;
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1,
      });
    }

  }
}

const renderCart = () => {
  modalBody.textContent = '';
  console.log(cart);
  cart.forEach(item => {

    const { id, title, cost, count } = item;

    const itemCart = `
        <div class="food-row">
            <span class="food-name">${title}</span>
            <span class="food-price">${cost}</span>
            <div class="food-counter">
                <button class="counter-button counter-minus" data-id=${id}>-</button>
                <span class="counter">${count}</span>
                <button class="counter-button counter-plus" data-id=${id}>+</button>
            </div>
        </div>
    `;

    modalBody.insertAdjacentHTML('afterbegin', itemCart);
  });

  const totalPrice = cart.reduce((result, item) => {
      return result + (parseFloat(item.cost)) * item.count;
  }, 0);

  modalPrice.textContent = `${totalPrice} ₽`;
  saveCart();
}

const changeCount = (e) => {

  const target = e.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(item => {
        return item.id === target.dataset.id;
    });

    if (target.classList.contains('counter-minus')) {
        food.count--;

        //если позиция 0 шт
        if (food.count === 0) {
            cart.splice(cart.indexOf(food), 1); //найдем id товара и удалим из масива карточки
        }
    }

    if (target.classList.contains('counter-plus')) {
        food.count++;
    }
    
    renderCart();
    
  }
}

const init = () => {

  getData('./db/partners.json').then(data => {
    data.forEach(createCardRestaurant);
  })

  cartButton.addEventListener('click', () => {
      renderCart();
      toggleModal();
  });

  buttonClearCart.addEventListener('click', () => {
      cart.length = 0;
      localStorage.removeItem(`deliveryFood_${login}`);
      renderCart();
  });

  modalBody.addEventListener('click', changeCount);
  close.addEventListener('click', toggleModal);
  closeCart.addEventListener('click', toggleModal);
  cardsMenu.addEventListener('click', addToCart);

  cardsRestaurants.addEventListener('click', openGoods)

  logo.addEventListener('click', () => {
      containerPromo.classList.remove('hide');
      swiper.init();
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
            swiper.destroy(false, false);
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
};


init();