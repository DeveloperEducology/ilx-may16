// src/data/sampleData.js
export const subjects = [
    { id: 1, name: "Mathematics", specialties: ["Algebra", "Calculus", "Statistics"], link: "/subjects/mathematics" },
    { id: 2, name: "Science", specialties: ["Physics", "Chemistry", "Biology"], link: "/subjects/science" },
    { id: 3, name: "Language", specialties: ["English", "Spanish", "French"], link: "/subjects/language" },
    { id: 4, name: "Computer Science", specialties: ["Programming", "Web Dev", "Data Science"], link: "/subjects/computer-science" },
  ];
  
  export const tutors = [
    {
      id: 1,
      name: "Sarah Johnson",
      subject: "Mathematics",
      specialties: ["Algebra", "Calculus", "SAT Math Prep"],
      experience: "8+ years teaching, M.S. in Mathematics",
      rate: "$45-60/hour",
      rating: 5.0,
      reviews: 48,
      profileLink: "/tutors/sarah-johnson",
    },
    {
      id: 2,
      name: "Michael Chen",
      subject: "Computer Science",
      specialties: ["Python", "Java", "Web Development"],
      experience: "5+ years, Software Engineer at Tech Company",
      rate: "$55-75/hour",
      rating: 4.8,
      reviews: 32,
      profileLink: "/tutors/michael-chen",
    },
    {
      id: 3,
      name: "Lisa Rodriguez",
      subject: "Language Arts",
      specialties: ["English", "Spanish", "Essay Writing"],
      experience: "12+ years, High School English Teacher",
      rate: "$40-55/hour",
      rating: 4.9,
      reviews: 56,
      profileLink: "/tutors/lisa-rodriguez",
    },
  ];
  
  export const testimonials = [
    {
      id: 1,
      name: "Alex Thompson",
      subject: "Mathematics",
      quote: "I was struggling with calculus until I found Sarah through TutorConnect. Her teaching style helped me understand the concepts I was missing. I went from a C- to an A in just 8 weeks!",
    },
    {
      id: 2,
      name: "Michelle Parker",
      subject: "Spanish Language",
      quote: "The flexible payment options were a gamechanger for me. I was able to get the help I needed with my Spanish classes without breaking the bank. My tutor Lisa is amazing!",
    },
    {
      id: 3,
      name: "James Wilson",
      subject: "Computer Science",
      quote: "Michael helped me learn Python programming when I had no coding experience. The live chat support was great when I needed quick answers between sessions. I now have a job as a junior developer!",
    },
  ];