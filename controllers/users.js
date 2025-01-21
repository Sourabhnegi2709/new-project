const UserActivation = require("../models/user");


module.exports.signup =async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Ensure all required fields are provided
        if (!username || !email || !password) {
            req.flash("error", "All fields are required.");
            return res.redirect("/signup");
        }

        // Create a new user
        const newUser = new UserActivation({ email, username });
        const registeredUser = await UserActivation.register(newUser, password);
        console.log("New user registered:", registeredUser);

        // Automatically log in the user after signup
        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listing");
        });
    } catch (error) {
        console.error("Signup error:", error);

        // Handle specific error cases (e.g., email already exists)
        if (error.name === "UserExistsError") {
            req.flash("error", "A user with the given email or username already exists.");
        } else {
            req.flash("error", error.message || "Something went wrong. Please try again.");
        }
        res.redirect("/signup");
    }
};

module.exports.login = async (req, res)=>{
    res.render("users/login.ejs");
}

module.exports.loginCheck =  async  (req, res)=>{
    req.flash("success","Welcome to wanderlust! You are logged in")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = async (req, res, next)=>{
    req.logout((err) =>{
        if(err){
        return next(err);
        }
        req.flash("success", "you are logged out");
        res.redirect("/listings");
    })
}








