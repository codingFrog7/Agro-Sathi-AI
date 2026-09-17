import React, { useState } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  Sparkles,
  Users,
  Leaf,
  TrendingUp,
  CloudSun,
  ShieldCheck
} from "lucide-react";
import teamFroggersImg from "../assets/team-froggers.png";

const TEAM_MEMBERS = [
  {
    id: "deepu",
    name: "Deepu",
    nickname: "Froggy",
    role: [
      "AI & Machine Learning Development",
      "API Integration & Core Pipelines",
      "Frontend Engineering & UI Flow",
      "Graphic Design & Creative Direction",
      "Project & Workflow Management",
      "Cross-Functional Project Coordination"
    ],
    color: "#b6f022",
    badgeBg: "bg-lime-50",
    badgeBorder: "border-lime-300",
    coords: { x: "17.5%", y: "89%", popoverAlign: "left" },
    hotspot: { left: "7%", top: "20%", width: "20%", height: "68%" }
  },
  {
    id: "vansh",
    name: "Vansh",
    nickname: "Team Leader",
    role: [
      "Team Leadership & Mentor Coordination",
      "Team Management & Sprint Planning",
      "Platform Research & Discovery",
      "System Architecture & Solution Design",
      "Frontend Design & UI Initiation"
    ],
    color: "#38bdf8",
    badgeBg: "bg-sky-50",
    badgeBorder: "border-sky-300",
    coords: { x: "33%", y: "89%", popoverAlign: "center" },
    hotspot: { left: "24%", top: "35%", width: "17%", height: "53%" }
  },
  {
    id: "kartik",
    name: "Kartik",
    role: [
      "Backend & Systems Architecture",
      "APMC Mandi Bhav Live API Engine",
      "Database Management & Caching",
      "Server Optimization & Security",
      "Offline Sync & Fallback Architecture"
    ],
    color: "#fbbf24",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-300",
    coords: { x: "46%", y: "89%", popoverAlign: "center" },
    hotspot: { left: "39%", top: "22%", width: "14%", height: "66%" }
  },
  {
    id: "rishabh",
    name: "Rishabh",
    role: [
      "Software Testing & QA",
      "Product Demo Video Production",
      "Video Editing & Media Assets",
      "Cross-Device Compatibility Testing",
      "Bug Tracking & Release Validation"
    ],
    color: "#fb923c",
    badgeBg: "bg-orange-50",
    badgeBorder: "border-orange-300",
    coords: { x: "58%", y: "89%", popoverAlign: "center" },
    hotspot: { left: "51%", top: "35%", width: "14%", height: "53%" }
  },
  {
    id: "tanishka",
    name: "Tanishka",
    role: [
      "Agronomy Research & Data Curation",
      "UI/UX Design & Prototyping",
      "Presentation Contributor",
      "Design System & Visual Assets",
      "User Accessibility & Farmer Persona Research"
    ],
    color: "#facc15",
    badgeBg: "bg-yellow-50",
    badgeBorder: "border-yellow-300",
    coords: { x: "70.5%", y: "89%", popoverAlign: "center" },
    hotspot: { left: "63%", top: "22%", width: "15%", height: "66%" }
  },
  {
    id: "nisha",
    name: "Nisha",
    role: [
      "Presentation & Pitch Deck Designing",
      "Frontend Development & UI Flow",
      "Content & Documentation Support",
      "Agromet Advisory Content Curation",
      "Farmer Guidance & Support Material"
    ],
    color: "#34d399",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-300",
    coords: { x: "85.5%", y: "89%", popoverAlign: "right" },
    hotspot: { left: "78%", top: "30%", width: "17%", height: "58%" }
  }
];

export default function TeamPage() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div className="min-h-screen bg-[#eff0eb] font-sans flex flex-col pt-20 md:pt-24 px-4 sm:px-6 pb-16">
      <div className="w-full max-w-5xl mx-auto flex-1">
        {/* Navigation & Breadcrumb */}
        <div className="mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all text-slate-900 font-bold text-sm cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-2 bg-white text-slate-900 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <img src="/sih-logo.png" alt="Smart India Hackathon" className="h-4 w-auto object-contain" />
              <span>Smart India Hackathon</span>
            </div>
            <div className="inline-flex items-center gap-2 bg-[#b6f022] text-slate-900 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 border-slate-900 shadow-[2px_2px_0px_0px_#0f172a]">
              <Sparkles size={13} /> Agro Sathi Crew
            </div>
          </div>
        </div>

        {/* Hero Title Section */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 uppercase tracking-tight mb-2">
            Team Froggers
          </h1>
          <p className="text-slate-600 font-semibold text-base sm:text-lg max-w-2xl leading-relaxed">
            The builders behind Agro Sathi. Hover or tap any character's name below the table to reveal their profile.
          </p>
        </div>

        {/* ==================================================================== */}
        {/* INTERACTIVE TEAM CANVAS: NAMES BELOW THE TABLE ALIGNED WITH AVATARS  */}
        {/* ==================================================================== */}
        <div className="bg-white border-4 border-slate-900 rounded-3xl shadow-[10px_10px_0px_0px_#0f172a] mb-8 overflow-visible relative">
          {/* Main Relative Image Canvas */}
          <div className="relative w-full aspect-[1024/585] bg-white overflow-visible select-none rounded-t-[20px]">
            {/* The Base Illustration */}
            <img
              src={teamFroggersImg ? `${teamFroggersImg}?v=sih2` : "/team-froggers.png?v=sih2"}
              alt="Team Froggers with Smart India Hackathon Branding"
              className="w-full h-full object-contain block rounded-t-[20px]"
              loading="eager"
            />

            {/* Interactive Character Hitspots over bodies */}
            {TEAM_MEMBERS.map(member => (
              <div
                key={`hotspot-${member.id}`}
                className="absolute z-10 cursor-pointer rounded-2xl hover:bg-black/5 transition-colors"
                style={{
                  left: member.hotspot.left,
                  top: member.hotspot.top,
                  width: member.hotspot.width,
                  height: member.hotspot.height,
                }}
                onMouseEnter={() => setHoveredId(member.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedId(prev => prev === member.id ? null : member.id)}
                title={`View ${member.name}'s profile`}
              />
            ))}

            {/* Names positioned BELOW THE TABLE, perfectly aligned with each Avatar */}
            {TEAM_MEMBERS.map(member => {
              const isHovered = hoveredId === member.id;
              const isSelected = selectedId === member.id && !hoveredId;
              const isActive = isHovered || isSelected;

              // Popover horizontal alignment classes
              let popoverPosClass = "-translate-x-1/2 left-1/2";
              if (member.coords.popoverAlign === "left") {
                popoverPosClass = "left-0 translate-x-[-8%]";
              } else if (member.coords.popoverAlign === "right") {
                popoverPosClass = "right-0 translate-x-[8%]";
              }

              return (
                <div
                  key={member.id}
                  className="absolute z-20"
                  style={{
                    left: member.coords.x,
                    top: member.coords.y,
                  }}
                >
                  <div
                    className="relative -translate-x-1/2 cursor-pointer group"
                    onMouseEnter={() => setHoveredId(member.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => setSelectedId(prev => prev === member.id ? null : member.id)}
                  >
                    {/* Minimal Upward Indicator Arrow */}
                    <div
                      className={`w-0 h-0 mx-auto border-x-4 border-x-transparent border-b-4 mb-0.5 transition-colors ${
                        isActive ? "border-b-[#b6f022]" : "border-b-white/80"
                      }`}
                    />

                    {/* Name Pill Badge (Below Table, Aligned with Avatar) */}
                    <button
                      type="button"
                      className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-black uppercase tracking-wider border-2 border-slate-900 transition-all duration-200 cursor-pointer ${
                        isActive
                          ? "bg-slate-900 text-white scale-105 shadow-[2px_2px_0px_0px_#b6f022]"
                          : "bg-white text-slate-900 hover:scale-105 shadow-[2px_2px_0px_0px_#0f172a]"
                      }`}
                    >
                      <span
                        className="w-2 h-2 rounded-full border border-slate-900 shrink-0"
                        style={{ backgroundColor: member.color }}
                      />
                      <span>{member.name}</span>
                    </button>

                    {/* ========================================================== */}
                    {/* MINIMAL HOVER INFO CARD (POPS UP ABOVE NAME TAG)          */}
                    {/* ========================================================== */}
                    {isActive && (
                      <div
                        className={`absolute bottom-full mb-3 w-64 sm:w-72 bg-white border-3 border-slate-900 rounded-2xl shadow-[6px_6px_0px_0px_#0f172a] p-3.5 text-slate-900 z-50 pointer-events-auto transition-all animate-in fade-in zoom-in-95 duration-150 ${popoverPosClass}`}
                        onMouseEnter={() => setHoveredId(member.id)}
                        onMouseLeave={() => setHoveredId(null)}
                      >
                        <div className="flex items-center gap-1.5 mb-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-900 shrink-0"
                            style={{ backgroundColor: member.color }}
                          />
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                            {member.name}
                            {member.nickname && (
                              <span className="ml-1 text-slate-500 font-bold normal-case text-xs">
                                ({member.nickname})
                              </span>
                            )}
                          </h3>
                        </div>
                        {Array.isArray(member.role) ? (
                          <div
                            className={`${member.badgeBg} border-2 ${member.badgeBorder} text-slate-900 rounded-xl p-2.5`}
                          >
                            <ul className="space-y-1 text-xs font-bold text-slate-800">
                              {member.role.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0 border border-slate-900/40"
                                    style={{ backgroundColor: member.color }}
                                  />
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div
                            className={`${member.badgeBg} border-2 ${member.badgeBorder} text-slate-900 text-xs font-bold rounded-xl px-3 py-2 leading-snug`}
                          >
                            {member.role}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Minimal Stage Bottom Bar */}
          <div className="px-6 py-3 bg-slate-50 border-t-4 border-slate-900 rounded-b-[20px] flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-600">
            <span className="flex items-center gap-2">
              <img src="/sih-logo.png" alt="SIH" className="h-4 w-auto object-contain" />
              <span>Team Froggers · Smart India Hackathon</span>
            </span>
            <span className="text-slate-400">
              6 Builders · Click or hover any name to inspect
            </span>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* CORE PLATFORM PILLARS                                                */}
        {/* ==================================================================== */}
        <div className="mb-12">
          <div className="mb-5">
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">
              Built by Team Froggers
            </span>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
              Core Innovations
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-[5px_5px_0px_0px_#0f172a] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#b6f022] border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a] mb-3">
                  <Leaf size={20} className="text-slate-900" />
                </div>
                <h3 className="font-black text-base text-slate-900 uppercase mb-1">
                  AI Leaf Doctor
                </h3>
                <p className="text-slate-600 text-xs font-medium leading-relaxed">
                  Real-time Gemini Vision diagnostics with CIB dosages and ICAR field database.
                </p>
              </div>
            </div>

            <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-[5px_5px_0px_0px_#0f172a] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-sky-200 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a] mb-3">
                  <TrendingUp size={20} className="text-slate-900" />
                </div>
                <h3 className="font-black text-base text-slate-900 uppercase mb-1">
                  Live Mandi Bhav
                </h3>
                <p className="text-slate-600 text-xs font-medium leading-relaxed">
                  APMC price tracking and lot profit calculation for crops like Chilli, Cotton, and Paddy.
                </p>
              </div>
            </div>

            <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-[5px_5px_0px_0px_#0f172a] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-200 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a] mb-3">
                  <CloudSun size={20} className="text-slate-900" />
                </div>
                <h3 className="font-black text-base text-slate-900 uppercase mb-1">
                  Agromet Desk
                </h3>
                <p className="text-slate-600 text-xs font-medium leading-relaxed">
                  Microclimate insights and optimal spray timing to save farmers chemical input costs.
                </p>
              </div>
            </div>

            <div className="bg-white border-3 border-slate-900 rounded-2xl p-5 shadow-[5px_5px_0px_0px_#0f172a] flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-200 border-2 border-slate-900 flex items-center justify-center shadow-[2px_2px_0px_0px_#0f172a] mb-3">
                  <ShieldCheck size={20} className="text-slate-900" />
                </div>
                <h3 className="font-black text-base text-slate-900 uppercase mb-1">
                  Rural First UX
                </h3>
                <p className="text-slate-600 text-xs font-medium leading-relaxed">
                  Bilingual voice readouts in Hindi/Telugu and offline-resilient field database.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-4 border-slate-900">
          <span className="text-sm font-bold text-slate-700">
            🌾 Built with passion by Team Froggers
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/detect"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#b6f022] border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all text-slate-900 font-black text-xs cursor-pointer"
            >
              <Leaf size={14} /> Try Leaf Doctor
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-900 rounded-xl shadow-[3px_3px_0px_0px_#0f172a] hover:translate-y-0.5 hover:shadow-[1px_1px_0px_0px_#0f172a] active:translate-y-1 active:shadow-none transition-all text-slate-900 font-bold text-xs cursor-pointer"
            >
              About Agro Sathi
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
