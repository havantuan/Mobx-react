import React from 'react';
import DocumentForm from './DocumentForm';
import documentStore from "../../../../stores/document/documentStore";

export default function UpdateDocument() {
  documentStore.onChangeUpdateMode(true);
  return <DocumentForm/>;
}
