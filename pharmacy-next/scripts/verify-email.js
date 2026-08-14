import nodemailer from 'nodemailer'
import pkg from '@next/env'
const { loadEnvConfig } = pkg
loadEnvConfig(process.cwd())

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

transporter.verify()
    .then(() => console.log('✅ EMAIL_USER and EMAIL_PASS are valid — SMTP login succeeded.'))
    .catch((err) => {
        console.error('❌ Verification failed:', err.message)
        if (err.code === 'EAUTH') {
            console.error('This usually means: wrong password, or you need a Gmail App Password (not your normal Gmail password) with 2FA enabled.')
        }
    })
