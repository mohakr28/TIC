import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { GLOBALS } from "../GLOBALS";

const HomePage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState(""); // الحالة للمجموعة المحددة
  const [filteredUsers, setFilteredUsers] = useState([]); // حالة المستخدمين بعد التصفية

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          GLOBALS.SERVER + "/api/users/allProjects"
        );
        setUsers(response.data);
        setFilteredUsers(response.data); // تعيين المستخدمين بعد تحميل البيانات
      } catch (error) {
        console.error("Error fetching users", error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      setFilteredUsers(users.filter((user) => user.group === selectedGroup));
    } else {
      setFilteredUsers(users); // إعادة جميع المستخدمين إذا لم يتم اختيار مجموعة
    }
  }, [selectedGroup, users]);

  const groups = [...new Set(users.map((user) => user.group))]; // استخراج المجموعات الفريدة

  return (
    <div
      className={`min-h-[89vh] bg-gray-100 p-6 ${
        loading ? "animate-page-load" : ""
      }`}
    >
      {/* عنوان الصفحة */}
      <h2 className="text-3xl font-bold text-center mb-8">Students</h2>

      {/* عرض المجموعات كأزرار بجانب بعضها */}
      <div className="mb-6 flex justify-center space-x-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            !selectedGroup ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setSelectedGroup("")} // إعادة عرض جميع المستخدمين عند الضغط على "All"
        >
          All
        </button>
        {groups.map((group) => (
          <button
            key={group}
            className={`px-4 py-2 rounded-lg ${
              selectedGroup === group ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setSelectedGroup(group)} // تعيين المجموعة المحددة عند الضغط على الزر
          >
            {group}
          </button>
        ))}
      </div>

      {/* عرض المستخدمين بعد التصفية */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-md rounded-lg p-4 transform transition-all duration-300 hover:shadow-xl hover:scale-105 animate-slide-up"
          >
            <h3 className="text-xl font-semibold">{user.username}</h3>
            <p className="text-gray-600">{user.registrationNumber}</p>
            <p className="text-gray-600">{user.group}</p>

            <Link
              to={`/user/${user._id}`}
              className="text-blue-500 font-medium mt-4 inline-block"
            >
              View Project
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
