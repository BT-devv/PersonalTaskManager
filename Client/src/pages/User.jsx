import { useNavigate, useParams } from "react-router-dom";
import {
  useFetchUserQuery,
  useUpdateUserMutation,
  useLogoutMutation,
} from "../redux/slices/apiSlice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../redux/slices/authSlice";
const UserProfile = () => {
  const { userId } = useParams(); // Lấy userId từ URL
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log("hello", userId);

  // Truy vấn dữ liệu người dùng từ API
  const {
    data: user,
    error,
    isLoading,
  } = useFetchUserQuery(userId, {
    skip: !userId, // Bỏ qua nếu userId không tồn tại
  });

  const [updateUser] = useUpdateUserMutation(); // lấy mutation cho update user
  const [logout] = useLogoutMutation(); // lấy mutation cho logout

  // State để quản lý dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    role: "",
    email: "",
    password: "",
  });

  // Khi nhận được dữ liệu người dùng, cập nhật formData
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        title: user.title || "",
        role: user.role || "",
        email: user.email || "",
        password: "", // Giữ trống vì không lấy từ API
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating user...");
      await updateUser({ userId, userData: formData }).unwrap();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("There was an error updating your profile.");
    }
  };

  const handleLogout = async () => {
    try {
      console.log("Logging out...");
      await logout().unwrap();
      dispatch(logoutAction());
      navigate("/log-in");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("There was an error logging out.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">User Profile</h1>
        <button
          onClick={handleLogout}
          className="p-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors"
        >
          Logout
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-3xl">
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Role
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-lg font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
              placeholder="Leave blank to keep current password"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 p-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UserProfile;
