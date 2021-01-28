import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import Button from '../src/components/Botton';
import AlternativesForm from '../src/components/AlternativesForm';

// const BackgroundImage = styled.div`
//   background-image: url(${db.bg});
//   flex: 1;
//   background-size: cover;
//   background-position: center;
// `;

function LoadingWidget() {
  return (
    <Widget>
      <Widget.Header>
        Carregando...
      </Widget.Header>

      <Widget.Content>
        [Desafio do Loading]
      </Widget.Content>
    </Widget>
  );
}

function ResultWidget({ results, name }) {
  return (
    <Widget>
      <Widget.Header>
        Resultado
      </Widget.Header>

      <Widget.Content>
        <p>
          {`Mandou bem, ${name} `}
          {' '}
          Você acertou
          {' '}
          {/* {results.reduce((somatoriaAtual, resultAtual) => {
            const isAcerto = resultAtual === true;
            if (isAcerto) return somatoriaAtual + 1;
            return somatoriaAtual;
          }, 0)} */}
          {results.filter((x) => x).length}
          {' '}
          preguntas

        </p>
        <ul>
          {results.map((result, index) => (
            <li key={`result__${result}`}>
              {`#${index + 1} Resultado: `}
              { result === true ? 'Acertou' : 'Errou'}
            </li>
          ))}
        </ul>
      </Widget.Content>
    </Widget>
  );
}

function QuestionWidget({
  question, totalQuestions, questionIndex, onSubmit, addResult,
}) {
  const [selectedAlternative, setSelectedAlternative] = useState(undefined);
  const [isQuestionSubmited, setIsQuestionSubmited] = useState(false);
  const questionID = `question__${questionIndex}`;
  const isCorrect = selectedAlternative === question.answer;
  const hasAlternativeSelected = selectedAlternative !== undefined;

  return (
    <Widget>
      <Widget.Header>
        <h3>
          {`Pergunta ${questionIndex + 1} de ${totalQuestions} ` }
        </h3>
      </Widget.Header>
      <img
        alt="Descricao"
        style={{
          width: '100%',
          height: '150px',
          objectFit: 'cover',
        }}
        src={question.image}
      />
      <Widget.Content>
        <h2>{question.title}</h2>
        <p>{question.description}</p>
        <AlternativesForm onSubmit={(e) => {
          e.preventDefault();
          setIsQuestionSubmited(true);
          setTimeout(() => {
            addResult(isCorrect);
            onSubmit();
            setIsQuestionSubmited(false);
            setSelectedAlternative(undefined);
          }, 3 * 1000);
        }}
        >
          {question.alternatives.map((alternative, alternativeIndex) => {
            const alternativeId = `alternative__${alternativeIndex}`;
            const AlternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR';
            const isSelected = selectedAlternative === alternativeIndex;
            return (
              <Widget.Topic
                key={alternativeId}
                as="label"
                htmlFor={alternativeId}
                data-selected={isSelected}
                data-status={isQuestionSubmited && AlternativeStatus}

              >
                <input
                  style={{ display: 'none' }}
                  onChange={() => setSelectedAlternative(alternativeIndex)}
                  id={alternativeId}
                  name={questionID}
                  type="radio"
                />
                {alternative}
              </Widget.Topic>
            );
          })}

          <Button type="submit" disabled={!hasAlternativeSelected}>
            Confirmar
          </Button>
          {isQuestionSubmited && isCorrect && <p>Você Acertou!!</p>}
          {isQuestionSubmited && !isCorrect && <p>Você Errou!!</p>}
        </AlternativesForm>

      </Widget.Content>
    </Widget>
  );
}
const screenStates = {
  QUIZ: 'QUIZ',
  LOADING: 'LOADING',
  RESULT: 'RESULT',
};

export default function Quiz() {
  const [screenState, setScreenState] = useState(screenStates.LOADING);
  const [results, setResults] = useState([]);
  const totalQuestions = db.questions.length;
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const questionIndex = currentQuestion;
  const question = db.questions[questionIndex];
  const router = useRouter();
  const { name } = router.query;

  function addResult(result) {
    setResults([
      ...results,
      result,
    ]);
  }
  useEffect(() => {
    setTimeout(() => {
      setScreenState(screenStates.QUIZ);
    }, 1 * 1000);
  }, []);

  function handleSubmitQuiz() {
    const nextQuestion = questionIndex + 1;
    if (nextQuestion < totalQuestions) {
      setCurrentQuestion(nextQuestion);
    } else {
      setScreenState(screenStates.RESULT);
    }
  }
  return (
    <QuizBackground backgroundImage={db.bg}>
      <QuizContainer>
        <QuizLogo />
        {screenState === screenStates.LOADING && (
        <LoadingWidget />
        )}

        {screenState === screenStates.QUIZ && (
        <QuestionWidget
          question={question}
          totalQuestions={totalQuestions}
          questionIndex={questionIndex}
          onSubmit={handleSubmitQuiz}
          addResult={addResult}
        />
        )}

        {screenState === screenStates.RESULT && (
        <ResultWidget results={results} name={name} />
        )}

        <Footer />
      </QuizContainer>
      <GitHubCorner projectUrl="https://github.com/glaucoserrano" />
    </QuizBackground>
  );
}
