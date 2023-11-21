import img0 from "./images/0.png";
import img00 from "./images/00.png";
import img1 from "./images/1.png";
import img2 from "./images/2.png";
import img3 from "./images/3.png";
import img4 from "./images/4.png";

export const mockTale = [
  {
    id: 0,
    pages: [
      {
        background: img0,
        text: null,
        objects: null,
      },
      {
        background: img00,
        text: null,
        objects: null,
      },
    ],
    audio: "/",
    choice: null,
    question: null,
    nextSteps: [2, 3],
    prevStep: null,
  },
  {
    id: 1,
    pages: [
      {
        background: img1,
        text: {
          content:
            "Μια φορά κι έναν καιρό ήταν ένα κοριτσάκι που το αγαπούσαν όλοι. Πιο πολύ απ’ όλους την αγαπούσε η γιαγιά της, αλλά ήταν φτωχή και το μόνο που μπόρεσε να της δώσει ήταν ένα μικρό κόκκινο σκουφάκι από βελούδο. Η μικρή το φορούσε πάντα και της ταίριαζε πολύ, έτσι όλοι τη φώναζαν “η",
          css: "",
        },
        objects: [
          {
            image: "/",
            css: "",
          },
        ],
      },
      {
        background: img2,
        text: null,
        objects: [
          {
            image: "/",
            css: "",
          },
        ],
      },
    ],
    audio: "/",
    choice: {
      image: "/",
      text: "Δεν δίνουμε προσωπικές πληροφορίες όταν δεν γνωρίζουμε το άτομο και τις προθέσεις του.",
      audio: "/",
      options: ["Ναί", "όχι"],
    },
    question: {
      image: "/",
      text: "Δεν δίνουμε προσωπικές πληροφορίες όταν δεν γνωρίζουμε το άτομο και τις προθέσεις του.",
      audio: "/",
      options: ["Ναί", "όχι"],
    },
    nextSteps: [4, 4],
    prevStep: null,
  },
  {
    id: 2,
    pages: [
      {
        background: img3,
        text: null,
        objects: [
          {
            image: "/",
            css: "",
          },
        ],
      },
      {
        background: img4,
        text: {
          content:
            "Μια φορά κι έναν καιρό ήταν ένα κοριτσάκι που το αγαπούσαν όλοι. Πιο πολύ απ’ όλους την αγαπούσε η γιαγιά της, αλλά ήταν φτωχή και το μόνο που μπόρεσε να της δώσει ήταν ένα μικρό κόκκινο σκουφάκι από βελούδο. Η μικρή το φορούσε πάντα και της ταίριαζε πολύ, έτσι όλοι τη φώναζαν “η",
          css: "",
        },
        objects: [
          {
            image: "/",
            css: "",
          },
        ],
      },
    ],
    audio: "/",
    choice: {
      image: "/",
      text: "Make a choice",
      audio: "/",
      options: ["option1", "option2"],
    },
    question: {
      image: "/",
      text: "",
      audio: "/",
      options: ["option1", "option2"],
    },
    nextSteps: [2, 3],
    prevStep: null,
  },
];
