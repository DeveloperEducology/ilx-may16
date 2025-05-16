import ContactForm from '../tomponents/ContactForm';

const Contact = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/2">
            <ContactForm />
          </div>
          <div className="lg:w-1/2">
            <h3 className="text-xl font-semibold">Our Contact Information</h3>
            <p className="mt-4"><strong>Phone:</strong> (123) 456-7890</p>
            <p><strong>Email:</strong> support@tutorconnect.com</p>
            <p><strong>Address:</strong> 123 Education Lane, Suite 101, Learning City, ST 12345</p>
            <p><strong>Working Hours:</strong> Mon-Fri: 9AM-8PM, Sat: 10AM-6PM, Sun: Closed</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;