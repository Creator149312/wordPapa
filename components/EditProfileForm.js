"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Globe, Building2, User, AtSign, FileText, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import Toast from "@components/Toast";

// Popular countries list for clean quick-picker
const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
];

export default function EditProfileForm() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    country: "",
    region: "",
    institution: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/user/profile");
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setFormData({
              name: data.profile.name || session?.user?.name || "",
              username: data.profile.username || "",
              bio: data.profile.bio || "",
              country: data.profile.country || "",
              region: data.profile.region || "",
              institution: data.profile.institution || "",
            });
          }
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setIsLoading(false);
      }
    }

    if (session?.user) {
      loadProfile();
    }
  }, [session?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setToastMessage("Profile & Regional Identity saved!");
      } else {
        setToastMessage(data.error || "Failed to update profile");
      }
    } catch (err) {
      setToastMessage("Network error updating profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="animate-spin text-[#75c32c]" size={28} />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage("")} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Full Name */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Display Name
          </label>
          <div className="relative">
            <User size={18} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#75c32c] transition-colors"
            />
          </div>
        </div>

        {/* Public Handle / Username */}
        <div>
          <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
            Public Handle / Username
          </label>
          <div className="relative">
            <AtSign size={18} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""),
                })
              }
              placeholder="lexicon-champion"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#75c32c] transition-colors"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1 pl-1">
            Your public showcase URL: <span className="font-mono text-[#75c32c]">/u/{formData.username || "username"}</span>
          </p>
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
          Learner Bio / Goal
        </label>
        <div className="relative">
          <FileText size={18} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            maxLength={160}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="e.g. Master 1,000 SAT words | Daily hangman enthusiast"
            className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#75c32c] transition-colors"
          />
        </div>
      </div>

      {/* Regional & Institutional Pride */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#75c32c]" />
          <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#75c32c]">
            Regional & Institutional Pride
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Country */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Country
            </label>
            <div className="relative">
              <Globe size={18} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#75c32c] transition-colors appearance-none cursor-pointer"
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Region / State */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Region / State
            </label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value })}
              placeholder="e.g. California, Ontario, Delhi"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#75c32c] transition-colors"
            />
          </div>

          {/* Institution / School / University */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              School / University / Club
            </label>
            <div className="relative">
              <Building2 size={18} className="absolute left-3.5 top-3.5 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. Stanford University"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-semibold text-gray-900 dark:text-white focus:outline-none focus:border-[#75c32c] transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#75c32c] hover:bg-[#66aa26] text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-[#75c32c]/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
          <span>{isSaving ? "Saving..." : "Save Identity"}</span>
        </button>
      </div>
    </form>
  );
}
