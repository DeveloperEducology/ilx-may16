const HowItWorks = () => {
    const steps = [
      { step: 1, title: "Find your perfect tutor", desc: "Search our database of qualified tutors by subject, availability, and price range." },
      { step: 2, title: "Book your sessions", desc: "Schedule sessions that fit your calendar and learning needs, in-person or online." },
      { step: 3, title: "Pay with flexibility", desc: "Choose from multiple payment options including pay-as-you-go or discounted packages." },
    ];
  
    return (
      <section className="py-12 bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.step} className="text-center">
                <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default HowItWorks;