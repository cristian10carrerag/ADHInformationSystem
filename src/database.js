const mongoose = require('mongoose')


const {PSA_APP_HOST, PSA_APP_DATABASE} = process.env;
const MONGODB_URI = `mongodb://${PSA_APP_HOST}/${PSA_APP_DATABASE}`;


mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(db => console.log('Database is connected'))
.catch(err => console.log(err));
    