const ContactForm = () => {
    return (
      <div className="border rounded-lg p-6 shadow-md">
        <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
        <form>
          <div className="mb-4">
            <input type="text" placeholder="Full name" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <input type="tel" placeholder="Phone" className="w-full p-2 border rounded" />
          </div>
          <div className="mb-4">
            <select className="w-full p-2 border rounded">
              <option>General Inquiry</option>
            </select>
          </div>
          <div className="mb-4">
            <textarea placeholder="Message" className="w-full p-2 border rounded h-32"></textarea>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Send Message
          </button>
        </form>
      </div>
    );
  };
  
  export default ContactForm;