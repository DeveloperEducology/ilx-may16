import { createContext, useState, useEffect } from "react";

// Create Context
export const DataContext = createContext();

const SHEET_ID = "1dpbkXj3WH6PMWNHV42PdpnRmn6s9BO1I_vY9ODrZ6bE";
const API_KEY = "AIzaSyC9vv5R8eYv0Y4vjJxPtbfwm-f1P1AFvVA";
const SHEET1_NAME = "Categories";
const SHEET2_NAME = "Classes";
const SHEET3_NAME = "clsData";

// Context Provider Component
export const DataProvider = ({ children }) => {
  const [collection, setCollection] = useState([]); // Store fetched data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [data, setData] = useState([]) 
  let categoriesData = [];
  let coursesData = [];
  let classsData = [];


  // Function to update user data
  const updateData = (newData) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  const [jsonData, setJsonData] = useState({});

  useEffect(() => {
    const fetchSheetData = async (sheetName) => {
      try {
        const response = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${sheetName}?key=${API_KEY}`
        );
        const result = await response.json();

        if (result.values) {
          const [headers, ...rows] = result.values;
          // Convert rows to array of objects with header keys
          const formattedData = rows.map((row) => {
            return headers.reduce((obj, header, index) => {
              obj[header] = row[index] || ""; // Use empty string if cell is undefined
              return obj;
            }, {});
          });

          return formattedData;
        }
        return [];
      } catch (error) {
        console.error(`Error fetching ${sheetName}:`, error);
        return [];
      }
    };

    const fetchAllData = async () => {
      const categoriesData = await fetchSheetData(SHEET1_NAME);
      const coursesData = await fetchSheetData(SHEET2_NAME);
      const classsData = await fetchSheetData(SHEET3_NAME);
      

      setJsonData({
        [SHEET1_NAME]: categoriesData,
        [SHEET2_NAME]: coursesData,
        [SHEET3_NAME]: classsData,
      });
    };
    fetchAllData();
  }, []);





  
  // Log the JSON data to console
  // console.log("JSON Data in Data context:", jsonData);

  // Function to fetch data from API
  // const fetchCollection = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await fetch("http://localhost:5000/collections"); // Change URL accordingly
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }
  //     const result = await response.json();
  //     console.log(result);
  //     setCollection(result); // Update collection state
  //   } catch (err) {
  //     setError(err.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Fetch data when the component mounts
  // useEffect(() => {
  //   fetchCollection();
  // }, []);

  return (
    <DataContext.Provider
      value={{jsonData, loading, error }}
    >
      {children}
    </DataContext.Provider>
  );
};
