import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import "./quiz.css";

const questions = [
  {
    id: "f7",
    type: "fill-in",
    sequenceType: "html",
    prompt: `<p>
    <span style="background-color:rgb(255,255,255);color:rgb(0,0,0);font-family:'IXL Verdana', Verdana, Arial, Helvetica, sans-serif;font-size:16px;"><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273112622_216'>Count</span><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273112622_217'> the lollipops by </span><span class='decimal-scalar expression number' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;position:relative;text-align:center;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' data-testid='decimal-scalar' id='yui_3_18_1_1_1747273112622_218'>2</span><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273112622_219'>s.</span></span>
</p>
<p>
    <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.webp 376w' type='image/webp' sizes='(max-width: 376px) 100vw, 376px'><img class='image_resized' style='width:13.12%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.png' data-ckbox-resource-id='u89BOAn07qVi' width='376' height='420'></picture> <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.webp 376w' type='image/webp' sizes='(max-width: 376px) 100vw, 376px'><img class='image_resized' style='width:12.81%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.png' data-ckbox-resource-id='u89BOAn07qVi' width='376' height='420'></picture>
</p>
<p>
    <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.webp 376w' type='image/webp' sizes='(max-width: 376px) 100vw, 376px'><img class='image_resized' style='width:12.82%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.png' data-ckbox-resource-id='u89BOAn07qVi' width='376' height='420'></picture><picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.webp 376w' type='image/webp' sizes='(max-width: 376px) 100vw, 376px'><img class='image_resized' style='width:13.22%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.png' data-ckbox-resource-id='u89BOAn07qVi' width='376' height='420'></picture>
</p>`,
    correctAnswer: "8",
  },
  {
    id: "f8",
    type: "fill-in",
    sequenceType: "html",
    prompt: `<p>
    <span style="background-color:rgb(255,255,255);color:rgb(0,0,0);font-family:'IXL Verdana', Verdana, Arial, Helvetica, sans-serif;font-size:16px;"><span style='-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:pre-wrap;widows:2;word-spacing:0px;'>Each bush has 3 flowers.</span></span>
</p>
<p>
    <span style="background-color:rgb(255,255,255);color:rgb(0,0,0);font-family:'IXL Verdana', Verdana, Arial, Helvetica, sans-serif;font-size:16px;"><span style='-webkit-text-stroke-width:0px;display:inline !important;float:none;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:pre-wrap;widows:2;word-spacing:0px;'>How many flowers are on 6 bushes?</span></span>
</p>
<figure class='table' style='float:left;width:23.95%;'>
    <table class='ck-table-resized' style='background-color:hsl(0, 0%, 90%);border-color:hsl(0, 0%, 0%);'>
        <colgroup><col style='width:46.77%;'><col style='width:53.23%;'></colgroup>
        <tbody>
            <tr>
                <td style='background-color:hsl(210, 75%, 60%);border-color:hsl(0, 0%, 0%);'>
                    No of Bushes
                </td>
                <td style='background-color:hsl(210, 75%, 60%);border-color:hsl(0, 0%, 0%);border-style:double;text-align:center;'>
                    No of flowers
                </td>
            </tr>
            <tr>
                <td style='border-color:hsl(0, 0%, 0%);'>
                    <p style='text-align:center;'>
                        1
                    </p>
                </td>
                <td style='border-color:hsl(0, 0%, 0%);'>
                    <p style='text-align:center;'>
                        3
                    </p>
                </td>
            </tr>
            <tr>
                <td style='border-color:hsl(0, 0%, 0%);'>
                    <p style='text-align:center;'>
                        2
                    </p>
                </td>
                <td style='border-color:hsl(0, 0%, 0%);'>
                    <p style='text-align:center;'>
                        6
                    </p>
                </td>
            </tr>
            <tr>
                <td style='border-color:hsl(0, 0%, 0%);'>
                    <p style='text-align:center;'>
                        3
                    </p>
                </td>
                <td style='border-color:hsl(0, 0%, 0%);'>
                    <p style='text-align:center;'>
                        <span style='background-color:#f44336;'>X</span>
                    </p>
                </td>
            </tr>
        </tbody>
    </table>
</figure>`,
    correctAnswer: "9",
  },
  {
    id: "S9",
    type: "sequence",
    text: "Fill the blank with the correct letter.",
    question: ["2 + 3 = null"],
    correctAnswers: ["5"],
    options: [],
    imageUrl: [],
    style: { height: "200px", width: "200px" },
  },
  {
    id: "A.12",
    type: "fill-in-sequence",
    prompt: "Guess the missing number",
    sequence: [
      `<p>
    <span style="background-color:rgb(255,255,255);color:rgb(0,0,0);font-family:'IXL Verdana', Verdana, Arial, Helvetica, sans-serif;font-size:16px;"><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273112622_216'>Count</span><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273112622_217'> the lollipops by </span><span class='decimal-scalar expression number' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;position:relative;text-align:center;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' data-testid='decimal-scalar' id='yui_3_18_1_1_1747273112622_218'>2</span><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273112622_219'>s.</span></span>
</p>
<p>
    <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.webp 376w' type='image/webp' sizes='(max-width: 376px) 100vw, 376px'><img class='image_resized' style='width:13.12%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.png' data-ckbox-resource-id='u89BOAn07qVi' width='376' height='420'></picture> <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.webp 376w' type='image/webp' sizes='(max-width: 376px) 100vw, 376px'><img class='image_resized' style='width:12.81%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.png' data-ckbox-resource-id='u89BOAn07qVi' width='376' height='420'></picture>
</p>
<p>
    <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.webp 376w' type='image/webp' sizes='(max-width: 376px) 100vw, 376px'><img class='image_resized' style='width:12.82%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.png' data-ckbox-resource-id='u89BOAn07qVi' width='376' height='420'></picture><picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.webp 376w' type='image/webp' sizes='(max-width: 376px) 100vw, 376px'><img class='image_resized' style='width:13.22%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/u89BOAn07qVi/images/376.png' data-ckbox-resource-id='u89BOAn07qVi' width='376' height='420'></picture>
</p>`,
    ],
    sequenceType: "html",
    correctAnswers: ["8"],
  },
  {
    id: "A.13",
    type: "fill-in",
    prompt: `<p>
    <span style="background-color:rgb(255,255,255);color:rgb(0,0,0);font-family:'IXL Verdana', Verdana, Arial, Helvetica, sans-serif;font-size:16px;"><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273769756_343'>Count</span><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273769756_344'> the fire trucks by </span><span class='decimal-scalar expression number' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;position:relative;text-align:center;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' data-testid='decimal-scalar' id='yui_3_18_1_1_1747273769756_345'>5</span><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273769756_346'>s.</span></span>
</p>
<p>
    <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/140.webp 140w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/280.webp 280w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/420.webp 420w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/560.webp 560w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/700.webp 700w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/840.webp 840w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/980.webp 980w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/1120.webp 1120w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/1260.webp 1260w,https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/1396.webp 1396w' sizes='(max-width: 1396px) 100vw, 1396px' type='image/webp'><img class='image_resized' style='width:80.75%;' data-ckbox-resource-id='BWqdHuNjwUzm' src='https://ckbox.cloud/915813720b45bb024b87/assets/BWqdHuNjwUzm/images/1396.png' width='1396' height='442'></picture>
</p>
<p>
    <span style="background-color:rgb(255,255,255);color:rgb(0,0,0);font-family:'IXL Verdana', Verdana, Arial, Helvetica, sans-serif;font-size:16px;"><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;'>How many fire trucks are there?</span></span>
</p>`,
    sequenceType: "html",
    correctAnswer: "15",
  },
  {
    id: "A.13",
    type: "fill-in-sequence",
    prompt: "Guess the missing number",
    sequence: [
      `<p>
    <span style="background-color:rgb(255,255,255);color:rgb(0,0,0);font-family:'IXL Verdana', Verdana, Arial, Helvetica, sans-serif;font-size:16px;"><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273769756_343'>Count</span><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273769756_344'> the fire trucks by </span><span class='decimal-scalar expression number' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;position:relative;text-align:center;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' data-testid='decimal-scalar' id='yui_3_18_1_1_1747273769756_345'>5</span><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;' id='yui_3_18_1_1_1747273769756_346'>s.</span></span>
</p>
<p>
    <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/400.webp 400w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/448.webp 448w' sizes='(max-width: 448px) 100vw, 448px' type='image/webp'><img class='image_resized' style='width:21.63%;' data-ckbox-resource-id='GkWWpiE_G4mp' src='https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/448.png' width='448' height='334'></picture>. <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/400.webp 400w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/448.webp 448w' type='image/webp' sizes='(max-width: 448px) 100vw, 448px'><img class='image_resized' style='width:21.63%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/448.png' data-ckbox-resource-id='GkWWpiE_G4mp' width='448' height='334'></picture> <picture><source srcset='https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/80.webp 80w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/160.webp 160w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/240.webp 240w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/320.webp 320w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/400.webp 400w,https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/448.webp 448w' type='image/webp' sizes='(max-width: 448px) 100vw, 448px'><img class='image_resized' style='width:21.63%;' src='https://ckbox.cloud/915813720b45bb024b87/assets/GkWWpiE_G4mp/images/448.png' data-ckbox-resource-id='GkWWpiE_G4mp' width='448' height='334'></picture>
</p>
<p>
    <span style="background-color:rgb(255,255,255);color:rgb(0,0,0);font-family:'IXL Verdana', Verdana, Arial, Helvetica, sans-serif;font-size:16px;"><span class='txt' style='-webkit-text-stroke-width:0px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:400;letter-spacing:normal;orphans:2;text-align:left;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;vertical-align:middle;white-space:normal;widows:2;word-spacing:0px;'>How many fire trucks are there?</span></span>
</p>`,
    ],
    sequenceType: "html",
    correctAnswers: ["15"],
  },
  {
    id: "S3",
    type: "fill-in-sequence",
    prompt: "Fill the blank.",
    sequence: [10, 20, null],
    correctAnswers: ["30"],
  },
  {
    id: "Q0",
    type: "single-select",
    prompt:
      "Assertion (A): Water boils at 100°C at sea level.\nReason (R): Atmospheric pressure affects the boiling point of liquids.",
    options: [
      "Both A and R are true and R is the correct explanation of A.",
      "Both A and R are true but R is not the correct explanation of A.",
      "A is true but R is false.",
      "A is false but R is true.",
      "Both A and R are false.",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: "Q1",
    type: "single-select",
    prompt: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "London"],
    correctAnswerIndex: 2,
  },
  {
    id: "Q2",
    type: "multi-select",
    prompt: "Select all prime numbers:",
    options: ["2", "3", "4", "5"],
    correctAnswerIndices: [0, 1, 3],
  },
  {
    id: "Q2-2",
    type: "multi-select",
    prompt: "Select correct values:",
    options: ["2+2=4", "3+3=6", "4+4=6", "5+5=10"],
    correctAnswerIndices: [0, 1, 3],
  },
  {
    id: "Q3",
    type: "fill-in",
    prompt: "The chemical symbol for water is ___",
    correctAnswer: "H2O",
  },
  {
    id: "A.4",
    type: "fill-in-sequence",
    prompt: "Guess the missing number",
    sequence: [1, 4, null, 16],
    sequenceType: "plainText",
    correctAnswers: ["9"],
  },
  {
    id: "A.5",
    type: "fill-in",
    prompt: "1, 3, 5, ?",
    correctAnswer: "7",
  },
  {
    id: "A.6",
    type: "fill-in-sequence",
    prompt: "write after number and before number",
    sequence: [null, 3, null],
    sequenceType: "plainText",
    correctAnswers: ["2", "4"],
  },
  {
    id: "A.8",
    type: "fill-in-sequence",
    prompt: "Guess the missing number",
    sequence: [
      `<p><strong>Guess the sequence</strong></p>
        <table border='2'>
          <tr><td>1</td><td>2</td><td>3</td><td>4</td></tr>
          <tr><td>1</td><td>4</td><td style='color:red;'>?</td><td>25</td></tr>
        </table>`,
    ],
    sequenceType: "html",
    correctAnswers: ["9"],
  },
  {
    id: "A.10",
    type: "fill-in-sequence",
    prompt: "Assertion and reasoning",
    sequence: [
      `<div style='-webkit-text-stroke-width:0px;background-color:rgb(248, 248, 248);box-sizing:border-box;color:rgb(102, 102, 102);font-family:roboto-regular;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:300;letter-spacing:normal;line-height:27px;margin-bottom:10px;orphans:2;outline:none;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;'>
          <span style='font-family:Tahoma, Geneva, sans-serif;'><strong><sup>In each of the questions given below, there are two statements marked as Assertion (A) and Reason (R). Mark your answer as per the codes provided below:</sup></strong></span>
      </div>
      <p>
          Assertion (A): When lightning strikes, the sound is heard a little after the flash is seen.<br>
          Reason (R): The velocity of light is greater than that of the sound.
      </p>
      <ol style='-webkit-text-stroke-width:0px;background-color:rgb(248, 248, 248);box-sizing:border-box;color:rgb(102, 102, 102);font-family:roboto-regular;font-size:16px;font-style:normal;font-variant-caps:normal;font-variant-ligatures:normal;font-weight:300;letter-spacing:normal;list-style-type:decimal;margin-bottom:10px;margin-top:0px;orphans:2;outline:none;padding:0px 0px 20px 30px;text-align:start;text-decoration-color:initial;text-decoration-style:initial;text-decoration-thickness:initial;text-indent:0px;text-transform:none;white-space:normal;widows:2;word-spacing:0px;'>
          <li style='box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px 0px 10px;'>
              Both A and R are true and R is the correct explanation of A.
          </li>
          <li style='box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px 0px 10px;'>
              Both A and R are true but R is not the correct explanation of A.
          </li>
          <li style='box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px 0px 10px;'>
              A is true but R is false.
          </li>
          <li style='box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px 0px 10px;'>
              A is false but R is true.
          </li>
          <li style='box-sizing:border-box;font-family:roboto-regular !important;outline:none;padding:0px;'>
              Both A and R are false
          </li>
      </ol>`,
    ],
    sequenceType: "html",
    correctAnswers: ["1"],
  },
  {
    id: "S1",
    type: "fill-in",
    prompt: "How many apples are there in the basket?",
    correctAnswer: "10",
    options: [],
    imageUrl: [
      "https://m.media-amazon.com/images/I/81MbS41+wFL._AC_UF894,1000_QL80_.jpg",
    ],
    style: { height: "300px", width: "300px" },
  },
  {
    id: "S2",
    type: "sequence",
    text: "Fill the blank.",
    question: ["There are null apples in a tray, null are red, null are green"],
    correctAnswers: ["10", "5", "5"],
    options: [],
    imageUrl: [
      "https://m.media-amazon.com/images/I/81MbS41+wFL._AC_UF894,1000_QL80_.jpg",
    ],
    style: { height: "300px", width: "300px" },
  },
  {
    id: "S4",
    type: "sequence",
    text: "Fill the blank.",
    question: [
      "There are null days in a week",
      "There are null months in a year",
    ],
    correctAnswers: ["7", "12"],
    options: [],
    imageUrl: [],
    style: { height: "300px", width: "300px" },
  },
  {
    id: "S5",
    type: "sequence",
    text: "Fill the blank.",
    clue: "chocolate",
    question: ["ch null c null l null t null"],
    correctAnswers: ["o", "o", "a", "e"],
    options: [],
    imageUrl: [
      "https://upload.wikimedia.org/wikipedia/commons/1/11/Three_Bars_%281%29.jpg",
    ],
    style: { height: "300px", width: "300px" },
  },
  {
    id: "S6",
    type: "sequence",
    text: "Fill the blank.",
    clue: "leopard",
    question: ["l null null p null rd"],
    correctAnswers: ["e", "o", "a"],
    options: [],
    imageUrl: [
      "https://www.krugerpark.co.za/images/leopard-kruger-rh-786x500.jpg",
    ],
    style: { height: "200px", width: "200px" },
  },
  {
    id: "S7",
    type: "sequence",
    text: "Fill the blank with the correct letter.",
    clue: "airplane",
    question: ["a null rpl null n null"],
    correctAnswers: ["i", "a", "e"],
    options: ["i", "a", "e"],
    imageUrl: ["https://i.ytimg.com/vi/5gHYQto803E/maxresdefault.jpg"],
    style: { height: "200px", width: "200px" },
  },
  {
    id: "S8",
    type: "sequence",
    text: "Fill the blank with the correct letter.",
    question: ["a big p null g"],
    correctAnswers: ["i"],
    options: ["a", "e", "o", "i"],
    imageUrl: [],
    style: { height: "200px", width: "200px" },
  },
  {
    id: "S9",
    type: "sequence",
    text: "Fill the blank with the correct letter.",
    question: ["null null ui null null"],
    correctAnswers: ["f", "r", "t", "s"],
    options: [],
    imageUrl: [
      "https://www.fastandup.in/nutrition-world/wp-content/uploads/2023/06/fruit-min.png",
    ],
    style: { height: "200px", width: "200px" },
  },
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [showQuestion, setShowQuestion] = useState(true);
  const [filledSequences, setFilledSequences] = useState([]);

  const question = questions[currentQuestionIndex];

  const initializeUserAnswer = (question) => {
    if (question.type === "fill-in-sequence" || question.type === "sequence") {
      const nullCount =
        question.type === "fill-in-sequence"
          ? question.sequence
            ? question.sequence.filter((item) => item === null).length
            : question.correctAnswers.length
          : question.question.reduce(
              (count, str) => count + (str.match(/null/g) || []).length,
              0
            );
      return Array(nullCount).fill("");
    }
    return "";
  };

  const handleAnswerChange = (e, index) => {
    if (question.type === "fill-in-sequence") {
      const prevSequenceAnswers =
        userAnswers[question.id] || initializeUserAnswer(question);
      const newSequenceAnswers = [...prevSequenceAnswers];
      newSequenceAnswers[index] = e.target.value;
      setUserAnswers({ ...userAnswers, [question.id]: newSequenceAnswers });
    } else {
      setUserAnswers({ ...userAnswers, [question.id]: e.target.value });
    }
    setFeedback({ ...feedback, [question.id]: "" });
  };

  const handleSingleSelect = (value) => {
    setUserAnswers({ ...userAnswers, [question.id]: value });
    setFeedback({ ...feedback, [question.id]: "" });
  };

  const handleMultiSelect = (value) => {
    const prev = userAnswers[question.id] || [];
    const updated = prev.includes(value)
      ? prev.filter((v) => v !== value)
      : [...prev, value];
    setUserAnswers({ ...userAnswers, [question.id]: updated });
    setFeedback({ ...feedback, [question.id]: "" });
  };

  const handleSequenceInputChange = (index, value) => {
    const prevSequenceAnswers =
      userAnswers[question.id] || initializeUserAnswer(question);
    const newSequenceAnswers = [...prevSequenceAnswers];
    newSequenceAnswers[index] = value;
    setUserAnswers({ ...userAnswers, [question.id]: newSequenceAnswers });
    setFeedback({ ...feedback, [question.id]: "" });
    setFilledSequences([]);
  };

  const handleSequenceOptionClick = (option) => {
    const prevSequenceAnswers =
      userAnswers[question.id] || initializeUserAnswer(question);
    const firstEmptyIndex = prevSequenceAnswers.findIndex((val) => !val);
    if (firstEmptyIndex !== -1) {
      const newSequenceAnswers = [...prevSequenceAnswers];
      newSequenceAnswers[firstEmptyIndex] = option;
      setUserAnswers({ ...userAnswers, [question.id]: newSequenceAnswers });
      setFeedback({ ...feedback, [question.id]: "" });
      setFilledSequences([]);
    }
  };

  const checkAnswer = () => {
    let isCorrect = false;
    const userInput = userAnswers[question.id];

    if (question.type === "single-select" || question.type === "reasoning") {
      isCorrect = userInput === question.options[question.correctAnswerIndex];
    } else if (question.type === "multi-select") {
      const selected = (userInput || []).sort().join(",");
      const correct = question.correctAnswerIndices
        .map((i) => question.options[i])
        .sort()
        .join(",");
      isCorrect = selected === correct;
    } else if (question.type === "sequence") {
      const sequenceAnswers = userInput || initializeUserAnswer(question);
      isCorrect =
        sequenceAnswers.length === question.correctAnswers.length &&
        sequenceAnswers.every(
          (value, idx) =>
            value &&
            value.trim().toLowerCase() ===
              String(question.correctAnswers[idx]).trim().toLowerCase()
        );

      if (isCorrect) {
        const nullCount = question.question.reduce(
          (count, str) => count + (str.match(/null/g) || []).length,
          0
        );
        let nullIndex = 0;
        const replaced = question.question.map((str) =>
          str.replace(/null/g, () => sequenceAnswers[nullIndex++] || "")
        );
        setFilledSequences(replaced);
      }
    } else if (question.type === "fill-in-sequence") {
      const sequenceAnswers = userInput || initializeUserAnswer(question);
      const nullCount = question.sequence
        ? question.sequence.filter((item) => item === null).length
        : question.correctAnswers.length;
      isCorrect =
        sequenceAnswers.length === nullCount &&
        sequenceAnswers.every(
          (value, idx) =>
            value &&
            value.trim().toLowerCase() ===
              String(question.correctAnswers[idx]).trim().toLowerCase()
        );
    } else {
      const normalizedUser = String(userInput || "")
        .trim()
        .toLowerCase();
      if (question.correctAnswers) {
        isCorrect = question.correctAnswers.some(
          (correct) => normalizedUser === String(correct).trim().toLowerCase()
        );
      } else {
        const normalizedCorrect = String(question.correctAnswer)
          .trim()
          .toLowerCase();
        isCorrect = normalizedUser === normalizedCorrect;
      }
    }

    const feedbackMessage = isCorrect
      ? "✅ Correct!"
      : question.type === "sequence" || question.type === "fill-in-sequence"
      ? `❌ Incorrect, the correct answers are ${question.correctAnswers.join(
          ", "
        )}. You entered: ${(userInput || []).join(", ")}`
      : question.correctAnswers
      ? `❌ Incorrect, the correct answers are ${question.correctAnswers.join(
          ", "
        )}. You entered: ${userInput || ""}`
      : `❌ Incorrect, the correct answer is ${
          question.correctAnswer
        }. You entered: ${userInput || ""}`;

    setFeedback({
      ...feedback,
      [question.id]: feedbackMessage,
    });

    if (isCorrect) {
      setShowQuestion(false);
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex((prev) => prev + 1);
          setShowQuestion(true);
          setFeedback({
            ...feedback,
            [questions[currentQuestionIndex + 1].id]: "",
          });
          setFilledSequences([]);
        } else {
          setFeedback({
            ...feedback,
            [question.id]: "✅ Correct! Quiz completed!",
          });
        }
      }, 1500);
    }
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "reasoning":
      case "single-select":
        return (
          <>
            <p className="question-prompt">{question.prompt}</p>
            {question.options.map((opt, index) => {
              const isSelected = userAnswers[question.id] === opt;
              const alphabet = String.fromCharCode(65 + index);
              return (
                <div key={opt} className="option-container">
                  <label className="option-label">
                    <input
                      type="radio"
                      name={question.id}
                      value={opt}
                      checked={isSelected}
                      onChange={() => handleSingleSelect(opt)}
                      className="option-radio"
                      aria-label={`${alphabet}: ${opt}`}
                    />
                    <span
                      className={`option-indicator ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      {alphabet}
                    </span>
                    <span>{opt}</span>
                  </label>
                </div>
              );
            })}
          </>
        );

      case "multi-select":
        return (
          <>
            <p className="question-prompt">{question.prompt}</p>
            {question.options.map((opt, index) => {
              const isSelected = (userAnswers[question.id] || []).includes(opt);
              const alphabet = String.fromCharCode(65 + index);
              return (
                <div key={opt} className="option-container">
                  <label className="option-label">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleMultiSelect(opt)}
                      className="option-checkbox"
                      aria-label={`${alphabet}: ${opt}`}
                    />
                    <span
                      className={`option-indicator ${
                        isSelected ? "selected" : ""
                      }`}
                    >
                      {isSelected ? "✔" : alphabet}
                    </span>
                    <span>{opt}</span>
                  </label>
                </div>
              );
            })}
          </>
        );

      case "fill-in":
        return (
          <div className="mb-6 flex flex-col items-start">
            {question.sequenceType === "html" ? (
              <div
                className="html-content"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(question.prompt),
                }}
              />
            ) : (
              <p className="question-prompt">{question.prompt}</p>
            )}
            {question.imageUrl?.length > 0 && (
              <div className="image-container">
                {question.imageUrl.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Question ${currentQuestionIndex + 1} image ${
                      index + 1
                    }`}
                    style={{
                      width: question.style?.width || "150px",
                      height: question.style?.height || "150px",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ))}
              </div>
            )}
            <input
              type="text"
              value={userAnswers[question.id] || ""}
              onChange={(e) => handleAnswerChange(e)}
              placeholder="Your answer"
              className="fill-in-input"
            />
          </div>
        );

      case "fill-in-sequence":
        return (
          <>
            <p className="question-prompt">{question.prompt}</p>
            {question.sequenceType === "html" ? (
              <>
                <div
                  className="html-content"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(question.sequence[0]),
                  }}
                />
                <div className="flex gap-2 mb-4">
                  {Array(question.correctAnswers.length)
                    .fill()
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        value={(userAnswers[question.id] || [])[index] || ""}
                        onChange={(e) => handleAnswerChange(e, index)}
                        className="sequence-input"
                        placeholder=""
                        aria-label={`Answer ${index + 1} for ${
                          question.prompt
                        }`}
                      />
                    ))}
                </div>
              </>
            ) : (
              <div className="flex items-center flex-wrap gap-2">
                {question.sequence?.map((item, index) => {
                  if (item === null) {
                    const nullIndex = question.sequence
                      .slice(0, index)
                      .filter((i) => i === null).length;
                    return (
                      <input
                        key={index}
                        type="text"
                        value={
                          (userAnswers[question.id] || [])[nullIndex] || ""
                        }
                        onChange={(e) => handleAnswerChange(e, nullIndex)}
                        className="sequence-input"
                        placeholder=""
                        aria-label={`Answer ${nullIndex + 1} for ${
                          question.prompt
                        }`}
                      />
                    );
                  }
                  return (
                    <span key={index} className="mr-1">
                      {item}
                      {index < question.sequence.length - 1 ? "," : ""}
                    </span>
                  );
                })}
              </div>
            )}
            {question.options?.length > 0 && (
              <div className="flex justify-start gap-2 mt-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSequenceOptionClick(option)}
                    className={`sequence-option-button ${
                      (userAnswers[question.id] || []).includes(option)
                        ? "selected"
                        : ""
                    }`}
                    aria-label={`Select option ${option}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </>
        );

      case "sequence":
        const sequenceAnswers =
          userAnswers[question.id] || initializeUserAnswer(question);
        const questionStrings = Array.isArray(question.question)
          ? question.question
          : question.question[0]?.split(",") || [];
        const totalNullCount = questionStrings.reduce(
          (count, str) => count + (str.match(/null/g) || []).length,
          0
        );

        return (
          <>
            <div className="mb-6">
              <p className="text-xl font-semibold">{question.text}</p>
              {question.clue && (
                <p className="text-lg italic text-gray-600">
                  Clue: {question.clue}
                </p>
              )}
            </div>

            {question.imageUrl?.length > 0 && (
              <div className="image-container">
                {question.imageUrl.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Question ${currentQuestionIndex + 1} image ${
                      index + 1
                    }`}
                    style={{
                      width: question.style?.width || "150px",
                      height: question.style?.height || "150px",
                      maxWidth: "100%",
                      objectFit: "contain",
                    }}
                  />
                ))}
              </div>
            )}

            <div className="text-lg mb-6">
              {questionStrings.map((sequenceStr, qIndex) => {
                if (!sequenceStr || typeof sequenceStr !== "string") {
                  return (
                    <p key={qIndex} className="text-red-600">
                      Invalid question format
                    </p>
                  );
                }
                const isSentence = /[a-zA-Z]/.test(sequenceStr);
                const nullOffset = questionStrings
                  .slice(0, qIndex)
                  .reduce(
                    (count, str) => count + (str.match(/null/g) || []).length,
                    0
                  );

                return (
                  <div key={qIndex} className="mb-4">
                    {isSentence ? (
                      <p className="text-lg">
                        {sequenceStr.split(" ").map((word, idx) => {
                          if (word === "null") {
                            const nullIndex =
                              nullOffset +
                              sequenceStr
                                .split(" ")
                                .slice(0, idx)
                                .filter((w) => w === "null").length;
                            return (
                              <input
                                key={idx}
                                type="text"
                                value={sequenceAnswers[nullIndex] || ""}
                                onChange={(e) =>
                                  handleSequenceInputChange(
                                    nullIndex,
                                    e.target.value
                                  )
                                }
                                className="sequence-input"
                                placeholder=""
                                aria-label={`Answer ${nullIndex + 1} for ${
                                  question.text
                                }`}
                              />
                            );
                          }
                          return <span key={idx}> {word} </span>;
                        })}
                      </p>
                    ) : (
                      <div className="flex justify-center gap-2 flex-wrap items-center text-lg">
                        {sequenceStr.split(",").map((item, index) => {
                          const trimmed = String(item || "").trim();
                          if (trimmed === "null") {
                            const nullIndex =
                              nullOffset +
                              sequenceStr
                                .split(",")
                                .slice(0, index)
                                .filter((i) => i.trim() === "null").length;
                            return (
                              <span key={index} className="mx-1">
                                <input
                                  type="text"
                                  value={sequenceAnswers[nullIndex] || ""}
                                  onChange={(e) =>
                                    handleSequenceInputChange(
                                      nullIndex,
                                      e.target.value
                                    )
                                  }
                                  className="sequence-input"
                                  placeholder={`Answer ${nullIndex + 1}`}
                                  aria-label={`Answer ${nullIndex + 1} for ${
                                    question.text
                                  }`}
                                />
                                {index < sequenceStr.split(",").length - 1 &&
                                  ","}
                              </span>
                            );
                          }
                          return (
                            <span key={index} className="mx-1">
                              {trimmed}
                              {index < sequenceStr.split(",").length - 1 && ","}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
              {question.options.length > 0 && (
                <div className="flex justify-start gap-2 mb-6">
                  {question.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSequenceOptionClick(option)}
                      className={`sequence-option-button ${
                        sequenceAnswers.includes(option) ? "selected" : ""
                      }`}
                      aria-label={`Select option ${option}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {filledSequences.length > 0 && (
              <div className="sequence-output">
                {filledSequences.map((seq, idx) => (
                  <p key={idx}>
                    Output {idx + 1}:{" "}
                    <span className="sequence-output-span">{seq}</span>
                  </p>
                ))}
              </div>
            )}
          </>
        );

      default:
        return <p className="question-prompt">Unsupported question type.</p>;
    }
  };

  const allInputsFilled = () => {
    if (question.type === "sequence") {
      const sequenceAnswers =
        userAnswers[question.id] || initializeUserAnswer(question);
      return sequenceAnswers.every((val) => val && val.trim() !== "");
    } else if (question.type === "fill-in-sequence") {
      const sequenceAnswers =
        userAnswers[question.id] || initializeUserAnswer(question);
      const nullCount = question.sequence
        ? question.sequence.filter((item) => item === null).length
        : question.correctAnswers.length;
      return (
        sequenceAnswers.length === nullCount &&
        sequenceAnswers.every((val) => val && val.trim() !== "")
      );
    }
    return (
      userAnswers[question.id] !== undefined && userAnswers[question.id] !== ""
    );
  };

  return (
    <div className="quiz-container">
      <h2 className="quiz-title">Quiz</h2>
      <div>
        <h4 className="question-number">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h4>

        {showQuestion ? renderQuestion() : null}
        <div>
          {showQuestion && (
            <button
              onClick={checkAnswer}
              disabled={!allInputsFilled()}
              className="submit-button"
              aria-label="Submit answer"
            >
              Submit
            </button>
          )}
        </div>

        {feedback[question.id] && (
          <p
            className={`feedback-message ${
              feedback[question.id].startsWith("✅") ? "correct" : "incorrect"
            }`}
          >
            {feedback[question.id]}
          </p>
        )}

        {showQuestion && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))
              }
              disabled={currentQuestionIndex === 0}
              className="nav-button"
              aria-label="Previous question"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentQuestionIndex((prev) =>
                  Math.min(prev + 1, questions.length - 1)
                )
              }
              disabled={currentQuestionIndex === questions.length - 1}
              className="nav-button"
              aria-label="Next question"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;