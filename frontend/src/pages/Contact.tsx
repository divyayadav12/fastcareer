import toast from 'react-hot-toast';
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useForm } from 'react-hook-form';

type ContactFormData = {
  name?: string;
  email: string;
  phone: string;
  companyName?: string;
  message?: string;
};

// WhatsApp Icon SVG
const WhatsAppIcon = ({ size = 20, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.78.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.3z"/>
  </svg>
);

export const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    toast.success('Thank you for contacting us. We will get back to you shortly.');
    reset();
  };

  const whatsappNumber = '918839250427';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20FAST%20Careers%2C%20I%20would%20like%20to%20inquire%20about%20recruitment%20services.`;

  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section className="bg-secondary text-white pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Contact Us
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Whether you're an employer looking for exceptional talent, or a professional seeking your next big opportunity, we're here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div>
            <h2 className="text-3xl font-bold text-text mb-8">Get In Touch</h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Reach out to our dedicated team of recruitment specialists. We aim to respond to all inquiries within 24 business hours.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="bg-blue-50 p-3.5 rounded-xl text-primary mr-5">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-text mb-0.5">Call Us</h4>
                  <p className="text-gray-800 font-medium">+91 11 4567 8900</p>
                  <p className="text-gray-500 text-xs mt-0.5">Mon-Sat, 9:00 AM - 7:00 PM (IST)</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="bg-blue-50 p-3.5 rounded-xl text-primary mr-5">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-text mb-0.5">Email Us</h4>
                  <p className="text-gray-800 font-medium">info@fastcareers.com<br/>careers@fastcareers.com</p>
                </div>
              </div>

              <div className="flex items-start p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="bg-blue-50 p-3.5 rounded-xl text-primary mr-5">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-text mb-0.5">Corporate Headquarters</h4>
                  <p className="text-gray-600 text-sm">Level 4, Business Tower,<br/>Connaught Place, New Delhi 110001, India</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-2xl font-bold text-text">Send a Message</h3>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Open WhatsApp Chat"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold transition-colors"
              >
                <WhatsAppIcon size={15} className="text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            </div>
            <p className="text-xs text-gray-500 mb-6">Fields marked with <span className="text-red-500 font-bold">*</span> are required.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input 
                label="Full Name (Optional)"
                placeholder="Raj Verma"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input 
                label="Email Address *"
                type="email"
                placeholder="raj.verma@example.com"
                {...register("email", { 
                  required: "Email address is required",
                  pattern: { value: /^\S+@\S+\.\S+$/i, message: "Invalid email format" }
                })}
                error={errors.email?.message}
              />
              <Input 
                label="Phone Number *"
                type="tel"
                placeholder="+91 98765 43210"
                {...register("phone", { 
                  required: "Phone number is required",
                  minLength: { value: 7, message: "Please enter a valid phone number" }
                })}
                error={errors.phone?.message}
              />
              <Input 
                label="Company Name (Optional)"
                placeholder="e.g. Tata Consultancy Services, Reliance, Infosys"
                {...register("companyName")}
                error={errors.companyName?.message}
              />
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-text mb-2">Message (Optional)</label>
                <textarea 
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all min-h-[120px] resize-y ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                  placeholder="e.g. Inquiring about Chartered Accountant hiring solutions..."
                  {...register("message")}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
              
              <Button type="submit" className="w-full justify-center group" icon={<Send size={18} className="group-hover:translate-x-1 transition-transform" />}>
                Send Message
              </Button>

              {/* Instant WhatsApp Quick Connect Banner (No number text printed) */}
              <div className="pt-2 text-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">Prefer immediate chat?</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <WhatsAppIcon size={20} />
                  <span>Chat with Us on WhatsApp</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Action Widget (Bottom-Right) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with FAST Careers on WhatsApp"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
      >
        <WhatsAppIcon size={26} className="text-white animate-bounce" />
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
