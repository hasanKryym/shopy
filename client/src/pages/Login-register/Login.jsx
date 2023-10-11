import "./Login-register.css";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/User/UserContext";
import Notification from "../../components/Notification/Notification";
import { NOTIFICATION_STATES } from "../../components/Notification/notificationStates";

const Login = () => {
  const server = process.env.REACT_APP_HOST_URL;
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({
    state: "",
    message: "",
  });

  const navigate = useNavigate();

  const signIn = async (e) => {
    e.preventDefault();
    try {
      if (email && password) {
        setNotificationData({
          ...notificationData,
          message: "Loading",
          state: NOTIFICATION_STATES.LOAD,
        });
        setShowNotification(true);
        const body = { email, password };

        const response = await fetch(`${server}/auth/login`, {
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
            message: "Invalid email/password combination",
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
        <form className="form" onSubmit={signIn}>
          <p className="form-title">Sign in to your account</p>
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

          <button type="submit" className="button-primary">
            Sign in
          </button>

          <p className="signup-link">
            No account?
            <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
