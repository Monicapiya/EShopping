import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../redux/api/userAPI";
import toast from "react-hot-toast";
import MetaData from "../layouts/MetaData";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');

  const [resetPassword, {isLoading, error, isSuccess}] = useResetPasswordMutation();
  const {isAuthenticated} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if(isAuthenticated) {
      navigate("/");
    }
    if (error) {
      toast.error(error?.data?.message);
    }
    if(isSuccess) {
      toast.success("Password has been reset");
      navigate("/login");
    }
  }, [error, isAuthenticated, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    if(password !== confirm_password){
      return toast.error("Passwords don't match. Please try again!");
    }
    const data = {password, confirm_password};
    resetPassword({token: params?.token, body: data});
  };

  return (
    <> 
      <MetaData  title={"Reset Password"}/> 
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow rounded bg-body" onSubmit={submitHandler}>
            <h2 className="mb-4">New Password</h2>
            <div className="mb-3">
              <label htmlFor="password_field" className="form-label">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirm_password_field" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirm_password_field"
                className="form-control"
                name="confirm_password"
                value={confirm_password}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button id="new_password_button" type="submit" className="btn w-100 py-2" disabled={isLoading}>
              Set Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
