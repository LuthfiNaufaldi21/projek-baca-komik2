/**
 * 🧪 Browser Console Test Runner
 *
 * Copy-paste this entire file into browser console
 * Run: await runAllTests()
 */

window.testMigration = {
  results: [],

  async testEndpoint(name, url, validator) {
    console.log(`\n🧪 Testing: ${name}`);
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const result = validator(data);

      if (result.pass) {
        console.log(`✅ ${name}: PASS`);
        this.results.push({ name, status: "PASS", message: result.message });
        return true;
      } else {
        console.error(`❌ ${name}: FAIL - ${result.message}`);
        this.results.push({ name, status: "FAIL", message: result.message });
        return false;
      }
    } catch (error) {
      console.error(`❌ ${name}: ERROR - ${error.message}`);
      this.results.push({ name, status: "ERROR", message: error.message });
      return false;
    }
  },

  async runAllTests() {
    console.clear();
    console.log("🚀 Starting Migration Tests...\n");
    this.results = [];

    const baseUrl = "http://localhost:5000";

    // Test 1: Basic Comics List
    await this.testEndpoint(
      "Get All Comics",
      `${baseUrl}/api/comics?limit=5`,
      (data) => {
        if (!data.data || !Array.isArray(data.data)) {
          return { pass: false, message: "No data array" };
        }
        if (data.data.length === 0) {
          return { pass: false, message: "Empty data array" };
        }
        return { pass: true, message: `Got ${data.data.length} comics` };
      }
    );

    // Test 2: Comic Structure
    await this.testEndpoint(
      "Comic Data Structure",
      `${baseUrl}/api/comics?limit=1`,
      (data) => {
        const comic = data.data[0];
        const requiredFields = [
          "id",
          "slug",
          "title",
          "cover_url",
          "genres",
          "author",
          "rating",
        ];
        const missing = requiredFields.filter(
          (f) => !comic[f] && comic[f] !== 0
        );

        if (missing.length > 0) {
          return {
            pass: false,
            message: `Missing fields: ${missing.join(", ")}`,
          };
        }

        if (!Array.isArray(comic.genres)) {
          return { pass: false, message: "genres is not an array" };
        }

        if (comic.genres.length > 0 && !comic.genres[0].name) {
          return { pass: false, message: "genres[0] missing name property" };
        }

        return { pass: true, message: "All required fields present" };
      }
    );

    // Test 3: Genre Filter
    await this.testEndpoint(
      "Genre Filter",
      `${baseUrl}/api/comics?genre=action&limit=5`,
      (data) => {
        if (data.data.length === 0) {
          return {
            pass: false,
            message: "No action comics found (check if genre exists in DB)",
          };
        }

        const hasAction = data.data.every((comic) =>
          comic.genres.some((g) => g.slug === "action")
        );

        if (!hasAction) {
          return { pass: false, message: "Not all comics have action genre" };
        }

        return { pass: true, message: `Got ${data.data.length} action comics` };
      }
    );

    // Test 4: Sort by Rating
    await this.testEndpoint(
      "Sort by Rating",
      `${baseUrl}/api/comics?sort=rating&limit=5`,
      (data) => {
        const ratings = data.data.map((c) => c.rating);
        const sorted = [...ratings].sort((a, b) => b - a);
        const isCorrect = JSON.stringify(ratings) === JSON.stringify(sorted);

        if (!isCorrect) {
          return {
            pass: false,
            message: `Ratings not sorted: ${ratings.join(", ")}`,
          };
        }

        return {
          pass: true,
          message: `Correctly sorted: ${ratings.join(" > ")}`,
        };
      }
    );

    // Test 5: Search
    await this.testEndpoint(
      "Search Comics",
      `${baseUrl}/api/comics?search=one&limit=5`,
      (data) => {
        if (data.data.length === 0) {
          return {
            pass: false,
            message: 'No search results (check if comics with "one" exist)',
          };
        }

        const allMatch = data.data.every((comic) =>
          comic.title.toLowerCase().includes("one")
        );

        if (!allMatch) {
          return { pass: false, message: "Not all results match search term" };
        }

        return { pass: true, message: `Found ${data.data.length} comics` };
      }
    );

    // Test 6: User Profile (if logged in)
    const token = localStorage.getItem("token");
    if (token) {
      await this.testEndpoint(
        "User Profile with Relations",
        `${baseUrl}/api/user/profile`,
        (data) => {
          if (!data.user) {
            return { pass: false, message: "No user data" };
          }

          if (!Array.isArray(data.user.bookmarks)) {
            return { pass: false, message: "bookmarks is not an array" };
          }

          if (!Array.isArray(data.user.readHistory)) {
            return { pass: false, message: "readHistory is not an array" };
          }

          // Check if bookmark has comic relation
          if (data.user.bookmarks.length > 0) {
            const firstBookmark = data.user.bookmarks[0];
            if (!firstBookmark.comic) {
              return {
                pass: false,
                message: "Bookmark missing comic relation",
              };
            }
            if (!Array.isArray(firstBookmark.comic.genres)) {
              return {
                pass: false,
                message: "Comic in bookmark missing genres",
              };
            }
          }

          return {
            pass: true,
            message: `User: ${data.user.username}, Bookmarks: ${data.user.bookmarks.length}, History: ${data.user.readHistory.length}`,
          };
        }
      );
    } else {
      console.log("⚠️  Skipping user profile test (not logged in)");
    }

    // Print Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 TEST SUMMARY");
    console.log("=".repeat(60));

    const passed = this.results.filter((r) => r.status === "PASS").length;
    const failed = this.results.filter((r) => r.status === "FAIL").length;
    const errors = this.results.filter((r) => r.status === "ERROR").length;
    const total = this.results.length;

    console.log(`\n✅ Passed: ${passed}/${total}`);
    console.log(`❌ Failed: ${failed}/${total}`);
    console.log(`⚠️  Errors: ${errors}/${total}`);

    if (failed > 0 || errors > 0) {
      console.log("\n⚠️  FAILED TESTS:");
      this.results
        .filter((r) => r.status !== "PASS")
        .forEach((r) => {
          console.log(
            `   ${r.status === "FAIL" ? "❌" : "⚠️"} ${r.name}: ${r.message}`
          );
        });
    }

    console.log("\n" + "=".repeat(60));

    if (passed === total) {
      console.log("🎉 ALL TESTS PASSED! Migration is working correctly.");
      return true;
    } else {
      console.log("⚠️  Some tests failed. Please check the errors above.");
      return false;
    }
  },
};

// Quick access
window.runAllTests = () => window.testMigration.runAllTests();

console.log("✅ Test runner loaded!");
console.log("Run: await runAllTests()");
