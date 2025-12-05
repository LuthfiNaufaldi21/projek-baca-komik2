// index.js (Komiku Rest API)

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const path = require("path"); // 👈 BARU: Import path

// Load environment variables
dotenv.config();

// Panggil fungsi koneksi DB PostgreSQL
connectDB();

// Tambahkan penanganan error global
process.on("uncaughtException", (err) => {
  console.error("Ada error yang tidak tertangkap:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

const app = express();
const port = process.env.PORT || 5000;
const rateLimiter = require("./middleware/rateLimiter");

// 🎯 KODE BARU: Middleware untuk melayani file statis (avatar)
// Mengizinkan akses ke folder /public dari root URL
app.use(express.static(path.join(__dirname, "public")));

// Middleware untuk memparsing JSON body
app.use(express.json());

// 🔍 Request Logger Middleware
app.use((req, res, next) => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  // Log request
  console.log(`\n🌐 [${timestamp}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log("📦 Body:", JSON.stringify(req.body, null, 2));
  }
  if (req.headers.authorization) {
    console.log("🔑 Auth:", req.headers.authorization.substring(0, 20) + "...");
  }

  // Log response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - startTime;
    console.log(`✅ [${duration}ms] Status: ${res.statusCode}`);
    originalSend.call(this, data);
  };

  next();
});

app.use(rateLimiter);

// Middleware for CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Komiku Rest API",
      version: "1.0.0",
      description: "API untuk mengambil data komik dari Komiku",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const comicRoutes = require("./routes/comicRoutes");
const rekomendasiRoute = require("./routes/rekomendasi");
const terbaruRoute = require("./routes/terbaru");
const pustakaRouter = require("./routes/pustaka");
const komikPopulerRoute = require("./routes/komik-populer");
const detailKomikRoute = require("./routes/detail-komik");
const bacaChapterRoute = require("./routes/baca-chapter");
const searchRoute = require("./routes/search");
const berwarnaRoute = require("./routes/berwarna");
const genreAll = require("./routes/genre-all");
const genreDetail = require("./routes/genre-detail");
const genreRekomendasi = require("./routes/genre-rekomendasi");

// Endpoint Otentikasi dan User Terproteksi
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/comics", comicRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Komiku Rest API",
    version: "1.0.0",
    endpoints: [
      "/api/auth/register",
      "/api/auth/login",
      "/api/user/profile",
      "/rekomendasi",
      "/trending",
      "/terbaru-2",
      "/terbaru",
      "/pustaka",
      "/berwarna",
      "/komik-populer",
      "/detail-komik/:slug",
      "/baca-chapter/:slug/:chapter",
      "/search?q=keyword",
      "/genre-detail/:slug",
    ],
  });
});

app.use("/rekomendasi", rekomendasiRoute);
app.use("/terbaru", terbaruRoute);
app.use("/pustaka", pustakaRouter);
app.use("/komik-populer", komikPopulerRoute);
app.use("/detail-komik", detailKomikRoute);
app.use("/baca-chapter", bacaChapterRoute);
app.use("/search", searchRoute);
app.use("/berwarna", berwarnaRoute);
app.use("/genre-all", genreAll);
app.use("/genre-rekomendasi", genreRekomendasi);
app.use("/genre", genreDetail);

app.listen(port, () => {
  console.log(`Server jalan di http://localhost:${port}`);
});

module.exports = app;
