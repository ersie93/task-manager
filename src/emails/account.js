const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: process.env.SENDER_EMAIL,
		subject: 'Thanks for joining',
		text: `Welcome to the app ${name}, have fun!!!`
	})
}

const sendCancellationEmail = (email, name) => {
	sgMail.send({
		to: email,
		from: process.env.SENDER_EMAIL,
		subject: 'Sorry to see you leave',
		text: `Im sorry ${name} to see you cancel your account!!`
	})
}

module.exports = {
	sendWelcomeEmail,
	sendCancellationEmail
}
