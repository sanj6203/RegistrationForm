const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const username= process.env.MONGODB_USERNAME;
const password= process.env.MONGODB_PASSWORD;

const port = process.env.PORT || 3000;
main().then(()=>{
    console.log("db connected successfully")
}).catch(err => console.log(err));


async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/test');

  await mongoose.connect('mongodb+srv://sanjeet620395:muWuGzRjfRVIbCoT@cluster0.if75gpt.mongodb.net/Testing');
//   await mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.if75gpt.mongodb.net/Testing`);
}


const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name: name,
                email: email,
                password: password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            console.log("User already exists");
            res.redirect("/error");
        }
    } catch (err) {
        console.error(err);
        res.redirect("/error");
    }
});

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html");
});

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
