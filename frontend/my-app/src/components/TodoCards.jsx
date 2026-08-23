function TodoCards({
  html,
  onDelete,
  onUpdate
}) {
  async function handleClick(
    event
  ) {
    const button =
      event.target.closest(
        "button[data-action]"
      );

    if (!button) {
      return;
    }

    const card =
      button.closest(
        ".card"
      );

    if (!card) {
      return;
    }

    const id =
      card.dataset.id;

    const action =
      button.dataset.action;

    const normalArea =
      card.querySelector(
        ".normal-area"
      );

    const editArea =
      card.querySelector(
        ".edit-area"
      );

    if (
      action === "edit"
    ) {
      normalArea.hidden = true;
      editArea.hidden = false;

      return;
    }

    if (
      action === "cancel"
    ) {
      normalArea.hidden = false;
      editArea.hidden = true;

      return;
    }

    if (
      action === "delete"
    ) {
      await onDelete(id);

      return;
    }

    if (
      action === "save"
    ) {
      const category =
        editArea
          .querySelector(
            ".edit-category"
          )
          .value;

      const contain =
        editArea
          .querySelector(
            ".edit-contain"
          )
          .value
          .trim();

      const datum =
        editArea
          .querySelector(
            ".edit-datum"
          )
          .value;

      const important =
        editArea
          .querySelector(
            ".edit-important"
          )
          .checked;

      if (!contain) {
        return;
      }

      await onUpdate(
        id,
        {
          category,
          contain,
          datum,
          important,
        }
      );
    }
  }

  return (
    <div
      className="cards"

      onClick={handleClick}

      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}

export default TodoCards;