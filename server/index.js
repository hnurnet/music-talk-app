import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import db from "./database/db.js";
import bcrypt from "bcrypt";

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

const saltRounds = 10;

app.post('/signup', (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if(err) {
            res.status(418).send(`Couldn't hash password ...`)
        }
        else {
            const sql = `INSERT INTO users (username,password) VALUES (?,?)`;
    db.query(sql,[username,hashedPassword], (err,result) => {
        if(err) {
           res.status(418).send(`Couldn't register user 😒`)
        }
        else {
            res.send({username: username})
        }
    })   
        }
    })
})

app.post('/signin', (req,res) => {
    const username = req.body.username
    const password = req.body.password
    const sql = "SELECT * FROM users WHERE username = ?";
    db.query(sql,[username], (err, result) => {
        if(err) {
            res.status(418).send(err.message)
        }
        else if (result.length < 1 ) {
            res.status(418).send(`User name doesn't match 😒`)
        }
        else {
            bcrypt.compare(password, result[0].password, (err, match) => {
                if (match) {
                    res.send({username})
                }
                if (!match) {
                    res.status(418).send(`Password doesn't match 😒`)
                }
            })
        }
    })
})

app.get('/find-friends', (req,res) => {
    const username = req.query.user;
    // Select all users != friends of the user
    const sql = "SELECT u.username FROM users u WHERE u.user_id NOT IN (SELECT f.friend FROM friends f WHERE user = (SELECT u.user_id FROM users u WHERE username = ?)) AND username != ?"
    db.query(sql,[username,username], (err,result) => {
        if(err) {
            res.status(418).send(`An error occurred 😒`)
        }
        if(result) {
            res.send(result)
        }
    })
})

app.post(`/:id/add-friend`, (req,res) => {
    const user = req.params.id;
    const friend = req.body.username;
    console.log({user})
    console.log({friend})
    const sql = "INSERT INTO friends (user, friend) VALUES ((SELECT user_id FROM users WHERE username = ?), (SELECT user_id FROM users WHERE username = ?))";
    db.query(sql,[user, friend], (err, result) => {
        if(err) {
            console.log(err)
            res.status(418).send(`An error occurred 😒`)
        }
        if (result) {
            res.send({added: true})

        }
    })

    
})



app.listen(8800, () => console.log("Server Connected on port 8800!"))
