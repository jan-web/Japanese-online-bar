import createElement from "./create-element.js";

export default class RibbonMenu {
	constructor(categories) {
		this.categories = categories;
		this.elem = null;
		this._render();
		this._getAllElements();
		this._listeners();
	}

	_getAllElements() {
		this._ribbonInner = this.elem.querySelector(".ribbon__inner");
		this._ribbonItems = this.elem.querySelectorAll(".ribbon__item");
		this._ribbonArrowLeft = this.elem.querySelector(".ribbon__arrow_left");
		this._ribbonArrowRight = this.elem.querySelector(".ribbon__arrow_right");
	}

	_listeners() {
		this._ribbonInner.addEventListener("click", this._onClickRibbonInner);

		this._ribbonArrowLeft.addEventListener("click", this._onMoveRibbonToRight);
		this._ribbonArrowRight.addEventListener("click", this._onMoveRibbonToLeft);
	}

	_onMoveRibbonToRight = () => {
		this._ribbonInner.scrollBy(-350, 0);
		this._ribbonArrowRight.classList.add("ribbon__arrow_visible");
		if (this._scrollLeft() < 186) {
			this._ribbonArrowLeft.classList.remove("ribbon__arrow_visible");
		}
	};

	_onMoveRibbonToLeft = () => {
		this._ribbonInner.scrollBy(350, 0);
		this._ribbonArrowLeft.classList.add("ribbon__arrow_visible");
		if (this._scrollRight() < 186) {
			this._ribbonArrowRight.classList.remove("ribbon__arrow_visible");
		}
	};

	_showAllArrows() {
		this._ribbonArrowRight.classList.add("ribbon__arrow_visible");
		this._ribbonArrowLeft.classList.add("ribbon__arrow_visible");
	}

	_scrollWidth = () => this._ribbonInner.scrollWidth;
	_clientWidth = () => this._ribbonInner.clientWidth;
	_scrollLeft = () => this._ribbonInner.scrollLeft;
	_scrollRight = () =>
		this._scrollWidth() - this._scrollLeft() - this._clientWidth();

	_onClickRibbonInner = (e) => {
		e.preventDefault();

		const ribbonItem = e.target.closest(".ribbon__item");
		if (!ribbonItem) {
			return;
		}
		this._ribbonItems.forEach((item) =>
			item.classList.remove("ribbon__item_active")
		);
		ribbonItem.classList.add("ribbon__item_active");

		const customEvent = new CustomEvent("ribbon-select", {
			detail: ribbonItem.dataset.id,
			bubbles: true,
		});

		this.elem.dispatchEvent(customEvent);
	};

	_render() {
		this.elem = createElement(
			`
      <div class="ribbon">
      <button class="ribbon__arrow ribbon__arrow_left">
        <img src="./assets/images/icons/angle-icon.svg" alt="icon">
      </button>
      <nav class="ribbon__inner">
      ${this._getLinks()}
      </nav>
      <button class="ribbon__arrow ribbon__arrow_right ribbon__arrow_visible">
        <img src="./assets/images/icons/angle-icon.svg" alt="icon">
      </button>
    </div>
      `
		);
	}

	_getLinks() {
		const layout = this.categories
			.map(
				(link) =>
					`<a href="#" class="ribbon__item" data-id="${link.id}">${link.name}</a>`
			)
			.join("");
		return layout;
	}
}
