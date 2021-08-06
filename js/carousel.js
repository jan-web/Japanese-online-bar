import { hideElement, showElement } from "./services.js";
import createElement from "./create-element.js";

export default class Carousel {
	constructor(slides) {
		this._slides = slides;
		this.elem = null;
		this._render();
		this._carouselArrowRight = this.elem.querySelector(
			".carousel__arrow_right"
		);
		this._carouselArrowLeft = this.elem.querySelector(".carousel__arrow_left");
		this._carouselSlidesNumber =
			this.elem.querySelectorAll(".carousel__slide").length;
		this._carouselInner = this.elem.querySelector(".carousel__inner");
		this._cardButtons = this.elem.querySelectorAll(".carousel__button");
		this._slide = 1;
		hideElement(this._carouselArrowLeft);
		this._listener();
	}

	_render() {
		const layout = this._getLayout();
		this.elem = createElement(layout);
	}

	_listener() {
		this.elem.addEventListener("click", (event) => this._moveSlides(event));

		[...this._cardButtons].forEach((button) => {
			button.addEventListener("click", (event) => {
				this._onClickButton(event);
			});
		});
	}
	_onClickButton(event) {
		const customEvent = new CustomEvent("product-add", {
			detail: event.target.closest("button").dataset.id,
			bubbles: true,
		});
		this.elem.dispatchEvent(customEvent);
	}

	_moveSlides(event) {
		const target = event.target.closest(".carousel__arrow");
		if (!target) return;

		this._getCarouselInnerWidth();
		this._arrowRightAction(target);
		this._arrowLeftAction(target);
		this._hideArrowRight();
		this._hideArrowLeft();
	}

	_getCarouselInnerWidth() {
		if (!this.position && this.position != 0) {
			this._carouselInnerWidth = this._carouselInner.offsetWidth;
			this.position = this._carouselInnerWidth;
		}
	}

	_arrowRightAction(target) {
		if (target.classList.contains("carousel__arrow_right")) {
			this._carouselInner.style.transform = this.translateXdataRender(
				this.position
			);
			this.position += this._carouselInnerWidth;
			this._slide++;
		}
	}

	_arrowLeftAction(target) {
		if (target.classList.contains("carousel__arrow_left")) {
			this.position -= this._carouselInnerWidth;
			this._carouselInner.style.transform = this.translateXdataRender(
				this.position,
				this._carouselInnerWidth
			);
			this._slide--;
		}
	}

	_hideArrowRight() {
		if (this._slide === this._carouselSlidesNumber) {
			hideElement(this._carouselArrowRight);
		} else {
			showElement(this._carouselArrowRight);
		}
	}

	_hideArrowLeft() {
		if (this._slide === 1) {
			hideElement(this._carouselArrowLeft);
		} else {
			showElement(this._carouselArrowLeft);
		}
	}

	translateXdataRender(position, shift = 0) {
		return `translateX(-${position - shift}px)`;
	}

	_getLayout() {
		return `
    <div class="carousel">
      <div class="carousel__arrow carousel__arrow_right">
        <img src="/assets/images/icons/angle-icon.svg" alt="icon">
      </div>
      <div class="carousel__arrow carousel__arrow_left">
        <img src="/assets/images/icons/angle-left-icon.svg" alt="icon">
      </div>
      <div class="carousel__inner">
      ${this._getSlidesTempalte()}
      </div>
    </div>`;
	}
	_getSlidesTempalte() {
		let slidesTempalte = "";
		this._slides.forEach((slide) => {
			slidesTempalte += `
          <div class="carousel__slide" data-id="penang-shrimp">
          <img src="/assets/images/carousel/${
						slide.image
					}" class="carousel__img" alt="slide">
          <div class="carousel__caption">
            <span class="carousel__price">€${slide.price.toFixed(2)}</span>
            <div class="carousel__title">${slide.name}</div>
            <button type="button" class="carousel__button" data-id=${slide.id}>
              <img src="/assets/images/icons/plus-icon.svg" alt="icon">
            </button>
          </div>
        </div>`;
		});
		return slidesTempalte;
	}
}
