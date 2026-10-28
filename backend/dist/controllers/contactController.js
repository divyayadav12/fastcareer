"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendContactEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, company, message } = req.body;
        if (!email || !phone) {
            res.status(400).json({ message: 'Email and phone are required.' });
            return;
        }
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: 'divyayadav141203@gmail.com',
            subject: `New Contact Inquiry from ${name || email}`,
            html: `
        <h3>New Contact Message received on FAST CAREERS</h3>
        <p><strong>Name:</strong> ${name || 'N/A'}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Company:</strong> ${company || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message || 'No message provided'}</p>
      `,
        };
        yield transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!' });
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email' });
    }
});
exports.sendContactEmail = sendContactEmail;
