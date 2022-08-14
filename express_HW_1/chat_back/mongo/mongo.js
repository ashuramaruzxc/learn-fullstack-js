const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log(`connect successfully`)
});


// Scheme
const messageSchema = new mongoose.Schema({
    nickName: String,
    message: String,
    timestamp: Number
});

//создается КЛАСС по этой схеме
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;




