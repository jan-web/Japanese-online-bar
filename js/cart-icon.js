import createElement from "./create-element.js";

export default class CartIcon {
	constructor() {
		this.render();

		this.addEventListeners();
	}

	render() {
		this.elem = createElement('<div class="cart-icon"></div>');
	}

	update(cart) {
		if (!cart.isEmpty()) {
			this.elem.classList.add("cart-icon_visible");

			this.elem.innerHTML = `
        <div class="cart-icon__inner">
          <span class="cart-icon__count">${cart.getTotalCount()}</span>
          <span class="cart-icon__price">€${cart
						.getTotalPrice()
						.toFixed(2)}</span>
        </div>`;

			this.updatePosition();

			this.elem.classList.add("shake");
			this.elem.addEventListener(
				"transitionend",
				() => {
					this.elem.classList.remove("shake");
				},
				{ once: true }
			);
		} else {
			this.elem.classList.remove("cart-icon_visible");
		}
	}

	addEventListeners() {
		document.addEventListener("scroll", () => this.updatePosition());
		window.addEventListener("resize", () => this.updatePosition());
	}

	updatePosition() {
		if (!this.elem.offsetWidth) {
			return;
		}

		if (!this._initialTopCoord) {
			this._initialTopCoord =
				this.elem.getBoundingClientRect().top + window.pageYOffset;
		}

		if (window.pageYOffset > this._initialTopCoord) {
			this._floatingCart();

			if (document.documentElement.clientWidth <= 767) {
				this._changeElemPosition();
			}
		} else {
			this._changeElemPosition();
		}
	}

	_changeElemPosition(
		elemPosition = { position: "", top: "", left: "", zIndex: "" }
	) {
		Object.assign(this.elem.style, elemPosition);
	}

	_floatingCart = () => {
		let leftIndent =
			Math.min(
				document.querySelector(".container").getBoundingClientRect().right + 20,
				document.documentElement.clientWidth - this.elem.offsetWidth - 10
			) + "px";

		this._changeElemPosition({
			position: "fixed",
			top: "50px",
			zIndex: 1e3,
			right: "10px",
			left: leftIndent,
		});
	}
}
