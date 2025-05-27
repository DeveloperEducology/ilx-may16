import React, { useEffect, useState, useRef } from "react";

 // MathRenderer component (unchanged)
    const MathRenderer = ({ latex }) => {
      const [katexLoaded, setKatexLoaded] = useState(false);

      useEffect(() => {
        if (!window.katex) {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.js";
          script.onload = () => setKatexLoaded(true);
          document.head.appendChild(script);

          const css = document.createElement("link");
          css.rel = "stylesheet";
          css.href = "https://cdn.jsdelivr.net/npm/katex@0.16.4/dist/katex.min.css";
          document.head.appendChild(css);
        } else {
          setKatexLoaded(true);
        }
      }, []);

      if (!katexLoaded) return <p>Loading KaTeX...</p>;

      try {
        return (
          <div className="my-4">
            <span
              dangerouslySetInnerHTML={{
                __html: window.katex.renderToString(latex, {
                  throwOnError: false,
                  displayMode: true,
                }),
              }}
            />
          </div>
        );
      } catch (e) {
        console.error("KaTeX rendering error:", e);
        return <p>Invalid LaTeX: {latex}</p>;
      }
    };

    // piecesToLatex function (unchanged)
    function piecesToLatex(pieces) {
      return pieces
        .map((piece) => {
          switch (piece.objectType) {
            case "PlainText":
              return piece.text.replace(/\*/g, "\\times ");
            case "QMDecimal":
              return piece.nonRepeatingPart;
            case "QMExponent":
              if (piece.children?.length === 2) {
                const base = piecesToLatex([piece.children[0]]);
                const exponent = piecesToLatex([piece.children[1]]);
                return `{${base}}^{${exponent}}`;
              }
              return "";
            case "QMFraction":
              if (piece.children?.length === 2) {
                const numerator = piecesToLatex([piece.children[0]]);
                const denominator = piecesToLatex([piece.children[1]]);
                return `\\frac{${numerator}}{${denominator}}`;
              }
              return "";
            case "QMAlgebraic":
              return piece.children.map((child) => piecesToLatex([child])).join("");
            case "QMInput":
              return `\\boxed{\\text{Input}}`;
            case "QMHTML":
              return `\\text{[HTML: ${piece.content.substring(0, 20)}...]}`;
            default:
              return "";
          }
        })
        .join("");
    }

    const EditorWithMathRenderer = () => {
      const [pieces, setPieces] = useState([]);
      const [previewLatex, setPreviewLatex] = useState("");
      const [activeInput, setActiveInput] = useState(null);
      const [inputValue, setInputValue] = useState("");
      const [inputValue2, setInputValue2] = useState("");
      const quillRef = useRef(null);
      const editorRef = useRef(null);

      useEffect(() => {
        setPreviewLatex(piecesToLatex(pieces));
      }, [pieces]);

      useEffect(() => {
        let quillInstance = null;

        if (activeInput === "QMHTML" || activeInput === "PlainText") {
          if (editorRef.current && !quillRef.current) {
            quillInstance = new window.Quill(editorRef.current, {
              theme: 'snow',
              modules: {
                toolbar: [
                  [{ 'header': [1, 2, 3, false] }], // Headings (H1, H2, H3, normal)
                  [{ 'size': ['small', false, 'large', 'huge'] }], // Font sizes
                  ['bold', 'italic', 'underline'],
                  [{ 'color': [] }, { 'background': [] }], // Text and background color
                  [{ 'align': ['', 'center', 'right', 'justify'] }], // Text alignment
                  ['link'],
                  [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                  ['clean']
                ]
              },
              placeholder: 'Enter rich text here...',
            });

            quillRef.current = quillInstance;

            quillInstance.on('text-change', () => {
              if (quillRef.current) {
                setInputValue(quillRef.current.root.innerHTML);
              }
            });
          }
        }

        return () => {
          if (quillRef.current) {
            quillRef.current.off('text-change');
            quillRef.current = null;
            if (editorRef.current) {
              editorRef.current.innerHTML = '';
            }
          }
        };
      }, [activeInput]);

      const showInput = (inputType) => {
        setActiveInput(inputType);
        setInputValue("");
        setInputValue2("");
        if (quillRef.current) {
          quillRef.current.root.innerHTML = '';
        }
      };

      const addComponent = () => {
        if (!activeInput) return;

        switch (activeInput) {
          case "PlainText":
            if (inputValue.trim()) {
              setPieces([...pieces, { text: inputValue, objectType: "PlainText" }]);
            }
            break;
          case "QMDecimal":
            if (inputValue.trim()) {
              setPieces([
                ...pieces,
                {
                  objectType: "QMDecimal",
                  nonRepeatingPart: inputValue,
                },
              ]);
            }
            break;
          case "QMExponent":
            if (inputValue.trim() && inputValue2.trim()) {
              setPieces([
                ...pieces,
                {
                  objectType: "QMExponent",
                  children: [
                    { objectType: "QMDecimal", nonRepeatingPart: inputValue },
                    { objectType: "QMDecimal", nonRepeatingPart: inputValue2 },
                  ],
                },
              ]);
            }
            break;
          case "QMFraction":
            if (inputValue.trim() && inputValue2.trim()) {
              setPieces([
                ...pieces,
                {
                  objectType: "QMFraction",
                  children: [
                    { objectType: "QMDecimal", nonRepeatingPart: inputValue },
                    { objectType: "QMDecimal", nonRepeatingPart: inputValue2 },
                  ],
                },
              ]);
            }
            break;
          case "QMAlgebraic":
            if (inputValue.trim()) {
              const parts = inputValue.split(/([+\-*/])/).filter((p) => p.trim());
              const children = parts.map((part) => {
                if (["+", "-", "*", "/"].includes(part)) {
                  return { objectType: "PlainText", text: ` ${part} ` };
                } else {
                  return { objectType: "QMDecimal", nonRepeatingPart: part };
                }
              });
              setPieces([...pieces, { objectType: "QMAlgebraic", children }]);
            }
            break;
          case "QMInput":
            if (inputValue.trim() && inputValue2.trim()) {
              setPieces([
                ...pieces,
                {
                  objectType: "QMInput",
                  id: inputValue,
                  correctAnswer: inputValue2,
                },
              ]);
            }
            break;
          case "QMHTML":
            if (inputValue.trim()) {
              setPieces([
                ...pieces,
                {
                  objectType: "QMHTML",
                  content: inputValue,
                },
              ]);
            }
            break;
          default:
            break;
        }

        setActiveInput(null);
        setInputValue("");
        setInputValue2("");
        if (quillRef.current) {
          quillRef.current.root.innerHTML = '';
        }
      };

      const clearAll = () => setPieces([]);

      const exportJSON = () => {
        const blob = new Blob([JSON.stringify(pieces, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "math_pieces.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      const renderInputField = () => {
        if (!activeInput) return null;

        const inputConfig = {
          "PlainText": {
            label: "Enter plain text:",
            fields: 1,
            useQuill: false
          },
          "QMDecimal": {
            label: "Enter a number:",
            fields: 1,
            useQuill: false
          },
          "QMExponent": {
            label: "Enter exponent:",
            fields: 2,
            labels: ["Base", "Exponent"],
            useQuill: false
          },
          "QMFraction": {
            label: "Enter fraction:",
            fields: 2,
            labels: ["Numerator", "Denominator"],
            useQuill: false
          },
          "QMAlgebraic": {
            label: "Enter algebraic expression (e.g., 2x + 3y):",
            fields: 1,
            useQuill: false
          },
          "QMInput": {
            label: "Enter input field:",
            fields: 2,
            labels: ["Input ID", "Correct answer"],
            useQuill: false
          },
          "QMHTML": {
            label: "Enter HTML content:",
            fields: 1,
            useQuill: true
          }
        };

        const config = inputConfig[activeInput];

        return (
          <div className="bg-gray-100 p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">{config.label}</h3>
            {config.useQuill ? (
              <div>
                <div ref={editorRef} className="bg-white border rounded" style={{ minHeight: '150px' }}></div>
                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={addComponent}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                  <button 
                    onClick={() => setActiveInput(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={config.fields === 1 ? config.label : config.labels[0]}
                  className="flex-1 p-2 border rounded"
                />
                {config.fields === 2 && (
                  <input
                    type="text"
                    value={inputValue2}
                    onChange={(e) => setInputValue2(e.target.value)}
                    placeholder={config.labels[1]}
                    className="flex-1 p-2 border rounded"
                  />
                )}
                <button 
                  onClick={addComponent}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add
                </button>
                <button 
                  onClick={() => setActiveInput(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
      };

      return (
        <div className="p-4 max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Math Expression Editor</h2>

          <div className="flex flex-wrap gap-2 mb-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => showInput("PlainText")}>
              Add Text
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => showInput("QMDecimal")}>
              Add Number
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => showInput("QMExponent")}>
              Add Exponent
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => showInput("QMFraction")}>
              Add Fraction
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => showInput("QMAlgebraic")}>
              Add Expression
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => showInput("QMInput")}>
              Add Input
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => showInput("QMHTML")}>
              Add HTML
            </button>
            <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600" onClick={clearAll}>
              Clear All
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600" onClick={exportJSON}>
              Export JSON
            </button>
          </div>

          {renderInputField()}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Components</h3>
              <ul className="border rounded p-2 bg-gray-50">
                {pieces.length === 0 ? (
                  <li className="text-gray-500">No components added yet</li>
                ) : (
                  pieces.map((piece, i) => (
                    <li key={i} className="py-1 border-b last:border-b-0">
                      {piece.objectType === "PlainText" && `Text: "${piece.text}"`}
                      {piece.objectType === "QMDecimal" &&
                        `Number: ${piece.nonRepeatingPart}`}
                      {piece.objectType === "QMExponent" &&
                        `Exponent: ${piece.children[0].nonRepeatingPart}^${piece.children[1].nonRepeatingPart}`}
                      {piece.objectType === "QMFraction" &&
                        `Fraction: ${piece.children[0].nonRepeatingPart}/${piece.children[1].nonRepeatingPart}`}
                      {piece.objectType === "QMAlgebraic" &&
                        `Expression: ${piece.children
                          .map((c) => c.text || c.nonRepeatingPart)
                          .join("")}`}
                      {piece.objectType === "QMInput" &&
                        `Input: ${piece.id} (Correct answer: ${piece.correctAnswer})`}
                      {piece.objectType === "QMHTML" &&
                        `HTML: ${piece.content.substring(0, 50)}...`}
                    </li>
                  ))
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Rendered Preview</h3>
              <div className="border rounded p-4 bg-white min-h-20">
                <MathRenderer latex={previewLatex} />
              </div>
            </div>
          </div>
        </div>
      );
    };


export default  EditorWithMathRenderer