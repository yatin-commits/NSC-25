import React, { useState, useEffect } from "react";
import axios from "axios";
import { eventFields, eventsData } from "./eventFields";
import Navbarr from "./NavBarr";
import * as XLSX from "xlsx";
import { SiGooglesheets } from "react-icons/si";

const AdminPanel = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const adminUserId = "29BruJMxHXMB6mbdAZyvKVUixW13"; // Hardcoded admin UID

  useEffect(() => {
    if (selectedEvent) {
      setLoading(true);
      // Fetch visibility status
      axios
        .get(`https://nsc-25-backend.vercel.app/api/visibility?eventId=${selectedEvent}`)
        .then((response) => setIsActive(response.data.isActive))
        .catch((error) => console.error("Error fetching visibility:", error));

      // Fetch all registrations for admin
      axios
        .get(`https://nsc-25-backend.vercel.app/api/registrations?userId=${adminUserId}`)
        .then((response) => {
          console.log("Backend response:", response.data); // Debug log
          // Ensure response.data is an array before filtering
          const data = Array.isArray(response.data) ? response.data : [];
          const eventRegistrations = data.filter((reg) => reg.eventId === Number(selectedEvent));
          setRegistrations(eventRegistrations);
        })
        .catch((error) => {
          console.error("Error fetching registrations:", error);
          setRegistrations([]); // Reset on error
        })
        .finally(() => setLoading(false));
    }
  }, [selectedEvent]);

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
    if (registrations.length === 0) {
      alert("No data available to export.");
      return;
    }

    const formattedData = registrations.map((registration, index) => {
      let row = { "S.No": index + 1, Name: registration.name, Email: registration.email };
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

  return (
    <>
      <Navbarr />
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel</h2>

        {/* Event Selection */}
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

        {/* Loading Indicator */}
        {loading && <div className="text-center text-blue-600 font-medium">Loading registrations...</div>}

        {selectedEvent && !loading && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-gray-700">
                Total Registrations: {registrations.length}
              </h3>
              <button
                onClick={handleActive}
                className={`cursor-pointer m-2 p-2 rounded-md shadow-md ${isActive ? "bg-green-400 hover:bg-green-500" : "bg-red-400 hover:bg-red-500"}`}
              >
                {isActive ? "Active" : "Inactive"}
              </button>
              {registrations.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600 flex items-center gap-2"
                >
                  <SiGooglesheets /> Export to Excel
                </button>
              )}
            </div>

            {/* No Registrations Message */}
            {registrations.length === 0 ? (
              <p className="text-center text-gray-500">No registrations found for this event.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                  <thead>
                    <tr className="bg-gray-100 border-b">
                      <th className="p-4 text-left text-gray-600 font-medium">S.No</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Name</th>
                      <th className="p-4 text-left text-gray-600 font-medium">Email</th>
                      {eventFields[selectedEvent]?.map((field) => (
                        <th key={field.name} className="p-4 text-left text-gray-600 font-medium">
                          {field.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.map((registration, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50 transition duration-200">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4">{registration.name}</td>
                        <td className="p-4">{registration.email}</td>
                        {Object.entries(registration.fields).map(([key, value]) => (
                          <td key={key} className="p-4">{value}</td>
                        ))}
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

export default AdminPanel;