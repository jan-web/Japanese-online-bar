import createElement from "./create-element.js";

export default class Modal {
  constructor() {
    this._title = null;
    this._modalBody = null;
    this._elem = null;
  }

  _makeLayout() {
    const layout = `
    <div class="container">
    <!--Корневой элемент Modal-->
    <div class="modal">
      <div class="modal__overlay"></div>

      <div class="modal__inner">
        <div class="modal__header">
          <!--Кнопка закрытия модального окна-->
          <button type="button" class="modal__close">
            <img src="./assets/images/icons/cross-icon.svg" alt="close-icon" />
          </button>

          <h3 class="modal__title">${this._title}</h3>
        </div>

        <div class="modal__body">
        </div>
      </div>

    </div>
  </div>`;

    this._elem = createElement(layout);
    const modalBodyDiv = this._elem.querySelector(".modal .modal__body");
    modalBodyDiv.append(this._modalBody);
    this._buttonModalClose = this._elem.querySelector(".modal__close");
  }

  open() {
    this._makeLayout();
    document.body.append(this._elem);
    document.body.classList.add("is-modal-open");
    this._listeners();
  }

  close() {
    this._elem.remove();
    document.body.classList.remove("is-modal-open");
  }
  _closeElement = () => this.close();

  _listeners() {
    this._onClickCloseButton();
    this._onKeyDown();
  }

  _onClickCloseButton() {
    this._buttonModalClose.addEventListener("click", () => {
      this._closeElement();
      this._removeEventListener();
    });
  }

  _onKeyDown () {
    document.body.addEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        this._closeElement();
        this._removeEventListener();
      }
    });
  }

  _removeEventListener() {
    this._buttonModalClose.removeEventListener("click", () => {
      this._closeElement();
    });

    document.body.removeEventListener("keydown", (event) => {
      if (event.code === "Escape") {
        this._closeElement();
      }
    });
  }

  setTitle(str) {
    this._title = str;
  }

  setBody(bodyElem) {
    this._modalBody = bodyElem;
  }
}