import React from 'react';
import QuizForm from './QuizForm';
import quizStore from "../../../../stores/quiz/quizStore";

export default function CreateQuiz() {
  quizStore.onChangeUpdateMode(false);
  return (
    <QuizForm mode="create"/>
  )
}
