export const splitCodeIntoChunks = (code, settings) => {
  const lines = code.split('\n');
  
  // Constants for calculation
  const CANVAS_HEIGHT = 1080;
  // Inner padding of the code window (SnippetCard has padding: '40px')
  // Top + Bottom = 80px
  const WINDOW_INNER_PADDING_Y = 80; 
  // Small safety buffer to prevent single-pixel overflows
  const BUFFER = 10;
  
  // Dynamic metrics based on settings
  const containerPaddingY = settings.padding * 2; // Top + Bottom
  
  // Header height logic
  const hasHeader = settings.showWindowControls || settings.showFilename;
  const headerHeight = hasHeader ? settings.windowHeadingHeight : 0; 
  
  // Footer logic
  const hasAuthor = settings.showAuthor;
  const footerHeightVal = settings.windowFooterHeight;

  const lineHeightPx = settings.fontSize * settings.lineHeight;
  
  // Calculate max lines assuming single page (unless Author forces footer)
  const availableHeightSinglePage = CANVAS_HEIGHT - containerPaddingY - headerHeight - (hasAuthor ? footerHeightVal : 0) - WINDOW_INNER_PADDING_Y - BUFFER;
  const maxLinesSinglePage = Math.floor(availableHeightSinglePage / lineHeightPx);
  
  // If content fits in single page, return it
  if (lines.length <= maxLinesSinglePage) {
    return [{
      lines,
      startLineNumber: 1,
      isLastPage: true
    }];
  }

  // Multiple pages needed → footer is now mandatory
  const availableHeightMultiPage = CANVAS_HEIGHT - containerPaddingY - headerHeight - footerHeightVal - WINDOW_INNER_PADDING_Y - BUFFER;
  
  // Edge case: not enough space for even one line
  if (availableHeightMultiPage < lineHeightPx) {
    return [{
      lines,
      startLineNumber: 1,
      isLastPage: true
    }];
  }

  const maxLinesPerPage = Math.floor(availableHeightMultiPage / lineHeightPx);
  const safeMaxLines = Math.max(1, maxLinesPerPage);
  
  const chunks = [];
  let currentLine = 0;
  
  while (currentLine < lines.length) {
    const chunkLines = lines.slice(currentLine, currentLine + safeMaxLines);
    
    chunks.push({
      lines: chunkLines,
      startLineNumber: currentLine + 1,
      isLastPage: (currentLine + safeMaxLines) >= lines.length
    });
    
    currentLine += safeMaxLines;
  }
  
  return chunks;
};