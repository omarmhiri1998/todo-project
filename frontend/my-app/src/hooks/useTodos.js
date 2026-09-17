import {
  useEffect,
  useState
} from "react";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3070";

function useTodos(
  isLoggedIn,
  onUnauthorized
) {
  const [
    cardsHtml,
    setCardsHtml
  ] = useState("");

  const [
    loading,
    setLoading
  ] = useState(false);

  const [
    error,
    setError
  ] = useState("");

  async function refreshAccessToken() {
    try {
      const response =
        await fetch(
          `${API}/refresh`,
          {
            method: "POST",

            credentials:
              "include"
          }
        );

      return response.ok;

    } catch {
      return false;
    }
  }

  async function requestHtml(
    url,
    options = {},
    canRetry = true
  ) {
    try {
      setError("");

      const response =
        await fetch(
          url,
          {
            ...options,

            credentials:
              "include",

            headers: {
              ...options.headers
            }
          }
        );

      if (
        response.status === 401 &&
        canRetry
      ) {
        const refreshed =
          await refreshAccessToken();

        if (refreshed) {
          return requestHtml(
            url,
            options,
            false
          );
        }
      }

      if (
        response.status === 401
      ) {
        setCardsHtml("");

        onUnauthorized();

        return false;
      }

      if (!response.ok) {
        const message =
          await response.text();

        throw new Error(
          message
        );
      }

      const html =
        await response.text();

      setCardsHtml(
        html
      );

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

  async function addTodo(
    todo
  ) {
    return requestHtml(
      `${API}/todos`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json"
        },

        body:
          JSON.stringify(
            todo
          )
      }
    );
  }

  async function deleteTodo(
    id
  ) {
    return requestHtml(
      `${API}/todos/${id}`,
      {
        method: "DELETE"
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
            "application/json"
        },

        body:
          JSON.stringify(
            todo
          )
      }
    );
  }

  useEffect(() => {
    if (isLoggedIn) {
      loadTodos();
    }
  }, [isLoggedIn]);

  return {
    cardsHtml,
    loading,
    error,

    addTodo,
    deleteTodo,
    updateTodo,
    loadTodos
  };
}

export default useTodos;