import React, { useState, useEffect } from "react";
import axios from "axios";

const SHEET_ID = "1dpbkXj3WH6PMWNHV42PdpnRmn6s9BO1I_vY9ODrZ6bE";
const API_KEY = "AIzaSyC9vv5R8eYv0Y4vjJxPtbfwm-f1P1AFvVA";
const SHEET1_NAME = "Categories";
const SHEET2_NAME = "Classes";
const SHEET3_NAME = "clsData";

const GoogleSheetData = () => {
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
//   console.log("JSON Data:", jsonData);

  // Render the data (optional)
  return (
    <div>
      <h2>Google Sheets Data as JSON</h2>
      <pre>{JSON.stringify(jsonData, null, 2)}</pre>
    </div>
  );
};

export default GoogleSheetData;
