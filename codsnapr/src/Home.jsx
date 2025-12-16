import React from 'react';
import {
  TentTree,
  ArrowRight,
  Github,
  Twitter,
  Heart,
  Sparkles,
  Code,
  Layers,
  Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500/30">

    <div className="fixed inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(34,197,94,0.2),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(16,185,129,0.15),transparent_50%)] pointer-events-none" />
      
      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-800/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs font-medium text-gray-400 mb-8">
            <Sparkles size={12} className="text-green-500" />
            <span>Carousel splitting & optimized social exports</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            Turn your code into <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-green-400">
              shareable art.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Codsnapr helps developers create stunning, high-quality code snippets
            for Instagram, Twitter, and LinkedIn in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/editor"
              className="px-8 py-4 bg-green-500 text-black rounded-full font-bold text-lg hover:bg-green-600 transition-all transform hover:scale-105 flex items-center gap-2"
            >
              Start Creating <ArrowRight size={20} />
            </Link>

            <Link
              to="/about"
              className="px-8 py-4 bg-gray-900 border border-gray-800 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need</h2>
            <p className="text-gray-400">
              Craft perfect snippets with our powerful app.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code className="text-green-500" />}
              title="Syntax Highlighting"
              description="Multiple clean syntax themes with readable highlighting."
            />
            <FeatureCard
              icon={<Layers className="text-green-400" />}
              title="Carousel Support"
              description="Long code automatically splits into swipeable slides."
            />
            <FeatureCard
              icon={<Download className="text-green-500" />}
              title="High-Res Export"
              description="Export crisp PNGs or full ZIP carousels instantly."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-neutral-800 text-center text-gray-500 text-sm bg-black">
        <div className="flex items-center justify-center gap-2">
          <span>Built with</span>
          <Heart size={14} className="text-red-500 fill-red-500" />
          <span>by Codsnapr • {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="p-6 rounded-2xl bg-black border border-gray-800 hover:border-green-500/40 transition-colors">
    <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

export default Home;
