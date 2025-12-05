const { connectDB } = require("./config/db");
const { User } = require("./models");

async function testConnection() {
  try {
    console.log("🔌 Testing database connection...");
    await connectDB();

    console.log("\n📋 Testing User model...");
    const userCount = await User.count();
    console.log(`✅ User count: ${userCount}`);

    console.log("\n🔍 Testing User schema...");
    const sampleUser = await User.findOne();
    if (sampleUser) {
      console.log("✅ Sample user found:", {
        id: sampleUser.id,
        username: sampleUser.username,
        email: sampleUser.email,
        role: sampleUser.role,
        created_at: sampleUser.created_at,
      });
    } else {
      console.log("⚠️  No users found in database");
    }

    console.log("\n✅ All tests passed!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

testConnection();
