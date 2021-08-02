const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')


beforeEach( setupDatabase )

test('Should signup new user', async () => {
	const response = await request(app).post('/users').send({
		name: 'Ryan',
		email: 'ryan@example.com',
		password: 'ryan1234'
	}).expect(201)

	const user = await User.findById(response.body.user._id)
	expect(user).not.toBeNull()

	expect(response.body).toMatchObject({
		user: {
			name: "Ryan",
			email: "ryan@example.com"
		},
		token: user.tokens[0].token
	})

	expect(user.password).not.toBe('ryan1234')
})

test('Should login user', async () => {
	const response = await request(app).post('/users/login').send({
		email: userOne.email,
		password: userOne.password
	}).expect(200)

	const user = await User.findById(userOneId)
	expect(user).not.toBeNull()

	expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not login nonexistent user', async () => {
	await request(app).post('/users/login').send({
		email: 'user@fail.com',
		password: 'failed1234'
	}).expect(400)
})

test('Should get profile for user', async () => {
	await request(app)
		.get('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}` )
		.send()
		.expect(200)
})

test('Should not get profile for unauthorized user', async () => {
	await request(app)
		.get('/users/me')
		.send()
		.expect(401)
})

test('Should delete account for user', async () => {
	await request(app)
		.delete('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send()
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user).toBeNull()
})

test('Should not delete account for unauthorized user', async () => {
	await request(app)
		.delete('/users/me')
		.send()
		.expect(401)
})

test('Should upload avatar image', async () => {
	await request(app)
		.post('/users/me/avatar')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.attach('avatar', 'tests/fixtures/profile.png')
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should upate valid user fields', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			name: 'Ryan Erswell'
		})
		.expect(200)

	const user = await User.findById(userOneId)
	expect(user.name).toBe('Ryan Erswell')

})

test('Should not update invalid user field', async () => {
	await request(app)
		.patch('/users/me')
		.set('Authorization', `Bearer ${userOne.tokens[0].token}`)
		.send({
			location: "the moon"
		})
		.expect(400)
})

