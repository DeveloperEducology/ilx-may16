const SubjectCard = ({ subject }) => {
    return (
      <div className="border rounded-lg p-6 shadow-md hover:shadow-lg transition">
        <h3 className="text-xl font-semibold">{subject.name}</h3>
        <p className="text-gray-600">{subject.specialties.join(", ")}</p>
        <a
          href={subject.link}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Find Tutors
        </a>
      </div>
    );
  };
  
  export default SubjectCard;