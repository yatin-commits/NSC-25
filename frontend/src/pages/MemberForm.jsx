import React, { useState } from "react";
import toast from "react-hot-toast";

const MemberForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });
  const [memberId, setMemberId] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }
    if (!formData.college.trim()) newErrors.college = "College name is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("https://nsc-25-backend.vercel.app/api/generate-member-id", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setMemberId(data.memberId);
        setCopied(false);
        toast.success("Member ID generated successfully!");
      } else {
        if (response.status === 500) {
          if (data.message === "Email already registered" || data.message === "Phone already registered") {
            toast.error("Email or phone number already registered.");
          } else {
            toast.error("Email or phone number already registered.");
          }
        } else {
          toast.error(data.message || "Failed to generate member ID");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again later.");
      setErrors({ submit: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-100 to-indigo-50 pt-20">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-extrabold text-center text-indigo-600 dark:text-indigo-400 mb-4">
          Generate Member ID
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "phone", "college"].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm transition-colors duration-200 ${
                  errors[field] ? "border-red-500" : "border-gray-300"
                }`}
                placeholder={`Enter your ${field}`}
              />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
            </div>
          ))}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 ${
              isLoading ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          {errors.submit && <p className="text-red-500 text-xs mt-2 text-center">{errors.submit}</p>}
        </form>
        {memberId && (
          <div className="mt-4 p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg text-center">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Your Member ID:
            </h3>
            <div className="flex items-center justify-center space-x-3">
              <p className="text-xl font-mono text-indigo-600 dark:text-indigo-400 select-all">
                {memberId}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(memberId).then(() => setCopied(true))}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                  copied ? "bg-green-500 text-white" : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Save this ID for event registration!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberForm;