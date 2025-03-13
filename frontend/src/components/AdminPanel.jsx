import React, { useState, useEffect } from "react";
import axios from "axios";
import { eventFields, eventsData } from "./data";
import Navbarr from "./NavBarr";
import * as XLSX from "xlsx";
import { SiGooglesheets } from "react-icons/si";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const AdminPanel = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc' for date sorting
  const [error, setError] = useState(null);

  const adminUserId = "29BruJMxHXMB6mbdAZyvKVUixW13";

  useEffect(() => {
    if (selectedEvent) {
      fetchData();
    }
  }, [selectedEvent]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const visibilityResponse = await axios.get(
        `https://nsc-25-backend.vercel.app/api/visibility?eventId=${selectedEvent}`
      );
      setIsActive(visibilityResponse.data.isActive);

      const registrationsResponse = await axios.get(
        `https://nsc-25-backend.vercel.app/api/registrations?userId=${adminUserId}`
      );
      
      // console.log("Raw backend response:", registrationsResponse.data);
      
      const data = Array.isArray(registrationsResponse.data) ? registrationsResponse.data : [];
      const eventRegistrations = data.filter((reg) => reg.eventId === Number(selectedEvent));
      
      // console.log("Filtered registrations:", eventRegistrations);
      
      setRegistrations(eventRegistrations);
      
      if (eventRegistrations.length === 0) {
        setError("No registrations found for this event in the database.");
      } else if (!eventRegistrations.some(reg => reg.registeredAt)) {
        setError("Registration dates are not available in the data.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(`Failed to load data: ${error.message}`);
      setRegistrations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleActive = async () => {
    try {
      const response = await axios.post(
        `https://nsc-25-backend.vercel.app/api/visibility?eventId=${selectedEvent}`,
        { isActive: !isActive },
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setIsActive((prevState) => !prevState);
      }
    } catch (error) {
      console.error("Error updating visibility:", error);
    }
  };

  const exportToExcel = () => {
    if (filteredRegistrations.length === 0) {
      alert("No data available to export.");
      return;
    }

    const formattedData = filteredRegistrations.map((registration, index) => {
      let row = { 
        "S.No": index + 1, 
        Name: registration.name, 
        Email: registration.email, 
        "Registration Date": registration.registeredAt 
          ? new Date(registration.registeredAt).toLocaleString('default', { day: 'numeric', month: 'short' }) 
          : "Not Recorded"
      };
      Object.entries(registration.fields).forEach(([key, value]) => {
        row[key] = value;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `${eventsData.find((e) => e.id === Number(selectedEvent))?.name || selectedEvent}_registrations.xlsx`);
  };

  // Filter and sort registrations
  const filteredRegistrations = registrations
    .filter((reg) => {
      const matchesSearch = 
        (reg.name && reg.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (reg.email && reg.email.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = a.registeredAt ? new Date(a.registeredAt) : new Date(0); // Default to epoch if no date
      const dateB = b.registeredAt ? new Date(b.registeredAt) : new Date(0);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <>
      <Navbarr />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
        <p className="font-semibold flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 448 512" 
              className="w-4 h-4"
              fill="currentColor"
            >
              <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
            </svg>
            Back to Home
          </Link>
        </p>
        <br />
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel</h2>

        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-600 mb-2">Select Event:</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedEvent(e.target.value)}
            value={selectedEvent}
          >
            <option value="">--Select--</option>
            {eventsData.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              )}
            </div>
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full cursor-pointer sm:w-48 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option className="cursor-pointer" value="desc">Date (Newest First)</option>
                <option className="cursor-pointer" value="asc">Date (Oldest First)</option>
              </select>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center text-blue-600 font-medium">Loading registrations...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : selectedEvent ? (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg  font-semibold text-gray-700">
                Total Registrations: {filteredRegistrations.length}
              </h3>
              {filteredRegistrations.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 flex items-center gap-2"
                >
                  <SiGooglesheets />
                </button>
              )}
            </div>

            {filteredRegistrations.length === 0 ? (
              <p className="text-center text-gray-500">
                {searchTerm 
                  ? "No registrations match your search criteria." 
                  : "No registrations found for this event."}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-4 text-left text-gray-600 font-medium">S.No</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Name</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Email</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Registration Date</th>
                      {eventFields[selectedEvent]?.map((field) => (
                        <th key={field.name} className="p-4 text-left text-gray-600 font-medium">
                          {field.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((registration, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{registration.name || 'N/A'}</td>
                        <td className="p-4">{registration.email || 'N/A'}</td>
                        <td className="p-4">
                          {registration.registeredAt 
                            ? new Date(registration.registeredAt).toLocaleString('default', { 
                                day: 'numeric', 
                                month: 'short' 
                              }) 
                            : 'Not Recorded'}
                        </td>
                        {Object.entries(registration.fields).map(([key, value]) => (
                          <td key={key} className="p-4">{value || 'N/A'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500">Please select an event to view registrations.</p>
        )}
      </div>
    </>
  );
};

export default AdminPanel;