import { getByLabelText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../../../store";
import { BrowserRouter } from "react-router-dom";
import LoginSignupLanding from "../loginSignupLanding";

/* This is a test that checks the rendering of the loginSignUp component. */

test("renders loginSignUp Component Correctly", () => {
  let root = document.createElement("div");

  render(
    <Provider store={store}>
      <BrowserRouter>
        <LoginSignupLanding />
      </BrowserRouter>
    </Provider>
  );

  const usernameField = screen.getByLabelText("Username/Email/Phone");
  const passwordField = screen.getByLabelText("Password");

  userEvent.type(usernameField, "Test");
  userEvent.type(passwordField, "Test@123");

  expect(usernameField).toHaveValue("Test");
  expect(passwordField).toHaveValue("Test@123");

  userEvent.click(screen.getByRole('button',  {
    name: 'Login',
  }))
});
