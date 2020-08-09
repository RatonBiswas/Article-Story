const mongoose = require("mongoose");
const chalk = require('chalk');
const connectDB = async () =>{
    try {
        const  conn = await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        console.log(`MOngoDB connected successfully ${chalk.greenBright(conn.connection.host)}`);
    } catch (err) {
        console.log(err)
        process.exit(1)
    }
}

module.exports = connectDB;