
const express = require(`express`)
const domainSet = require(`./model/mongo`)
const bodyParser = require(`body-parser`)

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


app.get(`/list`, (req, res, next) => {
	let length = req.query.length*1
	if(typeof length == `undefined`){
		length = 30
	}
	domainSet.find({}).sort({views :-1}).limit(length)
		.then(domain => res.json(domain))
		.catch(err => {
			console.error(err)
			next(err)
		})
})


app.post(`/domain`, (req, res, next) => {
	domainSet.exists({domainURL:req.body.domainUrl}).then(check => {
		if(check){
			domainSet.updateOne({domainURL:req.body.domainUrl}, {$inc:{views:1}}).exec()
				.then(() => {
					res.status(200).json('updated')
				})
				.catch(err => {
					console.error(err)
					next(err)
				})
		}
		else{
			domainSet.create({
				domainURL:req.body.domainUrl,
				views:0,
			}).then(() => {
				res.status(200).json('created')
			})
			.catch(err => {
				console.error(err)
				next(err)
			})
		}
	})
	
})

// catch 404 and forward to error handler
// error handler
// app.use((err, req, res, next) => {
// 	// set locals, only providing error in development
// 	res.locals.message = err.message
// 	res.locals.error = req.app.get(`env`) === `development` ? err : {}

// 	// render the error page
// 	res.status(err.status || 500)
// 	res.render(`error`)
// })
app.listen(8000, () => {
	console.log(`Express server listening on port 8000`)
})
module.exports = app
