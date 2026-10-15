// Quick static render of the blob PapaMascot to SVG for visual review.
// Not part of the app — a dev preview only.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Minimal standalone reproduction of the blob body (no framer-motion).
function Blob({ bodyColor = "#75c32c", mood = "idle" }) {
  const moods = {
    idle: { eyeCurve: 0, eyeOpen: 1, mouth: "M 43 60 Q 50 67 57 60", fill: "none" },
    happy: { eyeCurve: 2, eyeOpen: 1, mouth: "M 43 60 Q 50 67 57 60", fill: "none", blush: true },
    worried: { eyeCurve: -1, eyeOpen: 0.9, mouth: "M 44 64 Q 50 60 56 64", fill: "none" },
    celebrating: { eyeCurve: 3, eyeOpen: 1, mouth: "M 42 60 Q 50 70 58 60 Q 50 64 42 60 Z", fill: "#1a1a1a", blush: true },
    sleeping: { eyeCurve: 0, eyeOpen: 0.1, mouth: null },
  };
  const c = moods[mood] || moods.idle;
  return React.createElement(
    "svg",
    { viewBox: "0 0 100 100", width: 120, height: 120 },
    React.createElement("rect", { x: 20, y: 26, width: 60, height: 62, rx: 26, fill: bodyColor }),
    React.createElement("ellipse", { cx: 50, cy: 66, rx: 18, ry: 15, fill: "#fff", opacity: 0.28 }),
    React.createElement("path", { d: "M 22 58 Q 14 62 15 70", stroke: bodyColor, strokeWidth: 6, strokeLinecap: "round", fill: "none" }),
    React.createElement("path", { d: "M 78 58 Q 88 54 86 44", stroke: bodyColor, strokeWidth: 6, strokeLinecap: "round", fill: "none" }),
    // eyes
    React.createElement("g", { transform: "translate(50,48)" },
      React.createElement("g", { transform: "translate(-14,0)" },
        React.createElement("ellipse", { rx: 10, ry: 10 * c.eyeOpen, fill: "#fff" }),
        React.createElement("circle", { r: 3.5, cy: c.eyeCurve, fill: "#1a1a1a" })),
      React.createElement("g", { transform: "translate(14,0)" },
        React.createElement("ellipse", { rx: 10, ry: 10 * c.eyeOpen, fill: "#fff" }),
        React.createElement("circle", { r: 3.5, cy: c.eyeCurve, fill: "#1a1a1a" }))),
    c.blush && React.createElement("ellipse", { cx: 32, cy: 56, rx: 4, ry: 2.5, fill: "#f472b6", opacity: 0.6 }),
    c.blush && React.createElement("ellipse", { cx: 68, cy: 56, rx: 4, ry: 2.5, fill: "#f472b6", opacity: 0.6 }),
    c.mouth && React.createElement("path", { d: c.mouth, stroke: "#1a1a1a", strokeWidth: 2, strokeLinecap: "round", fill: c.fill }),
  );
}

const colors = ["#75c32c", "#059669", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed", "#c026d3", "#db2777", "#ea580c", "#dc2626"];
const mood = process.argv[2] || "idle";
const out = React.createElement(
  "svg",
  { viewBox: "0 0 1300 150", width: 1300, height: 150, xmlns: "http://www.w3.org/2000/svg" },
  colors.map((col, i) =>
    React.createElement("g", { key: i, transform: `translate(${10 + i * 128}, 10)` },
      React.createElement(Blob, { bodyColor: col, mood })))
);
console.log(renderToStaticMarkup(out));
