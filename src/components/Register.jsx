import React from "react";
import "../style/Register.css";
import RoomIcon from "@mui/icons-material/Room";
import { Cancel } from "@mui/icons-material";
import { useRef } from "react";
import axios from "axios";

const Register = ({ setShowRegister }) => {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newUser = {
      username: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post(
        import.meta.env.VITE_BASE_URL + "calls/users/signup",
        newUser
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="registerContainer">
      <div className="logo">
        <RoomIcon />
        MapIN
      </div>
      <form className="shift" onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="email" placeholder="email" ref={emailRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="registerBtn">Register</button>
      </form>
      <Cancel
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
    </div>
  );
};

export default Register;
