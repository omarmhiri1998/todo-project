
import { useState } from "react";

import TodoForm from "./components/TodoForm";
import TodoCards from "./components/TodoCards";
import Login from "./components/Login";
import Signup from "./components/Signup";

import useTodos from "./hooks/useTodos";

import "./App.css";

function App() {
  const [authPage, setAuthPage] =
    useState("login");

  const [isLoggedIn, setIsLoggedIn] =
    useState(() => {
      return Boolean(
        localStorage.getItem("token")
      );
    });

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

  const [showMobileForm, setShowMobileForm] =
    useState(false);

  async function handleAddTodo(todo) {
    const success = await addTodo(todo);

    if (success) {
      setShowMobileForm(false);
    }

    return success;
  }

  function handleLogout() {
    localStorage.removeItem("token");

    setIsLoggedIn(false);
    setAuthPage("login");
    setShowMobileForm(false);
  }

  if (!isLoggedIn) {
    if (authPage === "signup") {
      return (
        <Signup
          onSwitch={() =>
            setAuthPage("login")
          }
        />
      );
    }

    return (
      <Login
        onSwitch={() =>
          setAuthPage("signup")
        }
        onLogin={() =>
          setIsLoggedIn(true)
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
          onClick={handleLogout}
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
            setShowMobileForm(false)
          }
        >
          ← Back
        </button>

        <TodoForm
          onAdd={handleAddTodo}
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
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        )}
      </div>

      {!showMobileForm && (
        <button
          type="button"
          className="mobile-add-button"
          onClick={() =>
            setShowMobileForm(true)
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

