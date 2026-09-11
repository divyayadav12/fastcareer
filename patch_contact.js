const fs = require('fs');
const file = 'frontend/src/pages/Contact.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  "import { useForm } from 'react-hook-form';",
  "import { useForm } from 'react-hook-form';\nimport axios from 'axios';\nimport { useState } from 'react';"
);

content = content.replace(
  "  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();",
  "  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();\n  const [isSubmitting, setIsSubmitting] = useState(false);"
);

content = content.replace(
  /const onSubmit = \(data: ContactFormData\) => \{\s*console\.log\('Contact form submitted:', data\);\s*toast\.success\('Thank you for contacting us\. We will get back to you shortly\.'\);\s*reset\(\);\s*\};/g,
  `const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await axios.post(\`\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact\`, data);
      toast.success('Thank you for contacting us. We will get back to you shortly.');
      reset();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast.error('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };`
);

content = content.replace(
  /<Button type="submit" className="w-full">/,
  '<Button type="submit" className="w-full" disabled={isSubmitting}>'
);
content = content.replace(
  /<span>Send Message<\/span>/,
  '<span>{isSubmitting ? "Sending..." : "Send Message"}</span>'
);

fs.writeFileSync(file, content);
