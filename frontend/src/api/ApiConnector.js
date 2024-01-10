export function ApiConnector() {
  // const API_SERVER = "https://redcapp.islab.di.unimi.it";
  const API_SERVER = "";

  async function getTale(storyUrl) {
    const data = await fetch(`${API_SERVER}/story/${storyUrl}`);
    const parsedData = await data.json();
    return parsedData;
  }

  async function submitForm({
    language,
    age,
    gender,
    education,
    isGroup,
    u_gid,
  }) {
    const data = await fetch(`${API_SERVER}/persist/context`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        r_code: "",
        language,
        age,
        gender,
        edu_level: education,
        nationality: "",
        user_group_id: u_gid ? u_gid : "",
        host_organization: "",
        user_organization: "",
        is_group: isGroup,
      }),
    });

    const parsedData = await data.json();
    return parsedData;
  }

  async function getDebrief(sessionId) {
    const data = await fetch(`${API_SERVER}/debrief/${sessionId}`);
    const parsedData = await data.text();
    return parsedData;
  }

  async function sendEvaluation({ score, sessionId }) {
    const data = await fetch(`${API_SERVER}/persist/evaluation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        score,
        session_id: sessionId,
      }),
    });
  }

  async function sendAnswer({
    sessionId,
    frameId,
    reponseType,
    questionText,
    responseText,
    responseId,
    reponseValue,
  }) {
    const data = await fetch(`${API_SERVER}/persist//answer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        r_code: "",
        frame_id: frameId,
        story_id: "1",
        session_id: sessionId,
        question_text: questionText,
        response_text: responseText,
        response_id: responseId,
        response_value: reponseValue,
        response_type: reponseType,
      }),
    });
  }

  return {
    getTale,
    submitForm,
    sendEvaluation,
    sendAnswer,
    getDebrief,
  };
}
