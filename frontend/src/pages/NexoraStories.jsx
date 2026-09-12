import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  TrendingUp,
  Star,
  Users,
  Store,
  Clock,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

const STORIES = [
  {
    id: 1,
    tag: 'Seller Spotlight',
    title: 'From a Small Ludhiana Workshop to ₹3 Crore Annual Sales on Nexora',
    author: 'Harpreet Singh, Royal Textiles',
    readTime: '4 min read',
    date: 'August 2026',
    image: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=800&auto=format&fit=crop&q=60',
    excerpt: 'How a traditional garment manufacturer expanded their regional reach to 19,000+ PIN codes with 0% commission on Nexora Marketplace.',
  },
  {
    id: 2,
    tag: 'Tech & Innovation',
    title: 'How Nexora’s Automated Warehouses Deliver Electronics in Under 24 Hours',
    author: 'Nexora Engineering Team',
    readTime: '5 min read',
    date: 'July 2026',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=60',
    excerpt: 'Inside the high-speed sorting facilities and predictive route algorithms ensuring 99.4% on-time express doorstep fulfillment.',
  },
  {
    id: 3,
    tag: 'Customer Experience',
    title: 'Open-Box Delivery: Transforming Online Trust in Tier-2 & Tier-3 India',
    author: 'Customer Delight Cell',
    readTime: '3 min read',
    date: 'June 2026',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&auto=format&fit=crop&q=60',
    excerpt: 'Allowing buyers to physically inspect smartphones and laptops before sharing delivery OTP has brought unprecedented peace of mind.',
  },
  {
    id: 4,
    tag: 'Sustainability',
    title: '100% Recyclable Paper Packaging: Our Pledge Towards a Greener India',
    author: 'Nexora Impact Group',
    readTime: '3 min read',
    date: 'May 2026',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=60',
    excerpt: 'Eliminating single-use plastics across our nationwide supply chain to prevent tons of non-biodegradable landfill waste.',
  },
];

const NexoraStories = () => {
  const [selectedTag, setSelectedTag] = useState('All');

  const tags = ['All', 'Seller Spotlight', 'Tech & Innovation', 'Customer Experience', 'Sustainability'];

  const filteredStories =
    selectedTag === 'All' ? STORIES : STORIES.filter((s) => s.tag === selectedTag);

  return (
    <div className="bg-[#f1f2f4] min-h-screen pb-20 font-sans text-gray-800">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white py-14 px-4 relative overflow-hidden shadow-lg">
        <div className="max-w-6xl mx-auto relative z-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-300/30 px-3.5 py-1 rounded-full text-xs font-bold text-nexora-yellow mb-4 backdrop-blur-xs">
            <BookOpen className="w-3.5 h-3.5" /> Stories of Impact, Growth & Innovation
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Nexora Stories & <br />
            <span className="text-nexora-yellow">Inspiring Seller Journeys</span>
          </h1>

          <p className="text-gray-200 text-sm sm:text-base mt-4 max-w-2xl leading-relaxed">
            Discover how Nexora is empowering local artisans, manufacturers, and millions of Indian consumers through cutting-edge technology and human-first commerce.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-10 space-y-8">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                selectedTag === t
                  ? 'bg-nexora-blue text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span className="font-black text-nexora-blue bg-blue-50 px-2.5 py-1 rounded">
                      {story.tag}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3" /> {story.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900 mt-2 hover:text-nexora-blue transition leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-0 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-4">
                <span>By {story.author}</span>
                <span className="text-nexora-blue font-bold flex items-center gap-1 cursor-pointer hover:underline">
                  Read full story →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action Bar */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-8 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black">Have a seller success story to share?</h3>
            <p className="text-xs text-blue-200 mt-1">
              Join over 150,000+ sellers who have multiplied their sales on Nexora.
            </p>
          </div>
          <Link
            to="/become-seller"
            className="px-6 py-3 bg-nexora-yellow hover:bg-yellow-400 text-gray-950 font-black rounded-xl text-xs transition shadow-md whitespace-nowrap"
          >
            Start Selling on Nexora →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NexoraStories;
