const rateLimit = require("express-rate-limit");

// Rate limiting middleware
// Development: More lenient limits for testing
// Production: Stricter limits to prevent abuse
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window (instead of 15 minutes)
  max: process.env.NODE_ENV === "production" ? 100 : 500, // 500 requests per minute in dev, 100 in prod
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      "Terlalu banyak request dari IP ini, silakan coba lagi setelah 1 menit",
  },
  // Skip rate limiting for localhost in development
  skip: (req) => {
    return (
      process.env.NODE_ENV !== "production" &&
      (req.ip === "127.0.0.1" ||
        req.ip === "::1" ||
        req.ip === "::ffff:127.0.0.1")
    );
  },
});

module.exports = limiter;
