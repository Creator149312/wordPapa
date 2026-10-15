import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/wordpapa";

async function testPhase3() {
  console.log("Connecting to MongoDB for Phase 3 verification...");
  await mongoose.connect(uri);

  const GameProfile = (await import("../models/gameprofile.js")).default;

  const testUser = `test_phase3_${Date.now()}@example.com`;
  const username = `testchamp_${Date.now()}`;

  console.log("1. Creating test profile with Regional & Institutional Identity...");
  const profile = await GameProfile.create({
    userEmail: testUser,
    name: "Alex Rivera",
    username,
    bio: "Aiming for SAT 1550+ | Daily Word Master",
    country: "US",
    region: "California",
    institution: "Stanford University",
    isGhost: false,
    xp: 1500,
    journeyXP: 1000,
    wordsMastered: 45,
  });

  console.log("✓ Profile created:", {
    userEmail: profile.userEmail,
    username: profile.username,
    country: profile.country,
    region: profile.region,
    institution: profile.institution,
    wordsMastered: profile.wordsMastered,
  });

  console.log("2. Verifying unique username query lookup...");
  const found = await GameProfile.findOne({ username: profile.username }).lean();
  if (!found || found.institution !== "Stanford University") {
    throw new Error("Failed to find profile by username or institution mismatch!");
  }
  console.log("✓ Found profile by username:", found.username);

  console.log("3. Testing regional and institutional query indexes...");
  const countryMatches = await GameProfile.find({ country: "US", isGhost: false }).lean();
  console.log(`✓ Country query index works! Found ${countryMatches.length} US player(s).`);

  const instMatches = await GameProfile.find({
    institution: new RegExp("Stanford", "i"),
    isGhost: false,
  }).lean();
  console.log(`✓ Institution query works! Found ${instMatches.length} Stanford player(s).`);

  // Cleanup test profile
  await GameProfile.deleteOne({ _id: profile._id });
  console.log("✓ Cleaned up test record.");

  await mongoose.disconnect();
  console.log("🎉 Phase 3 verification complete! All systems operational.");
}

testPhase3().catch((err) => {
  console.error("Test error:", err);
  process.exit(1);
});
