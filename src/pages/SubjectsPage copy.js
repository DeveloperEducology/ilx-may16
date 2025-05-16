import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { subjectsData } from "../data/Data"; // Ensure this points to the array-based JSON

function SubjectsPage() {
  const { classId } = useParams();
  const navigate = useNavigate();

  // Find the subject data for the given classId
  const subject = subjectsData.find((item) => item.classId === classId) || {
    description: "No subjects available for this class.",
    categories: {},
  };

  return (
    <div className="text-left p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-green-600 mb-4">
        {classId} maths
      </h1>
      <p className="text-gray-700 mb-6 text-sm leading-relaxed">
        {classData.description}
      </p>
      <div className="space-y-6">
        {Object.entries(classData.categories).map(([category, skills]) => (
          <div key={category} className="text-left">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              {category}
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 text-sm">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="hover:underline cursor-pointer"
                  onClick={() => navigate(`/practice/${classId}/${skill.id}`)}
                >
                  {skill.id} {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SubjectsPage;
