const express = require("express")
const PORT = 2304
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')


// npm install express ejs body-parser express-validator
// npm install -dev nodemon/-g nodemon (sollte es nicht schon installiert sein)

const app = express()
app.set("view engine", "ejs")

const users = []

app.use(bodyParser.urlencoded())
console.log(bodyParser);

app.use((req, _, next) => {
    console.log("New Request", req.method, req.url);
    next()
})

app.use(express.static("public"))

app.get("/", (_, res) => {
    res.render("home", { users })
})

app.post(
    "/neueUser",
    body("name").isLength({ min: 1, max: 20 }),
    body("nachname").isLength({ min: 1, max: 20 }),
    body("email").isEmail(),
    body("message").isLength({ min: 1, max: 100 }),
    (req, res) => {
        const neuerUser = req.body

        const errors = validationResult(req)
        const isValidUser = errors.isEmpty()

        if (!isValidUser) {
            const validationErrors = errors.array()
            res.render("invalidInputError", {
                description: "user input is invalid, please try again...",
                validationErrors
            })
            console.log(validationErrors);
            return
        }

        const userExistsAlready = users.find(user => user.username === neuerUser.username)
        if (userExistsAlready) {
            res.render("invalidInputError", {
                description: "user already exists",
                validationErrors: [] // warum?
            })
            return
        }

        users.push(neuerUser)
        res.redirect("/")
    }
)






app.listen(PORT, () => console.log("Server listing to Port: ", PORT))