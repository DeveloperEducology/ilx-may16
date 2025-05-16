import HeroSection from "../tomponents/HeroSection";
import SubjectCard from "../tomponents/SubjectCard";
import TutorCard from "../tomponents/TutorCard";
import TestimonialCard from "../tomponents/TestimonialCard";
import { subjects, tutors, testimonials } from "../data/sampleData";
import ContactForm from "../tomponents/ContactForm";
import Footer from "../tomponents/Footer";
import Header from "../tomponents/Header";
import HowItWorksPage from "./HowItWorksPage";

const Home = () => {
  return (
    <div>
      {/* <Header /> */}
      <HeroSection />
      <main className="p-3 max-w-5xl mx-auto">
        <section className="py-12 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Popular Subjects
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map((subject) => (
                <SubjectCard key={subject.id} subject={subject} />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 bg-gray-100">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Meet Our Expert Tutors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 bg-white">
          <HowItWorksPage />
        </section>
        <section className="py-12 bg-white">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              What Our Students Say
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="py-12 bg-gray-100">
          <ContactForm />
        </section>
      </main>
      <section className="py-12 bg-white">
        <Footer />
      </section>
    </div>
  );
};

export default Home;
