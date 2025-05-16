import React from "react";
import { useParams, useNavigate } from "react-router-dom";
// import { subjectsData } from "../data/Data";

const subjectsData = {
  VI: {
    description:
      "Here is a list of all of the maths skills students learn in class VI! These skills are organised into categories, and you can move your mouse over any skill name to preview the skill. To start practising, just click on any link. IXL will track your score, and the questions will automatically increase in difficulty as you improve!",
    categories: {
      "Whole numbers": [
        { id: "A.1", name: "Place values in whole numbers" },
        { id: "A.2", name: "Word names for numbers" },
        { id: "A.3", name: "Roman numerals" },
        { id: "A.4", name: "Add and subtract whole numbers" },
        { id: "A.5", name: "Add and subtract whole numbers: word problems" },
      ],
      Multiplication: [
        { id: "B.1", name: "Multiply whole numbers" },
        { id: "B.2", name: "Multiply whole numbers: word problems" },
        { id: "B.3", name: "Multiply numbers ending in zeros" },
        { id: "B.4", name: "Multiply numbers ending in zeros: word problems" },
        { id: "B.5", name: "Multiply three or more numbers" },
        { id: "B.6", name: "Multiply three or more numbers: word problems" },
        { id: "B.7", name: "Estimate products" },
      ],
      Division: [
        { id: "C.1", name: "Division rules" },
        { id: "C.2", name: "Division patterns with zeros" },
        { id: "C.3", name: "Divide numbers ending in zeros: word problems" },
        { id: "C.4", name: "Estimate quotients" },
        { id: "C.5", name: "Divide whole numbers - two-digit divisors" },
      ],
      "Number theory": [
        { id: "D.1", name: "Prime or composite" },
        { id: "D.2", name: "Prime factorisation" },
        { id: "D.3", name: "Prime factorisation with exponents" },
        { id: "D.4", name: "Highest common factor" },
        { id: "D.5", name: "Lowest common multiple" },
        { id: "D.6", name: "HCF and LCM: word problems" },
      ],
      Integers: [
        { id: "I.1", name: "Understanding integers" },
        { id: "I.2", name: "Integers on number lines" },
        {
          id: "I.3",
          name: "Graph integers on horizontal and vertical number lines",
        },
        { id: "I.4", name: "Compare and order integers" },
      ],
      "Operations with integers": [
        { id: "J.1", name: "Add integers using counters" },
        { id: "J.2", name: "Add integers" },
        { id: "J.3", name: "Subtract integers using counters" },
        { id: "J.4", name: "Subtract integers" },
        { id: "J.5", name: "Add and subtract integers: find the sign" },
        { id: "J.6", name: "Add and subtract integers: input/output tables" },
        { id: "J.7", name: "Add three or more integers" },
      ],
      "Mixed operations": [
        {
          id: "K.1",
          name: "Add, subtract, multiply or divide two whole numbers",
        },
        {
          id: "K.2",
          name: "Add, subtract, multiply or divide two whole numbers: word problems",
        },
        { id: "K.3", name: "Evaluate numerical expressions" },
        { id: "K.4", name: "Add and subtract decimals or fractions" },
        {
          id: "K.5",
          name: "Add and subtract decimals or fractions: word problems",
        },
        { id: "K.6", name: "Add, subtract, multiply or divide two integers" },
      ],
      "Problem solving and estimation": [
        { id: "L.1", name: "Estimate to solve word problems" },
        { id: "L.2", multiStep: true, name: "Multi-step word problems" },
        { id: "L.3", name: "Word problems with extra or missing information" },
        { id: "L.4", name: "Guess-and-check word problems" },
        { id: "L.5", name: "Distance/direction to starting point" },
        { id: "L.6", name: "Use logical reasoning to find the order" },
      ],
      "Expressions and properties": [
        { id: "Q.1", name: "Write variable expressions" },
        { id: "Q.2", name: "Evaluate variable expressions" },
        { id: "Q.3", name: "Properties of addition and multiplication" },
        { id: "Q.4", name: "Multiply using the distributive property" },
        { id: "Q.5", name: "Write equivalent expressions using properties" },
        { id: "Q.6", name: "Properties of addition" },
        { id: "Q.7", name: "Properties of multiplication" },
        {
          id: "Q.8",
          name: "Solve for a variable using properties of multiplication",
        },
        { id: "Q.9", name: "Identify equivalent expressions" },
      ],
      "One-variable equations": [
        { id: "R.1", name: "Write variable equations: word problems" },
        { id: "R.2", name: "Solve equations using properties" },
        { id: "R.3", name: "Solve equations" },
      ],
      "Two-dimensional figures": [
        { id: "S.1", name: "Is it a polygon?" },
        { id: "S.2", name: "Types of angles" },
        { id: "S.3", name: "Measure angles with a protractor" },
        { id: "S.4", name: "Regular and irregular polygons" },
        { id: "S.5", name: "Number of sides in polygons" },
        { id: "S.6", name: "Classify triangles" },
        { id: "S.7", name: "Identify trapeziums" },
        { id: "S.8", name: "Classify quadrilaterals" },
        { id: "S.9", name: "Graph triangles and quadrilaterals" },
        {
          id: "S.10",
          name: "Find the unknown angle in triangles and quadrilaterals",
        },
        { id: "S.11", name: "Lines, line segments, rays" },
        { id: "S.12", name: "Parallel, perpendicular and intersecting lines" },
        { id: "S.13", name: "Parts of a circle" },
      ],
      "Symmetry and transformations": [
        { id: "T.1", name: "Symmetry and transformations" },
      ],
    },
  },
  // Sample data for other classes (simplified)
  V: {
    description:
      "Math skills for Class V including area, perimeter, and fractions.",
    categories: {
      Geometry: [
        { id: "V.1", name: "Calculate area of rectangles" },
        { id: "V.2", name: "Calculate perimeter" },
      ],
      Fractions: [
        { id: "V.3", name: "Add fractions" },
        { id: "V.4", name: "Subtract fractions" },
      ],
    },
  },
  VII: {
    description:
      "Math skills for Class VII including proportions and rational numbers.",
    categories: {
      Proportions: [
        { id: "VII.1", name: "Solve proportions" },
        { id: "VII.2", name: "Ratio problems" },
      ],
      "Rational Numbers": [
        { id: "VII.3", name: "Add rational numbers" },
        { id: "VII.4", name: "Multiply rational numbers" },
      ],
    },
  },
  // Add more classes as needed with similar structure
};

function SubjectsPage() {
  const { classId } = useParams();
  console.log(classId);
  const navigate = useNavigate();

  const classData = subjectsData[classId] || {
    description: "No subjects available for this class.",
    categories: {},
  };
  // console.log(Object.entries(classData.categories));
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
