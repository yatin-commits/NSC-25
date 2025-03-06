const eventFields = {
    1: [
      { name: "teamName", type: "text" },
      { name: "teamSize", type: "select", options: ["3", "4", "5"] },
      { name: "preferredLanguage", type: "select", options: ["JavaScript", "Python", "Java"] },
    ],
    2: [
      { name: "performanceType", type: "select", options: ["Dance", "Drama"] },
      { name: "groupSize", type: "select", options: ["2", "4", "6", "8"] },
      { name: "songChoice", type: "text" },
    ],
    3: [
      { name: "teamName", type: "text" },
      { name: "teamSize", type: "radio", options: ["6"] }, // Fixed to 6 as per rules
    ],
    4: [
      { name: "codingLanguage", type: "select", options: ["C++", "Python", "Java"] },
      { name: "experienceLevel", type: "radio", options: ["Beginner", "Intermediate", "Advanced"] },
    ],
    5: [
      { name: "pitchTitle", type: "text" },
      { name: "teamSize", type: "select", options: ["1", "2", "3", "4"] },
      { name: "industry", type: "select", options: ["Tech", "Health", "Finance"] },
    ],
    6: [
      { name: "cameraType", type: "select", options: ["DSLR", "Mirrorless", "Point-and-Shoot"] },
      { name: "photoTheme", type: "text" },
    ],
    7: [
      { name: "filmTitle", type: "text" },
      { name: "teamSize", type: "select", options: ["3", "4", "5", "6"] },
      { name: "genre", type: "select", options: ["Drama", "Comedy", "Action"] },
    ],
    8: [
      { name: "playTitle", type: "text" },
      { name: "castSize", type: "select", options: ["4", "6", "8", "10"] },
    ],
    9: [
      { name: "danceStyle", type: "select", options: ["Hip-Hop", "Contemporary", "Ballet"] },
      { name: "groupSize", type: "select", options: ["1", "2", "3", "4", "5", "6"] },
    ],
    10: [
      { name: "debateTopicPreference", type: "text" },
      { name: "teamName", type: "text" },
    ],
    11: [
      { name: "songChoice", type: "text" },
      { name: "groupSize", type: "select", options: ["2", "4", "6", "8"] },
      { name: "choreographer", type: "text" },
    ],
    12: [
      { name: "artMedium", type: "select", options: ["Painting", "Sculpture", "Digital"] },
      { name: "artTheme", type: "text" },
    ],
  };

  export default eventFields;