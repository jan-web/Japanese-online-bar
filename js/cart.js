import createElement from "./create-element.js";
import escapeHtml from "./escape-html.js";

import Modal from "./modal.js";

export default class Cart {
	cartItems = [];

	constructor(cartIcon) {
		this.cartIcon = cartIcon;
		this._modal = null;

		this.addEventListeners();
	}

	addProduct(product) {
		let cartItem = this.cartItems.find(
			(item) => item.product.name === product.name
		);

		if (cartItem) {
			cartItem.count++;
		} else {
			cartItem = { product: product, count: 1 };
			this.cartItems.push(cartItem);
		}

		this.onProductUpdate(cartItem);
	}

	updateProductCount(productId, amount) {
		let cartItem = this.cartItems.find((item) => item.product.id === productId);

		if (!cartItem) {
			return;
		}
		cartItem.count += amount;

		if (cartItem.count === 0) {
			const newArr = [];
			this.cartItems.forEach((item) => {
				if (item !== cartItem) {
					newArr.push(item);
				}
			});
			this.cartItems = newArr;
		}

		this.onProductUpdate(cartItem);
	}

	isEmpty() {
		const isEmpty = this.cartItems.length === 0;

		return isEmpty;
	}

	getTotalCount() {
		const totalCount = this.cartItems.reduce((result, item) => {
			result += item.count;

			return result;
		}, 0);

		return totalCount;
	}

	getTotalPrice() {
		const totalPrice = this.cartItems.reduce((result, item) => {
			result += item.product.price * item.count;

			return result;
		}, 0);

		return totalPrice;
	}

	renderProduct(product, count) {
		return createElement(`
    <div class="cart-product" data-product-id="${product.id}">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
	}

	renderOrderForm() {
		return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
							2
						)}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
	}

	renderModal() {
		let modal = new Modal();
		this._modal = modal;
		modal.setTitle("Your order");

		modal.setBody(this._getLayoutOfCart());
		modal.open();

		this._modal._elem.addEventListener("click", this._onEventOfModal);

		const formOfModal = modal._elem.querySelector(`.cart-form`);
		formOfModal.addEventListener("submit", this._onSubmit, { once: true });
	}

	_onEventOfModal = (e) => {
		const amount = e.target.closest(".cart-counter__button_plus") ? 1 : -1;

		const closestCardProduct = e.target.closest(".cart-product");
		if (!closestCardProduct) {
			return;
		}
		const productId = closestCardProduct.dataset.productId;
		this.updateProductCount(productId, amount);

		if (this.isEmpty()) {
			this._modal.close();
			this._modal._elem.removeEventListener("click", this._onEventOfModal);
		}
	};

	_getLayoutOfCart() {
		const layoutOfCart = createElement("<div></div>");
		this.cartItems.forEach((item) => {
			layoutOfCart.append(this.renderProduct(item.product, item.count));
		});

		layoutOfCart.append(this.renderOrderForm());

		return layoutOfCart;
	}

	onProductUpdate(cartItem) {
		this.cartIcon.update(this);

		const isModalOpen = document.body.classList.contains("is-modal-open");
		if (!isModalOpen) {
			return;
		}

		const isHasItemsInCart = cartItem.count !== 0;
		if (!isHasItemsInCart) {
			let elemForDelite = this._modal._elem.querySelector(
				`[data-product-id="${cartItem.product.id}"]`
			);
			elemForDelite.remove();

			return;
		}

		this._onProductPriceUpdate(cartItem);
	}

	_onProductPriceUpdate(cartItem) {
		if (!this._modal) {
			return;
		}
		let productCount = this._modal._elem.querySelector(
			`[data-product-id="${cartItem.product.id}"] .cart-counter__count`
		);
		productCount.textContent = cartItem.count;

		let productPrice = this._modal._elem.querySelector(
			`[data-product-id="${cartItem.product.id}"] .cart-product__price`
		);
		productPrice.textContent = `€${(
			cartItem.product.price * cartItem.count
		).toFixed(2)}`;

		let infoPrice = this._modal._elem.querySelector(
			`.cart-buttons__info-price`
		);
		infoPrice.textContent = `€${this.getTotalPrice().toFixed(2)}`;
	}

	_onSubmit = async (event) => {
		event.preventDefault();
		let formOfModal = this._modal._elem.querySelector(`.cart-form`);
		let bodyOfForm = new FormData(formOfModal);

		let response = await fetch("https://httpbin.org/post", {
			method: "POST",
			body: bodyOfForm,
		});
		if (response.status == 200) {
			this._successSubmit();
		}
	};

	_successSubmit() {
		this._modal._elem.removeEventListener("click", this._onEventOfModal);
		this._modal.setTitle("Success!");

		this.cartItems = [];

		const successfulModalBody = `
    <div class="modal__body-inner">
    <p>
      Order successful! Your order is being cooked :) <br>
      We’ll notify you about delivery time shortly.<br>
      <img src="/assets/images/delivery.gif">
    </p>
  </div>`;
		this._modal.setBody(createElement(successfulModalBody));
		this._modal.close();
		this._modal.open();
		this.cartIcon.update(this);
	}

	addEventListeners() {
		this.cartIcon.elem.onclick = () => this.renderModal();
	}
}
