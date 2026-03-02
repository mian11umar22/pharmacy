// Global singleton for OTP store to survive hot-reloads in Next.js development
let otpStore;

if (process.env.NODE_ENV === 'production') {
    otpStore = new Map();
} else {
    if (!global._otpStore) {
        global._otpStore = new Map();
    }
    otpStore = global._otpStore;
}

export const saveOTP = (email, otp) => {
    const expiry = Date.now() + 15 * 60 * 1000; // 15 mins
    const normalizedEmail = email.toLowerCase().trim();
    otpStore.set(normalizedEmail, { otp, expiry });
    console.log(`💾 [OTP_STORE] Saved for ${normalizedEmail}: ${otp} (Total active: ${otpStore.size})`);
};

export const verifyOTP = (email, otp) => {
    const normalizedEmail = email.toLowerCase().trim();
    const record = otpStore.get(normalizedEmail);

    if (!record) {
        console.log(`❌ [OTP_STORE] No record found for ${normalizedEmail}. Currently stored emails: ${Array.from(otpStore.keys()).join(', ')}`);
        return { valid: false, message: 'No OTP found for this email. Please request a new one.' };
    }

    if (record.expiry < Date.now()) {
        otpStore.delete(normalizedEmail);
        console.log(`❌ [OTP_STORE] Expired for ${normalizedEmail}`);
        return { valid: false, message: 'OTP has expired' };
    }

    if (record.otp !== otp) {
        console.log(`❌ [OTP_STORE] Mismatch for ${normalizedEmail}. Input: "${otp}", Store: "${record.otp}"`);
        return { valid: false, message: 'Invalid OTP code' };
    }

    console.log(`✅ [OTP_STORE] Verified for ${normalizedEmail}`);
    return { valid: true };
};

export const clearOTP = (email) => {
    otpStore.delete(email.toLowerCase().trim());
    console.log(`🧹 [OTP_STORE] Cleared for ${email}. (Remaining: ${otpStore.size})`);
};
