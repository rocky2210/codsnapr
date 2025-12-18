// utils/highlight.js

import React from 'react';
import { LANGUAGE_KEYWORDS } from '../constants.js';

export const simpleHighlight = (code, theme, language = 'javascript') => {
  const c = theme.colors;
  let key = 0;


  // comments and docstrings
  let commentRegex;
  if (language === 'python') {
    // Python: # and triple-quoted strings (docstrings)
    commentRegex = /(("""[\s\S]*?""")|('''[\s\S]*?''')|(#.*?$))/gm;
  } else if (language === 'bash') {
    // Bash: only # comments
    commentRegex = /(#.*?$)/gm;
  } else {
    // All others: // and /* */
    commentRegex = /(\/\*[\s\S]*?\*\/|\/\/.*?$)/gm;
  }

  const comments = [];
  const protectedCode = code.replace(commentRegex, (match) => {
    const id = comments.length;
    comments.push(match);
    return `___COMMENT_${id}___`;
  });

  //keywords
  const keywordList = (LANGUAGE_KEYWORDS[language] || LANGUAGE_KEYWORDS.javascript)
    .split('|')
    .map(k => k.trim())
    .filter(Boolean);

  // manual highlighting loop
  const parts = [];
  let i = 0;

  while (i < protectedCode.length) {
    const rest = protectedCode.slice(i);

    // 1. Restore protected comment first
    const commentMatch = rest.match(/^___COMMENT_(\d+)___/);
    if (commentMatch) {
      const id = Number(commentMatch[1]);
      parts.push(
        <span key={key++} style={{ color: c.comment }}>
          {comments[id]}
        </span>
      );
      i += commentMatch[0].length;
      continue;
    }

    // 2. Strings (highest priority)
    const stringMatch = rest.match(/^("([^"\\]|\\.)*"|'([^'\\]|\\.)*'|`([^`\\]|\\.)*`)/);
    if (stringMatch) {
      parts.push(
        <span key={key++} style={{ color: c.string }}>
          {stringMatch[0]}
        </span>
      );
      i += stringMatch[0].length;
      continue;
    }

    // 3. Keywords
    let matchedKeyword = false;
    for (const kw of keywordList) {
      if (
        rest.startsWith(kw) &&
        (rest[kw.length] === undefined || !/[\w]/.test(rest[kw.length]))
      ) {
        parts.push(
          <span key={key++} style={{ color: c.keyword }}>
            {kw}
          </span>
        );
        i += kw.length;
        matchedKeyword = true;
        break;
      }
    }
    if (matchedKeyword) continue;

    // 4. Function definitions — language-specific
    let funcDefHandled = false;

    if (['javascript', 'dart'].includes(language)) {
      const jsMatch = rest.match(/^(function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (jsMatch) {
        parts.push(<span key={key++} style={{ color: c.keyword }}>function</span>);
        parts.push(<span key={key++} style={{ color: c.function }}>{jsMatch[2]}</span>);
        i += jsMatch[0].length;
        funcDefHandled = true;
      }
    }

    if (language === 'python') {
      const pyMatch = rest.match(/^(def)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (pyMatch) {
        parts.push(<span key={key++} style={{ color: c.keyword }}>def</span>);
        parts.push(<span key={key++} style={{ color: c.function }}>{pyMatch[2]}</span>);
        i += pyMatch[0].length;
        funcDefHandled = true;
      }
    }

    if (['c', 'cpp', 'java'].includes(language)) {
      // Match: [return_type] functionName(
      const cMatch = rest.match(/^([a-zA-Z_][a-zA-Z0-9_*& \t]+)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
      if (cMatch) {
        const full = cMatch[0];
        const name = cMatch[2];
        const nameStart = full.indexOf(name);
        parts.push(<span key={key++} style={{ color: c.text }}>{full.slice(0, nameStart)}</span>);
        parts.push(<span key={key++} style={{ color: c.function }}>{name}</span>);
        parts.push(<span key={key++} style={{ color: c.text }}>{full.slice(nameStart + name.length)}</span>);
        i += full.length;
        funcDefHandled = true;
      }
    }

    if (language === 'go') {
      const goMatch = rest.match(/^(func)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (goMatch) {
        parts.push(<span key={key++} style={{ color: c.keyword }}>func</span>);
        parts.push(<span key={key++} style={{ color: c.function }}>{goMatch[2]}</span>);
        i += goMatch[0].length;
        funcDefHandled = true;
      }
    }

    if (language === 'bash') {
      const bashMatch = rest.match(/^(function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
      if (bashMatch) {
        parts.push(<span key={key++} style={{ color: c.keyword }}>function</span>);
        parts.push(<span key={key++} style={{ color: c.function }}>{bashMatch[2]}</span>);
        i += bashMatch[0].length;
        funcDefHandled = true;
      }
    }

    if (funcDefHandled) continue;

    // 5. Function calls: identifier(
    const callMatch = rest.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    if (callMatch) {
      parts.push(
        <span key={key++} style={{ color: c.function }}>
          {callMatch[1]}
        </span>
      );
      i += callMatch[1].length;
      continue;
    }

    // 6. Numbers
    const numMatch = rest.match(/^(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/);
    if (numMatch) {
      parts.push(
        <span key={key++} style={{ color: c.number }}>
          {numMatch[0]}
        </span>
      );
      i += numMatch[0].length;
      continue;
    }

    // 7. Class names (capitalized)
    const classMatch = rest.match(/^([A-Z][a-zA-Z0-9_]*)/);
    if (classMatch) {
      parts.push(
        <span key={key++} style={{ color: c.class }}>
          {classMatch[0]}
        </span>
      );
      i += classMatch[0].length;
      continue;
    }

    // 8. Operators & punctuation
    const opMatch = rest.match(/^([{}()\[\].,;:+\-*/%=&|!<>^~?:]+)/);
    if (opMatch) {
      parts.push(
        <span key={key++} style={{ color: c.operator }}>
          {opMatch[0]}
        </span>
      );
      i += opMatch[0].length;
      continue;
    }

    // 9. Default: plain text
    parts.push(
      <span key={key++} style={{ color: c.text }}>
        {rest[0]}
      </span>
    );
    i += 1;
  }

  return parts;
};