import React, { useState, useEffect } from "react";
import axios from "axios";
import { eventFields, eventsData } from "./eventFields";
import Navbar from "./Navbar";
import * as XLSX from "xlsx";

const AdminPanel = () => {
  const [selectedEvent, setSelectedEvent] = useState("");
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedEvent) {
      setLoading(true);
      axios
        .get(`http://localhost:5000/api/registrations/all?eventId=${selectedEvent}`)
        .then((response) => setRegistrations(response.data))
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => setLoading(false));
    }
  }, [selectedEvent]);

  // Function to export registrations to Excel
  const exportToExcel = () => {
    if (registrations.length === 0) {
      alert("No data available to export.");
      return;
    }

    const formattedData = registrations.map((registration, index) => {
      let row = { "S.No": index + 1 };
      Object.entries(registration.fields).forEach(([key, value]) => {
        row[key] = value;
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");
    XLSX.writeFile(workbook, `${selectedEvent}_registrations.xlsx`);
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Panel</h2>

        {/* Event Selection */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-600 mb-2">Select Event:</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedEvent(e.target.value)}
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
              {registrations.length > 0 && (
                <button
                  onClick={exportToExcel}
                  className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-green-600"
                >
                  Export to Excel
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
