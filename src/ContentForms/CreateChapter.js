import React, { useState, useEffect } from "react";

const CreateChapter = () => {
  const [formData, setFormData] = useState({
    name: "", // Changed from 'name' to 'name'
    subjectId: "",
    classId: "",
  });
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch subjects and classes on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/subjects");
        if (!response.ok) throw new Error("Failed to fetch subjects");
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setMessage("Failed to load subjects");
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/classes");
        if (!response.ok) throw new Error("Failed to fetch classes");
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setMessage("Failed to load classes");
      }
    };

    fetchSubjects();
    fetchClasses();
  }, []);

  console.log("Subjects:", subjects);
  console.log("Classes:", classes);
  console.log("Form Data:", formData);
  console.log("Message:", message);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    // Validate subjectId and classId
    const isValidSubject = subjects.some((s) => s._id === formData.subjectId);
    console.log(isValidSubject);
    const isValidClass = classes.some((c) => c._id === formData.classId);
    if (!isValidSubject || !isValidClass) {
      setMessage("Please select a valid subject and class");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/chapter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Server error: ${response.status}`
        );
      }

      await response.json();
      setMessage("Chapter created successfully!");
      setFormData({ name: "", subjectId: "", classId: "" });
    } catch (error) {
      console.error("Error creating chapter:", error);
      setMessage(error.message || "Failed to create chapter");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-4">Create Chapter</h2>
      {message && (
        <div
          className={`mb-4 p-2 rounded ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Chapter Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter chapter name"
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="subjectId"
            className="block text-sm font-medium text-gray-700"
          >
            Subject
          </label>
          <select
            id="subjectId"
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:bor
der-indigo-500 sm:text-sm"
            required
            disabled={isLoading}
          >
            <option value="">Select a subject</option>
            {subjects.map((subject) => (
              <option key={subject._id} value={subject._id}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="classId"
            className="block text-sm font-medium text-gray-700"
          >
            Class
          </label>
          <select
            id="classId"
            name="classId"
            value={formData.classId}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
            disabled={isLoading}
          >
            <option value="">Select a class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.name || cls.title}{" "}
                {/* Fallback to title if name is unavailable */}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white ${
            isLoading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Chapter"}
        </button>
      </form>
    </div>
  );
};

export default CreateChapter;
