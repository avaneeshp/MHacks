import React, { useState } from 'react';
import axios from 'axios';
import './feature.css'; // Update with correct path
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';
import masc from '../assets/logoDump/mascotNoBG.png'
import fakeQuiz from '../assets/quizimg.jpg'

function Testimonial({ quote, author, authorImageSrc }) {
  return (
    <div className="testimonial">
      <p className="testimonial-quote">"{quote}"</p>
      <div className="testimonial-author">
        <img src={authorImageSrc} alt={author} className="testimonial-image" />
        <footer className="testimonial-name">- {author}</footer>
      </div>
    </div>
  );
}

function Statistic({ value, decimals, suffix, label }) {
  const handleMouseOver = (e) => {
    e.target.style.transform = 'scale(1.1)';
  };

  const handleMouseOut = (e) => {
    e.target.style.transform = 'scale(1)';
  };

  return (
    <div className="statistic" onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
      <div className="statistic-number">
        <CountUp end={value} duration={2.5} decimals={decimals} preserveValue suffix={suffix} />
      </div>
      <p className="statistic-label">{label}</p>
    </div>
  );
}

function Figure() {
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null)
  const [topicName, setTopicName] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizPopulated, setQuizPopulated] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [msg, setMsg] = useState("")

  const handleFileSelect = (event) => {
    setFiles([...files, ...event.target.files]);
    setFile(event.target.files[0])
  };

  const handleMsg = (event) => {
    event.preventDefault();
    console.log(1);
    // setFile(event.target.files);
    console.log(2);
    const formData = new FormData();
    console.log(3);
    formData.append("file", file); // Assuming "selectedFile" is the file object
    formData.append("topic", topicName)
    // Add other form data as needed
    console.log(4);
    fetch("/process_summary", {
      method: "POST",
      body: formData, 
    })
    .then(response => response.json())
    .then(data => {
      // Handle success
      setMsg(data.Summary);
      console.log(data.Summary);
      // setformattedMsg(JSON.parse(data.Summary))
    })
    .catch(error => {
      // Handle error
    // API call logic here
    setQuizStarted(true);
    setTopicName('');
  });


}

  const handleQuizStart = async () => {
    // API call to start quiz
    setQuizPopulated(true);
  };

  const handleAnswerSelect = (questionIndex, answerIndex) => {
    // Logic to check answers and update score
    setCurrentQuestion(currentQuestion + 1);
  };

  const formatKey = (key) => {
    return key.replace(/ _/g, ' ')
  };
    
  return (

    <div className="figure-component">
      <div className="content-box">
      <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', align: 'center'}}>Send us your study material,{" "}<span className='suga'>we'll help from here...</span></h1>
        <div className="api-output">
        {Object.entries(msg).map(([key, value], index) => (
            <div key={index} className='api-output'>
              <h2><b>{formatKey(key)}</b></h2>
              <h3>{value}</h3>
            </div>
          ))}
            <img src={masc} alt="Mascot" className="mascot" />
        </div>

        <div className="input-section">
          <form onSubmit={handleMsg}>
            <label className="file-input-container">
                Choose Files
                <input id="file-upload" type="file" multiple onChange={handleFileSelect} />
            </label>
            
            <div className="file-display-bubble">
                {files.length === 0 ? 'No files selected' :
                files.length === 1 ? files[0].name :
                `${files.length} files selected`}
            </div>
            
            <input type="text" value={topicName} onChange={(e) => setTopicName(e.target.value)} placeholder="Topic Name" />
            <button className="file-input-container" type="submit" >Generate</button>
          </form>
        </div>
          

        {/* Quiz Creation */}
        {quizStarted && (
        <div className={`quiz-section-visible ${quizStarted ? 'quiz-section-visible' : ''}`}>
            <h2 style={{ color: '#1a8cd8', fontSize: '1.3rem', fontWeight: 'bold', paddingBottom: '1px', paddingLeft: '75px'}}>
            Ready to <span className='suga2'>practice</span>? Let's create a quiz!
            </h2>
            <div className="input-section">
                <label htmlFor="numQuestions" className=''>How many questions?</label>
                <input type="number" id="numQuestions" value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)} placeholder="0" />
                <button className="file-input-container" onClick={handleQuizStart}>Generate</button>
            </div>
        </div>)}


        {/* Actual Quiz Output */}
        {quizPopulated && (
        <div className="output-box">
            {/* Score Container */}
            <div className="score-container">
                <span className="Correct">Score: {currentScore}</span>
                <span className="Correct">Question {currentQuestion}/{numQuestions}</span>
            </div>
            
            {/* Questions */}
            <div className='flex align-middle'>
            <img src={fakeQuiz} alt="Placeholder image for a quiz"/>
            </div>
        </div> )}
    
      </div>
    </div>
  );
}

export default Figure;