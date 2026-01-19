function setButtonTextLoading(
  button,
  isLoading,
  defaultText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = defaultText;
  }
}

function handleSubmit(request, event, loadingText = "Saving...") {
  event.preventDefault();
  const submitButton = event.submitter;
  const initialText = submitButton.textContent;
  setButtonTextLoading(submitButton, true, initialText, loadingText);
  request()
    .then(() => {
      event.target.reset();
    })
    .catch(console.error)
    .finally(() => {
      setButtonTextLoading(submitButton, false, initialText);
    });
}

export { setButtonTextLoading, handleSubmit };
