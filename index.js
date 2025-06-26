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
const cors = require("cors");




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
      "http://localhost:5173",
      "https://smartyatrafrontend.vercel.app"
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


app.get("/api/v1", (req, res) => {
  res.status(200).json({ message: "Smart Yatra API working!" });
});


app.listen(PORT, () => {
});
