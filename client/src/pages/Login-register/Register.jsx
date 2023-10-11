import "./Login-register.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/User/UserContext";
import Notification from "../../components/Notification/Notification";
import { NOTIFICATION_STATES } from "../../components/Notification/notificationStates";

const Register = () => {
  const server = process.env.REACT_APP_HOST_URL;
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    number: "",
  });

  const { name, email, password, address, number } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    state: "",
    message: "",
  });

  const navigate = useNavigate();

  const signUp = async (e) => {
    e.preventDefault();
    try {
      if (name && email && password && address && number) {
        setNotificationData({
          ...notificationData,
          message: "Loading",
          state: NOTIFICATION_STATES.LOAD,
        });
        setShowNotification(true);
        const body = { name, email, password, address, number };
        const response = await fetch(`${server}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const parseRes = await response.json();
        setShowNotification(false);
        if (parseRes.token) {
          localStorage.setItem("token", parseRes.token);
          localStorage.setItem("user_id", parseRes.user.id);
          setUser({
            ...user,
            status: {
              ...user.status,
              isLoggedIn: true,
              user_id: parseRes.user.id,
              token: parseRes.token,
            },
          });
          navigate("/");
        } else {
          setInputs({ ...inputs, email: "", password: "" });
          setNotificationData({
            ...notificationData,
            message: "email already exists",
            state: NOTIFICATION_STATES.ERROR,
          });
          setShowNotification(true);

          setTimeout(() => setShowNotification(false), 3000);
        }
      } else {
        setNotificationData({
          ...notificationData,
          message: "please fill all the inputs",
          state: NOTIFICATION_STATES.INFO,
        });
        setShowNotification(true);

        setTimeout(() => setShowNotification(false), 3000);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) navigate("/");
  }, []);

  return (
    <>
      {showNotification && (
        <Notification
          message={notificationData.message}
          state={notificationData.state}
        />
      )}
      <div className="login_register-form_container">
        <form className="form" onSubmit={signUp}>
          <p className="form-title">Sign in to your account</p>
          <div className="input-container">
            <input
              className="input"
              type="text"
              name="name"
              placeholder="name"
              value={name}
              onChange={(e) => onChange(e)}
            />
            <span></span>
          </div>

          <div className="input-container">
            <input
              className="input"
              type="email"
              name="email"
              placeholder="email"
              value={email}
              onChange={(e) => onChange(e)}
            />
            <span></span>
          </div>

          <div className="input-container">
            <input
              className="input"
              type="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className="input-container">
            <input
              className="input"
              type="text"
              name="address"
              placeholder="address"
              value={address}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className="input-container">
            <input
              className="input"
              type="number"
              name="number"
              placeholder="number"
              value={number}
              onChange={(e) => onChange(e)}
            />
          </div>

          <button type="submit" className="button-primary">
            Sign up
          </button>

          <p className="signup-link">
            already have an account?
            <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
