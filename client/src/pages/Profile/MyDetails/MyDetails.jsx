import "./MyDetails.css";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/User/UserContext";
import Loader from "../../../components/Loader/Loader";
import { updateUser } from "../../../data/updatingData";
import { toast } from "react-toastify";

const MyDetails = () => {
  const { userData } = useContext(UserContext);
  const [user, setUser] = userData;
  const [isLoading, setIsLoading] = useState(true);
  const [inputs, setInputs] = useState({
    name: user.data.name,
    email: user.data.email,
    address: user.data.address,
    number: user.data.number,
    role: {
      position: user.data.role.position,
      company: user.data.role.company,
    },
  });

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setInputs(user.data);
    setIsLoading(false);
  }, [user]);

  // useEffect(() => {
  //   if (inputs.name) setIsLoading(false);
  // }, [inputs]);

  const saveUser = () => {
    if (!inputs.name || !inputs.email || !inputs.address || !inputs.number) {
      toast.info("please fill all the inputs");
      return;
    }
    if (user.data === inputs) return;

    // setUser({ ...user, data: inputs });
    setUser((prevState) => {
      return { ...prevState, data: inputs };
    });

    updateUser(user.status.user_id, inputs);
    toast.success("user updated successfully");
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="user_details">
          <div className="userDetails_input">
            <label htmlFor="name">Full Name</label>
            <br />
            <input
              name="name"
              id="name"
              type="text"
              className="input"
              value={inputs.name}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className="userDetails_input">
            <label htmlFor="email">email</label>
            <br />
            <input
              readOnly
              name="email"
              id="email"
              type="email"
              className="input"
              value={inputs.email}
            />
          </div>

          <div className="userDetails_input">
            <label htmlFor="address">address</label>
            <br />
            <input
              name="address"
              id="address"
              type="text"
              className="input"
              value={inputs.address}
              onChange={(e) => onChange(e)}
            />
          </div>

          <div className="userDetails_input">
            <label htmlFor="number">number</label>
            <br />
            <input
              name="number"
              id="number"
              type="number"
              className="input"
              value={inputs.number}
              onChange={(e) => onChange(e)}
            />
          </div>

          <button
            onClick={() => saveUser()}
            className="button-primary save_profile-button"
          >
            save
          </button>
        </div>
      )}
    </>
  );
};

export default MyDetails;
