const express = require("express")
const PORT = 2304
const bodyParser = require('body-parser')
const { body, validationResult } = require('express-validator')
const fs = require("fs")
const path = require("path")
const users = require('./userlist.json')
    // const config = require("./config.json")


// npm install express ejs body-parser express-validator
// npm install -dev nodemon/-g nodemon (sollte es nicht schon installiert sein)

const app = express()
app.set("view engine", "ejs")

app.use(bodyParser.urlencoded())
    // console.log(bodyParser);

app.use((req, _, next) => {
    console.log("New Request", req.method, req.url);
    next()
})

app.use(express.static("public"))

app.get("/", (_, res) => {
    res.render("home", { users })
})

// fs.readFile("./data.json", 'utf-8', (err, data) =>{
//     if(err){
//         console.log("Error in readfile error.son");
//     }
//     else {
//         users = JSON.parse(data)
//     }
// })

app.post(
    "/neueUser",
    body("name").isLength({ min: 1, max: 20 }),
    body("nachname").isLength({ min: 1, max: 20 }),
    body("email").isEmail(),
    body("message").isLength({ min: 1, max: 100 }),
    (req, res) => {
        const neuerUser = req.body
        console.log(neuerUser);
        const errors = validationResult(req)
        const isValidUser = errors.isEmpty()

        if (!isValidUser) {
            const validationErrors = errors.array()
            res.render("invalidInputError", {
                description: "user input is invalid, please try again...",
                validationErrors
            })
            return
        }

        const userExistsAlready = users.find(user => user.nachname === neuerUser.nachname)
        if (userExistsAlready) {
            res.render("invalidInputError", {
                description: "user already exists",
                validationErrors: [] // warum?
            })
            return
        }

        // fs.readFile("./config.json", "utf-8", (err, jsonString) => {
        //     if (err) {
        //         console.log("File read failed:", err);
        //         return
        //     }
        //     try {
        //         users = JSON.parse(jsonString)
        //         console.log("Costumoer address is:", users);
        //     } catch (err) {
        //         console.log("Error parsting JSOn String:", err);
        //     }
        // })

        users.push(neuerUser)

        fs.writeFile('./userlist.json', JSON.stringify(users), (err) => {
            if (err) {
                console.log('error wring json', err);
                return
            }
        })

        res.redirect("/")

    }
)



app.listen(PORT, () => console.log("Server listing to Port: ", PORT))