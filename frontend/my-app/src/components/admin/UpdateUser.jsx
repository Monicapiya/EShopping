import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import toast from "react-hot-toast";
import Loader from "../layouts/Loader";
import { useParams } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import { useNavigate } from "react-router-dom";
import { useGetUserDetailsQuery, useUpdateUserMutation } from "../../redux/api/userAPI";

const UpdateUser = () => {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
   
  const navigate = useNavigate();
  const params = useParams();

  const { data } = useGetUserDetailsQuery(params?.id);

  const [updateUser, { error, isSuccess, isLoading }] = useUpdateUserMutation();

  useEffect(() => {
    if (data?.user) {
      setName(data?.user?.name);
      setEmail(data?.user?.email);
      setRole(data?.user?.role);
    }
  }, [data]);
   
  useEffect(() => {
    if (error) {
      toast.error(error?.data?.message);
    }
    if (isSuccess) {
      toast.success("User Updated");
      navigate("/admin/users");
    }
  }, [error, isSuccess]);

  const submitHandler = (e) => {
    e.preventDefault();
    const userData = {
      name, 
      email,
      role,
    };
    updateUser({ id: params?.id, body: userData });
  };

  if (isLoading) return <Loader />;

  return (
    <AdminLayout>
      <MetaData title={"Update User"} />
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form className="shadow-lg" onSubmit={submitHandler}>
            <h2 className="mb-4">Update User</h2>
            {/* Form inputs */}
            <button type="submit" className="btn update-btn w-100 py-2">
              Update
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateUser;
