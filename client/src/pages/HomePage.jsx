import React, { useState, useEffect } from "react";
import axios from "axios";
import { GLOBALS } from "../GLOBALS";
import { Link } from "react-router-dom";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [group, setGroup] = useState(""); // الحالة لتتبع المجموعة المختارة

  const fetchUsers = async (pageNumber = 1, selectedGroup = "") => {
    try {
      setLoadingMore(true);
      const response = await axios.get(
        `${GLOBALS.SERVER}/api/users/allProjects?page=${pageNumber}&limit=6&group=${selectedGroup}`
      );

      const { users: newUsers, hasMore: moreAvailable } = response.data;
      setUsers((prevUsers) =>
        pageNumber === 1 ? newUsers : [...prevUsers, ...newUsers]
      );
      setHasMore(moreAvailable);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchUsers(1, group); // استدعاء أولي لجلب المستخدمين عند تحميل الصفحة
  }, [group]); // تحديث عند تغيير المجموعة المختارة

  const loadMoreUsers = () => {
    if (hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchUsers(nextPage, group); // تمرير المجموعة المختارة عند جلب المزيد
        return nextPage;
      });
    }
  };

  return (
    <div className="min-h-[89vh] bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-8">Students</h2>

      {/* Group Buttons */}
      <div className="flex justify-center mb-6 space-x-4">
        {["", "B1", "B2", "B3"].map((grp) => (
          <button
            key={grp}
            onClick={() => {
              setGroup(grp);
              setPage(1); // إعادة تعيين الصفحة عند تغيير المجموعة
              setUsers([]); // إعادة تصفية المستخدمين
            }}
            className={`px-4 py-2 rounded-lg shadow-md text-white ${
              group === grp
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-400 hover:bg-gray-500"
            }`}
          >
            {grp === "" ? "All" : `${grp}`}
          </button>
        ))}
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow-md rounded-lg p-4 transform transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-xl font-semibold">{user.username}</h3>
                <p className="text-gray-600">{user.email}</p>
                <p className="text-gray-600">
                  {user.group || "No Group Assigned"}
                </p>
              </div>
            </div>
            <Link
              to={`/user/${user._id}`}
              className="text-blue-500 font-medium mt-4 inline-block"
            >
              View Project
            </Link>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <button
            className={`px-6 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition ${
              loadingMore ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={loadMoreUsers}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center mt-8">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default UsersList;
