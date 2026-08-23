const categoryData = {
  work: {
    image: "/images/business-man-icon-working-at-his-office-desk-flat-illustration-isolated-on-white-background-vector.jpg",
    color: "#ffcccc",
  },

  studys: {
    image: "/images/566985.png",
    color: "#d9ccff",
  },

  sport: {
    image: "/images/2553625.png",
    color: "#ffe0b3",
  },

  health: {
    image: "/images/913382.png",
    color: "#ccf2d6",
  },

  voyage: {
    image: "/images/3125792.png",
    color: "#cceeff",
  },
};


function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function createCategoryOptions(currentCategory) {
  const categories = [
    "work",
    "studys",
    "sport",
    "health",
    "voyage",
  ];

  return categories
    .map((category) => {

      const selected =
        category === currentCategory
          ? "selected"
          : "";

      return `
        <option
          value="${category}"
          ${selected}
        >
          ${category}
        </option>
      `;
    })
    .join("");
}


function renderCard(todo) {
  const category =
    categoryData[todo.category] ||
    categoryData.work;

  const backgroundColor =
    todo.important
      ? category.color
      : "white";

  const checked =
    todo.important
      ? "checked"
      : "";

  return `
    <div
      class="card"
      data-id="${escapeHtml(todo.id)}"
      style="background-color: ${backgroundColor}"
    >

      <div class="card-logo">

        <img
          class="category-image"
          src="${category.image}"
          alt="${escapeHtml(todo.category)}"
        >

      </div>


      <div class="content">


        <!-- NORMAL MODE -->

        <div class="normal-area">

          <div class="descrip">

            <h1>
              ${escapeHtml(todo.contain)}
            </h1>

            <h2>
              ${escapeHtml(todo.datum)}
            </h2>

          </div>


          <div class="buttons">

            <button
              type="button"
              class="minus"
              data-action="delete"
              title="Delete"
            ></button>

            <button
              type="button"
              class="modivier"
              data-action="edit"
              title="Edit"
            ></button>

          </div>

        </div>


        <!-- EDIT MODE -->

        <div
          class="edit-area"
          hidden
        >

          <select class="edit-category">

            ${createCategoryOptions(
              todo.category
            )}

          </select>


          <input
            type="text"
            class="edit-contain"
            value="${escapeHtml(todo.contain)}"
          >


          <input
            type="date"
            class="edit-datum"
            value="${escapeHtml(todo.datum)}"
          >


          <label>

            <input
              type="checkbox"
              class="edit-important"
              ${checked}
            >

            Important

          </label>


          <!-- SAVE + CANCEL ALWAYS TOGETHER -->

          <div class="edit-actions">

            <button
              type="button"
              class="save"
              data-action="save"
            >
              Save
            </button>


            <button
              type="button"
              class="cancel"
              data-action="cancel"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

    </div>
  `;
}


function renderCards(todos) {
  if (todos.length === 0) {
    return `
      <div class="empty">
        No todos yet.
      </div>
    `;
  }

  return todos
    .map((todo) => renderCard(todo))
    .join("");
}


module.exports = {
  renderCards,
};