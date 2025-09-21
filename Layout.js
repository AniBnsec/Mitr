
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Home, BookOpen, Sparkles, BarChart3, Edit } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

  const navItems = [
    {
      title: "Home",
      url: createPageUrl("Home"),
      icon: Home
    },
    {
      title: "Talk to Mitr",
      url: createPageUrl("MitrTalk"),
      icon: Sparkles
    },
    {
      title: "Journal",
      url: createPageUrl("GuidedJournal"),
      icon: Edit
    },
    {
      title: "Progress",
      url: createPageUrl("Progress"),
      icon: BarChart3
    },
    {
      title: "Resources",
      url: createPageUrl("Resources"),
      icon: BookOpen
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <style>
        {`
          :root {
            --primary-blue: #6366f1;
            --soft-blue: #e0e7ff;
            --warm-pink: #f3e8ff;
            --gentle-green: #ecfdf5;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
          }
          
          .glass-effect {
            background: rgba(255, 255, 255, 0.25);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
          }
          
          .gentle-shadow {
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.1);
          }
        `}
      </style>

      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center gentle-shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Mitr (मित्र)
                </h1>
                <p className="text-xs text-gray-500">Your AI Wellness Companion</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    location.pathname === item.url
                      ? 'bg-white/40 text-indigo-700 gentle-shadow'
                      : 'hover:bg-white/20 text-gray-600 hover:text-indigo-600'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Mobile Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 p-2">
        <div className="flex justify-around items-center">
           {navItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-300 ${
                    location.pathname === item.url
                      ? 'text-indigo-700'
                      : 'text-gray-500'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{item.title}</span>
                </Link>
              ))}
        </div>
      </div>


      {/* Footer */}
      <footer className="glass-effect border-t border-white/20 mt-12 pb-20 md:pb-0">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-pink-500" />
              <span className="text-gray-600 font-medium">You are not alone</span>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-gray-500 text-sm mb-4">
              A confidential, AI-powered mental wellness companion for Indian youth
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-400">
              <span>🔒 Completely Anonymous</span>
              <span>❤️ Culturally Sensitive</span>
              <span>🤝 Always Here for You</span>
            </div>
            
            <div className="mt-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
              <p className="text-sm text-gray-600">
                <strong>Crisis Support:</strong> If you're experiencing a mental health emergency, 
                please contact <strong>KIRAN Mental Health Helpline: 1800-599-0019</strong>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
