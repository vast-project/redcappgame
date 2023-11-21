import Modal from "react-modal";
import ReactStars from "react-rating-stars-component";
import { useState, useEffect } from "react";
import { ApiConnector } from "../api/ApiConnector";

function EvaluationModal({ label, sessionId }) {
  const [modalOpen, setModalOpen] = useState(true);
  const [debrief, setDebrief] = useState(null);
  const { sendEvaluation, getDebrief } = ApiConnector();

  useEffect(() => {
    async function _getDebrief() {
      const _debrief = await getDebrief(sessionId);
      setDebrief(_debrief);
    }
    _getDebrief();
  }, [sessionId]);

  const ratingChanged = (newRating) => {
    setModalOpen(false);
    sendEvaluation({
      score: newRating,
      sessionId: sessionId,
    });
  };

  return (
    <div className="EvaluationModal">
      <Modal isOpen={modalOpen} ariaHideApp={false} className="Modal">
        <>
          {debrief && (
            <div
              className="Debrief"
              dangerouslySetInnerHTML={{ __html: debrief }}
            />
          )}
          <div className="Evaluation">
            {label}
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={60}
              activeColor="#ff351f"
            />
          </div>
        </>
      </Modal>
    </div>
  );
}

export default EvaluationModal;
