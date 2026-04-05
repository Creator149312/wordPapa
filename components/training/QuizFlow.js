"use client";

import { useState, useEffect, useRef } from "react";
import ProgressBar from "./ProgressBar"; 
import AudioTypingPractice from "../AudioTypingPractice";
import SpeakingPractice from "../SpeakingPractice";
import SentenceMakingPractice from "../SentenceMakingPractice";
import WordPlacementPractice from "../WordPlacementPractice";
import MatchingPractice from "../MatchingPractice";
import { Trophy, ArrowRight, RotateCcw, AlertCircle, Home, Sparkles, TrendingUp, X } from "lucide-react";

export default function QuizFlow({ questions, listTitle, listId }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [xpData, setXpData] = useState(null);
  const [isLoadingXP, setIsLoadingXP] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [showQuitModal, setShowQuitModal] = useState(false);
  const autoAdvanceTimerRef = useRef(null);
  const totalQuestions = questions.length;
  const currentQuestion = questions[currentIndex];

  // Award XP and track journey progress when session finishes
  useEffect(() => {
    if (isFinished && !xpData && !isLoadingXP) {
      const awardXP = async () => {
        setIsLoadingXP(true);
        try {
          // 1. Award XP
          const response = await fetch("/api/lists/practice", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              listId: listId || "unknown",
              listTitle: listTitle || "Practice",
              questionsCount: questions.length,
              correctAnswers: correctAnswers, // Only correct answers now
              isQuizMode: true,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            setXpData(data);

            // 2. Track journey progress (if user is logged in and has session)

            try {
              const sessionRes = await fetch("/api/auth/session");
              if (sessionRes.ok) {
                const session = await sessionRes.json();
                if (session?.user?.email) {
                  // Track list completion for journey progress
                  const progressRes = await fetch("/api/journey/list-completion", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      email: session.user.email,
                      listId: listId,
                      wordsLearned: correctAnswers,
                    }),
                  });
                  
                  if (progressRes.ok) {
                    console.log("[QuizFlow] Journey progress tracked for list", listId);
                    // Dispatch event to notify journey page to refresh data
                    window.dispatchEvent(new CustomEvent('journeyProgressUpdated', { detail: { listId, correctAnswers } }));
                  }
                }
              }
            } catch (journeyError) {
              console.error("[QuizFlow] Error tracking journey progress:", journeyError);
              // Don't fail the XP award if journey tracking fails
            }
          } else {
            console.error("Failed to award XP");
            setXpData({ error: true });
          }
        } catch (error) {
          console.error("Error awarding XP:", error);
          setXpData({ error: true });
        } finally {
          setIsLoadingXP(false);
        }
      };
      awardXP();
    }
  }, [isFinished, xpData, isLoadingXP, questions.length, correctAnswers, listId, listTitle]);

  const markCorrect = () => {
    if (!answeredQuestions.has(currentIndex)) {
      setCorrectAnswers(prev => prev + 1);
      setAnsweredQuestions(prev => new Set([...prev, currentIndex]));
      // Auto-advance after correct answer (user can tap Skip to go immediately)
      if (totalQuestions > 1) {
        autoAdvanceTimerRef.current = setTimeout(nextQuestion, 1200);
      }
    }
  };

  // Auto-finish single-question quizzes after question is answered
  useEffect(() => {
    if (questions.length === 1 && answeredQuestions.has(0) && !isFinished) {
      // For single-question quizzes, auto-finish after a short delay
      const timer = setTimeout(() => {
        setIsFinished(true);
      }, 1500); // 1.5 second delay to show correct answer feedback
      return () => clearTimeout(timer);
    }
  }, [answeredQuestions, isFinished, questions.length]);

  const nextQuestion = () => {
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  // Cleanup auto-advance timer on unmount
  useEffect(() => {
    return () => { if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current); };
  }, []);

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    // Standardized data access to handle both Single Word and List objects
    const targetWord = currentQuestion.word;
    const wordList = currentQuestion.fullList || [];

    switch (currentQuestion.type) {
      case "speaking":
        return <SpeakingPractice key={currentIndex} words={[{ word: targetWord }]} onCorrect={markCorrect} />;

      case "audioTyping":
        return <AudioTypingPractice key={currentIndex} words={[{ word: targetWord }]} onCorrect={markCorrect} />;

      case "sentenceMaking":
        return <SentenceMakingPractice key={currentIndex} sentence={currentQuestion.sentence} />;

      case "match":
        // Logic: Only show Match if we have 4+ items. 
        // In MicroPractice, this will usually show the fallback.
        if (wordList.length >= 4) {
          return (
            <MatchingPractice
              key={currentIndex}
              wordList={wordList}
              targetWord={targetWord} 
              isSingleRound={true}
              onCorrect={markCorrect}
              onComplete={nextQuestion}
            />
          );
        } else {
          return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 dark:bg-gray-800/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-500 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">Match Mode Locked</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[220px] mb-6 font-medium leading-relaxed">
                Matching requires at least 4 words in a collection to generate choices.
              </p>
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-black text-xs transition-all active:scale-95 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Skip Challenge
              </button>
            </div>
          );
        }

      case "matchReverse":
        if (wordList.length >= 4) {
          return (
            <MatchingPractice
              key={currentIndex}
              wordList={wordList}
              reverseMode={true}
              isSingleRound={true}
              onCorrect={markCorrect}
              onComplete={nextQuestion}
            />
          );
        } else {
          return (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 dark:bg-gray-800/40 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-700 animate-in fade-in zoom-in">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center text-orange-500 mb-4">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white mb-2">Match Mode Locked</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 max-w-[220px] mb-6 font-medium leading-relaxed">
                Matching requires at least 4 words in a collection to generate choices.
              </p>
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-2xl font-black text-xs transition-all active:scale-95 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Skip Challenge
              </button>
            </div>
          );
        }

      case "wordPlacement":
        return (
          <WordPlacementPractice
            key={currentIndex}
            sentence={currentQuestion.sentence}
            practiceWord={currentQuestion.practiceWord}
            onCorrect={markCorrect}
          />
        );

      default:
        return (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem]">
            <p className="text-gray-500 font-bold">New challenge coming soon!</p>
          </div>
        );
    }
  };

  if (isFinished) {
    return (
      <div className="flex flex-col bg-white dark:bg-gray-950 min-h-[calc(100vh-96px)] px-4 pb-8 pt-6 animate-in fade-in zoom-in duration-400">
        {/* Trophy */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-[#75c32c]/20 rounded-full animate-ping" />
            <div className="relative flex items-center justify-center w-20 h-20 bg-[#75c32c] rounded-full text-white shadow-lg shadow-[#75c32c]/30">
              <Trophy size={40} strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">Session Clear!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 max-w-[260px] leading-relaxed">
            {listTitle ? `Well done on ${listTitle}` : "Challenges complete"}. Keep going!
          </p>
        </div>

        {/* Rewards */}
        {isLoadingXP ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-[#75c32c]/30 border-t-[#75c32c] rounded-full animate-spin" />
              <p className="text-xs font-bold text-gray-400">Calculating rewards…</p>
            </div>
          </div>
        ) : xpData && !xpData.error ? (
          <div className="flex-1 space-y-3">
            {/* XP card */}
            <div className="p-4 rounded-2xl bg-[#75c32c]/8 border border-[#75c32c]/20 flex items-center gap-4">
              <div className="w-12 h-12 bg-[#75c32c] rounded-2xl flex items-center justify-center shrink-0">
                <Sparkles size={22} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">XP Awarded</p>
                {xpData.xpEarned > 0 ? (
                  <p className="text-2xl font-black text-[#75c32c]">+{xpData.xpEarned} XP</p>
                ) : (
                  <div>
                    <p className="text-base font-black text-gray-400">No new XP</p>
                    <p className="text-[10px] text-gray-400">Beat your best score to earn XP!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Rank-up banner */}
            {xpData.rankedUp && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-400/30 flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shrink-0">
                  <TrendingUp size={22} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-gray-400">Rank Up!</p>
                  <p className="text-base font-black text-orange-600 dark:text-orange-400">{xpData.newRank.name}</p>
                  <p className="text-[10px] text-gray-500">Level {xpData.newRank.level} · {xpData.totalXP} total XP</p>
                </div>
              </div>
            )}

            {/* Practice stats */}
            {xpData.practiceStats && (
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shrink-0">
                  <Trophy size={22} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-wider text-blue-500">Progress</p>
                  <p className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    {xpData.practiceStats.attempts} attempts · Best: {xpData.practiceStats.bestScore}%
                  </p>
                  {xpData.practiceStats.mastered && (
                    <p className="text-xs font-black text-green-600 dark:text-green-400">🎉 List Mastered!</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : <div className="flex-1" />}

        {/* Action buttons */}
        <div className="mt-6 space-y-2">
          <button
            onClick={() => window.location.reload()}
            disabled={isLoadingXP}
            className="w-full flex items-center justify-center gap-2 py-4 bg-[#75c32c] text-white rounded-2xl font-black text-base shadow-lg shadow-[#75c32c]/20 active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            <RotateCcw size={18} strokeWidth={3} />
            Practice Again
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full flex items-center justify-center gap-2 py-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 font-bold text-sm transition-colors"
          >
            <Home size={15} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="max-w-2xl mx-auto w-full px-4 pt-4 pb-8">
      {/* ── Session header: quit · title · challenge type ── */}
      <div className="mb-3">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setShowQuitModal(true)}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-all active:scale-90"
            aria-label="Quit session"
          >
            <X size={14} strokeWidth={3} />
          </button>
          <p className="flex-1 text-sm font-black text-gray-900 dark:text-white truncate leading-tight">
            {listTitle || "Vocabulary Practice"}
          </p>
          <span className="shrink-0 px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
            {currentQuestion?.type?.replace(/([A-Z])/g, " $1").trim() || "Practice"}
          </span>
        </div>
        <ProgressBar current={Math.min(currentIndex + 1, totalQuestions)} total={totalQuestions} />
      </div>

      {/* ── Question content ── */}
      <div
        key={currentIndex}
        className="animate-in fade-in slide-in-from-bottom-3 duration-300"
      >
        {renderQuestion()}
      </div>

      {/* ── Continue / Skip / Finish button ── */}
      {totalQuestions > 1 && (
        <div className="mt-6">
          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={nextQuestion}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm transition-all active:scale-[0.98] ${
                answeredQuestions.has(currentIndex)
                  ? "bg-[#75c32c] text-white shadow-lg shadow-[#75c32c]/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500"
              }`}
            >
              <span>{answeredQuestions.has(currentIndex) ? "Continue" : "Skip"}</span>
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg shadow-gray-900/10 active:scale-[0.98] transition-all"
            >
              <span>Finish Session</span>
              <ArrowRight size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      )}
      {totalQuestions === 1 && (
        <div className="mt-6 flex justify-center">
          {answeredQuestions.has(currentIndex) ? (
            <p className="text-xs font-black text-[#75c32c] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#75c32c] animate-pulse" />
              Finishing…
            </p>
          ) : (
            <p className="text-xs font-black text-gray-400">Complete the challenge to finish</p>
          )}
        </div>
      )}
    </div>

    {/* ── Quit confirmation bottom sheet ── */}
    {showQuitModal && (
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm p-4"
        onClick={() => setShowQuitModal(false)}
      >
        <div
          className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-[2rem] p-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6" />
          <div className="text-center mb-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Quit session</p>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Give up already?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Your session progress won't be saved.
            </p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setShowQuitModal(false)}
              className="w-full py-4 bg-[#75c32c] text-white rounded-2xl font-black text-base active:scale-[0.98] transition-transform shadow-lg shadow-[#75c32c]/20"
            >
              Keep Going
            </button>
            <button
              onClick={() => window.history.back()}
              className="w-full py-3.5 text-red-500 font-black text-sm transition-colors hover:text-red-600"
            >
              Quit
            </button>
          </div>
        </div>
      </div>
    )}
  </>);
}
