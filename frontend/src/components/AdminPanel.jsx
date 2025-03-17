import React, { useState, useEffect } from "react";
import axios from "axios";
import { eventFields, eventsData } from "./data";
import Navbarr from "./NavBarr";
import * as XLSX from "xlsx";
import { SiGooglesheets } from "react-icons/si";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

const AdminPanel = () => {
  const [selectedEvent, setSelectedEvent] = useState(""); // "" for all events
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [memberIdFilter, setMemberIdFilter] = useState("");
  const [sortField, setSortField] = useState("registeredAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [error, setError] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const adminUserId = "29BruJMxHXMB6mbdAZyvKVUixW13";

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const registrationsResponse = await axios.get(
        `https://nsc-25-backend.vercel.app/api/registrations/all?userId=${adminUserId}`
      );
      const data = Array.isArray(registrationsResponse.data) ? registrationsResponse.data : [];
      setRegistrations(data);

      if (data.length === 0) {
        setError("No registrations found in the database.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to load data: ${error.message}`);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (filteredRegistrations.length === 0) {
      alert("No data available to export.");
      return;
    }

    const formattedData = filteredRegistrations.map((reg, index) => {
      const eventName = eventsData.find((e) => e.id === reg.eventId)?.name || "Unknown Event";
      return {
        "S.No": index + 1,
        Event: eventName,
        Name: reg.name,
        Email: reg.email,
        "Registration Date": reg.registeredAt
          ? new Date(reg.registeredAt).toLocaleString("default", { day: "numeric", month: "short" })
          : "Not Recorded",
        ...reg.fields,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `registrations_${selectedEvent ? eventsData.find((e) => e.id === Number(selectedEvent))?.name : "all_events"}.xlsx`);
  };

  const filteredRegistrations = registrations
    .filter((reg) => {
      const matchesEvent = selectedEvent ? reg.eventId === Number(selectedEvent) : true;
      const matchesSearch =
        (reg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         reg.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         Object.values(reg.fields).some((val) =>
           val?.toString().toLowerCase().includes(searchTerm.toLowerCase())
         ));
      const matchesMemberId = memberIdFilter
        ? reg.fields.memberId?.toLowerCase().includes(memberIdFilter.toLowerCase())
        : true;
      return matchesEvent && matchesSearch && matchesMemberId;
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
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
            </svg>
            Back to Home
          </Link>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel</h2>

        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

          <div className="relative">
            <label className="block text-lg font-medium text-gray-600 mb-2">Filter by Member ID:</label>
            <input
              type="text"
              placeholder="Enter Member ID..."
              value={memberIdFilter}
              onChange={(e) => setMemberIdFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-10 w-5 h-5 text-gray-400" />
            {memberIdFilter && (
              <button
                onClick={() => setMemberIdFilter("")}
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
        </div>

        {loading ? (
          <div className="text-center text-blue-600 font-medium">Loading registrations...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Total Registrations: {filteredRegistrations.length}
            </h3>
            {filteredRegistrations.length === 0 ? (
              <p className="text-center text-gray-500">
                {searchTerm || memberIdFilter
                  ? "No registrations match your filter criteria."
                  : "No registrations found."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-4 text-left text-gray-600 font-medium">S.No</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Event</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Name</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Email</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Member ID</th>
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
                          <td className="p-4">{reg.fields.memberId || "N/A"}</td>
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
                            <td colSpan="7" className="p-4">
                              <div className="grid grid-cols-2 gap-2">
                                {Object.entries(reg.fields).map(([key, value]) => (
                                  <div key={key}>
                                    <strong>{key}:</strong> {value || "N/A"}
                                  </div>
                                ))}
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
      </div>
    </>
  );
};

export default AdminPanel;