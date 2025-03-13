import shark from "../assets/shark.png";
import code from "../assets/code.png";
import binary from "../assets/binary.png";
import bollywood from "../assets/bollywood.png";
import candid from "../assets/candidpng.png";
import cinema from "../assets/cinema.png";
import volleyball from "../assets/volleyball.png";
import script from "../assets/script.png";
import dancing from "../assets/dancing.png";
import debate from "../assets/debate.png";
import guitar from "../assets/guitar.png";
import painting from "../assets/painting.png";
export const eventFields = {
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

  export const eventsData = [
    // Your eventsData array, unchanged (omitted for brevity)
    {
      id: 1,
      name: "Code Avengers",
      image: code,
      shortDescription: "Unleash your coding superpowers!",
      longDescription:
        "Assemble your team and tackle complex coding challenges in a thrilling hackathon-style event.",
      time: "9:00 AM - 3:00 PM",
      venue: "Tech Lab",
      rules: [
        "Teams of 3-5 members.",
        "Bring your own laptop.",
        "No pre-written code allowed.",
      ],
      prize: "Winner: ₹12,000, Runner-up: ₹6,000",
    },
    {
      id: 2,
      name: "Bollywood Bazigar",
      image: bollywood,
      shortDescription: "Dance and drama Bollywood-style!",
      longDescription:
        "Perform iconic Bollywood scenes or dance numbers in a high-energy competition.",
      time: "4:00 PM - 7:00 PM",
      venue: "Main Stage",
      rules: [
        "Teams of 2-8 members.",
        "5-minute performance limit.",
        "Costumes encouraged.",
      ],
      prize: "Winner: ₹8,000, Runner-up: ₹4,000",
    },
    {
      id: 3,
      name: "Volleyball",
      image: volleyball,
      shortDescription: "Spike your way to victory!",
      longDescription:
        "Compete in a fast-paced volleyball tournament with teams battling it out on the court.",
      time: "10:00 AM - 2:00 PM",
      venue: "Sports Ground",
      rules: [
        "Teams of 6 players.",
        "Standard volleyball rules apply.",
        "Best of 3 sets.",
      ],
      prize: "Winner: ₹10,000, Runner-up: ₹5,000",
    },
    {
      id: 4,
      name: "Battle Byte",
      image: binary,
      shortDescription: "Code fast, win big!",
      longDescription:
        "A speed-coding competition where participants solve problems under time pressure.",
      time: "1:00 PM - 4:00 PM",
      venue: "Computer Lab 2",
      rules: [
        "Individual participation.",
        "90-minute time limit.",
        "Top 3 solutions win.",
      ],
      prize: "Winner: ₹7,000, Runner-up: ₹3,500",
    },
    {
      id: 5,
      name: "Shark Tank",
      image: shark,
      shortDescription: "Pitch your million-dollar idea!",
      longDescription:
        "Present your startup idea to a panel of judges in a Shark Tank-inspired pitch event.",
      time: "3:00 PM - 6:00 PM",
      venue: "Conference Room",
      rules: [
        "Teams of 1-4 members.",
        "5-minute pitch + 5-minute Q&A.",
        "Props allowed.",
      ],
      prize: "Winner: ₹15,000, Runner-up: ₹7,500",
    },
    {
      id: 6,
      name: "Candid Moments",
      image: candid,
      shortDescription: "Capture the perfect shot!",
      longDescription:
        "A photography contest where participants submit their best candid shots of the fest.",
      time: "All Day",
      venue: "Campus Wide",
      rules: [
        "Individual entries.",
        "Submit up to 3 photos.",
        "No heavy editing allowed.",
      ],
      prize: "Winner: ₹6,000, Runner-up: ₹3,000",
    },
    {
      id: 7,
      name: "Cine Blitz",
      image: cinema,
      shortDescription: "Lights, camera, action!",
      longDescription:
        "Create and showcase a short film in this rapid filmmaking challenge.",
      time: "11:00 AM - 5:00 PM",
      venue: "Auditorium",
      rules: [
        "Teams of 3-6 members.",
        "Max 5-minute runtime.",
        "Theme provided on-spot.",
      ],
      prize: "Winner: ₹10,000, Runner-up: ₹5,000",
    },
    {
      id: 8,
      name: "Rangmanch",
      image: script,
      shortDescription: "Stage your story!",
      longDescription:
        "Perform a captivating drama or skit in this theatrical competition.",
      time: "2:00 PM - 5:00 PM",
      venue: "Open Theatre",
      rules: [
        "Teams of 4-10 members.",
        "10-minute performance limit.",
        "Minimal props allowed.",
      ],
      prize: "Winner: ₹8,000, Runner-up: ₹4,000",
    },
    {
      id: 9,
      name: "Fandango",
      image: dancing,
      shortDescription: "Dance like nobody’s watching!",
      longDescription:
        "A solo or group dance competition featuring various styles and flair.",
      time: "5:00 PM - 8:00 PM",
      venue: "Main Stage",
      rules: [
        "1-6 participants.",
        "4-minute performance limit.",
        "Any dance style allowed.",
      ],
      prize: "Winner: ₹9,000, Runner-up: ₹4,500",
    },
    {
      id: 10,
      name: "War of Words",
      image: debate,
      shortDescription: "Argue your way to the top!",
      longDescription:
        "A debate competition where sharp minds clash over hot topics.",
      time: "10:00 AM - 1:00 PM",
      venue: "Seminar Hall",
      rules: [
        "Teams of 2 members.",
        "3-minute speaking slots.",
        "Rebuttals allowed.",
      ],
      prize: "Winner: ₹6,000, Runner-up: ₹3,000",
    },
    {
      id: 11,
      name: "Bollywood Beats",
      image: guitar,
      shortDescription: "Groove to Bollywood rhythms!",
      longDescription:
        "A dance-off featuring the best of Bollywood music and moves.",
      time: "6:00 PM - 9:00 PM",
      venue: "Outdoor Arena",
      rules: [
        "Teams of 2-8 members.",
        "5-minute performance limit.",
        "Bollywood tracks only.",
      ],
      prize: "Winner: ₹10,000, Runner-up: ₹5,000",
    },
    {
      id: 12,
      name: "Creative Canvas",
      image: painting,
      shortDescription: "Paint your masterpiece!",
      longDescription:
        "An art competition where participants create themed artworks on the spot.",
      time: "11:00 AM - 2:00 PM",
      venue: "Art Room",
      rules: [
        "Individual participation.",
        "2-hour time limit.",
        "Materials provided.",
      ],
      prize: "Winner: ₹7,000, Runner-up: ₹3,500",
    },
  ];



  export const events = [
      { name: "Nukkad-Natak", time: "11:00 AM", heads: [
          { name: "Shreya Srivastava", mobile: "+91 63872 99487" },
          { name: "Harshit", mobile: "+91 97172 25929" },
        ] },
      { name: "Nukkad-Natak", time: "11:00 AM", heads: [
          { name: "Shreya Srivastava", mobile: "+91 63872 99487" },
          { name: "Harshit", mobile: "+91 97172 25929" },
        ] },
      { name: "Nukkad-Natak", time: "11:00 AM", heads: [
          { name: "Shreya Srivastava", mobile: "+91 63872 99487" },
          { name: "Harshit", mobile: "+91 97172 25929" },
        ] },
      { name: "Tech Talk", time: "10:00 AM", heads: [
          { name: "Alice Johnson", mobile: "+91 99999 88888" },
        ] },
      { name: "Code Sprint", time: "1:00 PM", heads: [
          { name: "Ravi Kumar", mobile: "+91 98765 43210" },
        ] },
    ];