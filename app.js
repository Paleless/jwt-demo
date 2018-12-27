const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const R = require('ramda')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const cors = require('cors')


//---data
const users = [
    { id: 1, username: 'admin', password: 'admin' },
    { id: 2, username: 'guest', password: "guest" }
]

const secret = 'my secret key'
//--

app.use(cors())
app.use(bodyParser.json())
app.use(express.static(__dirname))
app.use(expressJwt({ secret }).unless({ path: ['/login', '/resource'] }))
app.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        res.status(401)
            .send('invalid token')
    }
})

app.post('/login', (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400)
            .send('you need a username and password')
        return
    }
    const user = users.find(user => {
        return user.username === req.body.username &&
            user.password === req.body.password
    })
    if (!user) {
        res.status(401)
            .send('user no found')
        return
    }
    const token = jwt.sign(user, secret, { expiresIn: '3 hours' })
    res.status(200)
        .json({ token })

})

app.get('/resource', (req, res) => {
    res.end('public')
})
app.get('/resource/secret', (req, res) => {
    console.log(req.user)
    res.end('secret')
})

const server = app.listen(3000, () => {
    console.log('your server is running at localhost:3000/')
})