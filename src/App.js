import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";
import PracticeQuestionPage from "./pages/PracticeQuestionPage";
import "./index.css";
import GoogleSheetData from "./components/GoogleDataSheet";
import { DataProvider } from "./context/DataContext";
import BlankQuestionComponent from "./pages/BlankQuestionComponent";
import BlankNumberLineComponent from "./pages/BlankNumberLineComponent";
import NumberSelectionComponent from "./pages/NumberSelectionComponent";
import TestPage from "./pages/TestPage";
import Contact from "./tpages/Contact";
import Home from "./tpages/Home";
import Pricing from "./tpages/Pricing";
import HowItWorksPage from "./tpages/HowItWorksPage";
import Subjects from "./tpages/Subjects";
import Tutors from "./tpages/Tutors";

import Header from "./tomponents/Header";
import Signin from "./auth/Signin";
import Signup from "./auth/Signup";
import { UserAuthContextProvider } from "./context/UserAuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
import IBlnak from "./pages/IBlank";
import QuestionForm from "./ContentForms/QuestionForm";
import TableQn from "./pages/tableqn";
import FillInTheBlank from "./pages/CBSECLASSII/FillInTheBlank";
import SubjectList from "./pages/CBSECLASSII/SubjectList";
import CreateChapter from "./ContentForms/CreateChapter";
import CreateLesson from "./ContentForms/CreateLesson";
import Sorting from "./components/Sorting";
import Sorting2 from "./components/Sorting2";
import NumberLinePage from "./components/NumberLinePage";
import SequenceInput from "./components/SequenceInput";
import QuizHtml from "./components/QuizHtml";
import QuizAppModal from "./components/QuizAppModal";
import Quiz from "./components/Quiz";
import BlankNumberLine from "./pages/BlankNumberLine.js";
import NumberSorting from "./components/NumberSorting.js";
import PhoneticsComponent from "./components/Phonetics.js";
import QuizManager from "./pages/QuizManager.js";
import MathEditor from "./editor/MathEditor.js";
import EditorWithMathRenderer from "./editor/EditorWithMathRenderer.js";
import Math from "./editor/Math.js";
import InteractiveNumberLine from "./components/InteractiveNumberLine.js";

// Create a wrapper component to use useLocation
const HeaderWrapper = () => {
  const location = useLocation();

  // Check if the current path matches specific routes
  const isHomePage =
    location.pathname === "/practice" ||
    /^\/subjects\/[^/]+$/.test(location.pathname) || // Matches /subjects/:classId
    /^\/practice\/[^/]+\/[^/]+$/.test(location.pathname); // Matches /practice/:classId/:subjectId

  return isHomePage ? (
    <header className="bg-green-600 text-white p-4">
      <h1 className="text-2xl font-bold">Vijay Learning Platform</h1>
    </header>
  ) : (
    <Header />
  );
};

function App() {
  return (
    <Router>
      <UserAuthContextProvider>
        <DataProvider>
          <div className="font-sans">
            {/* Conditionally render the header */}
            <HeaderWrapper />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/numline" element={<InteractiveNumberLine />} />
              {/* <Route path="/editor" element={<MathEditor />} /> */}
              <Route path="/editor" element={<EditorWithMathRenderer />} />
              <Route path="/math-quiz" element={<Math />} />
              <Route path="/phonetics" element={<PhoneticsComponent />} />
              <Route path="/create-chapter" element={<CreateChapter />} />
              <Route path="/create-lesson" element={<CreateLesson />} />
              <Route path="/test" element={<QuizManager />} />
              {/* <Route path="/quiz" element={<Quiz />} /> */}
              <Route path="/modal" element={<QuizAppModal />} />
              <Route path="/html" element={<QuizHtml />} />
              <Route path="/canvas" element={<NumberLinePage />} />
              <Route path="/sequence" element={<SequenceInput />} />
              <Route path="/sort" element={<Sorting />} />
              <Route path="/sort2" element={<Sorting2 />} />
              <Route path="/subjects" element={<SubjectList />} />
              <Route path="/login" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/tutors" element={<Tutors />} />
              <Route path="/table-qn" element={<TableQn />} />
              <Route path="/practice/chap1" element={<FillInTheBlank />} />

              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreateProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/subjects" element={<Subjects />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/practice" element={<HomePage />} />
              <Route path="/data" element={<GoogleSheetData />} />
              <Route path="/blank" element={<BlankQuestionComponent />} />
              <Route path="/new" element={<QuestionForm />} />
              <Route path="/number-line" element={<NumberLinePage />} />
              <Route path="/iblank" element={<IBlnak />} />
              <Route path="/numsort" element={<NumberSorting />} />
              <Route
                path="/number-selection"
                element={<NumberSelectionComponent />}
              />
              <Route path="/subjects/:classId" element={<SubjectsPage />} />
              <Route
                path="/practice/:classId/:lessonId/:lessonName"
                // element={<PracticeQuestionPage />}
                element={<Quiz />}
              />
              <Route path="/test/:classId/:subjectId" element={<TestPage />} />
            </Routes>
          </div>
        </DataProvider>
      </UserAuthContextProvider>
    </Router>
  );
}

export default App;
