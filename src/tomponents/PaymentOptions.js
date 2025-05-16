const PaymentOptions = () => {
    const options = [
      {
        title: "Pay As You Go",
        desc: "Pay only for the sessions you need, when you need them. No commitment required.",
        benefits: ["No long-term commitment", "Pay after each session", "All payment methods accepted"],
      },
      {
        title: "Monthly Subscription",
        desc: "Regular weekly sessions with a fixed monthly payment. Best for ongoing support.",
        benefits: ["4 sessions per month at lowest rates", "Pay in installments", "Guaranteed time slots"],
      },
    ];
  
    return (
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8"> Flexible Payment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {options.map((option) => (
              <div key={option.title} className="border rounded-lg p-6 shadow-md">
                <h3 className="text-xl font-semibold">{option.title}</h3>
                <p className="text-gray-600 mt-2">{option.desc}</p>
                <ul className="mt-4 list-disc list-inside">
                  {option.benefits.map((benefit, idx) => (
                    <li key={idx} className="text-gray-600">{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };
  
  export default PaymentOptions;