window.disableScroll = function() {

  
    /*сохраним значение ширины проявляющегося скролла справа,
    чтобы верстка не прыгала*/
  const widthScroll = window.innerWidth - document.body.offsetWidth;
  
  document.body.disableScrollPos = window.scrollY;
  document.body.style.cssText = `
    position: fixed;
    top: ${-window.scrollY}px;
    left: 0;
    width: 100%;
    overflow: hidden;
    height: 100vh;
    padding-right: ${widthScroll}px;
  `;
  
  /* Могли бы использовать 'position: relative', но это не работает в Safari и iOs
  поэтому используем position: fixed + top+left+width*/
}
window.enableScroll = function() {
  document.body.style.cssText = `
    position: relative;
  `;
  window.scroll({top: document.body.disableScrollPos});
}