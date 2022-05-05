import { getByLabelText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../../../store";
import { BrowserRouter } from "react-router-dom";
import WriterPublication from "../writerPublication";
import WriterEditor from "../../writerEditor/writerEditor";

/* This is a test that checks the rendering of the Editor component. */

test("check whether renders Publication Component Correctly", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <WriterEditor />
      </BrowserRouter>
    </Provider>
  );
});
