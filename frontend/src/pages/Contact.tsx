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

export const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = (data: ContactFormData) => {
    console.log('Contact form submitted:', data);
    toast.success('Thank you for contacting us. We will get back to you shortly.');
    reset();
  };

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
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="bg-blue-50 p-4 rounded-xl text-primary mr-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text mb-1">Corporate Headquarters</h4>
                  <p className="text-gray-600">Level 4, Business Tower,<br/>Connaught Place, New Delhi 110001,<br/>India</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-50 p-4 rounded-xl text-primary mr-6">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text mb-1">Email Us</h4>
                  <p className="text-gray-600">info@fastcareers.com<br/>careers@fastcareers.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-blue-50 p-4 rounded-xl text-primary mr-6">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-text mb-1">Call Us</h4>
                  <p className="text-gray-600">+91 11 4567 8900<br/>Mon-Fri, 9:00 AM - 6:00 PM (IST)</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-text mb-2">Send a Message</h3>
            <p className="text-xs text-gray-500 mb-6">Fields marked with <span className="text-red-500 font-bold">*</span> are required.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input 
                label="Full Name (Optional)"
                placeholder="John Doe"
                {...register("name")}
                error={errors.name?.message}
              />
              <Input 
                label="Email Address *"
                type="email"
                placeholder="john@example.com"
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
                placeholder="e.g. Ernst & Young, Tata Motors, ABC Corp"
                {...register("companyName")}
                error={errors.companyName?.message}
              />
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-text mb-2">Message (Optional)</label>
                <textarea 
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:border-transparent transition-all min-h-[120px] resize-y ${errors.message ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'}`}
                  placeholder="How can we help you?"
                  {...register("message")}
                ></textarea>
                {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
              </div>
              
              <Button type="submit" className="w-full justify-center group" icon={<Send size={18} className="group-hover:translate-x-1 transition-transform" />}>
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};
