import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbarr from "../components/NavBarr";
import { Link } from "react-router-dom";
import { Search, RefreshCw, Info } from "lucide-react";
import * as XLSX from "xlsx";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed

const Members = () => {
  const { user } = useAuth();
  const [allMembers, setAllMembers] = useState([]);
  const [incompleteMembers, setIncompleteMembers] = useState([]);
  const [showIncomplete, setShowIncomplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    if (user) {
      fetchMembers();
    }
  }, [user]);

  const fetchMembers = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [membersResponse, registrationsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-members`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-registrations?userId=${user.uid}`)
      ]);

      const memberList = membersResponse.data.data || membersResponse.data || [];
      const registrationList = registrationsResponse.data.data || [];

      // console.log("All members from /api/all-members:", memberList);
      // console.log("All registrations:", registrationList);

      // Map memberId to earliest registeredAt date
      const memberRegDates = new Map();
      registrationList.forEach((reg) => {
        const fields = reg.fields instanceof Map ? Object.fromEntries(reg.fields) : reg.fields || {};
        const regDate = reg.registeredAt ? new Date(reg.registeredAt) : null;

        if (fields.memberId && regDate) {
          if (!memberRegDates.has(fields.memberId) || regDate < memberRegDates.get(fields.memberId)) {
            memberRegDates.set(fields.memberId, regDate);
          }
        }

        const sizeField = Object.keys(fields).find((key) =>
          ["teamSize", "groupSize", "castSize"].includes(key)
        );
        const teamSize = sizeField ? parseInt(fields[sizeField]) || 0 : 0;
        if (teamSize > 1) {
          for (let i = 1; i <= teamSize - 1; i++) {
            const teamMemberId = fields[`teamMemberId${i}`];
            if (teamMemberId && regDate && (!memberRegDates.has(teamMemberId) || regDate < memberRegDates.get(teamMemberId))) {
              memberRegDates.set(teamMemberId, regDate);
            }
          }
        }
      });

      // Add registeredAt and createdAt to memberList
      const enrichedMemberList = memberList.map((member) => ({
        ...member,
        registeredAt: memberRegDates.get(member.memberId) || null,
        createdAt: member.createdAt ? new Date(member.createdAt) : null, // Parse ISO string or null
      }));

      const registeredMemberIds = new Set(memberRegDates.keys());
      // console.log(`Collected ${registeredMemberIds.size} unique registered member IDs`);
      // console.log("Sample enriched memberList[0]:", enrichedMemberList[0]);

      const registeredMembers = enrichedMemberList.filter(
        (member) => registeredMemberIds.has(member.memberId) && member.events && member.events.length > 0
      );
      const incompleteList = enrichedMemberList.filter(
        (member) => !registeredMemberIds.has(member.memberId)
      );

      setAllMembers(registeredMembers);
      setIncompleteMembers(incompleteList);
      setTotalMembers(memberList.length);

      if (memberList.length === 0) {
        setError("No members found in the database.");
      } else if (registeredMembers.length === 0 && incompleteList.length === 0) {
        setError("No registered or unregistered members found.");
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setError(`Failed to load members: ${error.response?.data?.error || error.message}`);
      setAllMembers([]);
      setIncompleteMembers([]);
      setTotalMembers(0);
    } finally {
      setLoading(false);
    }
  };

  const displayedMembers = showIncomplete ? incompleteMembers : allMembers;

  const filteredMembers = displayedMembers.filter(
    (member) =>
      member.memberId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.college && member.college.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.phone && member.phone.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.events && member.events.some((event) => event.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const exportToExcel = () => {
    const worksheetData = filteredMembers.map((member, index) => ({
      "S.No": index + 1,
      "Member ID": member.memberId,
      Name: member.name,
      Email: member.email,
      College: member.college || "N/A",
      "Phone No": member.phone || "N/A",
      "Date": member.registeredAt
        ? new Date(member.registeredAt).toLocaleString("default", { day: "numeric", month: "short" })
        : member.createdAt
        ? new Date(member.createdAt).toLocaleString("default", { day: "numeric", month: "short" })
        : "N/A",
      "Registered Events": member.events ? member.events.join(", ") : "N/A",
    }));
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");
    XLSX.writeFile(workbook, showIncomplete ? "Unregistered_Members_List.xlsx" : "Registered_Members_List.xlsx");
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-700">Please log in to view members.</p>
      </div>
    );
  }

  // console.log("Displayed members:", displayedMembers);

  return (
    <>
      <Navbarr />
      <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg mt-16 sm:mt-20">
        {/* Header and Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c-12.5-12.5-12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            Back to Home
          </Link>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={fetchMembers}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 w-full sm:w-auto"
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

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center text-gray-800">
          {showIncomplete ? "Unregistered Members" : "Registered Members"}
        </h2>

        {/* Statistics */}
        <div className="mb-6 text-center text-gray-700">
          <p className="text-base sm:text-lg font-semibold">
            Total Member IDs Generated: {totalMembers}
          </p>
          <p className="text-sm sm:text-md">
            Registered: {allMembers.length} | Unregistered: {incompleteMembers.length}
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center justify-center mb-6">
          <label className="mr-3 text-base sm:text-lg font-medium text-gray-600">
            Filter Incomplete:
          </label>
          <input
            type="checkbox"
            checked={showIncomplete}
            onChange={() => setShowIncomplete(!showIncomplete)}
            className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="relative group ml-2">
            <Info className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 cursor-pointer" />
            <div className="absolute left-0 sm:left-auto sm:right-0 top-6 hidden group-hover:block bg-gray-800 text-white text-xs sm:text-sm p-2 rounded shadow-lg z-10 whitespace-nowrap">
              {showIncomplete
                ? "Showing members who have not registered for any events."
                : "Showing members who have registered for at least one event."}
            </div>
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <label className="block text-base sm:text-lg font-medium text-gray-600 mb-2">
            Search by Member ID, Name, Email, College, Phone No, or Event:
          </label>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          />
          <Search className="absolute left-3 top-9 sm:top-10 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-9 sm:top-10 text-gray-400 hover:text-gray-600 text-lg sm:text-xl"
            >
              ×
            </button>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center text-blue-600 font-medium flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
            Loading members...
          </div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium text-sm sm:text-base">{error}</div>
        ) : (
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
              Total Displayed Members: {filteredMembers.length}
            </h3>
            {filteredMembers.length === 0 ? (
              <p className="text-center text-gray-500 text-sm sm:text-base">
                {searchTerm ? "No members match your search criteria." : "No members found."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                {/* Table for larger screens */}
                <table className="hidden sm:table min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-4 text-left text-gray-600 font-medium">S.No</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Member ID</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Name</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Email</th>
                      <th className="p-4 text-left text-gray-600 font-medium">College</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Phone No</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Date</th>
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
                        <td className="p-4">{member.phone || "N/A"}</td>
                        <td className="p-4">
                          {member.registeredAt
                            ? new Date(member.registeredAt).toLocaleString("default", {
                                day: "numeric",
                                month: "short",
                              })
                            : member.createdAt
                            ? new Date(member.createdAt).toLocaleString("default", {
                                day: "numeric",
                                month: "short",
                              })
                            : "N/A"}
                        </td>
                        <td className="p-4">
                          {member.events && member.events.length > 0 ? member.events.join(", ") : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Card layout for mobile */}
                <div className="sm:hidden space-y-4">
                  {filteredMembers.map((member, index) => (
                    <div
                      key={member.memberId}
                      className="bg-white border border-gray-200 rounded-lg shadow-md p-4 hover:bg-gray-50 transition duration-200"
                    >
                      <p className="text-sm font-medium text-gray-700">
                        <span className="font-semibold">S.No:</span> {index + 1}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Member ID:</span> {member.memberId}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Name:</span> {member.name}
                      </p>
                      <p className="text-sm text-gray-700 break-all">
                        <span className="font-semibold">Email:</span> {member.email}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">College:</span> {member.college || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Phone No:</span> {member.phone || "N/A"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Date:</span>{" "}
                        {member.registeredAt
                          ? new Date(member.registeredAt).toLocaleString("default", {
                              day: "numeric",
                              month: "short",
                            })
                          : member.createdAt
                          ? new Date(member.createdAt).toLocaleString("default", {
                              day: "numeric",
                              month: "short",
                            })
                          : "N/A"}
                      </p>
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Registered Events:</span>{" "}
                        {member.events && member.events.length > 0 ? member.events.join(", ") : "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Members;