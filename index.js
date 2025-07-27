const express = require("express");
const dotenv = require("dotenv");
const app = express();
const database=require('./config/database')
const cookieParser = require("cookie-parser");
const {cloudinaryConnect}=require("./config/cloudinary")
const fileUpload = require("express-fileupload");
const userRoutes = require("./routes/user");
const PORT = 5000;
const airoutes=require("./routes/ai")
const searchFareRoutes=require("./routes/searchFareRoutes")
const ticketsRoutes=require("./routes/ticketsRoutes")
const packageRoutes=require("./routes/packageRoutes")
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes=require("./routes/adminRoutes")
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const mailSender = require("../utils/mailSender");





dotenv.config();
database.connect()
cloudinaryConnect();

app.use(express.json());
app.use(cookieParser());
app.use(
	fileUpload({
		useTempFiles: true,
		tempFileDir: "/tmp/",
	})
);



app.use(
  cors({
    origin: [
      // "http://localhost:5173",
       process.env.FRONT_END_URL
    ],
    credentials: true,
  })
);




//routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1",airoutes)
app.use("/api/v1/fare",searchFareRoutes)
app.use("/api/v1",ticketsRoutes)
app.use("/api/v1/package",packageRoutes)
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/auth", authRoutes);

router.get("/test-mail", async (req, res) => {
  try {
    const html = resetPasswordTemplate("https://example.com/reset-password/test123");
    await mailSender("yourmail@gmail.com", "Test Mail", html);
    res.send("Mail sent");
  } catch (e) {
    console.log(e);
    res.send("Failed");
  }
});


app.get("/api/v1", (req, res) => {
  res.status(200).json({ message: "Smart Yatra API working!" });
});


app.listen(PORT, () => {
});
