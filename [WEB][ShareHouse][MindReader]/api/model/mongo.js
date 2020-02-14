const mongoose = require(`mongoose`)
const config = require(`../../config.json`)
mongoose.connect(`mongodb://${config.dbUser}:${config.dbPassword}@${config.dbIp}:${config.dbPort}`,{
	useNewUrlParser: true,
	useFindAndModify: false,
})

const db = mongoose.connection
const handleOpen = () => console.info(`DB connected.`)
const handleError = err => console.info(`DB Error : ${err}`)

db.once(`open`,handleOpen)
db.on(`error`,handleError)

const domainSet = new mongoose.Schema({
	domainURL:{
		type:String,
	},
	views:{
		type:Number,
		default: 0,
	},
})

module.exports = mongoose.model(`domainSet`,domainSet)

