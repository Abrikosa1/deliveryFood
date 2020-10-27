const cartButton = document.querySelector('#cart-button');
const modal = document.querySelector('.modal');
const close = document.querySelector('.close');

const toggleModal = () => {
  modal.classList.toggle('is-open');
}


cartButton.addEventListener('click', toggleModal);
close.addEventListener('click', toggleModal);


// day 1

const buttonAuth = document.querySelector('.button-auth'),
      modalAuth = document.querySelector('.modal-auth'),
      closeAuth = document.querySelector('.close-auth'),
      loginForm = document.querySelector('#logInForm'),
      loginInput = document.querySelector('#login'),
      userName = document.querySelector('.user-name'),
      buttonOut = document.querySelector('.button-out');
      


let login = localStorage.getItem('deliveryFood');


const toggleModalAuth = () => {
  modalAuth.classList.toggle('is-open');
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
    login = loginInput.value;
    localStorage.setItem('deliveryFood', login);
    toggleModalAuth();
    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeAuth.removeEventListener('click', toggleModalAuth);
    loginForm.removeEventListener('submit', logIn);
    loginForm.reset();
    checkAuth();
  }  
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeAuth.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener('submit', logIn);
};


const checkAuth = () => {
  if(login) {
    authorized();
  } else { 
    unAuthorized(); 
  }
}
checkAuth();