import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axiosInstance from "../../utils/axios";
import "./styles/styles.css";

const Login = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const [error, setError] = useState("");
  const onSubmit = async (data) => {
    console.log(data);
    setError("");
    axiosInstance
      .post("/login", data)
      .then((res) => {
        window.localStorage.setItem("user", JSON.stringify(res.data.data));
        history.push("/");
      })
      .catch(({ response }) => {
        console.log(data);
        setError(response.data.data);
      });
  };

  return (
    <div className="wrapper">
      <div className="auth-card">
        {error && (
          <div className="alert alert-error" aria-label="error">
            {error}
            <AiOutlineCloseCircle
              onClick={() => setError("")}
              className="icon"
            />
          </div>
        )}
        <div className="heading">
          <h1>Login</h1>
          <p>Welcome! Sign in to get chatting</p>
        </div>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <input
              placeholder="email"
              name="email"
              className="input"
              type="email"
              aria-label="email"
              ref={register({ required: "Please enter your email address" })}
            />
            <span className="error">{errors.email?.message}</span>
          </div>
          <div className="form-field">
            <input
              placeholder="password"
              className="input"
              name="password"
              aria-label="password"
              type="password"
              ref={register({ required: "Please enter your password" })}
            />
            <span className="error">{errors.password?.message}</span>
          </div>
          <button
            aria-label="submit"
            className="button button-primary button-lg"
          >
            Submit
          </button>
        </form>
        <Link to="/register" className="link">
          Register for the service
        </Link>
      </div>
    </div>
  );
};

export default Login;
