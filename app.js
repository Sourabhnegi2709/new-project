if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const cookieParser = require("cookie-parser");
const Session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const { listingSchema } = require("./schema.js")
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require("console");


const dbUrl = process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.engine('ejs', engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.json());


const store = MongoStore.create({
  mongoUrl : dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,
});

store.on("error", () =>{
  console.log("error in our mongo-session store", err)
});

const sessionOption ={
  store:store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookies: {
    expires: Date.now() + 7 * 24 *60 * 60 *1000,
    maxAge:  7 * 24 *60 * 60 *1000,
    httpOnly: true,
  },
};




app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(Session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) =>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user || null;
  next();
});

// app.get("/demoUser", async (req, res) => {
//   try {
//     const existingUser = await User.findOne({ email: "student@gmail.com" });
//     if (existingUser) {
//       return res.send(existingUser);
//     }
//     const fakeUser = new User({
//       email: "student@gmail.com",
//       username: "delta-student",
//     });
//     const registeredUser = await User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error creating demo user");
//   }
// });



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter); 



app.all("*", (req, res, next) =>{
  next(new ExpressError(404,"page not found"));
})

app.use((err,req, res, next) =>{
  let { statusCode = 500, message = "something went wrong"} = err;
  res.status(statusCode).render("error.ejs",{message});
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});






