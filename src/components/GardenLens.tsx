import React, { useState, useRef } from 'react';

import ReactMarkdown from 'react-markdown';
import { SmartCache, generateHash } from '../lib/cache';

export default function GardenLens() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysis(null); // Reset previous analysis
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setLoading(true);
    try {
      // Extract base64 and mimeType
      const match = imagePreview.match(/^data:(.*);base64,(.*)$/);
      if (!match) throw new Error("Invalid image format");

      const mimeType = match[1];
      const data = match[2];

      // 1. Generate Cache Key (Hash of the base64 data)
      const imageHash = generateHash(data);
      const cacheKey = `img_${imageHash}`;

      // 2. Check Cache
      const cachedAnalysis = SmartCache.get(cacheKey);
      if (cachedAnalysis) {
        console.log("Serving from cache 🧠");
        setAnalysis(cachedAnalysis);
        setLoading(false);
        return;
      }

      // 3. API Call
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: { mimeType, data },
        }),
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      
      // 4. Save to Cache
      setAnalysis(result.reply);
      SmartCache.set(cacheKey, result.reply);

    } catch (error) {
      console.error(error);
      setAnalysis("⚠️ Connectivity Issue: Could not reach the Plant AI. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 flex flex-col items-center gap-6">
      
      {/* Camera / Upload Button */}
      {!imagePreview && (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-48 h-48 rounded-full border-4 border-dashed border-green-300 flex flex-col items-center justify-center bg-green-50 hover:bg-green-100 transition-colors cursor-pointer group"
        >
          <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">📸</span>
          <span className="text-green-800 font-medium">Snap Plant</span>
          <span className="text-xs text-green-600 mt-1">or select file</span>
        </button>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        accept="image/*"
        capture="environment" // Forces rear camera on mobile
        className="hidden"
        onChange={handleFileSelect}
      />

      {/* Preview */}
      {imagePreview && (
        <div className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-lg border border-stone-200">
          <img src={imagePreview} alt="Plant Preview" className="w-full h-64 object-cover" />
          <button 
            onClick={() => setImagePreview(null)}
            className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center hover:bg-black/70"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Button */}
      {imagePreview && !analysis && (
        <button 
          onClick={handleAnalyze}
          disabled={loading}
          className={`btn-primary w-full ${loading ? 'opacity-70 cursor-wait' : ''}`}
        >
          {loading ? 'Analyzing with Gemini...' : 'Diagnose Plant 🌱'}
        </button>
      )}

      {/* Results Card */}
      {analysis && (
        <div className="w-full glass-panel p-6 animate-fade-in text-left prose prose-green max-w-none">
          <div className="flex items-center gap-2 mb-4 border-b border-stone-100 pb-2">
            <span className="text-2xl">🧠</span>
            <h3 className="text-lg font-bold text-green-900 m-0">AI Botanist Diagnosis</h3>
          </div>
          <div className="whitespace-pre-wrap text-stone-700 leading-relaxed font-sans">
             <ReactMarkdown 
                components={{
                    ul: ({node, ...props}) => <ul className="list-disc pl-4 my-2 space-y-1" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-4 my-2 space-y-1" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-green-800" {...props} />,
                }}
            >
                {analysis}
            </ReactMarkdown>
          </div>
          <button 
            onClick={() => { setImagePreview(null); setAnalysis(null); }}
            className="mt-6 text-sm text-stone-500 underline hover:text-green-700 w-full text-center"
          >
            Scan Another Plant
          </button>
        </div>
      )}
    </div>
  );
}
