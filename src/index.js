const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
	console.log("listening on port " + port)
})

const User = require('./models/user')

const main = async () => {
	// const task = await Task.findById('60faaef0d0c8cc61efe63f2a')
	// await task.populate('owner').execPopulate()
	// console.log(task.owner)

	const user = await User.findById("60faaeced0c8cc61efe63f21")
	await user.populate('tasks').execPopulate()
	console.log(user.tasks)
}

main()