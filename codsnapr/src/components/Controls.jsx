import React, { useState, useRef, useEffect } from 'react';
import { SYNTAX_THEMES, BACKGROUNDS, FONT_OPTIONS } from '../constants.js';
import {
  Settings,
  Layout,
  Type,
  Palette,
  User,
  PanelTop,
  Zap,
  ChevronDown,
  Cog,
} from 'lucide-react';


const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
    <Icon size={14} />
    {title}
  </div>
);


const BackgroundSelect = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const selected = BACKGROUNDS.find(b => b.value === value);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between bg-black border border-gray-700 text-white rounded p-2 text-sm hover:border-blue-500"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded"
            style={{ background: selected?.value }}
          />
          <span className="truncate">
            {selected?.name || 'Select Background'}
          </span>
        </div>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-black border border-gray-700 rounded-lg p-3 shadow-xl">
          <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg.id}
                title={bg.name}
                onClick={() => {
                  onChange(bg.value);
                  setOpen(false);
                }}
                className={`h-8 w-full rounded-md border
                  ${value === bg.value
                    ? 'border-blue-500 ring-2 ring-blue-500/40'
                    : 'border-gray-700 hover:border-gray-500'
                  }`}
                style={{ background: bg.value }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Controls = ({ settings, updateSettings }) => {
  return (
    <div className="w-full h-full bg-black border-r border-gray-800 flex flex-col">
      <div className="p-4 border-b border-gray-800 shrink-0">
        <h2 className="flex items-center gap-2 text-green-500 font-bold text-lg">
          <Cog />
          <span>Control Center</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        
        {/* Theme */}
        <div>
          <SectionHeader icon={Palette} title="Theme" />
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Syntax Theme</label>
              <select 
                className="w-full bg-black border border-gray-700 text-white rounded p-2 text-sm focus:outline-none focus:border-blue-500"
                value={settings.theme}
                onChange={(e) => updateSettings('theme', e.target.value)}
              >
                {SYNTAX_THEMES.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>


            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Background
              </label>
              <BackgroundSelect
                value={settings.background}
                onChange={(val) => updateSettings('background', val)}
              />
            </div>
          </div>
        </div>

        {/* Typography */}
        <div>
          <SectionHeader icon={Type} title="Typography" />
          <div className="space-y-4">
            <div>
               <label className="block text-sm text-gray-400 mb-2">Font Family</label>
               <select 
                className="w-full bg-black border border-gray-700 text-white rounded p-2 text-sm"
                value={settings.fontFamily}
                onChange={(e) => updateSettings('fontFamily', e.target.value)}
              >
                {FONT_OPTIONS.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm text-gray-400 mb-2">Weight</label>
                 <select 
                    className="w-full bg-black border border-gray-700 text-white rounded p-2 text-sm"
                    value={settings.fontWeight}
                    onChange={(e) => updateSettings('fontWeight', parseInt(e.target.value))}
                 >
                   <option value="300">Light</option>
                   <option value="400">Regular</option>
                   <option value="500">Medium</option>
                   <option value="600">SemiBold</option>
                   <option value="700">Bold</option>
                 </select>
              </div>
               <div className="flex flex-col justify-end">
                  <label className="flex items-center justify-between cursor-pointer h-10 border border-gray-700 rounded px-2 bg-black">
                   <span className="text-sm text-gray-300">Italic</span>
                   <input 
                    type="checkbox" 
                    checked={settings.fontStyle === 'italic'}
                    onChange={(e) => updateSettings('fontStyle', e.target.checked ? 'italic' : 'normal')}
                    className="accent-green-400 w-4 h-4 rounded"
                  />
                 </label>
               </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Size ({settings.fontSize}px)</label>
                <input 
                  type="range" min="12" max="64" step="2"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings('fontSize', parseInt(e.target.value))}
                  className="w-full accent-green-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Height ({settings.lineHeight})</label>
                <input 
                  type="range" min="1" max="2.5" step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => updateSettings('lineHeight', parseFloat(e.target.value))}
                  className="w-full accent-green-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Layout */}
        <div>
          <SectionHeader icon={Layout} title="Layout" />
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Padding</span>
                <input 
                  type="range" min="32" max="128" step="8"
                  value={settings.padding}
                  onChange={(e) => updateSettings('padding', parseInt(e.target.value))}
                  className="w-24 accent-green-400"
                />
             </div>
             
             <label className="flex items-center justify-between cursor-pointer">
               <span className="text-sm text-gray-300">Line Numbers</span>
               <input 
                type="checkbox" 
                checked={settings.showLineNumbers}
                onChange={(e) => updateSettings('showLineNumbers', e.target.checked)}
                className="accent-green-400 w-4 h-4 rounded"
              />
             </label>

             <label className="flex items-center justify-between cursor-pointer">
               <span className="text-sm text-gray-300">Window Controls</span>
               <input 
                type="checkbox" 
                checked={settings.showWindowControls}
                onChange={(e) => updateSettings('showWindowControls', e.target.checked)}
                className="accent-green-400 w-4 h-4 rounded"
              />
             </label>

             <label className="flex items-center justify-between cursor-pointer">
               <span className="text-sm text-gray-300">Rounded Corners</span>
               <input 
                type="checkbox" 
                checked={settings.roundedCorners}
                onChange={(e) => updateSettings('roundedCorners', e.target.checked)}
                className="accent-green-400 w-4 h-4 rounded"
              />
             </label>
             
             <label className="flex items-center justify-between cursor-pointer">
               <span className="text-sm text-gray-300">Drop Shadow</span>
               <input 
                type="checkbox" 
                checked={settings.dropShadow}
                onChange={(e) => updateSettings('dropShadow', e.target.checked)}
                className="accent-green-400 w-4 h-4 rounded"
              />
             </label>
          </div>
        </div>

        {/* Window UI */}
        <div>
          <SectionHeader icon={PanelTop} title="Window UI" />
          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Header Height</span>
                <input 
                  type="range" min="40" max="120" step="4"
                  value={settings.windowHeadingHeight}
                  onChange={(e) => updateSettings('windowHeadingHeight', parseInt(e.target.value))}
                  className="w-24 accent-green-400"
                />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Header Font Size</span>
                <input 
                  type="range" min="12" max="48" step="1"
                  value={settings.headerFontSize}
                  onChange={(e) => updateSettings('headerFontSize', parseInt(e.target.value))}
                  className="w-24 accent-green-400"
                />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Footer Height</span>
                <input 
                  type="range" min="40" max="120" step="4"
                  value={settings.windowFooterHeight}
                  onChange={(e) => updateSettings('windowFooterHeight', parseInt(e.target.value))}
                  className="w-24 accent-green-400"
                />
             </div>
             <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Footer Font Size</span>
                <input 
                  type="range" min="12" max="48" step="1"
                  value={settings.footerFontSize}
                  onChange={(e) => updateSettings('footerFontSize', parseInt(e.target.value))}
                  className="w-24 accent-green-400"
                />
             </div>
          </div>
        </div>

        {/* Metadata */}
        <div>
          <SectionHeader icon={User} title="Metadata" />
          <div className="space-y-4">
             <div className="space-y-2">
               <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Show Filename</span>
                  <input 
                    type="checkbox" 
                    checked={settings.showFilename} 
                    onChange={e => updateSettings('showFilename', e.target.checked)} 
                    className="accent-green-400"
                  />
               </div>
               {settings.showFilename && (
                 <input 
                   type="text" 
                   value={settings.filename}
                   onChange={e => updateSettings('filename', e.target.value)}
                   className="w-full bg-black border border-gray-700 text-white rounded px-2 py-1 text-sm"
                   placeholder="e.g. App.tsx"
                 />
               )}
             </div>

             <div className="space-y-2">
               <div className="flex justify-between">
                  <span className="text-sm text-gray-300">Show Author</span>
                  <input 
                    type="checkbox" 
                    checked={settings.showAuthor} 
                    onChange={e => updateSettings('showAuthor', e.target.checked)} 
                    className="accent-green-400"
                  />
               </div>
               {settings.showAuthor && (
                 <input 
                   type="text" 
                   value={settings.authorHandle}
                   onChange={e => updateSettings('authorHandle', e.target.value)}
                   className="w-full bg-black border border-gray-700 text-white rounded px-2 py-1 text-sm"
                   placeholder="@username"
                 />
               )}
             </div>
          </div>
        </div>
      </div>

      {/* Sidebar Footer Card */}
      <div className="p-4 border-t border-black bg-black shrink-0">
         <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl p-3 flex items-center gap-3 hover:border-indigo-500/40 transition-colors cursor-default">
           <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-xl shrink-0">
             ✨
           </div>
           <div>
             <div className="text-sm font-bold text-indigo-100">Pro Tip</div>
             <div className="text-xs text-gray-400">Use gradients for extra pop!</div>
           </div>
           <Zap className="ml-auto text-indigo-400 opacity-50" size={16} />
         </div>
      </div>
    </div>
  );
};

export default Controls;