import React from "react";
import "../style/Login.css";
import RoomIcon from "@mui/icons-material/Room";
import { Cancel } from "@mui/icons-material";
import { useRef } from "react";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post(
        import.meta.env.VITE_BASE_URL + "calls/users/login",
        user
      );
      myStorage.setItem("user", res.data.username);
      setCurrentUser(res.data.username);
      setShowLogin(false);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="loginContainer">
      <div className="logo">
        <RoomIcon />
        MapIN
      </div>
      <form className="shift" onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" ref={nameRef} />
        <input type="password" placeholder="password" ref={passwordRef} />
        <button className="loginBtn">Login</button>
      </form>
      <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
};

export default Login;
