import {
  useState
} from "react";

function TodoForm({
  onAdd
}) {
  const [
    category,
    setCategory
  ] = useState("work");

  const [
    contain,
    setContain
  ] = useState("");

  const [
    datum,
    setDatum
  ] = useState("");

  const [
    important,
    setImportant
  ] = useState(false);

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (
      contain.trim() === ""
    ) {
      return;
    }

    const success =
      await onAdd({
        category,
        contain:
          contain.trim(),
        datum,
        important,
      });

    if (!success) {
      return;
    }

    setCategory("work");
    setContain("");
    setDatum("");
    setImportant(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
    >

      <div className="choose">

        <label
          htmlFor="category"
        >
          Choose a category:
        </label>

        <select
          id="category"

          value={category}

          onChange={
            (event) =>
              setCategory(
                event.target.value
              )
          }
        >

          <option value="work">
            Work
          </option>

          <option value="studys">
            Studys
          </option>

          <option value="sport">
            Sport
          </option>

          <option value="health">
            Health
          </option>

          <option value="voyage">
            Voyage
          </option>

        </select>

      </div>

      <label
        htmlFor="contain"
      >
        What do you want to do?
      </label>

      <input
        type="text"
        id="contain"

        value={contain}

        onChange={
          (event) =>
            setContain(
              event.target.value
            )
        }
      />

      <div className="time">

        <label
          htmlFor="datum"
        >
          When?
        </label>

        <input
          type="date"
          id="datum"

          value={datum}

          onChange={
            (event) =>
              setDatum(
                event.target.value
              )
          }
        />

      </div>

      <div className="cheker">

        <input
          type="checkbox"
          id="check"

          checked={important}

          onChange={
            (event) =>
              setImportant(
                event.target.checked
              )
          }
        />

        <label
          htmlFor="check"
        >
          Important
        </label>

      </div>

      <input
        type="submit"
        value="Add +"
      />

    </form>
  );
}

export default TodoForm;