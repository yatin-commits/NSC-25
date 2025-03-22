import React, { useState, useEffect } from "react";
import axios from "axios";
import { eventFields, eventsData } from "./data";
import Navbarr from "./NavBarr";
import * as XLSX from "xlsx";
import { SiGooglesheets } from "react-icons/si";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const AdminPanel = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("registeredAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [selectedImage, setSelectedImage] = useState(null);

  const adminUserId = "29BruJMxHXMB6mbdAZyvKVUixW13";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [registrationsResponse, membersResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/registrations/all?userId=${adminUserId}`),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/all-members`),
      ]);

      const regData = Array.isArray(registrationsResponse.data) ? registrationsResponse.data : [];
      const memberData = Array.isArray(membersResponse.data.data) ? membersResponse.data.data : membersResponse.data || [];

      setRegistrations(regData);
      setMembers(memberData);

      if (regData.length === 0) {
        setError("No registrations found in the database.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to load data: ${error.message}`);
      setRegistrations([]);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const processRegistrations = () => {
    const memberMap = new Map(members.map((m) => [m.memberId, { name: m.name, email: m.email, phone: m.phone }]));

    const processed = [];
    registrations.forEach((reg) => {
      const fields = reg.fields instanceof Map ? Object.fromEntries(reg.fields) : reg.fields;
      const eventId = reg.eventId;
      const isTeamBased = eventFields[eventId]?.some((f) =>
        ["teamSize", "groupSize", "castSize"].includes(f.name)
      );
      const sizeField = eventFields[eventId]?.find((f) =>
        ["teamSize", "groupSize", "castSize"].includes(f.name)
      );
      const teamSize = sizeField ? parseInt(fields[sizeField.name]) || 0 : 0;

      const leaderInfo = memberMap.get(fields.memberId) || {};
      const teamLeader = {
        ...reg,
        memberId: fields.memberId,
        name: reg.name || leaderInfo.name || "Unknown",
        email: reg.email || leaderInfo.email || "N/A",
        isTeamLeader: true,
        teamLeaderId: fields.memberId,
        teamMembers: [],
      };

      if (isTeamBased && teamSize > 1) {
        for (let i = 1; i <= teamSize - 1; i++) {
          const teamMemberId = fields[`teamMemberId${i}`];
          if (teamMemberId) {
            const memberInfo = memberMap.get(teamMemberId) || {};
            teamLeader.teamMembers.push({
              memberId: teamMemberId,
              name: memberInfo.name || fields[`teamMemberName${i}`] || "Unknown Member",
              email: memberInfo.email || fields[`teamMemberEmail${i}`] || "N/A",
              phone: memberInfo.phone || fields[`teamMemberPhone${i}`] || "N/A",
            });
          }
        }
      }

      processed.push(teamLeader);
    });
    return processed;
  };

  const allParticipants = processRegistrations();

  const exportToExcel = () => {
    if (filteredRegistrations.length === 0) {
      alert("No data available to export.");
      return;
    }

    const formattedData = filteredRegistrations.map((reg, index) => {
      const eventName = eventsData.find((e) => e.id === reg.eventId)?.name || "Unknown Event";
      const rowData = {
        "S.No": index + 1,
        Event: eventName,
        "Team Leader Name": reg.name,
        "Team Leader Email": reg.email,
        "Registration Date": reg.registeredAt
          ? new Date(reg.registeredAt).toLocaleString("default", { day: "numeric", month: "short" })
          : "Not Recorded",
        "Team Leader ID": reg.teamLeaderId,
        "Payment Receipt": reg.paymentReceipt || "N/A",
        "Society Name": reg.fields["Society Name"] || "N/A",
        "Team Size": reg.fields.teamSize || "N/A",
      };

      reg.teamMembers.forEach((tm, idx) => {
        rowData[`Team Member ${idx + 1}`] = tm.name;
      });

      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(
      workbook,
      `registrations_${selectedEvent ? eventsData.find((e) => e.id === Number(selectedEvent))?.name : "all_events"}.xlsx`
    );
  };

  const filteredRegistrations = allParticipants
    .filter((reg) => {
      const matchesEvent = selectedEvent ? reg.eventId === Number(selectedEvent) : true;
      const matchesSearch =
        (reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         Object.values(reg.fields).some((val) =>
           val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
         ) ||
         reg.teamMembers.some((tm) =>
           [tm.name, tm.email, tm.phone].some((val) =>
             val?.toLowerCase().includes(searchTerm.toLowerCase())
           )
         ));
      return matchesEvent && matchesSearch;
    })
    .sort((a, b) => {
      if (sortField === "registeredAt") {
        const dateA = a.registeredAt ? new Date(a.registeredAt) : new Date(0);
        const dateB = b.registeredAt ? new Date(b.registeredAt) : new Date(0);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else if (sortField === "name") {
        return sortOrder === "asc"
          ? (a.name || "").localeCompare(b.name || "")
          : (b.name || "").localeCompare(a.name || "");
      } else if (sortField === "email") {
        return sortOrder === "asc"
          ? (a.email || "").localeCompare(b.email || "")
          : (b.email || "").localeCompare(a.email || "");
      } else if (sortField === "memberId") {
        return sortOrder === "asc"
          ? (a.memberId || "").localeCompare(b.memberId || "")
          : (b.memberId || "").localeCompare(a.memberId || "");
      }
      return 0;
    });

  const toggleRow = (index) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(index)) {
      newExpandedRows.delete(index);
    } else {
      newExpandedRows.add(index);
    }
    setExpandedRows(newExpandedRows);
  };

  const openImageModal = (url) => {
    setSelectedImage(url);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  return (
    <>
      <Navbarr />
      <div className="max-w-7xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
        <div className="flex items-center mb-6">
          <Link to="/" className="flex items-center gap-2 text-blue-600 hover:underline">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5-12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            Back to Home
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel</h2>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium text-gray-600 mb-2">Filter by Event:</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSelectedEvent(e.target.value)}
              value={selectedEvent}
            >
              <option value="">All Events</option>
              {eventsData.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <label className="block text-lg font-medium text-gray-600 mb-2">Search by Name/Email/Field:</label>
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
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center">
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="registeredAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
            <option value="memberId">Sort by Member ID</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full sm:w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button
            onClick={exportToExcel}
            className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 flex items-center gap-2"
          >
            <SiGooglesheets /> Export to Excel
          </button>
          <Link
            to="/members"
            className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 flex items-center gap-2"
          >
            Full Data Breakdown
          </Link>
        </div>

        {loading ? (
          <div className="text-center text-blue-600 font-medium">Loading registrations...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Total Teams: {filteredRegistrations.length}
            </h3>
            {filteredRegistrations.length === 0 ? (
              <p className="text-center text-gray-500">
                {searchTerm ? "No teams match your filter criteria." : "No teams found."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border-gray-200 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-4 text-left text-gray-600 font-medium">S.No</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Event</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Name</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Email</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Member ID</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Role</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Team Leader ID</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Payment Receipt</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Registration Date</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((reg, index) => (
                      <React.Fragment key={index}>
                        <tr className="border-b hover:bg-gray-50 transition duration-200">
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4">
                            {eventsData.find((e) => e.id === reg.eventId)?.name || "Unknown"}
                          </td>
                          <td className="p-4">{reg.name || "N/A"}</td>
                          <td className="p-4">{reg.email || "N/A"}</td>
                          <td className="p-4">{reg.memberId || "N/A"}</td>
                          <td className="p-4">Team Leader</td>
                          <td className="p-4">{reg.teamLeaderId || "N/A"}</td>
                          <td className="p-4">
                            {reg.paymentReceipt ? (
                              <div>
                                <img
                                  src={reg.paymentReceipt}
                                  alt="Payment Receipt"
                                  className="w-24 h-24 object-cover cursor-pointer rounded-md"
                                  onClick={() => openImageModal(reg.paymentReceipt)}
                                  onError={(e) => (e.target.src = "/images/placeholder.png")}
                                />
                                <a
                                  href={reg.paymentReceipt}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline text-sm mt-1 block"
                                >
                                  Open in new tab
                                </a>
                              </div>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="p-4">
                            {reg.registeredAt
                              ? new Date(reg.registeredAt).toLocaleString("default", {
                                  day: "numeric",
                                  month: "short",
                                })
                              : "Not Recorded"}
                          </td>
                          <td className="p-4">
                            <button onClick={() => toggleRow(index)}>
                              {expandedRows.has(index) ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(index) && (
                          <tr className="bg-gray-50">
                            <td colSpan="10" className="p-4">
                              <div className="space-y-4">
                                {/* Team Members Section */}
                                {reg.teamMembers.length > 0 && (
                                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <h4 className="text-base font-semibold text-gray-800 mb-3">Team Members</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                      {reg.teamMembers.map((tm, idx) => (
                                        <div
                                          key={idx}
                                          className="p-3 bg-gray-100 rounded-md border border-gray-200"
                                        >
                                          <p className="text-sm font-medium text-gray-900">{tm.name}</p>
                                          <p className="text-xs text-gray-600">
                                            <span className="font-medium">Email:</span> {tm.email}
                                          </p>
                                          {tm.phone !== "N/A" && (
                                            <p className="text-xs text-gray-600">
                                              <span className="font-medium">Phone:</span> {tm.phone}
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Additional Details Section */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                  <h4 className="text-base font-semibold text-gray-800 mb-3">Additional Details</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {Object.entries(reg.fields).map(([key, value]) => (
                                      <div key={key} className="text-sm">
                                        <span className="font-medium text-gray-700">{key}:</span>{" "}
                                        <span className="text-gray-600">{value || "N/A"}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative max-w-4xl w-full p-4">
              <button
                onClick={closeImageModal}
                className="absolute top-2 right-2 text-white bg-red-600 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt="Expanded Payment Receipt"
                className="w-full h-auto max-h-[80vh] object-contain rounded-md"
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;