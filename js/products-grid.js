import ProductCard from "./product-card.js";

import createElement from "./create-element.js";

export default class ProductGrid {
	constructor(products) {
		this.products = products;
		this._filteredCards = this.products;
		this.filters = {};
		this.elem = null;

		this._renderLayout();
	}

	_renderLayout() {
		let layout = `
    <div class="products-grid">
    <div class="products-grid__inner">

    </div>
    </div>
    `;

		this.elem = createElement(layout);
		this._productsGridInner = this.elem.querySelector(".products-grid__inner");

		this._renderCards();
	}

	_renderCards() {
		this._filteredCards.forEach((card) => {
			const el = new ProductCard(card).elem;
			this._productsGridInner.append(el);
		});
	}

	updateFilter(filter) {
		this.filters = Object.assign({}, this.filters, filter);
		this._filteredCards = this.products

			.filter((product) => {
				return this._noNutsSelect(product);
			})
			.filter((product) => {
				return this._vegeterianOnlySelect(product);
			})
			.filter((product) => {
				return this._spicinessSelect(product);
			})

			.filter((product) => {
				return this._categorySelect(product);
			});

		this._productsGridInner.innerHTML = "";
		this._renderCards();
	}

	_categorySelect(product) {
		if (this.filters["category"]) {
			if (
				this.filters["category"] === product["category"] ||
				this.filters["category"] === ""
			) {
				return true;
			}
			return false;
		}
		return true;
	}

	_spicinessSelect(product) {
		if (this.filters["maxSpiciness"]) {
			if (product["spiciness"] <= this.filters["maxSpiciness"]) {
				return true;
			}
			return false;
		}
		return true;
	}

	_noNutsSelect(product) {
		if (this.filters["noNuts"]) {
			if (product["nuts"] === false || product["nuts"] === undefined) {
				return true;
			}
			return false;
		}
		return true;
	}

	_vegeterianOnlySelect(product) {
		if (this.filters["vegeterianOnly"]) {
			if (product["vegeterian"] === true) {
				return true;
			}
			return false;
		}
		return true;
	}
}
