import React from 'react';
import QuizForm from './QuizForm';
import quizStore from "../../../../stores/quiz/quizStore";

export default function UpdateQuiz() {
  quizStore.onChangeUpdateMode(true);
  return (
    <QuizForm/>
  )
}
