import Carousel from './js/carousel.js';
import slides from './js/slides.js';

import RibbonMenu from './js/ribbon-menu.js';
import categories from './js/categories.js';

import StepSlider from './js/step-slider.js';
import ProductsGrid from './js/products-grid.js';

import CartIcon from './js/cart-icon.js';
import Cart from './js/cart.js';


export default class Main {
  constructor() {}

  async render() {
    const dataCarouselHolder = document.querySelector("[data-carousel-holder]");
    const carousel = new Carousel(slides);
    dataCarouselHolder.append(carousel.elem);

    const dataRibbonlHolder = document.querySelector("[data-ribbon-holder]");
    this.ribbonMenu = new RibbonMenu(categories);
    dataRibbonlHolder.append(this.ribbonMenu.elem);

    const dataSliderlHolder = document.querySelector("[data-slider-holder]");
    this.stepSlider = new StepSlider({
      steps: 5,
      value: 3,
    });
    dataSliderlHolder.append(this.stepSlider.elem);

    const dataCartIconlHolder = document.querySelector(
      "[data-cart-icon-holder]"
    );
    const cartIcon = new CartIcon();
    dataCartIconlHolder.append(cartIcon.elem);

    const cart = new Cart(cartIcon);

    let response = await fetch("products.json");
    let products = await response.json();

    const dataProductsGridlHolder = document.querySelector(
      "[data-products-grid-holder]"
    );
    this.productsGrid = new ProductsGrid(products);
    dataProductsGridlHolder.append(this.productsGrid.elem);

    this.filter = {
      noNuts: document.getElementById("nuts-checkbox").checked,
      vegeterianOnly: document.getElementById("vegeterian-checkbox").checked,
      maxSpiciness: this.stepSlider._value,
      category: "",
    };

    this.productsGrid.updateFilter(this.filter);

    document.body.addEventListener("product-add", (e) => {
      const product = products.find((item) => item.id === e.detail);
      cart.addProduct(product);
    });

    this.stepSlider.elem.addEventListener("slider-change", (e) => {
      this.filter.maxSpiciness = e.detail;
      this.productsGrid.updateFilter(this.filter);
    });

    this.ribbonMenu.elem.addEventListener("ribbon-select", (e) => {
      this.filter.category = e.detail;
      this.productsGrid.updateFilter(this.filter);
    });

    const nutsCheckbox = document.getElementById("nuts-checkbox");
    nutsCheckbox.addEventListener("change", (e) => {
      this.filter.noNuts = e.target.checked;
      this.productsGrid.updateFilter(this.filter);
    });

    const vegeterianCheckbox = document.getElementById("vegeterian-checkbox");
    vegeterianCheckbox.addEventListener("change", (e) => {
      this.filter.vegeterianOnly = e.target.checked;
      this.productsGrid.updateFilter(this.filter);
    });


  }
}

// export default class Main {

//   constructor() {}

//   async render() {
//     let response = await fetch('products.json');
//     let result = await response.json();
//     this.productsGrid = new ProductsGrid(result);
//     let productsGridHolder = document.querySelector('[data-products-grid-holder]');
//     productsGridHolder.innerHTML = '';
//     productsGridHolder.append(this.productsGrid.elem);
//     this.Carousel = new Carousel(slides);
//     let carouselHolder = document.querySelector('[data-carousel-holder]');
//     carouselHolder.append(this.Carousel.elem);
//     this.ribbonMenu = new RibbonMenu(categories);
//     let ribbonHolder = document.querySelector('[data-ribbon-holder]');
//     ribbonHolder.append(this.ribbonMenu.elem);
//     this.stepSlider = new StepSlider({
//       steps: 5,
//       value: 3
//     });
//     let sliderHolder = document.querySelector('[data-slider-holder]');
//     sliderHolder.append(this.stepSlider.elem);
//     this.CartIcon = new CartIcon();
//     let cartIconHolder = document.querySelector('[data-cart-icon-holder]');
//     cartIconHolder.append(this.CartIcon.elem);
//     this.cart = new Cart(this.CartIcon);
//     document.body.addEventListener('product-add', ({
//       detail: productId
//     }) => {
//       let product = result.find(product => product.id == productId);
//       this.cart.addProduct(product);
//     });

//     this.productsGrid.updateFilter({
//       noNuts: document.getElementById('nuts-checkbox').checked,
//       vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
//       maxSpiciness: this.stepSlider.value,
//       category: this.ribbonMenu.value
//     });

//     this.stepSlider.elem.addEventListener('slider-change', ({
//       detail: value
//     }) => {
//       this.productsGrid.updateFilter({
//         maxSpiciness: value
//       });
//     });

//     this.ribbonMenu.elem.addEventListener('ribbon-select', ({
//       detail: categoryId
//     }) => {
//       this.productsGrid.updateFilter({
//         category: categoryId
//       });
//     });
//     document.getElementById('nuts-checkbox').onchange = event => {
//       this.productsGrid.updateFilter({
//         noNuts: document.getElementById('nuts-checkbox').checked,
//       });
//     };
//     document.getElementById('vegeterian-checkbox').onchange = event => {
//       this.productsGrid.updateFilter({
//         vegeterianOnly: document.getElementById('vegeterian-checkbox').checked,
//       });
//     };
//   }
// }