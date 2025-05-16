import React from "react";
import PracticeQuestionPage from "./PracticeQuestionPage";
import BlankNumberLineComponent from "./BlankNumberLineComponent";
import NumberSelectionComponent from "./NumberSelectionComponent";
import { useParams, useSearchParams } from "react-router-dom";

function TestPage() {
  const { classId, subjectId } = useParams();
  const [searchParams] = useSearchParams();
  const questionType = searchParams.get("questionType") || "mcq";
  console.log("questionType", questionType);

  // Mapping of question types to components
  const componentMap = {
    mcq: PracticeQuestionPage,
    selection: NumberSelectionComponent,
    blank: BlankNumberLineComponent,
  };

  // Get the component based on questionType, default to PracticeQuestionPage if type is invalid
  const ComponentToRender = componentMap[questionType] || PracticeQuestionPage;

  return (
    <div className="min-h-screen">
      <ComponentToRender />
    </div>
  );
}

export default TestPage;
