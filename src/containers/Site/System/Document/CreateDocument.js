import React from 'react';
import DocumentForm from './DocumentForm';
import documentStore from "../../../../stores/document/documentStore";

export default function CreateDocument() {
  documentStore.onChangeUpdateMode(false);
  return <DocumentForm/>;
}
