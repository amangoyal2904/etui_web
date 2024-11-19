import React, { Fragment } from 'react';
import parse from 'html-react-parser';

export default function RenderText({ text = "" }) {
  let textStr = text?.toString();

  function renderText(text) {
    // replace html entities
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    return text;
  }

  // remove any empty <a> tags from textStr
  textStr = textStr?.replace(/<a[^>]*><\/a>/g, '');

  // if text contains html tags, render them as react elements else return text as it is
  return textStr?.includes('<') ? <Fragment>{parse(renderText(textStr))}</Fragment> : <Fragment>{renderText(textStr)}</Fragment>;
}