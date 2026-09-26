import toast from 'react-hot-toast';
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Globe } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useForm } from 'react-hook-form';
import { ExecutiveLeadershipCards } from '../components/ExecutiveLeadershipCards';

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
    const targetNumber = '918839250427';
    let text = `*New Contact Inquiry*\n\n`;
    if (data.name) text += `*Name:* ${data.name}\n`;
    text += `*Email:* ${data.email}\n`;
    text += `*Phone:* ${data.phone}\n`;
    if (data.company) text += `*Company:* ${data.company}\n`;
    if (data.message) text += `*Message:* ${data.message}\n`;

    const encodedText = encodeURIComponent(text);
    const url = `https://wa.me/${targetNumber}?text=${encodedText}`;
    
    window.open(url, '_blank');
    toast.success('Opening WhatsApp...');
    reset();
  };

  const whatsappNumber = '918839250427';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=Hello%20FAST%20Careers%2C%20I%20would%20like%20to%20inquire%20about%20recruitment%20services.`;

  return (
    <div className="w-full relative">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-slate-50 text-slate-900 pt-32 pb-16 px-4 border-b border-slate-200">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight text-slate-900"
          >
            Contact <span className="text-blue-700">FAST CAREERS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto font-normal"
          >
            Whether you're an employer looking for exceptional Chartered Accountants, or a candidate seeking placement assistance, our leadership is just a call or message away.
          </motion.p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          
          {/* Executive Leadership Direct Contacts */}
          <div className="mb-14">
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200 uppercase tracking-wider">
                Direct Leadership Access
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Executive Leadership Contacts
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Reach out directly to our directors for corporate partnerships and candidate placement mandates.
              </p>
            </div>

            <ExecutiveLeadershipCards />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            
            {/* Contact Details & Company Presence */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">Corporate Office & Presence</h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-sm sm:text-base">
                Reach out to our dedicated operations desk. We aim to respond to all corporate inquiries within 24 business hours.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <div className="bg-blue-50 p-3 rounded-xl text-primary mr-4 shrink-0">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Corporate Headquarters</h4>
                    <p className="text-gray-800 font-semibold text-xs sm:text-sm">Fast Career Consultants Private Limited</p>
                    <p className="text-gray-600 text-xs mt-0.5">Opposite Jain Mandir, Geeta Bhawan Square, Indore, Madhya Pradesh - 452001</p>
                  </div>
                </div>

                <div className="flex items-start p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <div className="bg-blue-50 p-3 rounded-xl text-primary mr-4 shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Official Inquiries & Support</h4>
                    <p className="text-gray-800 font-medium text-xs sm:text-sm">
                      <a href="mailto:sarthak@fast-india.com" className="hover:text-blue-600 text-slate-700 font-semibold">sarthak@fast-india.com</a>
                      <span className="mx-2 text-slate-300">|</span>
                      <a href="mailto:ritesh@fast-india.com" className="hover:text-blue-600 text-slate-700 font-semibold">ritesh@fast-india.com</a>
                    </p>
                    <p className="text-slate-400 text-xs mt-0.5">General & Recruitment Desk: contact@fast-india.com</p>
                  </div>
                </div>

                <div className="flex items-start p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <div className="bg-blue-50 p-3 rounded-xl text-primary mr-4 shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Support Timings</h4>
                    <p className="text-gray-700 font-medium text-xs sm:text-sm">Monday to Saturday: 9:30 AM - 7:00 PM (IST)</p>
                    <p className="text-slate-500 text-xs mt-0.5">FAST CA Campus Drives across 8+ Major Metro Venues & Virtual</p>
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

        {/* Interactive Google Map Section */}
        <div className="mt-12 sm:mt-16 bg-white rounded-3xl p-5 sm:p-7 border-2 border-slate-200/90 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-600 animate-bounce" size={20} />
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  FAST Careers Corporate Headquarters & Pan-India Venues
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Headquartered in Indore with physical campus recruitment centers in 9+ major metro hubs.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-1 rounded-full border border-blue-200">
                10+ Physical Hubs & Virtual
              </span>
            </div>
          </div>

          <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
            <iframe
              title="FAST Careers Office Location Map"
              src="https://maps.google.com/maps?q=Indore,Madhya%20Pradesh,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              allowFullScreen
            />
          </div>
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
