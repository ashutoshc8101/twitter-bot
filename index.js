// Importing neccessary modules //
const twitter = require('twitter')
const fs = require('fs')

// Configuring and initializing //
require('dotenv').config()

let client = new twitter({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token_key: process.env.ACCESS_KEY,
    access_token_secret: process.env.ACCESS_SECRET
})

let count;
let readStream = fs.createReadStream('count.dat')
readStream.on('data', (chunck) => {
    count = parseInt(chunck.toString('utf-8'))
    
    setInterval(() => {
        client.post('statuses/update', { status: `Tweet #${count}` })
            .then(tweet => {
                console.log(tweet.text)
                let stream = fs.createWriteStream('count.dat')
                stream.once('open', (fd) => {
                    stream.write(`${++count}`, (err) => {
                       if(err) throw err
                        stream.end()
                    })
                })
            })
            .catch(error => {
                console.log(error)
            })
    }, 5000)

})


