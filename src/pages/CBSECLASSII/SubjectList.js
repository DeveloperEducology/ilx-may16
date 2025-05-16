import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";

// Sample data (in a real app, this might come from an API)
const subjects = [
  {
    _id: "680b2953dd80d2453d81e4ae",
    name: "Mathematics",
    classId: {
      _id: "67f1096ed52c89d85988eb4b",
      title: "Class III",
      description:
        "Comparing numbers, measurement, possessive nouns, conjunctions, using a dictionary and more.",
    },
    chapterIds: [
      { _id: "680b25c8c71d21cab15235bb", name: "Addition of 3 digit numbers" },
      {
        _id: "680b2687c71d21cab15235be",
        name: "Subtraction of 3 digit numbers",
      },
    ],
    lessonIds: [
      {
        _id: "680b26c4c71d21cab15235c0",
        name: "even or odd",
        chapterId: "680b25c8c71d21cab15235bb",
      },
      {
        _id: "680b27b2c71d21cab15235c6",
        name: "arithmetic rules",
        chapterId: "680b25c8c71d21cab15235bb",
      },
    ],
    createdAt: "2025-04-25T06:18:59.449Z",
    __v: 0,
  },
  {
    _id: "680b2cae012a8d8a0830ef19",
    name: "English",
    classId: {
      _id: "67f1096ed52c89d85988eb4b",
      title: "Class III",
      description:
        "Comparing numbers, measurement, possessive nouns, conjunctions, using a dictionary and more.",
    },
    chapterIds: [{ _id: "680b29e4c71d21cab15235c9", name: "Tell Nouns" }],
    lessonIds: [
      {
        _id: "680b2a18c71d21cab15235cb",
        name: "identify noun objects",
        chapterId: "680b29e4c71d21cab15235c9",
      },
    ],
    createdAt: "2025-04-25T06:33:18.011Z",
    __v: 0,
  },
];

// Subject button component for better reusability
const SubjectButton = ({ subject, isSelected, onSelect }) => (
  <button
    type="button"
    onClick={() => onSelect(subject)}
    className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      isSelected
        ? "bg-green-600 text-white"
        : "bg-white text-gray-800 hover:bg-gray-100"
    } shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
    aria-label={`Select ${subject.name}`}
  >
    {subject.name}
  </button>
);

SubjectButton.propTypes = {
  subject: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
};

// Subject details component
const SubjectDetails = ({ subject }) => {
  const chapters = subject.chapterIds.reduce((acc, chap) => {
    acc[chap._id] = { name: chap.name, lessons: [] };
    return acc;
  }, {});

  subject.lessonIds.forEach((lesson) => {
    if (chapters[lesson.chapterId]) {
      chapters[lesson.chapterId].lessons.push(lesson.name);
    }
  });

  return (
    <section className="mt-6 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-green-600 mb-4">
        {subject.classId.title} {subject.name}
      </h2>
      <p className="text-gray-600 mb-6 leading-relaxed">
        Explore the {subject.name.toLowerCase()} skills for{" "}
        {subject.classId.title}. These skills are organized into categories.
        Hover over any skill to preview it, or click to start practicing. Your
        progress will be tracked, with questions increasing in difficulty as you
        improve.
      </p>
      {Object.entries(chapters).map(([id, chapter]) =>
        chapter.lessons.length > 0 ? (
          <div key={id} className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {chapter.name}
            </h3>
            <ul className="list-none space-y-1">
              {chapter.lessons.map((lesson, idx) => (
                <li key={idx} className="text-gray-600">
                  A.{idx + 1} {lesson}
                </li>
              ))}
            </ul>
          </div>
        ) : null
      )}
    </section>
  );
};

SubjectDetails.propTypes = {
  subject: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    classId: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    chapterIds: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
    lessonIds: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        chapterId: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

const SubjectList = () => {
  const [selectedSubject, setSelectedSubject] = useState(subjects[0]);

  const handleSelectSubject = useCallback((subject) => {
    setSelectedSubject(subject);
  }, []);

  return (
    <div className="text-left p-6 max-w-4xl mx-auto">
      <div className="max-w-7xl mx-auto">
        <nav className="flex flex-wrap gap-4 mb-8">
          {subjects.map((subject) => (
            <SubjectButton
              key={subject._id}
              subject={subject}
              isSelected={selectedSubject?._id === subject._id}
              onSelect={handleSelectSubject}
            />
          ))}
        </nav>
        {selectedSubject && <SubjectDetails subject={selectedSubject} />}
      </div>
    </div>
  );
};

export default SubjectList;
