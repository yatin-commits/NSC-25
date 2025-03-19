import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbarr from "../components/NavBarr";
import { Link } from "react-router-dom";
import { Search, RefreshCw } from "lucide-react";
import * as XLSX from "xlsx";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://nsc-25-backend.vercel.app/api/members");
      const memberList = Array.isArray(response.data) ? response.data : response.data.data || [];
      console.log("Fetched members:", memberList);

      setMembers(memberList);

      if (memberList.length === 0) {
        setError(response.data.message || "No members found in the database.");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setError(`Failed to load members: ${error.message}`);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.college && member.college.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.phone && member.phone.toLowerCase().includes(searchTerm.toLowerCase())) || // Changed to phone
      member.events.some((event) => event.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const exportToExcel = () => {
    const worksheetData = filteredMembers.map((member, index) => ({
      "S.No": index + 1,
      "Member ID": member.memberId,
      Name: member.name,
      Email: member.email,
      College: member.college || "N/A",
      "Phone No": member.phone || "N/A", // Changed to phone
      "Registered Events": member.events.join(", "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
    XLSX.writeFile(workbook, "Members_List.xlsx");
  };

  return (
    <>
      <Navbarr />
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
        <div className="flex items-center justify-between mb-6">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            Back to Home
          </Link>
          <div className="flex gap-4">
            <button
              onClick={fetchMembers}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 384 512"
                className="w-4 h-4"
                fill="currentColor"
              >
                <path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V160H256c-17.7 0-32-14.3-32-32V0H64zM256 0V128H384L256 0zM216 232c0-13.3-10.7-24-24-24s-24 10.7-24 24v56H112c-13.3 0-24 10.7-24 24s10.7 24 24 24h56v56c0 13.3 10.7 24 24 24s24-10.7 24-24V352h56c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V232z" />
              </svg>
              Export to Excel
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">All Members</h2>

        <div className="relative mb-6">
          <label className="block text-lg font-medium text-gray-600 mb-2">
            Search by Member ID, Name, Email, College, Phone No, or Event:
          </label>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600 text-xl"
            >
              ×
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center text-blue-600 font-medium flex items-center justify-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading members...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Total Members: {filteredMembers.length}
            </h3>
            {filteredMembers.length === 0 ? (
              <p className="text-center text-gray-500">
                {searchTerm ? "No members match your search criteria." : "No members found."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-4 text-left text-gray-600 font-medium">S.No</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Member ID</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Name</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Email</th>
                      <th className="p-4 text-left text-gray-600 font-medium">College</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Phone No</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Registered Events</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMembers.map((member, index) => (
                      <tr key={member.memberId} className="border-b hover:bg-gray-50 transition duration-200">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{member.memberId}</td>
                        <td className="p-4">{member.name}</td>
                        <td className="p-4">{member.email}</td>
                        <td className="p-4">{member.college || "N/A"}</td>
                        <td className="p-4">{member.phone || "N/A"}</td> {/* Changed to phone */}
                        <td className="p-4">{member.events.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Members;