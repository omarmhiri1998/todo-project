import { useState } from "react";

import TodoForm from "./components/TodoForm";
import TodoCards from "./components/TodoCards";
import useTodos from "./hooks/useTodos";

import "./App.css";

function App() {
  const {
    cardsHtml,
    loading,
    error,
    addTodo,
    deleteTodo,
    updateTodo,
  } = useTodos();


  // false = Todo List
  // true = Add Todo Form
  const [showMobileForm, setShowMobileForm] =
    useState(false);


  async function handleAddTodo(todo) {
    const success = await addTodo(todo);

    if (success) {
 
      setShowMobileForm(false);
    }

    return success;
  }


  return (
    <div
      className={
        showMobileForm
          ? "container mobile-form-open"
          : "container"
      }
    >

      {/* LOGO */}

      <div className="logo">
        <img
          src="/images/Gemini_Generated_Image_gnely6gnely6gnel-removebg-preview.png"
          alt="Todo Logo"
        />
      </div>


      {/* ADD TODO FORM */}

      <div
        className={
          showMobileForm
            ? "todo-form-wrapper open"
            : "todo-form-wrapper"
        }
      >

        {/* BACK BUTTON - MOBILE ONLY */}

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


      {/* ERROR */}

      {error && (
        <p className="error">
          {error}
        </p>
      )}


      {/* TODO LIST */}

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


      {/* FLOATING ADD BUTTON - MOBILE ONLY */}

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