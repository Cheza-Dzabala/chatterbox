import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";
import moxios from "moxios";
import { act } from "react-dom/test-utils";
import axiosInstance from "../../../utils/axios";

let container;
jest.setTimeout(10000);

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
  moxios.install(axiosInstance);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
  moxios.uninstall(axiosInstance);
});

test("Renders Login Page", async () => {
  act(() => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
      container
    );
  });
  const linkElement = screen.getByText(/Login/i);
  expect(linkElement).toBeInTheDocument();
  const emailInput = screen.getByLabelText("email");
  expect(emailInput).toBeInTheDocument();
});

test("Input occurrs properly", async (done) => {
  act(() => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>,
      container
    );
  });
  const errorResp = {
    status: 400,
    response: { message: "invalid data", data: "Invalid Data" },
  };
  await act(async () => {
    moxios.wait(function () {
      let request = moxios.requests.mostRecent();
      request.reject(errorResp);
    });
  });
  const email = screen.getByLabelText("email");
  const password = screen.getByLabelText("password");
  const submit = screen.getByLabelText("submit");

  fireEvent.change(email, { target: { value: "chezad@live.com" } });
  fireEvent.change(password, { target: { value: "12344" } });
  expect(password.value).toBe("12344");
  fireEvent.click(submit);
  done();
});
