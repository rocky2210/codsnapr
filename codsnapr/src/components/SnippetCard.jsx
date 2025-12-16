import React, { forwardRef } from 'react';
import { simpleHighlight } from '../utils/highlight.js';
import { ArrowRight, Instagram, Terminal } from 'lucide-react';

// Custom X (Twitter) Logo Component
const XLogo = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

const SnippetCard = forwardRef(({
  chunk,
  settings,
  theme,
  totalChunks,
  currentChunkIndex
}, ref) => {
  
  const hasHeader = settings.showWindowControls || settings.showFilename;
  const hasFooter = settings.showAuthor || totalChunks > 1;

  // Base styling for the container (1080x1080)
  const containerStyle = {
    width: '1080px',
    height: '1080px',
    background: settings.background,
    padding: `${settings.padding}px`,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
    position: 'relative',
    fontFamily: settings.fontFamily,
    overflow: 'hidden',
  };

  const windowStyle = {
    backgroundColor: theme.colors.background,
    borderRadius: settings.roundedCorners ? '20px' : '0px',
    boxShadow: settings.dropShadow ? '0 50px 100px -20px rgba(0,0,0,0.5)' : 'none',
    position: 'relative',
    flex: 1,
    overflow: 'hidden',
    border: '1px solid rgba(255,255,255,0.1)',
  };

  return (
    <div ref={ref} style={containerStyle} className="snippet-card-export">
      
      {/* Code Window */}
      <div style={windowStyle}>
        
        {/* Header (Window Controls + Filename) */}
        {hasHeader && (
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${settings.windowHeadingHeight}px`, 
            padding: '0 32px', 
            display: 'flex', 
            alignItems: 'center', 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            zIndex: 10,
            backgroundColor: theme.colors.background
          }}>
            {settings.showWindowControls && (
              <div style={{ display: 'flex', gap: '12px', marginRight: '24px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FF5F56' }} />
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#FFBD2E' }} />
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#27C93F' }} />
              </div>
            )}
            
            {settings.showFilename && (
              <div style={{ 
                color: theme.colors.comment, 
                fontSize: `${settings.headerFontSize}px`, 
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginLeft: settings.showWindowControls ? 'auto' : '0',
                marginRight: settings.showWindowControls ? 'auto' : '0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%',
              }}>
                <Terminal size={settings.headerFontSize} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {settings.filename || 'untitled'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Code Content */}
        <div style={{ 
          position: 'absolute',
          top: hasHeader ? `${settings.windowHeadingHeight}px` : 0,
          bottom: hasFooter ? `${settings.windowFooterHeight}px` : 0,
          left: 0,
          right: 0,
          padding: '40px', 
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden' 
        }}>
          <pre style={{ 
            margin: 0, 
            fontFamily: settings.fontFamily, 
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            fontWeight: settings.fontWeight,
            fontStyle: settings.fontStyle,
            color: theme.colors.text,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {chunk.lines.map((line, i) => (
              <div key={i} style={{ display: 'flex' }}>
                {settings.showLineNumbers && (
                  <span style={{ 
                    display: 'inline-block', 
                    width: '60px', 
                    textAlign: 'right', 
                    marginRight: '24px', 
                    color: theme.colors.comment,
                    userSelect: 'none',
                    opacity: 0.6,
                    flexShrink: 0
                  }}>
                    {chunk.startLineNumber + i}
                  </span>
                )}
                <span>
                  {simpleHighlight(line, theme)}
                </span>
              </div>
            ))}
          </pre>
        </div>

        {/* Footer (Author + Pagination + Continue Arrow) */}
        {hasFooter && (
          <div style={{ 
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${settings.windowFooterHeight}px`, 
            padding: '0 32px 20px 32px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            gap: '24px',
            zIndex: 10,
            backgroundColor: theme.colors.background
          }}>
            {settings.showAuthor && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                color: theme.colors.text, 
                opacity: 0.8, 
                fontSize: `${settings.footerFontSize}px`, 
                fontWeight: 600,
                minWidth: 0, 
                flex: 1
              }}>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <div style={{ 
                    background: theme.colors.text, 
                    color: theme.colors.background, 
                    padding: '4px', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Instagram size={Math.max(14, settings.footerFontSize - 2)} />
                  </div>
                  <div style={{ 
                    background: theme.colors.text, 
                    color: theme.colors.background, 
                    padding: '4px', 
                    borderRadius: '6px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <XLogo size={Math.max(14, settings.footerFontSize - 2)} color={theme.colors.background} />
                  </div>
                </div>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {settings.authorHandle}
                </span>
              </div>
            )}

            {totalChunks > 1 && (
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                marginLeft: settings.showAuthor ? '0' : 'auto',
                flexShrink: 0 
              }}>
                <span style={{ 
                  color: theme.colors.comment, 
                  fontSize: `${settings.footerFontSize}px`, 
                  fontWeight: 500 
                }}>
                  {currentChunkIndex + 1}/{totalChunks}
                </span>
                {!chunk.isLastPage && (
                  <div style={{ 
                    background: theme.colors.keyword, 
                    color: theme.colors.background, 
                    borderRadius: '50%', 
                    padding: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ArrowRight size={Math.max(16, settings.footerFontSize)} strokeWidth={3} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
});

SnippetCard.displayName = 'SnippetCard';

export default SnippetCard;