import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import axiosInstance from "../../utils/axios";
import "./styles/styles.css";

const Register = () => {
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm();
  const [error, setError] = useState("");
  const onSubmit = async (data) => {
    setError("");
    axiosInstance
      .post("/register", data)
      .then((res) => {
        window.localStorage.setItem("user", JSON.stringify(res.data.data));
        history.push("/");
      })
      .catch(({ response }) => {
        setError(response.data.data);
      });
  };

  return (
    <div className="wrapper">
      <div className="auth-card">
        {error && (
          <div className="alert alert-error">
            {error}
            <AiOutlineCloseCircle
              onClick={() => setError("")}
              className="icon"
            />
          </div>
        )}
        <div className="heading">
          <h1>Register</h1>
          <p>Welcome! Sign up to get chatting</p>
        </div>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-field">
            <input
              placeholder="Full Name"
              name="name"
              className="input"
              type="text"
              ref={register({ required: "Please enter your name" })}
            />
            <span className="error">{errors.name?.message}</span>
          </div>
          <div className="form-field">
            <input
              placeholder="email"
              name="email"
              className="input"
              type="email"
              ref={register({ required: "Please enter your email address" })}
            />
            <span className="error">{errors.email?.message}</span>
          </div>
          <div className="form-field">
            <input
              placeholder="username (the name you will appear by)"
              name="username"
              className="input"
              type="text"
              ref={register({ required: "Please enter your username" })}
            />
            <span className="error">{errors.email?.message}</span>
          </div>

          <div className="form-field">
            <input
              placeholder="password"
              className="input"
              name="password"
              type="password"
              ref={register({ required: "Please enter your password" })}
            />
            <span className="error">{errors.password?.message}</span>
          </div>
          <div className="form-field">
            <input
              placeholder="Confirm Password"
              className="input"
              name="confirm_password"
              type="password"
              ref={register({ required: "Please confirm your password" })}
            />
            <span className="error">{errors.confirm_password?.message}</span>
          </div>

          <button className="button button-primary button-lg">Submit</button>
        </form>
        <Link to="/login" className="link">
          Login Instead
        </Link>
      </div>
    </div>
  );
};

export default Register;
