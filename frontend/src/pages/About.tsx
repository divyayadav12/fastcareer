import React from 'react';
import { motion } from 'framer-motion';
import { LeadershipCard } from '../components/LeadershipCard';
import { Target, Eye, Shield, Users } from 'lucide-react';

const coreValues = [
  {
    icon: <Target className="text-primary w-8 h-8" />,
    title: 'Excellence',
    description: 'We strive for exceptional quality in every placement and interaction.'
  },
  {
    icon: <Eye className="text-primary w-8 h-8" />,
    title: 'Transparency',
    description: 'Clear, honest communication with both clients and candidates.'
  },
  {
    icon: <Shield className="text-primary w-8 h-8" />,
    title: 'Integrity',
    description: 'Upholding the highest ethical standards in the recruitment industry.'
  },
  {
    icon: <Users className="text-primary w-8 h-8" />,
    title: 'Partnership',
    description: 'Building long-term relationships rather than transactional exchanges.'
  }
];

export const About = () => {
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
            About FAST CAREERS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-gray-300 max-w-3xl mx-auto"
          >
            Connecting exceptional professionals with industry-leading organizations since 2008. We are more than recruiters; we are career architects.
          </motion.p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-text mb-6">Our Story</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Founded on the principle that the right talent can completely transform an organization, FAST CAREERS began as a boutique firm specializing in finance and accounting placements. Over the years, we've grown into a comprehensive talent solutions provider.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We understand that the corporate landscape is rapidly evolving. Today's businesses need agile, skilled, and culturally aligned professionals. Our unique methodology combines data-driven matching with deep human intuition.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Whether you are a startup scaling rapidly or a Fortune 500 company seeking specialized expertise, we have the network, the knowledge, and the passion to deliver results that exceed expectations.
            </p>
          </div>
          <div className="bg-gray-100 rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-secondary/10 z-10 rounded-3xl mix-blend-multiply"></div>
             <img src="/about-team.jpg" alt="Company Story" className="absolute inset-0 w-full h-full object-cover rounded-3xl" />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide our daily operations and long-term vision.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="mb-6 bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-text mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text mb-4">Leadership Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Meet the experienced professionals guiding our vision and strategy.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <LeadershipCard 
              name="Sarah Jenkins"
              designation="Chief Executive Officer"
              bio="With over 20 years in executive search, Sarah has placed hundreds of C-level executives globally. She leads FAST CAREERS with a vision of transformative talent acquisition."
              imageUrl="/sarah-ceo.jpg"
              linkedinUrl="#"
            />
            <LeadershipCard 
              name="David Chen"
              designation="Head of Operations"
              bio="David ensures our delivery teams operate at peak efficiency. His background in management consulting allows him to understand complex client organizational needs."
              imageUrl="/david-ops.jpg"
              linkedinUrl="#"
            />
            <LeadershipCard 
              name="Elena Rodriguez"
              designation="VP, Client Relations"
              bio="Elena is the bridge between our clients and our recruitment strategies. She specializes in building long-term, strategic partnerships with enterprise accounts."
              imageUrl="/elena-vp.jpg"
              linkedinUrl="#"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
