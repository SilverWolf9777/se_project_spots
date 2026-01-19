import "./index.css";
import Api from "../utils/Api.js";
import {
  enableValidation,
  settings,
  setEventListeners,
  disableButton,
  checkInputValidity,
  showInputError,
  hideInputError,
  hasInvalidInput,
  toggleButtonState,
  resetValidation,
} from "../scripts/validation.js";
import { setButtonTextLoading, handleSubmit } from "../utils/helpers.js";

// ---------------------------
// API Setup
// ---------------------------
const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "df5170a0-9aec-45e6-8242-5a9956a34898",
    "Content-Type": "application/json",
  },
});

// ---------------------------
// DOM Elements
// ---------------------------
const cardContainer = document.querySelector(".cards__list");
const cardTemplate = document.querySelector("#card-template").content;

const profileAvatarImgEl = document.querySelector(".profile__avatar");
const profileNameEl = document.querySelector(".profile__title");
const profileDescriptionEl = document.querySelector(".profile__description");

// Modals
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const editAvatarBtn = document.querySelector(".profile__editAvatar-btn");
const editAvatarCloseBtn = editAvatarModal.querySelector(".modal__close-btn");
const editAvatarForm = document.forms["edit-avatar-form"];
const editAvatarInput = editAvatarModal.querySelector("#avatar-input");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileForm = document.forms["edit-profile-form"];
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostForm = document.forms["new-post-form"];
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostImgInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");

const previewModal = document.querySelector("#preview-modal");
const closePreviewModalBtnEl = previewModal.querySelector(
  ".modal__close-btn_type_preview",
);
const previewImgEl = previewModal.querySelector(".modal__image_type_preview");
const previewTitleEl = previewModal.querySelector(".modal__caption");

const deletePostModal = document.querySelector("#delete-post-modal");
const deletePostCloseBtn = deletePostModal.querySelector(".modal__close-btn");
const deletePostForm = document.forms["deleteForm"];
const deletePostCancelBtn = deletePostModal.querySelector(".modal__cancel-btn");

// ---------------------------
// Global variables
// ---------------------------
let selectedCard, selectedCardId;

// ---------------------------
// Modal helpers
// ---------------------------
function handleEsc(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) closeModal(openedModal);
  }
}

function handleClickOutside(evt) {
  if (evt.target === evt.currentTarget) {
    closeModal(evt.currentTarget);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEsc);
  modal.addEventListener("mousedown", handleClickOutside);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEsc);
  modal.removeEventListener("mousedown", handleClickOutside);
}

// ---------------------------
// Card creation
// ---------------------------
function getCardElement(data) {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardDeleteBtnEl = cardElement.querySelector(".card__delete-btn");
  const cardLikeBtnEl = cardElement.querySelector(".card__like-btn");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;
  const cardId = data._id;

  // Delete
  cardDeleteBtnEl.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deletePostModal);
  });
  deletePostForm.onsubmit = (event) => {
    handleSubmit(requestDeleteCard, event, "Deleting...");
  };
  function requestDeleteCard() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      closeModal(deletePostModal);
    });
  }

  // Image preview
  cardImageEl.addEventListener("click", () => {
    previewImgEl.src = cardImageEl.src;
    previewImgEl.alt = cardTitleEl.textContent;
    previewTitleEl.textContent = cardTitleEl.textContent;
    openModal(previewModal);
  });

  // Like
  if (data.isLiked) {
    cardLikeBtnEl.classList.add("card__like-btn_active");
  }

  cardLikeBtnEl.addEventListener("click", () => {
    api
      .isLikedChange(
        data._id,
        !cardLikeBtnEl.classList.contains("card__like-btn_active"),
      )
      .then(() => {
        cardLikeBtnEl.classList.toggle("card__like-btn_active");
      })
      .catch((err) => {
        console.log(`Error: ${err}`);
      });
  });
  return cardElement;
}

// ---------------------------
// Event listeners
// ---------------------------

// Profile edit
editProfileBtn.addEventListener("click", () => {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

editProfileCloseBtn.addEventListener("click", () =>
  closeModal(editProfileModal),
);

editProfileForm.addEventListener("submit", (event) => {
  function requestEditProfile() {
    return api
      .editUserInfo({
        name: editProfileNameInput.value,
        about: editProfileDescriptionInput.value,
      })
      .then((data) => {
        profileNameEl.textContent = data.name;
        profileDescriptionEl.textContent = data.about;
        closeModal(editProfileModal);
      });
  }

  handleSubmit(requestEditProfile, event, "Saving...");
});

// Avatar edit
editAvatarBtn.addEventListener("click", () => openModal(editAvatarModal));
editAvatarCloseBtn.addEventListener("click", () => closeModal(editAvatarModal));

editAvatarForm.addEventListener("submit", (event) => {
  function requestAvatarEdit() {
    return api.editAvatarInfo(editAvatarInput.value).then((data) => {
      profileAvatarImgEl.src = data.avatar;
      closeModal(editAvatarModal);
    });
  }
  handleSubmit(requestAvatarEdit, event);
});

// New post
newPostBtn.addEventListener("click", () => openModal(newPostModal));
newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));
newPostForm.addEventListener("submit", (event) => {
  const inputValues = {
    link: newPostImgInput.value,
    name: newPostCaptionInput.value,
  };
  function requestNewPost() {
    return api.postCard(inputValues).then((newCard) => {
      const cardElement = getCardElement(newCard);
      cardContainer.prepend(cardElement);
      closeModal(newPostModal);
    });
  }
  handleSubmit(requestNewPost, event);
});

// Preview modal
closePreviewModalBtnEl.addEventListener("click", () =>
  closeModal(previewModal),
);

// Delete modal
deletePostCloseBtn.addEventListener("click", () => closeModal(deletePostModal));
deletePostCancelBtn.addEventListener("click", () =>
  closeModal(deletePostModal),
);

// ---------------------------
// Enable validation
// ---------------------------
enableValidation(settings);

// ---------------------------
// Initial render from API
// ---------------------------
api
  .getAppInfo()
  .then(([cards, user]) => {
    cards.forEach((card) => cardContainer.append(getCardElement(card)));

    profileNameEl.textContent = user.name;
    profileDescriptionEl.textContent = user.about;
    profileAvatarImgEl.src = user.avatar;
  })
  .catch((err) => console.error(err));
