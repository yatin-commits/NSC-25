import React, { useState } from 'react';

const MemberForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: ''
  });
  
  const [memberId, setMemberId] = useState('');
  const [copied, setCopied] = useState(false); // State to track if ID is copied

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const generateMemberId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `${formData.name.split(' ')[0].toLowerCase().replace(/\s/g, '')}-${randomNum}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone && formData.college) {
      const newMemberId = generateMemberId();
      setMemberId(newMemberId);
      setCopied(false); // Reset copied state when generating new ID
      console.log('Form Data:', formData);
      console.log('Generated Member ID:', newMemberId);
    } else {
      alert('Please fill all fields');
    }
  };

  // Function to copy member ID to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(memberId)
      .then(() => {
        setCopied(true);
        // Reset "Copied" feedback after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        alert('Failed to copy member ID');
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Generate your member ID
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
              College Name
            </label>
            <input
              type="text"
              id="college"
              name="college"
              value={formData.college}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your college name"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Generate Member ID
          </button>
        </form>

        {memberId && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Your Member ID:
            </h3>
            <div className="flex items-center justify-center space-x-4">
              <p className="text-xl font-mono text-blue-600">{memberId}</p>
              <button
                onClick={handleCopy}
                className={`px-3 py-1 rounded-md text-sm font-medium transition duration-300 ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberForm;