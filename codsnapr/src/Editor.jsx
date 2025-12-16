import React, { useState, useMemo, useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { DEFAULT_CODE, SYNTAX_THEMES, BACKGROUNDS, FONT_OPTIONS } from './constants.js';
import { splitCodeIntoChunks } from './utils/codeSplitter.js';
import SnippetCard from './components/SnippetCard.jsx';
import Controls from './components/Controls.jsx';
import {
  Download, Layers, ChevronLeft, ChevronRight, Code, Menu, X, Eye, Heart,
  TentTree, Home,
  BadgeInfo
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Editor = ({ onBackToHome,onGoToAbout }) => {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [showMobileSettings, setShowMobileSettings] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('editor');
  const [previewScale, setPreviewScale] = useState(0.45);

  const [settings, setSettings] = useState({
    language: 'javascript',
    theme: 'material-ocean',
    background: BACKGROUNDS[0].value,
    padding: 64,
    fontSize: 28,
    lineHeight: 1.5,
    fontFamily: FONT_OPTIONS[0].id,
    fontWeight: 400,
    fontStyle: 'normal',
    showLineNumbers: true,
    showWindowControls: true,
    showFilename: true,
    filename: 'index.js',
    showAuthor: true,
    authorHandle: '',
    roundedCorners: true,
    dropShadow: true,
    windowHeadingHeight: 80,
    windowFooterHeight: 60,
    headerFontSize: 24,
    footerFontSize: 20,
  });

  const cardRefs = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setPreviewScale(0.28);
      else if (width < 1024) setPreviewScale(0.35);
      else setPreviewScale(0.45);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateSettings = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const currentTheme = useMemo(() =>
    SYNTAX_THEMES.find(t => t.id === settings.theme) || SYNTAX_THEMES[0],
    [settings.theme]
  );

  const chunks = useMemo(() =>
    splitCodeIntoChunks(code, settings),
    [code, settings]
  );

  useEffect(() => {
    if (currentSlide >= chunks.length) {
      setCurrentSlide(Math.max(0, chunks.length - 1));
    }
  }, [chunks.length, currentSlide]);

  const handleDownload = async (type) => {
    setIsExporting(true);
    await new Promise(r => setTimeout(r, 100));

    try {
      if (type === 'single') {
        const ref = cardRefs.current[currentSlide];
        if (ref) {
          const dataUrl = await toPng(ref, { pixelRatio: 1 });
          FileSaver.saveAs(dataUrl, `codsnapr-slide-${currentSlide + 1}.png`);
        }
      } else {
        const zip = new JSZip();
        const promises = chunks.map(async (_, index) => {
          const ref = cardRefs.current[index];
          if (ref) {
            const dataUrl = await toPng(ref, { pixelRatio: 1 });
            const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");
            zip.file(`slide-${index + 1}.png`, base64Data, { base64: true });
          }
        });
        await Promise.all(promises);
        const content = await zip.generateAsync({ type: 'blob' });
        FileSaver.saveAs(content, 'codsnapr-snippets.zip');
      }
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to generate images. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-900 text-white overflow-hidden font-sans">

      {/* Controls Sidebar */}
      <div className={`
        fixed inset-0 z-50 bg-black transition-transform duration-300 transform 
        ${showMobileSettings ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:w-80 md:flex-shrink-0 md:shadow-xl md:z-20
        flex flex-col h-full
      `}>
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 shrink-0">
          <span></span>
          <button onClick={() => setShowMobileSettings(false)} className="p-2 text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        <div className="flex-1 min-h-0">
          <Controls settings={settings} updateSettings={updateSettings} />
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col relative min-w-0">
        {/* Header with Home Button */}
        <header className="h-16 bg-black border-b border-neutral-800 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setShowMobileSettings(true)} className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-md">
              <Menu size={24} />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 font-bold text-lg md:text-xl tracking-tight">
              <div className="w-8 h-8 bg-gradient-to-tr from-green-400 to-green-800 rounded-lg flex items-center justify-center">
                <TentTree size={20} className="text-black" />
              </div>
              <span className="hidden xs:inline">Codsnapr</span>
            </div>

            {/* Navigation */}
            <Link to="/" className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md text-xs transition">
            <Home size={20} />
            <span className="hidden sm:inline">Home</span>
            </Link>

            <Link to="/about" className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md text-xs transition">
            <BadgeInfo size={20} />
            About
            </Link>
          </div>

          {/* Export Buttons */}
          <div className="flex gap-2 md:gap-3">
            <button onClick={() => handleDownload('single')} disabled={isExporting}
              className="flex items-center gap-2 px-3 py-2 text-green-500 bg-gray-950 hover:bg-gray-900 rounded-md text-xs md:text-sm font-medium transition-colors border border-gray-950">
              <Download size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">Slide</span>
            </button>
            <button onClick={() => handleDownload('zip')} disabled={isExporting}
              className="flex items-center gap-2 px-3 py-2 text-black bg-green-500 hover:bg-green-600 rounded-md text-xs md:text-sm font-medium transition-colors shadow-lg">
              <Layers size={14} className="md:w-4 md:h-4" />
              <span className="hidden sm:inline">{isExporting ? '...' : 'Export All'}</span>
              <span className="sm:hidden">{isExporting ? '...' : 'All'}</span>
            </button>
          </div>
        </header>

        {/* Mobile Tabs */}
        <div className="md:hidden flex border-b border-gray-800 bg-gray-900 shrink-0">
          <button onClick={() => setActiveMobileTab('editor')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeMobileTab === 'editor' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}>
            <Code size={16} /> Editor
          </button>
          <button onClick={() => setActiveMobileTab('preview')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${activeMobileTab === 'preview' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-400'}`}>
            <Eye size={16} /> Preview
          </button>
        </div>

        {/* Workspace */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Code Editor */}
          <div className={`
            absolute inset-0 z-10 bg-[#0d1117] flex-col md:relative md:w-1/2 md:flex md:border-r md:border-gray-800
            ${activeMobileTab === 'editor' ? 'flex' : 'hidden'}
          `}>
            <div className="flex items-center justify-between px-4 py-2 bg-black border-b border-gray-800">
              <span className="text-xs font-mono text-gray-400 flex items-center gap-2">
                <Code size={14} /> Input Source
              </span>
              <span className="text-xs text-gray-500">{code.split('\n').length} lines</span>
            </div>
            <textarea
              className="flex-1 w-full h-full bg-black text-gray-300 p-4 md:p-6 font-mono text-sm resize-none focus:outline-none leading-relaxed"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              spellCheck={false}
            />
          </div>

          {/* Preview */}
          <div className={`
            absolute inset-0 z-10 bg-gray-950 flex-col md:relative md:w-1/2 md:flex
            ${activeMobileTab === 'preview' ? 'flex' : 'hidden'}
          `}>
            <div className="flex-1 flex items-center justify-center overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] relative">
              <div className="transform transition-transform duration-300 shadow-2xl origin-center" style={{ transform: `scale(${previewScale})` }}>
                {chunks[currentSlide] && (
                  <SnippetCard
                    chunk={chunks[currentSlide]}
                    settings={settings}
                    theme={currentTheme}
                    totalChunks={chunks.length}
                    currentChunkIndex={currentSlide}
                  />
                )}
              </div>

              {chunks.length > 1 && (
                <div className="absolute bottom-6 md:bottom-8 flex items-center gap-4 bg-gray-900/90 p-2 rounded-full border border-gray-700 backdrop-blur-sm z-30">
                  <button onClick={() => setCurrentSlide(s => Math.max(0, s - 1))} disabled={currentSlide === 0}
                    className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-30 transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                  <span className="font-mono text-sm px-2">{currentSlide + 1} / {chunks.length}</span>
                  <button onClick={() => setCurrentSlide(s => Math.min(chunks.length - 1, s + 1))} disabled={currentSlide === chunks.length - 1}
                    className="p-2 rounded-full hover:bg-gray-700 disabled:opacity-30 transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black border-t border-neutral-800 p-2 md:p-3 text-center shrink-0">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Built with</span>
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span>by Codsnapr • 2025</span>
          </div>
        </footer>
      </div>

      {/* Hidden Export Refs */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        {chunks.map((chunk, idx) => (
          <SnippetCard
            key={idx}
            ref={(el) => { cardRefs.current[idx] = el; }}
            chunk={chunk}
            settings={settings}
            theme={currentTheme}
            totalChunks={chunks.length}
            currentChunkIndex={idx}
          />
        ))}
      </div>
    </div>
  );
};

export default Editor;