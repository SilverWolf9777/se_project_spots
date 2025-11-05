const profileNameEl = document.querySelector(".profile__title");
const profileDescriptionEl = document.querySelector(".profile__description");

const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileBtn = document.querySelector(".profile__edit-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input"
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input"
);
const editProfileSubmitBtn =
  editProfileModal.querySelector(".modal__submit-btn");

const newPostModal = document.querySelector("#new-post-modal");
const newPostBtn = document.querySelector(".profile__add-btn");
const newPostForm = newPostModal.querySelector(".modal__form");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");
const newPostImgInput = newPostModal.querySelector("#card-image-input");
const newPostCaptionInput = newPostModal.querySelector("#card-caption-input");
const newPostSubmitBtn = editProfileModal.querySelector(".modal__submit-btn");

editProfileBtn.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  openModal(editProfileModal);
});

function openModal(modal) {
  modal.classList.add("modal_is-opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
}

editProfileCloseBtn.addEventListener("click", function () {
  closeModal(editProfileModal);
});

editProfileForm.addEventListener("submit", handleEditProfileSubmit);

function handleEditProfileSubmit(event) {
  event.preventDefault();
  profileNameEl.textContent = editProfileNameInput.value;
  profileDescriptionEl.textContent = editProfileDescriptionInput.value;
  closeModal(editProfileModal);
}

newPostBtn.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", function () {
  closeModal(newPostModal);
});

newPostForm.addEventListener("submit", handleNewPostSubmit);

function handleNewPostSubmit(event) {
  console.log(newPostImgInput.value);
  console.log(newPostCaptionInput.value);
  event.preventDefault();
  closeModal(newPostModal);
}
