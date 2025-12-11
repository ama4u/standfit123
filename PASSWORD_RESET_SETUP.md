# Password Reset Setup Guide

This application now supports email-based password reset functionality. Follow these steps to configure it:

## Email Configuration

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it "Standfit Wholesale"
   - Copy the 16-character password

3. **Create `.env` file** in the project root:
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-16-char-app-password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   BASE_URL=http://localhost:5000
   ```

### Option 2: Other Email Services

#### SendGrid
```env
EMAIL_USER=apikey
EMAIL_PASSWORD=your-sendgrid-api-key
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
```

#### Mailgun
```env
EMAIL_USER=your-mailgun-smtp-username
EMAIL_PASSWORD=your-mailgun-smtp-password
EMAIL_HOST=smtp.mailgun.org
EMAIL_PORT=587
```

#### Mailtrap (Testing Only)
```env
EMAIL_USER=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
```

## Testing the Feature

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Test the forgot password flow**:
   - Go to `http://localhost:5000/login`
   - Click "Forgot Password?"
   - Enter a registered user's email
   - Check the email inbox for the reset link
   - Click the link and set a new password

3. **Expected behavior**:
   - User receives an email with a reset link
   - Link is valid for 1 hour
   - After resetting, user can log in with new password

## Production Setup

For production, update the `BASE_URL` in your `.env` file:
```env
BASE_URL=https://your-domain.com
```

## Troubleshooting

### Email not sending?
- Check your `.env` file is in the project root
- Verify email credentials are correct
- For Gmail, ensure you're using an App Password, not your regular password
- Check the server console for error messages

### "Email service not configured" error?
- Make sure `EMAIL_USER` and `EMAIL_PASSWORD` are set in `.env`
- Restart the server after adding environment variables

### Reset link expired?
- Links expire after 1 hour for security
- Request a new password reset

## Security Notes

- Reset tokens are hashed and stored securely
- Tokens expire after 1 hour
- Each token can only be used once
- The system doesn't reveal if an email exists in the database (prevents user enumeration)
- Never commit your `.env` file to version control
