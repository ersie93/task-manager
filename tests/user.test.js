const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
	name: 'Mike',
	email: 'mike@example.com',
	password: 'mike1234'
}

beforeEach( async () => {
	await User.deleteMany()
	await new User(userOne).save()
})

test('Should signup new user', async () => {
	await request(app).post('/users').send({
		name: 'Ryan',
		email: 'ryan@example.com',
		password: 'ryan1234'
	}).expect(201)
})

test('Should login user', async () => {
	await request(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200)
})

test('Should not login nonexistent user', async () => {
	await request(app).post('/users/login').send({
		email: 'user@fail.com',
		password: 'failed1234'
	}).expect(400)
})