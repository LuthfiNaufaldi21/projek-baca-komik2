const http = require("http");

http
  .get("http://localhost:5000/api/comics?limit=100", (res) => {
    let data = "";
    res.on("data", (chunk) => (data += chunk));
    res.on("end", () => {
      const json = JSON.parse(data);
      console.log("Total comics:", json.data.length);
      console.log("\nAll slugs:");
      json.data.forEach((c, i) =>
        console.log(`  ${i + 1}. ${c.slug} (${c.title})`)
      );
    });
  })
  .on("error", (err) => {
    console.error("Error:", err.message);
  });
