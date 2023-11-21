import "./Tale.css";
import Book from "react-pageflip";
import Modal from "react-modal";
import { useRecoilState } from "recoil";
import { Howl } from "howler";
import { ApiConnector } from "./api/ApiConnector";
import { useState, useEffect, useRef } from "react";
import PageCouple from "./components/PageCouple";
import { choiceModalOpenAtom } from "./store/atoms/modalsAtom";
import EvaluationModal from "./components/EvaluationModal";
import AuthGuard from "./components/AuthGuard";
import { sessionDataAtom } from "./store/atoms/authAtom";

function Tale() {
  const bookRef = useRef(null);

  const [sessionData] = useRecoilState(sessionDataAtom);

  const { getTale, sendAnswer } = ApiConnector();
  const [bookWidth, setBookWidth] = useState(null);
  const [bookHeight, setBookHeight] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [talePages, setTalePages] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const [blockFlip, setBlockFlip] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [isChoiceModalOpen, setIsChoiceModalOpen] =
    useRecoilState(choiceModalOpenAtom);
  const [currentPageData, setCurrentPageData] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isEndBranch, setIsEndBranch] = useState(false);

  function playAudio(audio) {
    if (currentAudio) currentAudio.stop();
    // TODO: to fix
    const sound = new Howl({
      src: Array.isArray(audio)
        ? [`/audio/${sessionData.language}/${audio[0]}`]
        : [`/audio/${sessionData.language}/${audio}`],
    });
    setCurrentAudio(sound);
    sound.play();
  }

  function submitAnswer(index) {
    let action;
    let reponseType;
    let questionText;
    let responseText;
    let reponseValue;
    if (currentPageData.choice) {
      action = () =>
        bookRef.current.pageFlip().turnToPage(currentPageData.nextSteps[index]);
      reponseType = "choice";
      questionText = currentPageData.choice.text;
      responseText = currentPageData.choice.options[index];
      reponseValue = currentPageData.values[index];
    } else {
      action = () => bookRef.current.pageFlip().flipNext("bottom");
      reponseType = "question";
      questionText = currentPageData.question.text;
      responseText = currentPageData.question.options[index];
      reponseValue = currentPageData.values[index];
    }
    setFeedback({
      ...currentPageData.feedback.list[index],
      action,
    });
    playAudio(currentPageData.feedback.list[index].audio);
    sendAnswer({
      frameId: currentPageData.id,
      sessionId: sessionData.id,
      reponseType,
      questionText,
      responseText,
      responseId: index,
      reponseValue,
    });
  }

  useEffect(() => {
    if (talePages) {
      const _currentPageData = talePages[currentPage / 2];
      if (_currentPageData.end && !_currentPageData.feedback)
        setIsEndBranch(true);
      if (_currentPageData.choice || _currentPageData.question)
        setBlockFlip(true);
      if (!_currentPageData.choice && !_currentPageData.question)
        setBlockFlip(false);
      if (_currentPageData.audio) {
        playAudio(_currentPageData.audio);
      }
      if (!_currentPageData.audio) currentAudio.stop();
      setCurrentPageData(_currentPageData);
    }
  }, [currentPage]);

  function calculateBookSize(invert) {
    const aspectRatio = 16 / 9;

    let innerHeight = window.innerHeight;
    let innerWidth = window.innerWidth;

    if (invert) {
      innerHeight = window.innerWidth;
      innerWidth = window.innerHeight;
    }

    let height = parseFloat((innerWidth / aspectRatio).toFixed(2));
    if (height > innerHeight) height = innerHeight;
    setBookHeight(height);
    setBookWidth(innerWidth / 2);
  }

  useEffect(() => {
    async function _getTale() {
      const tale = await getTale(sessionData.storyFile);
      setTalePages(tale);
      setCurrentPageData(tale[0]);
    }
    _getTale();

    let portrait = window.matchMedia("(orientation: portrait)");
    calculateBookSize(portrait.matches);
  }, []);

  return (
    <AuthGuard>
      <>
        <div className="OrientationWarning">
          <img src="/rotateIcon.jpeg" />
          <div>Please rotate your device</div>
          <div>Per favore ruota il tuo device</div>
          <div>Περιστρέψτε τη συσκευή σας</div>
        </div>
        <div
          className="TaleContainer"
          style={
            isFlipping ? { pointerEvents: "none" } : { pointerEvents: "all" }
          }
        >
          {talePages && bookHeight && bookWidth && (
            <Book
              usePortrait={false}
              startZIndex={1}
              ref={bookRef}
              style={
                blockFlip ? { pointerEvents: "none" } : { pointerEvents: "all" }
              }
              width={bookWidth}
              height={bookHeight}
              onFlip={(e) => {
                setCurrentPage(e.data);
              }}
              onChangeState={(e) => {
                if (e.data === "flipping") {
                  setIsFlipping(true);
                  setBlockFlip(true);
                }
                if (e.data === "read") setIsFlipping(false);
              }}
            >
              {talePages.map((talePage, i) => (
                <PageCouple key={i} data={talePage} />
              ))}
            </Book>
          )}
          {currentPageData &&
            (currentPageData.choice || currentPageData.question) && (
              <Modal
                isOpen={isChoiceModalOpen}
                ariaHideApp={false}
                className="Modal"
              >
                {!feedback && (
                  <>
                    <p>
                      {currentPageData.choice
                        ? currentPageData.choice.text
                        : currentPageData.question.text}
                    </p>
                    <div className="ButtonsContainer">
                      <button
                        onClick={() => {
                          submitAnswer(0);
                        }}
                      >
                        {currentPageData.choice
                          ? currentPageData.choice.options[0]
                          : currentPageData.question.options[0]}
                      </button>
                      <button
                        onClick={() => {
                          submitAnswer(1);
                        }}
                      >
                        {currentPageData.choice
                          ? currentPageData.choice.options[1]
                          : currentPageData.question.options[1]}
                      </button>
                    </div>
                  </>
                )}
                {feedback && (
                  <>
                    <p>{feedback.text}</p>
                    <div className="ButtonsContainer">
                      <button
                        onClick={() => {
                          if (currentPageData.end) {
                            setIsEndBranch(true);
                          }
                          setIsChoiceModalOpen(false);
                          if (!currentPageData.end) feedback.action();
                          setFeedback(null);
                        }}
                      >
                        {currentPageData.feedback.option}
                      </button>
                    </div>
                  </>
                )}
              </Modal>
            )}
          <div className="BlockFlipLeftOverlay"></div>
          {blockFlip && (
            <div
              className="ChoiceOverlay"
              onClick={() => {
                if (currentPageData.choice || currentPageData.question) {
                  const audio =
                    currentPageData?.choice?.audio ||
                    currentPageData?.question?.audio;
                  playAudio(audio);
                }
                setIsChoiceModalOpen(true);
              }}
            />
          )}
          {isEndBranch && (
            <div
              className="ChoiceOverlay"
              onClick={() => {
                if (currentPageData.end) {
                  bookRef.current
                    .pageFlip()
                    .turnToPage(currentPageData.endStep);
                  return;
                }
              }}
            />
          )}
          {currentPageData?.lastPage && currentPageData?.evaluation.show && (
            <EvaluationModal
              label={currentPageData?.evaluation.label}
              sessionId={sessionData.id}
            />
          )}
        </div>
      </>
    </AuthGuard>
  );
}

export default Tale;
