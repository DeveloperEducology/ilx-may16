import React from "react";
import QuizFillHTML from "./QuizFillHTML";

const quizData = {
  id: "A.1",
  type: "blank",
  question: [
    {
      content: `<p>
    <span style="color:#009688;"><strong>guess the sequence&nbsp;</strong></span>
</p>
<p>
    &nbsp;
</p>
<figure class="table" style="width:27.79%;">
    <table class="ck-table-resized" style="background-color:hsl(0, 0%, 100%);border:2px solid hsl(0, 0%, 0%);">
        <colgroup><col style="width:18.84%;"><col style="width:24.93%;"><col style="width:27.46%;"><col style="width:28.77%;"></colgroup>
        <tbody>
            <tr>
                <td style="text-align:center;">
                    1
                </td>
                <td style="text-align:center;">
                    2
                </td>
                <td style="text-align:center;">
                    3
                </td>
                <td style="text-align:center;">
                    4
                </td>
            </tr>
            <tr>
                <td style="text-align:center;">
                    1
                </td>
                <td style="text-align:center;">
                    4
                </td>
                <td style="border-color:hsl(120, 75%, 60%);border-width:2px;text-align:center;">
                    <span><input style="width:40px;" type="text" placeholder="|"></span>
                </td>
                <td style="text-align:center;">
                    25
                </td>
            </tr>
        </tbody>
    </table>
</figure>
<p>
    &nbsp;
</p>
<p>
    &nbsp;
</p>
<p>
    &nbsp;
</p>
<p>
    &nbsp;
</p>
<p>
    &nbsp;
</p>
<p>
    &nbsp;
</p>
<p>
    &nbsp;
</p>
<p>
    &nbsp;
</p>
<p>
    &nbsp;
</p>`,
      type: "html",
    },
  ],
  correctAnswer: [7],
  images: [],
};

const QuizHtml = () => {
  return (
    <div style={{ padding: 20 }}>
      <h2>Quiz</h2>
      <QuizFillHTML questionData={quizData} />
    </div>
  );
};

export default QuizHtml;
