import React from 'react';
import "./QuizSucess.css"
import cross from "../../assets/cross.png"
import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.min.css';


function QuizSuccessModal({ quizLink, onClose }) {
    const handleCopyLink = () => {
        navigator.clipboard.writeText(quizLink);
        toast.success('Quiz link copied to clipboard!');
    };

    return (
        <div className="modal-open">
            <div className="overlay" />
            <div className="modal-content success-modal-content">
                <button className="close-btn" onClick={onClose}><img src={cross} alt="close button" /></button>
                <div className='sucess-msg'>
                <h2>Congrats your Quiz is Published! </h2>

                </div>
                <div className="quiz-link-container">
                    <input
                        type="text"
                        value={quizLink}
                        readOnly
                        className="quiz-link-input"
                    />
                    <button className="share-btn" onClick={handleCopyLink}>
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizSuccessModal;
