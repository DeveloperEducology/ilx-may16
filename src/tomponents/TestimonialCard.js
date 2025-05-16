const TestimonialCard = ({ testimonial }) => {
    return (
      <div className="border rounded-lg p-6 shadow-md">
        <p className="text-gray-600 italic">"{testimonial.quote}"</p>
        <p className="mt-4 font-semibold">{testimonial.name}</p>
        <p className="text-gray-500">{testimonial.subject} Student</p>
      </div>
    );
  };
  
  export default TestimonialCard;