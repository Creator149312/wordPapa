import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { connectMongoDB } from "@/lib/mongodb";
import GameProfile from "@/models/gameprofile";
import User from "@/models/user";
import { calculateLevel, calculateProgress } from "@/app/games/hangman/lib/progression";
import ShareProfileCard from "./ShareProfileCard";
import {
  Trophy,
  Flame,
  Award,
  Globe,
  Building2,
  Gamepad2,
  Sparkles,
  MapPin,
  CheckCircle2,
  Star,
  Zap,
} from "lucide-react";

export const revalidate = 60; // Cache profile page for 60 seconds

// Mapping ISO 2-letter codes to Flag emojis
function getCountryFlag(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export async function generateMetadata({ params }) {
  const { username } = await params;
  await connectMongoDB();

  const profile = await GameProfile.findOne({
    username: username.toLowerCase(),
  }).lean();

  if (!profile) {
    return {
      title: "Player Not Found | WordPapa",
    };
  }

  const rank = calculateLevel(profile.xp || 0);
  const displayName = profile.name || username;
  const flag = getCountryFlag(profile.country);

  return {
    title: `${displayName} (${rank.name}) | WordPapa Vocabulary Profile`,
    description: `${displayName} has solved ${profile.totalWordsSolved || 0} words and earned ${profile.xp || 0} XP on WordPapa. Challenge them in Hangman!`,
    openGraph: {
      title: `${displayName} ${flag} • WordPapa Champion`,
      description: `Rank: ${rank.name} | ${profile.wordsMastered || 0} Words Mastered | ${profile.xp || 0} Total XP`,
      type: "profile",
    },
  };
}

export default async function PublicUserProfilePage({ params }) {
  const { username } = await params;
  await connectMongoDB();

  const profile = await GameProfile.findOne({
    username: username.toLowerCase(),
  }).lean();

  if (!profile) {
    notFound();
  }

  // Fetch optional avatar from User collection
  const userRecord = await User.findOne({ email: profile.userEmail }).select("image").lean();
  const avatarUrl = userRecord?.image || null;

  const rank = calculateLevel(profile.xp || 0);
  const progressPercent = calculateProgress(profile.xp || 0);
  const countryFlag = getCountryFlag(profile.country);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-8 animate-in fade-in duration-500">
      {/* 1. HERO SHOWCASE CARD */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-950 border border-gray-100 dark:border-gray-800 p-6 md:p-10 shadow-xl shadow-[#75c32c]/5">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Avatar with rank border */}
            <div
              className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 shadow-xl shrink-0"
              style={{ borderColor: rank.color || "#75c32c" }}
            >
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={profile.name || "Player"}
                  fill
                  sizes="112px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center font-black text-3xl text-white"
                  style={{ backgroundColor: rank.color || "#75c32c" }}
                >
                  {(profile.name || "P")[0].toUpperCase()}
                </div>
              )}
            </div>

            {/* Name, Handle & Bio */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
                  {profile.name || "Player"}
                </h1>
                {countryFlag && (
                  <span className="text-2xl" title={profile.country}>
                    {countryFlag}
                  </span>
                )}
              </div>

              <p className="text-xs font-black uppercase tracking-widest text-[#75c32c]">
                @{profile.username}
              </p>

              {profile.bio && (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 max-w-md italic">
                  "{profile.bio}"
                </p>
              )}

              {/* Regional & Institutional Tags */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                {profile.region && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-[11px] font-bold">
                    <MapPin size={12} className="text-[#75c32c]" />
                    {profile.region}
                  </span>
                )}
                {profile.institution && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-[11px] font-bold">
                    <Building2 size={12} className="text-[#75c32c]" />
                    {profile.institution}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-row md:flex-col items-center gap-3 shrink-0">
            <ShareProfileCard name={profile.name || profile.username} username={profile.username} />
            <Link
              href="/games/hangman"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#75c32c] hover:bg-[#66aa26] text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#75c32c]/20 transition-all active:scale-95"
            >
              <Gamepad2 size={16} />
              <span>Play WordPapa</span>
            </Link>
          </div>
        </div>

        {/* Rank & Arena Banner */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-md"
              style={{ backgroundColor: rank.color || "#75c32c" }}
            >
              {rank.level || 1}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                Arena {rank.arenaId || 1}
              </p>
              <p className="text-base font-black text-gray-900 dark:text-white">
                {rank.name} • {rank.theme?.name || "The Courtyard"}
              </p>
            </div>
          </div>

          {/* Level Progress */}
          <div className="w-full sm:w-48 space-y-1.5 text-right">
            <div className="flex justify-between text-[11px] font-black uppercase tracking-wider text-gray-400">
              <span>XP to next rank</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progressPercent}%`,
                  backgroundColor: rank.color || "#75c32c",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. CAREER METRICS GRID */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Words Mastered */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-purple-500 mb-1">
            <Award size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Mastered</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {profile.wordsMastered || 0}
          </p>
          <p className="text-[11px] font-medium text-gray-400">Unique terms locked</p>
        </div>

        {/* Global XP */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-yellow-500 mb-1">
            <Star size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Total XP</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {(profile.xp || 0).toLocaleString()}
          </p>
          <p className="text-[11px] font-medium text-gray-400">All modes combined</p>
        </div>

        {/* Best Endless Run */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-orange-500 mb-1">
            <Flame size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Best Run</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {profile.highestEndlessRun || 0} <span className="text-sm font-bold text-gray-400">words</span>
          </p>
          <p className="text-[11px] font-medium text-gray-400">Endless record</p>
        </div>

        {/* Practice Streak */}
        <div className="p-5 bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm space-y-1">
          <div className="flex items-center gap-2 text-[#75c32c] mb-1">
            <Zap size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Streak</span>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
            {profile.dailyStreak || profile.journey?.streak || 0} <span className="text-sm font-bold text-gray-400">days</span>
          </p>
          <p className="text-[11px] font-medium text-gray-400">Consistent practice</p>
        </div>
      </section>

      {/* 3. PROUD CHALLENGE BANNER */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2rem] p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-orange-500/10">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-2xl font-black tracking-tight">Can you beat @{profile.username}?</h2>
          <p className="text-sm text-orange-100 font-medium">
            Jump into Endless Run or tackle the daily word challenge right now.
          </p>
        </div>
        <Link
          href="/games/hangman?mode=endless"
          className="px-6 py-3.5 bg-white text-orange-600 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-orange-50 transition-all active:scale-95 shadow-md shrink-0"
        >
          Challenge Score
        </Link>
      </section>
    </div>
  );
}
