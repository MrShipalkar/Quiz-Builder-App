import React from 'react';
import "./QuizSucess.css"
import cross from "../../assets/cross.png"
import { toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function QuizSuccessModal({ quizLink, onClose }) {
    const handleCopyLink = () => {
        navigator.clipboard.writeText(quizLink);
        toast.success('Quiz link copied to clipboard!');
    };

    return (
        <div className="sucess-modal-open">
            <div className="sucess-overlay" />
            <div className="sucess-modal-content">
                <button className="sucess-close-btn" onClick={onClose}><img src={cross} alt="close button" /></button>
                <div className='sucess-sucess-msg'>
                    <h2>Congrats your Quiz is Published! </h2>
                </div>
                <div className="sucess-quiz-link-container">
                    <input
                        type="text"
                        value={quizLink}
                        readOnly
                        className="sucess-quiz-link-input"
                    />
                    <button className="sucess-share-btn" onClick={handleCopyLink}>
                        Share
                    </button>
                </div>
            </div>
        </div>
    );
}

export default QuizSuccessModal;
