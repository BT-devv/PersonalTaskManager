import { MdOutlineAddTask, MdOutlineWorkspacePremium } from "react-icons/md";
import {
  SearchOutlined,
  NotificationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu, Button, Dropdown } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const items = [
  {
    key: "/search",
    label: "Search",
    icon: <SearchOutlined />,
  },
  {
    key: "/notification",
    label: "Notification",
    icon: <NotificationOutlined />,
  },
  {
    key: "/assign-to-me",
    label: "Assign to me",
    icon: <UserOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "grp",
    label: (
      <div className="flex justify-between items-center w-full  ">
        <span>Space</span>
        <div className="flex space-x-1">
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="1" onClick={() => console.log("Option 1")}>
                  Option 1
                </Menu.Item>
                <Menu.Item key="2" onClick={() => console.log("Option 2")}>
                  Option 2
                </Menu.Item>
              </Menu>
            }
            trigger={["click"]}
          >
            <Button
              type="link"
              icon={<EllipsisOutlined className="text-gray-500 " />}
              className="text-gray-500"
            />
          </Dropdown>
        </div>
      </div>
    ),
    type: "group",
    children: [
      {
        key: "/space",
        label: (
          <div className="flex gap-2">
            <MdOutlineWorkspacePremium className="flex mt-3 text-sm" />
            <span>First Space </span>
          </div>
        ),
      },
      {
        key: "/space/space-setting",
        label: "Space Setting",
      },
      {
        key: "/tasks",
        label: "Task Dashboard",
      },
      {
        key: "/workspaces/project/dashboard",
        label: "First Project",
      },
      {
        key: "/workspaces/add-project/",
        label: (
          <div className="text-gray-500">
            <span>Add Project </span>
          </div>
        ),
      },
    ],
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleMenuClick = ({ key }) => {
    switch (key) {
      case "/search":
        navigate("/search");
        break;
      case "/notification":
        navigate("/notification");
        break;
      case "/assign-to-me":
        navigate("/assign-to-me");
        break;
      case "/space/space-setting":
        navigate("/space/space-setting");
        break;
      case "/workspaces/project/dashboard":
        navigate("/workspaces/project/dashboard");
        break;
      case "/tasks":
        navigate("/tasks");
        break;
      case "/workspaces/add-project/":
        navigate("/workspaces/add-project");
        break;
      case "/space":
        console.log("Hello");
        break;
    }
  };

  return (
    <div className="w-70 h-full flex flex-col ">
      <h1 className="flex gap-1 items-center p-5 bg-[#2a2b79]">
        <span className="text-2xl font-bold text-white">Task Manager</span>
        <p className="bg-blue-600 p-2 rounded-full">
          <MdOutlineAddTask className="text-white text-2xl font-black" />
        </p>
      </h1>
      <Menu
        className="w-full h-full top-0"
        onClick={handleMenuClick}
        defaultSelectedKeys={["/workspaces/project/dashboard"]}
        defaultOpenKeys={["/workspaces/project/dashboard"]}
        items={items}
      />
    </div>
  );
};

export default Sidebar;
