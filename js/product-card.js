import createElement from "./create-element.js";

export default class ProductCard {
  constructor({ name, price, category, image, id }) {
    this._name = name;
    this._price = price;
    this._category = category;
    this._image = image;
    this._id = id;
    this.elem = null;
    this._render();
    this._cardButton = this.elem.querySelector(".card__button");
    this._onClickButton = this._onClickButton.bind(this);
    this._listener();
  }

  _render() {
    const layout =  this._getLayout();
    this.elem = createElement(layout);
  }

  _listener() {
    this._cardButton.addEventListener("click", this._onClickButton);
  }

  _onClickButton() {
    const event = new CustomEvent("product-add", {
      detail: this._id,
      bubbles: true,
    });

    this.elem.dispatchEvent(event);
  }
  _getLayout () {
    return `
    <div class="card">
    <div class="card__top">
        <img src="/assets/images/products/${this._image}" class="card__image" alt="product">
        <span class="card__price">€${this._price.toFixed(2)}</span>
    </div>
    <div class="card__body">
        <div class="card__title">${this._name}</div>
        <button type="button" class="card__button">
            <img src="/assets/images/icons/plus-icon.svg" alt="icon">
        </button>
        </div>
    </div> `;
  }
}




// export default class ProductCard {
//   constructor(product) {
//     this.elem = document.createElement('div');
//     this.elem.className = 'card';
//     this.product = product;
//     this.elem.addEventListener('click', this.onButtonClick);
//     this.render(product);
//   }

//   onButtonClick = (event) => {
//     const target = event.target;

//     if (target.closest('.card__button')) {
//       const event = new CustomEvent("product-add", {
//         bubbles: true,
//         detail: this.product.id
//       });
//       this.elem.dispatchEvent(event);

//     }
//   }

//   render(product) {
//     this.elem.innerHTML = `
//     <div class="card__top">
//       <img src="assets/images/products/${product.image}" class="card__image" alt="product">
//         <span class="card__price">€${product.price.toFixed(2)}</span>
//     </div>
//     <div class="card__body">
//         <div class="card__title">${product.name}</div>
//         <button type="button" class="card__button">
//             <img src="assets/images/icons/plus-icon.svg" alt="icon">
//         </button>
//     </div>
//     `;
//   }
// }