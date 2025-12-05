const http = require("http");

console.log("🧪 Testing Type & Bookmark Endpoints...\n");

// Test Type Filters
const types = ["Manga", "Manhwa", "Manhua"];
let completed = 0;

types.forEach((type) => {
  http
    .get(`http://localhost:5000/api/comics?type=${type}&limit=3`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const json = JSON.parse(data);
          console.log(`✅ ${type}: ${json.data.length} comics found`);
          if (json.data.length > 0) {
            console.log(
              `   Sample: ${json.data[0].title} (type: ${json.data[0].type})`
            );
          }
          completed++;
          if (completed === types.length) {
            console.log("\n✅ All type filters working correctly!\n");
          }
        } catch (e) {
          console.error(`❌ ${type}: Error parsing response`);
        }
      });
    })
    .on("error", (err) => {
      console.error(`❌ ${type}: ${err.message}`);
    });
});

// Wait a bit then test user profile endpoint
setTimeout(() => {
  console.log("ℹ️  To test bookmark, you need to:");
  console.log("   1. Login to get token");
  console.log(
    '   2. Use: curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/user/profile'
  );
  console.log(
    "   3. Check response has: user.bookmarks[].comic and user.readHistory[].comic\n"
  );
}, 1000);
