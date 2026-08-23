import {
  useEffect,
  useState
} from "react";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3070";

function useTodos() {
  const [
    cardsHtml,
    setCardsHtml
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(true);

  const [
    error,
    setError
  ] = useState("");

  async function requestHtml(
    url,
    options = {}
  ) {
    try {
      setError("");

      const response =
        await fetch(
          url,
          options
        );

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message
        );
      }

      const html =
        await response.text();

      setCardsHtml(html);

      return true;
    } catch (error) {
      setError(
        error.message
      );

      return false;
    }
  }

  async function loadTodos() {
    setLoading(true);

    await requestHtml(
      `${API}/todos`
    );

    setLoading(false);
  }

  async function addTodo(todo) {
    return requestHtml(
      `${API}/todos`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(todo),
      }
    );
  }

  async function deleteTodo(id) {
    return requestHtml(
      `${API}/todos/${id}`,
      {
        method: "DELETE",
      }
    );
  }

  async function updateTodo(
    id,
    todo
  ) {
    return requestHtml(
      `${API}/todos/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(todo),
      }
    );
  }

  useEffect(() => {
    loadTodos();
  }, []);

  return {
    cardsHtml,
    loading,
    error,

    addTodo,
    deleteTodo,
    updateTodo,
    loadTodos,
  };
}

export default useTodos;