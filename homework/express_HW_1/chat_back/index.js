const express = require('express')
const app = express()
const bodyParser = require(`body-parser`)
const port = 4000

const Message = require(`./mongo/mongo`)

let history = []




app.use(bodyParser.json());
app.use(express.static(`public`))


app.get('/message', async (req, res) =>{

    res.send(await Message.find())
});

app.get('/message/:id', async (req, res) =>
    res.send(
        await Message.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
    )
)

app.post('/message', async (req, res) => {

    let newMessage = new Message({...req.body, timestamp: new Date().getTime()}) //создание сообщения с полями nick и message. Можно и newMessage.nick = req.body.nick
    await newMessage.save() //сохранение
    res.status(201).send(newMessage) //201 - Entity Created Code. Возвращаем запись из бд с _id
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

/*
app.get('/message', (req, res) => {
    res.send(JSON.stringify(history))
})

app.post('/message', (req, res) => {
    history.push({...req.body, timestamp: new Date().getTime()})
    console.log(req.body)
    res.status(201).send(JSON.stringify(history));
})

*/