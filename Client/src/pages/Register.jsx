import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../redux/slices/userAPISlice";
import { setCredentials } from "../redux/slices/authSlice";
import Textbox from "../components/Textbox";
import Button from "../components/Button";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const submitHandler = async (data) => {
    try {
      const userData = await registerUser(data).unwrap();
      dispatch(setCredentials(userData));
      localStorage.setItem("userInfo", JSON.stringify(userData));
      navigate("/workspacesList"); // Redirect to WorkspaceList page after registration
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#f3f4f6]">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-40">
        {/* Right Side */}
        <div className="text-center lg:text-left lg:w-2/3">
          <h1 className="text-4xl md:text-6xl font-black text-blue-700">
            Personal Task Manager
          </h1>
          <p className="text-gray-600 mt-4">
            Manage all your tasks in one place!
          </p>
        </div>
        {/* Left Side - Registration Form */}
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-center text-blue-600">
                Create your account!
              </h2>
              <p className="text-center text-gray-700 mt-2">
                Join us to manage all your tasks.
              </p>
            </div>

            {/* Name Field */}
            <Textbox
              placeholder="Your Name"
              type="text"
              label="Name"
              className="w-full"
              register={register("name", {
                required: "Name is required!",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters long",
                },
              })}
              error={errors.name?.message}
            />

            {/* Email Field */}
            <Textbox
              placeholder="email@example.com"
              type="email"
              label="Email Address"
              className="w-full"
              register={register("email", {
                required: "Email Address is required!",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: "Invalid email address format",
                },
              })}
              error={errors.email?.message}
            />

            {/* Password Field */}
            <Textbox
              placeholder="Your Password"
              type="password"
              label="Password"
              className="w-full"
              register={register("password", {
                required: "Password is required!",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters long",
                },
              })}
              error={errors.password?.message}
            />

            {/* Confirm Password Field */}
            <Textbox
              placeholder="Confirm Password"
              type="password"
              label="Confirm Password"
              className="w-full"
              register={register("confirmPassword", {
                required: "Please confirm your password!",
                validate: (value) =>
                  // eslint-disable-next-line no-undef
                  value === watch("password") || "Passwords do not match!",
              })}
              error={errors.confirmPassword?.message}
            />

            {/* Role Field */}
            <Textbox
              placeholder="Role (e.g., member, admin)"
              type="text"
              label="Role"
              className="w-full"
              register={register("role", {
                required: "Role is required!",
              })}
              error={errors.role?.message}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              label={isLoading ? "Registering..." : "Register"}
              className="w-full h-12 bg-blue-700 text-white rounded-md"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
