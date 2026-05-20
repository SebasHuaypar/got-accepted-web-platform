"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Title } from "@/components/ui/Title";
import { Button } from "@/components/ui/Button";
import { FiMail, FiInstagram, FiLinkedin, FiYoutube, FiX, FiCheckCircle, FiAlertCircle, FiArrowRight, FiFacebook } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";

type FormStatus = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [topic, setTopic] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "info@gotaccepted.org";
  const instagramUrl = process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://instagram.com/gotacceptedorg";
  const linkedinUrl = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://linkedin.com/company/gotacceptedorg";
  const tiktokUrl = process.env.NEXT_PUBLIC_SOCIAL_TIKTOK || "https://tiktok.com/@gotacceptedorg";
  const youtubeUrl = process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "https://youtube.com/@gotacceptedorg";
  const facebookUrl = process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://www.facebook.com/gotacceptedorg";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      topic: topic,
      message: formData.get("message") as string,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMessage(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Please check your connection and try again.");
    }
  }

  return (
    <main className="min-h-screen bg-white relative">
      {/* Immersive close button */}
      <Link
        href="/"
        className="fixed top-6 right-6 sm:top-10 sm:right-10 z-[100] w-12 h-12 bg-white border border-muted rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-xl group"
        aria-label="Close contact page and return to home"
      >
        <FiX className="text-2xl group-hover:rotate-90 transition-transform" />
      </Link>

      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* LEFT COLUMN: Fixed and non-scrollable (Absolute anchor) */}
        <div className="lg:w-[55%] xl:w-[50%] bg-primary text-white p-8 sm:p-16 lg:pt-16 lg:pb-32 lg:pl-12 lg:pr-24 xl:pl-16 xl:pr-32 flex flex-col justify-center relative min-h-[600px] sm:min-h-[700px] lg:h-screen lg:fixed lg:top-0 lg:left-0 z-10 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute -bottom-24 -right-24 w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] opacity-[0.02] pointer-events-none grayscale brightness-200 -rotate-[15deg]">
            <Image src="/images/isotype.png" alt="" fill className="object-contain" />
          </div>

          <div className="relative z-10 space-y-8 sm:space-y-10 text-center lg:text-left">
            {/* Header - More compact for balance */}
            <div>
              <span className="text-accent text-xs sm:text-sm font-black uppercase tracking-[0.4em] mb-3 block">Contact Us</span>
              <Title as="h1" className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.85] tracking-tighter">
                LET&apos;S <br />
                <span className="text-accent italic">connect</span>
              </Title>
            </div>

            {/* Contact Methods Area */}
            <div className="space-y-5">
              <div className="group flex flex-col items-center lg:items-start gap-1">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Email Address</p>
                <a href={`mailto:${contactEmail}`} className="text-lg sm:text-xl md:text-2xl font-bold hover:text-accent transition-colors break-all">
                  {contactEmail}
                </a>
              </div>

              <div className="group flex flex-col items-center lg:items-start gap-1">
                <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.3em] mb-1">WhatsApp</p>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-white opacity-40 italic">Coming Soon</span>
              </div>
            </div>

            {/* Icons EXACTLY as in Footer.tsx */}
            <div className="flex items-center justify-center lg:justify-start space-x-6 md:space-x-8 pt-6">
              <a 
                href={`mailto:${contactEmail}`}
                className="hover:text-accent transition-transform hover:-translate-y-1 text-white/80"
                aria-label="Email GotAccepted"
              >
                <FiMail size={24} />
              </a>
              <a 
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-transform hover:-translate-y-1 text-white/80"
                aria-label="Follow GotAccepted on Facebook"
              >
                <FiFacebook size={24} />
              </a>
              <a 
                href={tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-transform hover:-translate-y-1 text-white/80"
              >
                <FaTiktok size={24} />
              </a>
              <a 
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-transform hover:-translate-y-1 text-white/80"
              >
                <FiInstagram size={24} />
              </a>
              <a 
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-transform hover:-translate-y-1 text-white/80"
              >
                <FiLinkedin size={24} />
              </a>
              <a 
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent transition-transform hover:-translate-y-1 text-white/80"
              >
                <FiYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling form area with offset */}
        <div className="lg:ml-[55%] xl:ml-[50%] lg:w-[45%] xl:w-[50%] p-8 sm:p-16 lg:p-24 xl:p-32 bg-white flex flex-col justify-center min-h-screen">
          <div className="max-w-xl mx-auto lg:mx-0 w-full space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-black text-primary leading-tight">
                Ready to start? <br />
                <span className="text-gray-300">Tell us about your goals.</span>
              </h2>
            </div>

            {status === "success" ? (
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left py-12 space-y-6">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-600 mb-2">
                  <FiCheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-black text-primary">Message Sent!</h3>
                <p className="text-gray-500 text-lg">We will get back to you within 24 hours.</p>
                <Button variant="primary" onClick={() => setStatus("idle")} className="rounded-2xl px-10">Send another</Button>
              </div>
            ) : (
              <form className="space-y-12" onSubmit={handleSubmit} noValidate>
                {status === "error" && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 border border-red-100 font-bold text-sm">
                    <FiAlertCircle className="shrink-0 text-xl" />
                    <p>{errorMessage}</p>
                  </div>
                )}
                <div className="grid grid-cols-1 gap-y-12">
                  <div className="relative group">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-muted py-3 outline-none focus:border-accent transition-colors font-bold text-base text-primary placeholder-transparent"
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-0 top-3 text-gray-400 font-bold uppercase tracking-widest text-[10px] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-accent peer-focus:text-[10px] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]"
                    >
                      Your Name
                    </label>
                  </div>

                  <div className="relative group">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder=" "
                      className="peer w-full bg-transparent border-b-2 border-muted py-3 outline-none focus:border-accent transition-colors font-bold text-base text-primary placeholder-transparent"
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 top-3 text-gray-400 font-bold uppercase tracking-widest text-[10px] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-accent peer-focus:text-[10px] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]"
                    >
                      Email Address
                    </label>
                  </div>
                </div>

                <div className="relative group" ref={dropdownRef}>
                  <label
                    className="block text-primary font-black uppercase tracking-widest text-[10px] mb-2"
                  >
                    What are you interested in?
                  </label>
                  <div className="relative">
                    {/* Hidden input to pass HTML5 validation */}
                    <input type="text" name="topic" value={topic} required className="absolute opacity-0 w-0 h-0" onChange={() => { }} />

                    <div
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className={`w-full bg-gray-50/50 border-2 ${isDropdownOpen ? 'border-accent bg-white shadow-[0_0_0_4px_rgba(255,107,0,0.1)]' : 'border-gray-100'} hover:border-gray-200 rounded-2xl py-4 pl-4 pr-12 transition-all font-bold text-sm text-primary cursor-pointer flex items-center justify-between select-none`}
                    >
                      <span>{topic || <span className="text-gray-400">Select a topic...</span>}</span>
                      <FiArrowRight className={`text-xl transition-transform duration-300 ${isDropdownOpen ? '-rotate-90 text-accent' : 'rotate-90 text-accent'}`} />
                    </div>

                    {/* Custom Dropdown Menu */}
                    <div className={`absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-elevated overflow-hidden transition-all duration-200 origin-top z-50 ${isDropdownOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
                      <ul className="py-2">
                        {[
                          "Scholarships Application",
                          "Graduate Programs Mentoring",
                          "1-on-1 Mentorship",
                          "Partnerships & Media",
                          "General Inquiry"
                        ].map((option) => (
                          <li
                            key={option}
                            onClick={() => {
                              setTopic(option);
                              setIsDropdownOpen(false);
                            }}
                            className={`px-5 py-3 text-sm font-bold cursor-pointer transition-colors ${topic === option ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}`}
                          >
                            {option}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={4}
                    placeholder=" "
                    className="peer w-full bg-transparent border-b-2 border-muted py-3 outline-none focus:border-accent transition-colors font-bold text-base text-primary placeholder-transparent resize-none"
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-0 top-3 text-gray-400 font-bold uppercase tracking-widest text-[10px] transition-all peer-placeholder-shown:text-base peer-placeholder-shown:top-3 peer-focus:-top-4 peer-focus:text-accent peer-focus:text-[10px] peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-[10px]"
                  >
                    Your Message
                  </label>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full group bg-primary text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4 hover:bg-accent transition-all shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Sending..." : "Send Message"}
                    <FiArrowRight className="text-xl group-hover:translate-x-2 transition-all" />
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
