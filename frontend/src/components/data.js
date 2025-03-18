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
    { name: "teamSize", type: "select", options: ["6"] }, // Changed from radio to select for consistency
  ],
  4: [
    { name: "teamSize", type: "select", options: ["5"] }, // Basketball: Fixed team size per standard rules
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
    { name: "teamSize", type: "select", options: ["6"] }, // Volleyball: Fixed team size per standard rules
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
  {
    id: 1,
    name: "binary", // Assuming this is "Battle Bytes" (BGMI)
    image: "battle_bytes",
    shortDescription: "Compete in an intense BGMI mobile gaming showdown!",
    longDescription: "A thrilling BGMI tournament where players battle it out on mobile devices to prove their gaming prowess.",
    time: "TBD",
    venue: "TBD",
    rules: [
      "Fair Play: No cheating, hacking, or use of third-party software.",
      "Device Restrictions: Players must use mobile devices (some tournaments may allow tablets/emulators).",
      "Game Version: All players must use the latest version of BGMI.",
      "Player Conduct: No abusive language, toxicity, or unsportsmanlike behavior.",
      "Team Composition: Teams should have the required number of players (usually 4 per squad).",
    ],
    prize: "TBD",
    contact: ["Ishaan: 93548 55625", "Tushar: 78271 15042"],
  },
  {
    id: 2,
    name: "Shark Tank",
    image: "shark",
    shortDescription: "Pitch your innovative ideas to the sharks!",
    longDescription: "Present your startup idea to a panel of judges in a Shark Tank-inspired competition for students.",
    time: "TBD",
    venue: "TBD",
    rules: [
      "Open to undergraduate and postgraduate students.",
      "Teams can consist of 1 to 5 members.",
      "Each participant can only be part of one team.",
      "No changes to team composition are allowed after registration.",
      "Teams must register by the specified deadline.",
      "A team leader must be designated during registration.",
      "Registration details should include team member names, contact information, and a brief description of the idea.",
      "Teams present their ideas to a panel of judges.",
      "Time limit for presentations: 10 minutes.",
      "Visual aids (e.g., slides, prototypes) are allowed.",
      "Judges may ask questions and provide feedback.",
      "Visual aids such as slides or prototypes must be prepared in advance.",
      "Teams must adhere strictly to time limits; exceeding the limit will lead to penalty points.",
      "All team members must participate in the presentation.",
    ],
    prize: "TBD",
    contact: ["Hiya: 965073321", "Darshita: 9810748780"],
  },
  {
    id: 3,
    name: "Rangmanch",
    image: "rangmanch",
    shortDescription: "Stage a powerful Nukkad Natak with a social message!",
    longDescription: "A street play competition where teams deliver impactful performances with a strong social message in Hindi.",
    time: "TBD",
    venue: "TBD",
    rules: [
      "Each team must have 18 to 20 members (including helpers).",
      "Minimum: 20 minutes, Maximum: 22 minutes (including setup time).",
      "Prelims Round: To qualify for the final competition, teams must clear the Prelims Round.",
      "Prelims Round: Teams must submit a 10-minute, unedited, one-take video of their Nukkad Natak.",
      "Prelims Round: No cuts, transitions, or edits are allowed in the video.",
      "Prelims Round: Last date for submission: 31st March 2025.",
      "Prelims Round: Only shortlisted teams will proceed to the final competition.",
      "Theme: The act should deliver a strong social message.",
      "Language: Performances must be in Hindi.",
      "Judging Criteria: Script & Content - Well-structured and impactful storytelling.",
      "Judging Criteria: Social Message - Clear, strong, and thought-provoking.",
      "Judging Criteria: Creativity & Execution - Unique presentation and performance quality.",
      "Judging Criteria: Time Adherence - Strictly within the given time limit.",
      "Judging Criteria: Teamwork & Coordination - Well-rehearsed and synchronized performance.",
      "Performance Guidelines: Allowed - Musical instruments (Drums, Dhol, Flute, etc.).",
      "Performance Guidelines: Not Allowed - Pre-recorded music, microphones, or any electronic devices.",
      "Performance Guidelines: Trigger Warnings - Must be provided for sensitive topics in the act.",
      "Note: Any form of offensive, defamatory, or inappropriate content will lead to disqualification.",
      "Note: Failure to adhere to the given rules and regulations will lead to disqualification.",
    ],
    prize: "TBD",
    contact: [
      "Tashmeen Kaur: 9354379839",
      "Ira Sharma: 85958 07792",
      "Khushi Kaushik: 83758 74982",
      "Kanak Bansal: 82092 92021",
    ],
  },
  {
    id: 4,
    name: "Basketball",
    image: "basketball",
    shortDescription: "Dominate the court in a 3x3 basketball showdown!",
    longDescription: "A fast-paced 3x3 basketball tournament played on half a court with one basket.",
    time: "TBD",
    venue: "TBD",
    rules: [
      "The game will be played on a 3x3 playing court with one basket. Half of a traditional basketball court may be used.",
      "Each team shall consist of no more than 4 players (3 players on the court and 1 substitute).",
      "A coin flip shall determine which team gets the first possession. The team that wins the coin flip can either choose to benefit from the ball possession at the beginning of the game or at the beginning of a potential overtime.",
      "Every shot from inside the arc (1-point field goal area) shall be awarded 1 point.",
      "Every shot from behind the arc (2-point field goal area) shall be awarded 2 points.",
      "Every successful free throw shall be awarded 1 point.",
      "The regular playing time shall be 1 period of 10 minutes. The game clock shall be stopped during dead ball situations and free throws.",
      "The game clock shall be restarted when: During a check-ball, the ball is at the disposal of the offensive player after the check-ball has been completed.",
      "The game clock shall be restarted when: After a successful last free throw, the next offensive team is in possession of the ball.",
      "The game clock shall be restarted when: After an unsuccessful last free throw and the ball continues to be live, the ball touches or is touched by any player on the playing court.",
      "The first team to score 21 points or more wins the game if it happens before the end of regular playing time. This 'sudden death' rule applies to the regular playing time only (not to a potential overtime).",
      "If the score is tied at the end of regular playing time, an overtime shall be played.",
      "There shall be an interval of 1 minute before the overtime starts. The first team to score 2 points in the overtime wins the game.",
      "No. of Players Allowed per team: 3+1 (substitute).",
      "Registration fees: ₹700 per team. Receipt must be uploaded during registration.",
    ],
    prize: "TBD",
    contact: ["Vijay: 72173 52469", "Harsh: 79064 27749"],
    requiresPayment: true,
    registrationFee: 700, // Updated to match provided data
    qrCode: "/images/basketball-qr.png",
  },
  {
    id: 5,
    name: "War of Words",
    image: "debate",
    shortDescription: "Debate your way to victory!",
    longDescription: "A debate competition where participants argue with facts, fluency, and creativity in English or Hindi.",
    time: "TBD",
    venue: "TBD",
    rules: [
      "Time Limit: Each speaker gets 5 minutes to present.",
      "Cross-Questioning: Allowed with clear, fair, and relevant questions.",
      "Content: Facts must be accurate and well-researched.",
      "Fluency: Participants must speak coherently in either English or Hindi.",
      "Creativity: Evaluated on uniqueness, clarity, and confident delivery.",
      "Preparation Time: 15 minutes before the debate.",
      "Our esteemed judges' decisions will be final.",
    ],
    prize: "TBD",
    contact: ["Navya: 78277 76854", "Tarushi: 92117 90589"],
  },
  {
    id: 6,
    name: "Fandango",
    image: "dancing",
    shortDescription: "Dance your heart out in this vibrant competition!",
    longDescription: "A dance event where teams from colleges showcase their moves within a 10-minute limit.",
    time: "TBD",
    venue: "TBD",
    rules: [
      "Each college should only send one team to represent them.",
      "Stage limit is 5 to 20 members.",
      "Song limit is 3 to 10 minutes.",
      "Maximum time limit for dance will be 10 mins.",
      "All teams are requested to send their track prior 4-5 days.",
      "All participants must bring their Institute's ID cards which they will be required to present at the registration desk before the commencement of the event.",
      "Decision of the judges will be final and binding on all teams and no objections shall be entertained.",
      "For backup please bring your track in pen drive.",
      "T&C: Any kind of cheating will lead to disqualification.",
      "THERE WILL BE NO PARTICIPATION FEE.",
    ],
    prize: "TBD",
    contact: ["Gunshita Varun: 9873760414", "Sourav: 9871169532", "Rohit: 98976 83764"],
  },
  {
    id: 7,
    name: "Creative Canvas",
    image: "painting",
    shortDescription: "Paint a masterpiece on the spot!",
    longDescription: "An art competition where participants create themed posters within a 2-hour limit.",
    time: "TBD",
    venue: "TBD",
    rules: [
      "Posters must adhere to the specified theme.",
      "Posters must be of the specified size i.e. A3 and it should be original and created by the participant only.",
      "Participants would be given 2 hours to complete their posters and they must submit it before the specified deadline.",
      "No use of electronic device during the time period if caught you will be disqualified.",
      "Posters will be judged on creativity, relevance to the theme, and visual appeal.",
    ],
    prize: "TBD",
    contact: ["Lakshita: 87440 47511", "Kanishka: 98100 41645"],
  },
  {
    id: 8,
    name: "Candid Moments",
    image: "candid_moments",
    shortDescription: "Capture the essence of NSC BVICAM 2025 through photography!",
    longDescription: "Join us in capturing the emotions and highlights of NSC BVICAM 2025 through your lens in this photography competition.",
    time: "Submissions: 12 PM - 2 PM",
    venue: "NSC BVICAM 2025 Venue",
    rules: [
      "Eligibility: The event is open to photographers of all levels, ages, and nationalities.",
      "Registration: Participants must register online or offline by [insert date] to participate in the event.",
      "Devices: Any device, whether a mobile phone or professional camera, is allowed.",
      "Image Format: Submitted images must be in JPEG format.",
      "Image Resolution: Images must have a minimum resolution of 16:9 aspect ratio (horizontal).",
      "Image Editing: Basic editing (e.g., brightness, contrast, saturation) is allowed, but excessive manipulation or tampering with the image is not permitted.",
      "Submission Timing: Submissions will open at 12 pm and close at 2 pm.",
      "Image Submission: Participants can submit one image per category.",
      "Note: Submissions must include your name (e.g., Revant_bvicam).",
      "Judging Criteria: Images will be judged based on creativity, technical skills, and composition.",
      "Judging Panel: A panel of three judges will select the winners.",
      "Awards: Winners will receive cash prizes, and participants will receive a certificate.",
      "Note: The metadata of your image will be checked to ensure the originality of your submission.",
      "Copyright: Participants retain the copyright to their submitted images.",
      "Usage: By participating, participants grant the event organizers permission to use their images for promotional purposes.",
    ],
    prize: "Cash prizes and certificates",
    contact: ["Revant: 8557751703", "Somil: 9205337823", "Kshitiz: 9910193041"],
  },
  {
    id: 9,
    name: "CODE AVENGERS",
    image: "code_avengers",
    shortDescription: "Test your coding skills in a thrilling two-round competition!",
    longDescription: "Challenge yourself with debugging and coding problems in this epic Code Avengers showdown featuring two rounds.",
    time: "Round 1: 30 mins, Round 2: 2 hrs",
    venue: "NSC BVICAM 2025 Coding Arena",
    rules: [
      "Round 1: Debugging Challenge (Elimination Round)",
      "Round 1: Participants will be given 5 code snippets with bugs. They must identify the error and suggest corrections without executing the code.",
      "Round 1: No execution of code—only logical debugging based on syntax, logic, and conceptual understanding.",
      "Round 1: Each bug correctly identified and fixed earns points.",
      "Round 1: Partial credit may be given for correctly identifying the error but incorrect fixes.",
      "Round 1: Top X% of participants (or a fixed number) with the highest scores advance to Round 2.",
      "Round 1: Time limit: 30 minutes",
      "Round 2: Final Coding Contest",
      "Round 2: This is the main coding challenge with 3 problems of varying difficulty. Participants must solve at least 2 problems to qualify for ranking.",
      "Round 2: Time Limit: 2 hours",
      "Round 2: Allowed Languages: C, C++, Java, Python",
      "Round 2: Evaluation Criteria: Correctness of solution, Efficiency (Time Complexity), Code readability and best practices.",
      "Round 2: Participants must submit their solutions within the given time frame.",
      "Round 2: Use of AI tools (e.g., ChatGPT, Copilot) is strictly prohibited.",
    ],
    prize: "Exciting rewards for top coders",
    contact: [
      "Pranav Pathak: 9582349597",
      "Pratham Bhatia: 7048575053",
      "Amrendram: 96258 54106",
      "Deepanshu: 85956 75015",
    ],
  },
  {
    id: 10,
    name: "Volleyball",
    image: "volleyball",
    shortDescription: "Spike your way to victory in a thrilling volleyball match!",
    longDescription: "A competitive volleyball tournament where teams showcase their skills on the court.",
    time: "TBD",
    venue: "TBD",
    rules: [
      // Note: Volleyball rules were not fully provided; using placeholder rules from original data
      "Each team shall consist of 6 players (plus up to 2 substitutes).",
      "Matches will follow standard volleyball rules with 3 sets to 25 points.",
      "A coin toss determines the first serve.",
      "Teams must adhere to fair play and sportsmanship guidelines.",
      "Registration fee must be paid and receipt uploaded before registration.",
    ],
    prize: "TBD",
    contact: ["Ravi: 9876543210", "Neha: 8765432109"],
    requiresPayment: true,
    registrationFee: 600, // Note: Update this if specific fee provided later
    qrCode: "/images/volleyball-qr.png",
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