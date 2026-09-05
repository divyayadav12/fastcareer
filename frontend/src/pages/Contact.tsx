import toast from 'react-hot-toast';
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
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

// Exact Official WhatsApp Brand Logo SVG
const OfficialWhatsAppLogo = ({ size = 26, className = '' }: { size?: number; className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path 
      fillRule="evenodd" 
      clipRule="evenodd" 
      d="M24 10C16.268 10 10 16.268 10 24c0 2.658.742 5.143 2.035 7.262L10 38l6.945-1.996A13.918 13.918 0 0024 38c7.732 0 14-6.268 14-14s-6.268-14-14-14zm7.982 19.866c-.347.973-1.745 1.789-2.427 1.895-.648.1-1.488.143-2.408-.15-1.92-.612-4.417-2.31-6.195-4.512-1.442-1.787-2.417-3.882-2.417-5.918 0-2.148 1.135-3.21 1.542-3.645.385-.41.839-.514 1.116-.514.278 0 .556.004.798.016.257.012.602-.098.942.718.347.834 1.185 2.894 1.289 3.107.104.214.174.464.035.742-.14.278-.21.45-.417.695-.208.245-.438.547-.626.734-.208.208-.426.435-.183.852.243.418 1.08 1.777 2.316 2.878 1.59 1.417 2.932 1.857 3.348 2.065.417.208.66.174.903-.105.244-.278 1.042-1.215 1.32-1.632.278-.417.556-.347.938-.208.382.139 2.43 1.146 2.847 1.354.417.209.695.313.798.487.104.174.104 1.007-.243 1.98z" 
      fill="#FFFFFF"
    />
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
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold transition-all shadow-sm"
              >
                <OfficialWhatsAppLogo size={18} />
                <span>WhatsApp Us</span>
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

              {/* Exact WhatsApp Action Banner */}
              <div className="pt-2 text-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-3 px-5 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-2xl text-base transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5"
                >
                  <OfficialWhatsAppLogo size={26} />
                  <span>Chat on WhatsApp</span>
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
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 transition-all duration-300"
      >
        <OfficialWhatsAppLogo size={28} className="drop-shadow-sm" />
        <span className="hidden sm:inline font-bold text-sm tracking-wide">
          Chat on WhatsApp
        </span>
      </a>
    </div>
  );
};
