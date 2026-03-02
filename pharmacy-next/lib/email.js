import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

// Send email helper
async function sendEmail({ to, subject, html }) {
    console.log(`📡 Attempting to send email to: ${to} using ${process.env.EMAIL_USER}`)
    try {
        const info = await transporter.sendMail({
            from: `"Hope Pharmacy" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        })
        console.log(`✅ Email sent successfully: ${info.messageId}`)
    } catch (error) {
        console.error('❌ Email sending failed!')
        console.error('Error Name:', error.name)
        console.error('Error Message:', error.message)
        if (error.code === 'EAUTH') {
            console.error('Authentication Error: Check EMAIL_USER and EMAIL_PASS.')
        }
    }
}

// ==================== Email Templates ====================

export async function sendOrderConfirmation(order, customerEmail) {
    const itemsHtml = order.items.map(item => `
        <tr>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${item.name}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">Rs. ${item.price * item.quantity}</td>
        </tr>
    `).join('')

    const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
        <div style="background: #16a34a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">✅ Order Confirmed!</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Order #${order.orderNumber}</p>
        </div>
        
        <div style="padding: 24px; background: #fff; border: 1px solid #e5e7eb;">
            <p>Dear ${order.shippingAddress.name},</p>
            <p>Thank you for your order! We've received your order and will process it shortly.</p>

            <h3 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 8px;">Order Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f9fafb;">
                        <th style="padding: 8px 12px; text-align: left;">Item</th>
                        <th style="padding: 8px 12px; text-align: center;">Qty</th>
                        <th style="padding: 8px 12px; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>

            <div style="margin-top: 16px; padding: 12px; background: #f0fdf4; border-radius: 8px;">
                <p style="margin: 4px 0;"><strong>Subtotal:</strong> Rs. ${order.subtotal}</p>
                <p style="margin: 4px 0;"><strong>Delivery:</strong> Rs. ${order.deliveryFee}</p>
                <p style="margin: 4px 0; font-size: 18px;"><strong>Total: Rs. ${order.total}</strong></p>
            </div>

            <h3 style="color: #16a34a; margin-top: 20px;">Shipping Address</h3>
            <p style="margin: 4px 0;">${order.shippingAddress.name}</p>
            <p style="margin: 4px 0;">${order.shippingAddress.address}</p>
            <p style="margin: 4px 0;">${order.shippingAddress.city}</p>
            <p style="margin: 4px 0;">Phone: ${order.shippingAddress.phone}</p>
            
            <p style="margin-top: 20px; color: #666;">Payment Method: <strong>Cash on Delivery</strong></p>
        </div>

        <div style="padding: 16px; background: #f9fafb; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #666; font-size: 13px;">Hope Pharmacy — Your Trusted Health Partner</p>
        </div>
    </div>`

    await sendEmail({
        to: customerEmail,
        subject: `Order Confirmed! #${order.orderNumber} — Hope Pharmacy`,
        html,
    })
}

export async function sendOrderStatusUpdate(order, customerEmail) {
    const statusMessages = {
        processing: { title: '🔧 Order is Being Processed', message: 'We are preparing your order for shipment.' },
        shipped: { title: '🚚 Order Shipped!', message: 'Your order is on its way! You will receive it soon.' },
        delivered: { title: '📦 Order Delivered!', message: 'Your order has been delivered. Thank you for shopping with us!' },
        cancelled: { title: '❌ Order Cancelled', message: 'Your order has been cancelled. If you have any questions, please contact us.' },
    }

    const status = statusMessages[order.status] || { title: 'Order Update', message: `Your order status is now: ${order.status}` }

    const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #333;">
        <div style="background: #16a34a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 22px;">${status.title}</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0;">Order #${order.orderNumber}</p>
        </div>
        
        <div style="padding: 24px; background: #fff; border: 1px solid #e5e7eb;">
            <p>Dear ${order.shippingAddress.name},</p>
            <p>${status.message}</p>

            <div style="padding: 16px; background: #f0fdf4; border-radius: 8px; text-align: center; margin: 16px 0;">
                <p style="margin: 0; font-size: 14px; color: #666;">Current Status</p>
                <p style="margin: 4px 0 0; font-size: 20px; font-weight: bold; color: #16a34a; text-transform: uppercase;">${order.status}</p>
            </div>

            <p style="margin: 4px 0;"><strong>Order Total:</strong> Rs. ${order.total}</p>
            <p style="margin: 4px 0;"><strong>Items:</strong> ${order.items.length} products</p>
        </div>

        <div style="padding: 16px; background: #f9fafb; text-align: center; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb; border-top: none;">
            <p style="margin: 0; color: #666; font-size: 13px;">Hope Pharmacy — Your Trusted Health Partner</p>
        </div>
    </div>`

    await sendEmail({
        to: customerEmail,
        subject: `${status.title} — Order #${order.orderNumber}`,
        html,
    })
}

export async function sendAdminNewOrderNotification(order) {
    const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: #1B3A4B; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0;">🔔 New Order Received!</h1>
        </div>
        <div style="padding: 24px; background: #fff; border: 1px solid #e5e7eb;">
            <p><strong>Order:</strong> #${order.orderNumber}</p>
            <p><strong>Customer:</strong> ${order.shippingAddress.name}</p>
            <p><strong>Phone:</strong> ${order.shippingAddress.phone}</p>
            <p><strong>Total:</strong> Rs. ${order.total}</p>
            <p><strong>Items:</strong> ${order.items.length} products</p>
            <p><strong>Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
        </div>
    </div>`

    await sendEmail({
        to: process.env.NOTIFY_EMAIL,
        subject: `🔔 New Order #${order.orderNumber} — Rs. ${order.total}`,
        html,
    })
}

export async function sendOTPEmail(email, otp, userName) {
    const html = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6;">
        <div style="background: #1B3A4B; padding: 40px 20px; text-align: center; border-radius: 16px 16px 0 0;">
            <div style="display: inline-block; width: 60px; height: 60px; background: #16a34a; border-radius: 12px; line-height: 60px; font-size: 24px; color: white; font-weight: bold; margin-bottom: 20px;">H+</div>
            <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">Password Reset</h1>
        </div>
        
        <div style="padding: 40px 30px; background: #ffffff; border: 1px solid #eef2f3; border-top: none; border-radius: 0 0 16px 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
            <p style="font-size: 16px; margin-bottom: 25px;">Hello <strong>${userName}</strong>,</p>
            <p style="margin-bottom: 25px;">We received a request to reset your password. Use the following 6-digit verification code to proceed:</p>
            
            <div style="background: #f8fafb; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; border: 1px dashed #cbd5e1;">
                <span style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #16a34a; font-family: monospace;">${otp}</span>
            </div>
            
            <p style="font-size: 14px; color: #64748b; text-align: center; margin-bottom: 25px;">This code is valid for <strong>15 minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
            
            <div style="border-top: 1px solid #f1f5f9; padding-top: 25px; margin-top: 25px;">
                <p style="font-size: 13px; color: #94a3b8; margin: 0; text-align: center;">Hope Pharmacy — Pakistans's Premium Pharmacy</p>
            </div>
        </div>
    </div>`

    await sendEmail({
        to: email,
        subject: `${otp} is your Hope Pharmacy verification code`,
        html,
    })
}
