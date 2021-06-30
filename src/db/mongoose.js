const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true
})

const User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		trim: true
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		validate(value){
			if(!validator.isEmail(value)){
				throw new Error('Email is invalid')
			}
		}
	},
	age: {
		type: Number,
		default: 0,
		validate(value) {
			if( value < 0 ){
				throw new Error('Age must be a positive number');
			}
		}
	},
	password: {
		type: String,
		required: true,
		trim: true,
		minLength: 6,
		validate(value){
			if(value.toLowerCase().match('password')){
				throw new Error('password must not contain password')
			}
		}
	}
})

// const me = new User({
// 	name: '   Ryan Erswell   ',
// 	email: 'me@EMAIL.io ',
// 	password: 'Pword7777'
// })

// me.save().then(() => { 
// 	console.log(me)
// }).catch((error) => {
// 	console.log('error', error.message)
// })

const Task = mongoose.model('Task', {
	description: {
		type: String,
		required: true,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	}
})

const newTask = new Task({
	description: "do some coding     ",
	completed: false
})

newTask.save().then(() => {
	console.log(newTask)
}).catch((error) => {
	console.log('Error', error.message)
})





