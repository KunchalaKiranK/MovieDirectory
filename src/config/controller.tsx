import {TYPE} from 'safeguard-corescript-npm';
import * as React from 'react';
import {
  DateField,
  DateTimeField,
  MultiLineTextField,
  MultiSelectField,
  NumericField,
  QuestionHOC,
  SingleSelectField,
  TextField,
} from '../component';

// function for returning curresponding components based on question Type
const getComponent = (question: TYPE.QuestionProps) => {
  let {Type} = question;
  switch (Type) {
    case 'TextField':
      return <TextField {...question} />;
    case 'Numeric' || 'Currency':
      return <NumericField {...question} />;
    case 'MultiLineText':
      return <MultiLineTextField {...question} />;
    case 'SingleSelect':
      return <SingleSelectField {...question} />;
    case 'Date':
      return <DateField {...question} />;
    case 'DateTime':
      return <DateTimeField {...question} />;
    case 'MultiSelect':
      return <MultiSelectField {...question} />;
    case 'Phone':
      return <NumericField {...question} />;
    default:
      return null;
  }
};

// return component based on its Type
const renderQuestions = (item: TYPE.QuestionProps) => {
  let {Visible, ActivatedBy, Hidden} = item;

  // conditions for not including the question based on Visible an Hidden
  if ((Visible === 'N' && !ActivatedBy) || Hidden === 'Y') return null;

  // handle quetion if it have key ActivatedBy
  if (ActivatedBy) return <QuestionHOC key={item.Name} {...item} />;

  // else return curresponding components
  return getComponent(item);
};

export {renderQuestions, getComponent};
