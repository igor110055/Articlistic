import { getByLabelText, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import store from "../../../store";
import { BrowserRouter } from "react-router-dom";
import WriterPublication from "../writerPublication";

/* This is a test that checks the rendering of the Publication component. */

test("check whether renders Publication Component Correctly", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <WriterPublication />
      </BrowserRouter>
    </Provider>
  );

  const zeroPublicationCheck = screen.getByText(
    "Create Your First Publication"
  );
  expect(zeroPublicationCheck).toBeInTheDocument();

  const publicationBtn = screen.getByRole("button");
  expect(publicationBtn).toBeEnabled();

  userEvent.click(publicationBtn);

  const publicationFormAppears = screen.getByRole("button", { name: "Save" });
  expect(publicationFormAppears).toBeInTheDocument();
});

test("Check if update publication Form appears", async () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <WriterPublication />
      </BrowserRouter>
    </Provider>
  );

  const publicationBtn = screen.getByRole("button", {
    name: "Create Your First Publication 🎉",
  });
  userEvent.click(publicationBtn);

  let publicationName = await screen.getByLabelText('Publication Name *');
  const cancelButton = screen.getByRole("button", { name: "Cancel" });

  userEvent.type(publicationName, "Test Publication");
  expect(publicationName).toHaveValue('Test Publication')

  
});
