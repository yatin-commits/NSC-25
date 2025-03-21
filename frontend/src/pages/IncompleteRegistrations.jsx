"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed
import toast from "react-hot-toast";

const IncompleteRegistrations = () => {
  const { user } = useAuth();
  const [incompleteMembers, setIncompleteMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchIncompleteRegistrations();
    }
  }, [user]);

  const fetchIncompleteRegistrations = async () => {
    const loadingToast = toast.loading("Fetching incomplete registrations...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/incomplete-registrations?userId=${"29BruJMxHXMB6mbdAZyvKVUixW13"}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await response.json();
      console.log("Fetched result:", result);
      if (response.ok) {
        const data = result.data || [];
        setIncompleteMembers(data);
        console.log("Set incompleteMembers:", data);
        toast.success("Incomplete registrations loaded!", { id: loadingToast });
      } else {
        throw new Error(result.error || "Failed to fetch incomplete registrations");
      }
    } catch (error) {
      console.error("Fetch incomplete registrations error:", error);
      toast.error("Failed to load incomplete registrations.", { id: loadingToast });
      setIncompleteMembers([]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Please log in to view incomplete registrations.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-700 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  console.log("Rendering with incompleteMembers:", incompleteMembers);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-indigo-600 mb-6">
        Incomplete Registrations
      </h1>
      {incompleteMembers.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 text-lg">
          No incomplete registrations found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="py-3 px-4 text-left text-sm font-semibold">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Event Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Phone</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">College Name</th>
              </tr>
            </thead>
            <tbody>
              {incompleteMembers.map((member) => (
                <tr
                  key={member.memberId}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {member.name || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-red-500 dark:text-red-400">
                    N/A
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {member.phone || "N/A"}
                  </td>
                  <td className="py-3 px-4 text-gray-700 dark:text-gray-300">
                    {member.college || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IncompleteRegistrations;