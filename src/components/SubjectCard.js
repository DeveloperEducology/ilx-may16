import React from 'react';

function SubjectCard({ subject, onSelect }) {
  return (
    <div 
      className="border border-gray-200 rounded-lg p-4 w-52 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
      onClick={onSelect}
    >
      <h3 className="text-lg font-medium text-gray-800">{subject.name}</h3>
      <p className="text-sm text-gray-600">{subject.description}</p>
    </div>
  );
}

export default SubjectCard;