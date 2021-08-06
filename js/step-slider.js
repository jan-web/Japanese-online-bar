import createElement from "./create-element.js";

export default class StepSlider {
	constructor({ steps, value = 0 }) {
		this.elem = null;
		this._steps = steps;
		this._value = value;
		this._initialPercentage = (100 / this._steps) * this._value;

		this._render();
		this._initAllElements();

		this._addListeners();
	}
	_initAllElements() {
		this._sliderValue = this.elem.querySelector(".slider__value");
		this._sliderSteps = this.elem.querySelectorAll(".slider__steps span");
		this._sliderThumb = this.elem.querySelector(".slider__thumb");
		this._sliderProgress = this.elem.querySelector(".slider__progress");
	}

	_addListeners() {
		this.elem.addEventListener("click", this._clickHandler);
		this.elem.ondragstart = () => false;
		this.elem.addEventListener("pointerdown", (e) => {
			this.elem.classList.add("slider_dragging");
			this.elem.addEventListener("pointermove", this._thumbMoveHandler);
		});

		this.elem.addEventListener("pointerup", (e) => {
			this._actionsOnClick(e);
			this.elem.classList.remove("slider_dragging");
			this.elem.removeEventListener("pointermove", this._thumbMoveHandler);
			this._dispatchCustomEvent(this._value);
		});
	}

	_thumbMoveHandler = (e) => {
		let leftRelative = this._getleftRelative(e);
		if (leftRelative < 0) {
			leftRelative = 0;
		}
		if (leftRelative > 1) {
			leftRelative = 1;
		}
		let leftPercents = leftRelative * 100;
		this._setleftRelative(leftRelative);

		this._sliderValue.textContent = this._value;
		this._makeSliderStepActiv(this._value);

		this._sliderThumb.style.left = `${leftPercents}%`;
		this._sliderProgress.style.width = `${leftPercents}%`;
	};

	_clickHandler = (e) => {
		this._actionsOnClick(e);
		this._dispatchCustomEvent(this._value);
	};

	_actionsOnClick(e) {
		let leftRelative = this._getleftRelative(e);
		this._setleftRelative(leftRelative);

		let valuePercents = (this._value / (this._steps - 1)) * 100;
		if (valuePercents < 0) {
			valuePercents = 0;
		}
		if (valuePercents > 100) {
			valuePercents = 100;
		}
		this._sliderValue.textContent = this._value;
		this._makeSliderStepActiv(this._value);

		this._sliderThumb.style.left = `${valuePercents}%`;
		this._sliderProgress.style.width = `${valuePercents}%`;
	}

	_getleftRelative(e) {
		let left = e.clientX - this.elem.getBoundingClientRect().left;
		return left / this.elem.offsetWidth;
	}

	_setleftRelative(leftRelative) {
		let segments = this._steps - 1;
		let approximateValue = leftRelative * segments;
		this._value = Math.round(approximateValue);
	}

	_dispatchCustomEvent(value) {
		const customEvent = new CustomEvent("slider-change", {
			detail: value,
			bubbles: true,
		});

		this.elem.dispatchEvent(customEvent);
	}

	_makeSliderStepActiv(value) {
		[...this._sliderSteps].forEach((step, index) => {
			step.classList.remove("slider__step-active");
			if (index === value) {
				step.classList.add("slider__step-active");
			}
		});
	}

	_render() {
		this.elem = createElement(`
    <div class="slider">
      <div class="slider__thumb" style="left: ${this._initialPercentage}%;">
        <span class="slider__value">${this._value}</span>
      </div>
      <div class="slider__progress" style="width: ${
				this._initialPercentage
			}%;"></div>
      <div class="slider__steps">
     ${this._getSteps()}
      </div>
    </div>
    `);
	}

	_getSteps() {
		let stepsLayout = "";
		for (let i = 0; i < this._steps; i++) {
			if (i === this._value) {
				stepsLayout += `<span class="slider__step-active"></span>`;
				continue;
			}
			stepsLayout += `<span></span>`;
		}
		return stepsLayout;
	}
}
