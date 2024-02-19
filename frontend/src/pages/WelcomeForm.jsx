import React, { useState } from "react";
import "./WelcomeForm.css";
import { Select, Option, Button, Checkbox } from "@mui/joy/";
import { ApiConnector } from "../api/ApiConnector";
import AuthGuard from "../components/AuthGuard";
import { useRecoilState } from "recoil";
import { sessionDataAtom } from "../store/atoms/authAtom";
import { useNavigate, useLocation } from "react-router-dom";

const countryOptions = [
  { value: "el", label: "🇬🇷 Ελληνικά" },
  { value: "en", label: "🇬🇧 English" },
  { value: "it", label: "🇮🇹 Italiano" },
  { value: "bg", label: "🇧🇬 Български" },
];

const ageOptions = [
  { value: "4-5", label: "4-5" },
  { value: "6-10", label: "6-10" },
  { value: "11-13", label: "11-13" },
  { value: "14-20", label: "14-20" },
  { value: "21-30", label: "21-30" },
  { value: ">30", label: ">30" },
  { value: "0-100+", label: "0-100+" },
];

const LT = {
  en: {
    welcomeLabel:
      "Please fill the form on the right to start reading the story",
    languageLabel: "Language:",
    ageLabel: "Age:",
    genderLabel: "Gender:",
    groupLabel: "I'm a group",
    genderOptions: [
      { value: "Male", label: "Male" },
      { value: "Female", label: "Female" },
      { value: "Prefer not to say", label: "Prefer not to say" },
    ],
    educationLabel: "Education:",
    educationOptions: [
      { value: "Preschool", label: "Preschool" },
      { value: "Primary school", label: "Primary school" },
      { value: "Mid school", label: "Mid school" },
      { value: "High school", label: "High school" },
      { value: "Bachelor degree", label: "Bachelor degree" },
      { value: "Master degree", label: "Master degree" },
      { value: "Ph.D.", label: "Ph.D." },
    ],
    disclaimer: (
      <span>
        by checking the box I accept the{" "}
        <a href={`/disclaimer/en.html`} target="_blank">
          terms and conditions of use
        </a>{" "}
        of the service
      </span>
    ),
    startButtonLabel: "Start",
  },
  el: {
    welcomeLabel:
      "Συμπληρώστε τη φόρμα στα δεξιά για να ξεκινήσετε την ανάγνωση της ιστορίας",
    languageLabel: "Γλώσσα:",
    ageLabel: "Ηλικία:",
    genderLabel: "Φύλο:",
    groupLabel: "Είμαι μια ομάδα",
    genderOptions: [
      { value: "Male", label: "Άντρας" },
      { value: "Boy", label: "Αγόρι" },
      { value: "Female", label: "Γυναίκα" },
      { value: "Girl", label: "Κορίτσι" },
      { value: "Prefer not to say", label: "Προτιμώ να μην πω" },
    ],
    educationLabel: "Εκπαίδευση:",
    educationOptions: [
      { value: "Preschool", label: "Προδημοτική" },
      { value: "Primary school", label: "Δημοτικό" },
      { value: "Mid school", label: "Γυμνάσιο" },
      { value: "High school", label: "Λύκειο" },
      { value: "Bachelor degree", label: "Πτυχίο" },
      { value: "Master degree", label: "Μεταπτυχιακό" },
      { value: "Ph.D.", label: "Διδακτορικό" },
    ],
    disclaimer: (
      <span>
        by checking the box I accept the{" "}
        <a href={`/disclaimer/el.html`} target="_blank">
          terms and conditions of use
        </a>{" "}
        of the service
      </span>
    ),
    startButtonLabel: "Αρχή",
  },
  it: {
    welcomeLabel: "Compila il modulo a destra per iniziare a leggere la storia",
    languageLabel: "Lingua:",
    ageLabel: "Età:",
    genderLabel: "Genere:",
    groupLabel: "Sono un gruppo",
    genderOptions: [
      { value: "Male", label: "Maschio" },
      { value: "Female", label: "Femmina" },
      { value: "Prefer not to say", label: "Preferisco non dirlo" },
    ],
    educationLabel: "Livello di istruzione:",
    educationOptions: [
      { value: "Preschool", label: "Scuola dell'infanzia" },
      { value: "Primary school", label: "Scuola elementare" },
      { value: "Mid school", label: "Scuola media" },
      { value: "High school", label: "Scuola superiore" },
      { value: "Bachelor degree", label: "Laurea triennale" },
      { value: "Master degree", label: "Laurea magistrale" },
      { value: "Ph.D.", label: "Dottorato di ricerca" },
    ],
    disclaimer: (
      <span>
        selezionando la casella accetto i{" "}
        <a href={`/disclaimer/it.html`} target="_blank">
          termini e le condizioni d’uso
        </a>{" "}
        del servizio
      </span>
    ),
    startButtonLabel: "Inizia",
  },
  bg: {
    welcomeLabel: "Моля, попълнете формуляра вдясно, за да започнете историята",
    languageLabel: "Език:",
    ageLabel: "Възраст:",
    genderLabel: "Пол:",
    groupLabel: "Група сме",
    genderOptions: [
      { value: "Male", label: "Мъжки" },
      { value: "Female", label: "Женски" },
      { value: "Prefer not to say", label: "Предпочитам да премълча" },
    ],
    educationLabel: "Образование:",
    educationOptions: [
      { value: "Preschool", label: "Предучилищно" },
      { value: "Primary school", label: "Начално образование" },
      { value: "Mid school", label: "Основно образование" },
      { value: "High school", label: "Средно образование" },
      { value: "Bachelor degree", label: "Бакалавърска степен" },
      { value: "Master degree", label: "Магистърска степен" },
      { value: "Ph.D.", label: "докторантура" },
    ],
    disclaimer: (
      <span>
        отбелязвайки тук аз приемам{" "}
        <a href={`/disclaimer/bg.html`} target="_blank">
          правилата за употреба
        </a>{" "}
        на тази услуга
      </span>
    ),
    startButtonLabel: "Начало",
  },
};

function useQuery() {
  const { search } = useLocation();

  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function WelcomeForm() {
  const navigate = useNavigate();
  let query = useQuery();

  const [language, setLanguage] = useState("it");
  const [age, setAge] = useState(ageOptions[0].value);
  const [gender, setGender] = useState(LT[language].genderOptions[0].value);
  const [education, setEducation] = useState(
    LT[language].educationOptions[0].value
  );
  const [isDisclaimerChecked, setIsDisclaimerChecked] = useState(false);
  const [isGroupChecked, setIsGroupChecked] = useState(false);

  const [, setSessionData] = useRecoilState(sessionDataAtom);

  const { submitForm } = ApiConnector();

  async function onSubmit() {
    const data = await submitForm({
      language,
      age,
      gender,
      education,
      isGroup: isGroupChecked,
      u_gid: query.get("vgroupid") ? query.get("vgroupid") : query.get("u_gid"),
    });
    if (data) {
      setSessionData({
        id: data.session_id,
        storyFile: data.story_file,
        language: data.language,
      });
      navigate("/tale");
    }
  }

  return (
    <AuthGuard>
      <div className="WelcomeContainer">
        <div className="ImageContainer">
          <span>{LT[language].welcomeLabel}</span>
        </div>
        <div className="WelcomeForm">
          <div className="LogoContainer">
            <a href="https://www.vast-project.eu/" target="_blank">
              <img src="/logo1.png" />
            </a>
            <a href="https://www.unimi.it/" target="_blank">
              <img src="/logo2.png" />
            </a>
            <a href="http://islab.di.unimi.it/" target="_blank">
              <img src="/logo3.png" />
            </a>
          </div>
          <div className="FormContainer">
            <label>{LT[language].languageLabel}</label>
            <Select
              value={language}
              onChange={(e, newValue) => setLanguage(newValue)}
              sx={{ width: "200px" }}
            >
              {countryOptions.map((language) => (
                <Option key={language.value} value={language.value}>
                  {language.label}
                </Option>
              ))}
            </Select>
            <div className="GroupContainer">
              <Checkbox
                checked={isGroupChecked}
                onChange={() => setIsGroupChecked(!isGroupChecked)}
              />
              <span>{LT[language].groupLabel}</span>
            </div>
            <label>{LT[language].ageLabel}</label>
            <Select
              value={age}
              onChange={(e, newValue) => setAge(newValue)}
              sx={{ width: "200px" }}
            >
              {ageOptions.map((age) => (
                <Option key={age.value} value={age.value}>
                  {age.label}
                </Option>
              ))}
            </Select>
            <label>{LT[language].genderLabel}</label>
            <Select
              value={gender}
              onChange={(e, newValue) => setGender(newValue)}
              sx={{ width: "200px" }}
            >
              {LT[language].genderOptions.map((gender) => (
                <Option key={gender.label} value={gender.value}>
                  {gender.label}
                </Option>
              ))}
            </Select>
            <label>{LT[language].educationLabel}</label>
            <Select
              value={education}
              onChange={(e, newValue) => setEducation(newValue)}
              sx={{ width: "200px" }}
            >
              {LT[language].educationOptions.map((edu) => (
                <Option key={edu.value} value={edu.value}>
                  {edu.label}
                </Option>
              ))}
            </Select>
            <div className="DisclaimerContainer">
              <Checkbox
                checked={isDisclaimerChecked}
                onChange={() => setIsDisclaimerChecked(!isDisclaimerChecked)}
              />
              {LT[language].disclaimer}
            </div>
            <Button
              sx={{ width: "200px", mt: 3 }}
              onClick={onSubmit}
              disabled={!isDisclaimerChecked}
            >
              {LT[language].startButtonLabel}
            </Button>
          </div>
          <div className="DisclaimerContainer">
            <img src="/disclaimer.jpeg" alt="disclaimer" />
            <small>
              This project has received funding from the European Union's
              Horizon 2020 research and innovation programme under grant
              agreement No 101004949.
            </small>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

export default WelcomeForm;
