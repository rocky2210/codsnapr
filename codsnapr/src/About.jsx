import React from 'react';
import { Heart, Globe, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
<div className="min-h-screen bg-gray-950 text-white pt-24 px-6">
    <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.2),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">About Codsnapr</h1>
        
        <div className="prose prose-invert prose-lg text-gray-300">
          <p className="mb-6">
            Codsnapr was born out of a simple frustration: sharing code on social media is hard.
            Screenshots often look blurry, syntax highlighting breaks, and long snippets don’t
            translate well into visual formats.
          </p>
          
          <p className="mb-6">
            I built Codsnapr as a focused tool to solve this problem — a way to turn raw code
            into clean, high-quality visuals that are easy to share. Whether it’s a quick tip
            on Twitter or a detailed walkthrough on Instagram, Codsnapr helps your code look
            clear, readable, and professional.
          </p>

          <h2 className="text-2xl font-bold text-white mt-12 mb-6">Our Mission</h2>
          <p className="mb-6">
            To empower developers to share knowledge visually. We believe that good design makes 
            learning easier, and by providing better tools for sharing code, we can help the 
            developer community grow together.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-12 not-prose">
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Globe size={18} className="text-blue-400" /> The Goal
              </h3>
              <p className="text-sm text-gray-400">
                The goal of Codsnapr is simple: make sharing code easier and more visually appealing.
    Good presentation helps ideas travel further, and better visuals make learning
    faster and more engaging.
              </p>
            </div>
            <div className="p-6 bg-gray-900 rounded-xl border border-gray-800">
              <h3 className="font-bold text-white mb-2 flex items-center gap-2">
                <Heart size={18} className="text-red-400" /> Passion Project
              </h3>
              <p className="text-sm text-gray-400">
                Codsnapr is designed, developed, and maintained by a single developer with a focus
    on simplicity, performance, and developer experience. The project continues to
    evolve based on real usage and practical needs.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col items-center">
            <p className="text-gray-500 text-sm mb-4">Connect with us</p>
            <div className="flex gap-4">
              <a href="#" className="p-3 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="p-3 bg-gray-900 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <Globe size={20} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;