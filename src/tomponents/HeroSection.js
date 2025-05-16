const HeroSection = () => {
    return (
      <section className="bg-gray-100 py-16 text-center">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-4">Connect with Expert Local Tutors</h2>
          <p className="text-lg mb-6">
            Find qualified tutors near you with flexible scheduling and payment options. Boost your grades and confidence with personalized learning.
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="What subject do you need help with?"
              className="w-full p-3 rounded-l-md border border-gray-300 focus:outline-none"
            />
            <button className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700">
              Find Tutors
            </button>
          </div>
          <p className="mt-4">Over 500 verified tutors available in your area.</p>
        </div>
      </section>
    );
  };
  
  export default HeroSection;