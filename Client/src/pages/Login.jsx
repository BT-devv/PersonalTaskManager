/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLoginMutation } from "../redux/slices/userAPISlice"; // Ensure this path is correct
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { setCredentials } from "../redux/slices/authSlice";

const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const [errorMessage, setErrorMessage] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const submitHandler = async (data) => {
    try {
      const userData = await login(data).unwrap();
      dispatch(setCredentials(userData));
      localStorage.setItem("userInfo", JSON.stringify(userData));
      navigate("/workspacesList"); // Redirect to WorkspaceList page after login
    } catch (error) {
      console.error("Login failed:", error); // Log the entire error object
      if (error?.status === 404) {
        setErrorMessage("Account does not exist. Please sign up.");
      } else if (error?.status === 401) {
        setErrorMessage("Incorrect password. Please try again.");
      } else if (error?.status === 400) {
        setErrorMessage("Bad request. Please check your input.");
      } else {
        setErrorMessage("Login failed. Please check your credentials.");
      }
    }
  };

  useEffect(() => {
    if (user) navigate("/workspacesList"); // Redirect if user is already logged in
  }, [user, navigate]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
      <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
        <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
          <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
            <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600">
              Manage all your tasks in one place!
            </span>
            <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
              <span>Personal Task Manager</span>
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
          >
            <div>
              <p className="text-blue-600 text-3xl font-bold text-center">
                Welcome to PTM!
              </p>
              <p className="text-center text-base text-gray-700">
                Keep all your tasks done.
              </p>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            <div className="flex flex-col gap-y-5">
              <Textbox
                placeholder="email@example.com"
                type="email"
                name="email"
                label="Email Address"
                className="w-full rounded-md"
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder="Your Password"
                type="password"
                name="password"
                label="Password"
                className="w-full rounded-md"
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />
              <span className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer">
                Forget Password?
              </span>
              <Button
                type="Submit"
                label={isLoading ? "Logging in..." : "Submit"}
                className="w-full h-12 bg-blue-700 text-white rounded-md"
              />
            </div>
            <div className="text-center">
              <Link to="/register" className="text-blue-600 hover:underline">
                Don't have an account? Sign up here.
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
