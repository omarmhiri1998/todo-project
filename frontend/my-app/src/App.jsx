import {
  useEffect,
  useState
} from "react";

import TodoForm
  from "./components/TodoForm";

import TodoCards
  from "./components/TodoCards";

import Login
  from "./components/Login";

import Signup
  from "./components/Signup";

import useTodos
  from "./hooks/useTodos";

import "./App.css";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3070";

function App() {
  const [
    authPage,
    setAuthPage
  ] = useState("login");

  const [
    isLoggedIn,
    setIsLoggedIn
  ] = useState(false);

  const [
    checkingSession,
    setCheckingSession
  ] = useState(true);

  const [
    showMobileForm,
    setShowMobileForm
  ] = useState(false);

  const {
    cardsHtml,
    loading,
    error,
    addTodo,
    deleteTodo,
    updateTodo,
  } = useTodos(
    isLoggedIn,

    () => {
      setIsLoggedIn(false);
      setAuthPage("login");
    }
  );

  useEffect(() => {

    localStorage.removeItem(
      "token"
    );

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

    async function checkSession() {
      try {
        let response =
          await fetch(
            `${API}/session`,
            {
              credentials:
                "include"
            }
          );

        if (
          response.status === 401
        ) {
          const refreshed =
            await refreshAccessToken();

          if (refreshed) {
            response =
              await fetch(
                `${API}/session`,
                {
                  credentials:
                    "include"
                }
              );
          }
        }

        setIsLoggedIn(
          response.ok
        );

      } catch {
        setIsLoggedIn(
          false
        );

      } finally {
        setCheckingSession(
          false
        );
      }
    }

    checkSession();

  }, []);

  async function handleAddTodo(
    todo
  ) {
    const success =
      await addTodo(todo);

    if (success) {
      setShowMobileForm(
        false
      );
    }

    return success;
  }

  async function handleLogout() {
    try {
      const response =
        await fetch(
          `${API}/logout`,
          {
            method: "POST",

            credentials:
              "include"
          }
        );

      if (!response.ok) {
        return;
      }

      setIsLoggedIn(false);

      setAuthPage(
        "login"
      );

      setShowMobileForm(
        false
      );

    } catch (error) {
      console.error(
        "Logout failed:",
        error
      );
    }
  }

  if (checkingSession) {
    return (
      <p className="loading">
        Loading...
      </p>
    );
  }

  if (!isLoggedIn) {
    if (
      authPage === "signup"
    ) {
      return (
        <Signup
          onSwitch={() =>
            setAuthPage(
              "login"
            )
          }
        />
      );
    }

    return (
      <Login
        onSwitch={() =>
          setAuthPage(
            "signup"
          )
        }

        onLogin={() =>
          setIsLoggedIn(
            true
          )
        }
      />
    );
  }

  return (
    <div
      className={
        showMobileForm
          ? "container mobile-form-open"
          : "container"
      }
    >

      <div className="todo-top-bar">
        <button
          type="button"
          className="logout-button"
          onClick={
            handleLogout
          }
        >
          Logout
        </button>
      </div>

      <div className="logo">
        <img
          src="/images/Gemini_Generated_Image_gnely6gnely6gnel-removebg-preview.png"
          alt="Todo Logo"
        />
      </div>

      <div
        className={
          showMobileForm
            ? "todo-form-wrapper open"
            : "todo-form-wrapper"
        }
      >
        <button
          type="button"
          className="mobile-back-button"
          onClick={() =>
            setShowMobileForm(
              false
            )
          }
        >
          ← Back
        </button>

        <TodoForm
          onAdd={
            handleAddTodo
          }
        />
      </div>

      {error && (
        <p className="error">
          {error}
        </p>
      )}

      <div className="todo-list-wrapper">

        {loading ? (
          <p className="loading">
            Loading...
          </p>
        ) : (
          <TodoCards
            html={cardsHtml}
            onDelete={
              deleteTodo
            }
            onUpdate={
              updateTodo
            }
          />
        )}

      </div>

      {!showMobileForm && (
        <button
          type="button"
          className="mobile-add-button"
          onClick={() =>
            setShowMobileForm(
              true
            )
          }
          aria-label="Add Todo"
        >
          +
        </button>
      )}

    </div>
  );
}

export default App;