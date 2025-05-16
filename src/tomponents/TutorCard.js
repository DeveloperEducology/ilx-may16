const TutorCard = ({ tutor }) => {
    return (
      <div className="border rounded-lg p-6 shadow-md flex flex-col items-center text-center">
        <h3 className="text-xl font-semibold">{tutor.name}</h3>
        <p className="text-gray-600">{tutor.subject} Tutor</p>
        <p className="mt-2">⭐ {tutor.rating} ({tutor.reviews} reviews)</p>
        <p className="mt-2"><strong>Specialties:</strong> {tutor.specialties.join(", ")}</p>
        <p><strong>Experience:</strong> {tutor.experience}</p>
        <p><strong>Rate:</strong> {tutor.rate}</p>
        <div className="mt-4 space-x-2">
          <a href={tutor.profileLink} className="text-blue-600 hover:underline">
            View full profile
          </a>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>
    );
  };
  
  export default TutorCard;