import React from 'react';

export const simpleHighlight = (code, theme) => {
  const regex = /(".*?"|'.*?'|`.*?`)|(\/\/.*|\/\*[\s\S]*?\*\/)|(\b(const|let|var|function|return|if|else|for|while|import|export|from|class|extends|=>|async|await)\b)|(\b\d+\b)|(\b[A-Z][a-zA-Z0-9]*\b)|([{}()[\],.])|(\w+)/g;

  let lastIndex = 0;
  let match;

  const elements = [];
  let keyCounter = 0;

  while ((match = regex.exec(code)) !== null) {
    // Add plain text before match
    if (match.index > lastIndex) {
      elements.push(
        React.createElement('span', {
          key: keyCounter++,
          style: { color: theme.colors.text }
        }, code.slice(lastIndex, match.index))
      );
    }

    const [fullMatch, str, comment, keyword, _k, number, className, punctuation, identifier] = match;
    let color = theme.colors.text;

    if (str) color = theme.colors.string;
    else if (comment) color = theme.colors.comment;
    else if (keyword) color = theme.colors.keyword;
    else if (number) color = theme.colors.number;
    else if (className) color = theme.colors.class;
    else if (punctuation) color = theme.colors.operator; // using operator color for punctuation
    else if (identifier) color = theme.colors.text; // Basic identifiers

    elements.push(
      React.createElement('span', {
        key: keyCounter++,
        style: { color }
      }, fullMatch)
    );

    lastIndex = regex.lastIndex;
  }

  // Add remaining text after last match
  if (lastIndex < code.length) {
    elements.push(
      React.createElement('span', {
        key: keyCounter++,
        style: { color: theme.colors.text }
      }, code.slice(lastIndex))
    );
  }

  return elements;
};