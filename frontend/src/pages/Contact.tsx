import toast from 'react-hot-toast';
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
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
    <div className="w-full">
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
              {/* WhatsApp Direct Connect Card */}
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-start p-5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 hover:shadow-md transition-all duration-300"
              >
                <div className="bg-emerald-500 p-3.5 rounded-xl text-white mr-5 shadow-sm group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold text-emerald-950">Chat on WhatsApp</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-200 text-emerald-800">
                      Online • Fast Reply
                    </span>
                  </div>
                  <p className="text-emerald-800 font-semibold text-base mt-0.5">+91 88392 50427</p>
                  <p className="text-emerald-700 text-xs mt-1">Click here to chat directly with our team on WhatsApp</p>
                </div>
              </a>

              <div className="flex items-start p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <div className="bg-blue-50 p-3.5 rounded-xl text-primary mr-5">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-semibold text-text mb-0.5">Call Us</h4>
                  <p className="text-gray-800 font-medium">+91 88392 50427 / +91 11 4567 8900</p>
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold transition-colors"
              >
                <MessageCircle size={14} className="text-emerald-600" />
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
                placeholder="+91 88392 50427"
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

              {/* Instant WhatsApp Quick Connect Banner */}
              <div className="pt-2 text-center">
                <p className="text-xs text-gray-500 mb-2 font-medium">Need immediate assistance?</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold rounded-xl text-sm transition-all duration-200 shadow-sm hover:shadow"
                >
                  <MessageCircle size={18} />
                  <span>Connect on WhatsApp (+91 88392 50427)</span>
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

