"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import apiConfig from "@utils/apiUrlConfig";
import { infantLevelLists } from "@data/infantLevelLists";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { isAdminEmail } from "@utils/isAdminEmail";

export default function SeedInfantLists() {
  const { status, data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [isComplete, setIsComplete] = useState(false);

  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "authenticated" && !isAdminEmail(session?.user?.email)) {
    redirect("/");
  }

  const handleSeedLists = async () => {
    setIsLoading(true);
    setResults([]);
    setIsComplete(false);

    try {
      let successCount = 0;
      let skipCount = 0;
      const newResults = [];

      for (const listData of infantLevelLists) {
        try {
          const response = await fetch(`${apiConfig.apiUrl}/list/bulk-create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: listData.title,
              description: listData.description,
              words: listData.words,
              createdBy: "admin@wordpapa.com",
              topic: listData.topic,
              difficulty: listData.difficulty
            })
          });

          const data = await response.json();

          if (response.ok) {
            successCount++;
            newResults.push({
              title: listData.title,
              status: "success",
              message: `Created with ${data.enrichedCount}/${listData.words.length} words enriched`
            });
          } else {
            if (data.error?.includes("already exists")) {
              skipCount++;
              newResults.push({
                title: listData.title,
                status: "skip",
                message: "Already exists"
              });
            } else {
              newResults.push({
                title: listData.title,
                status: "error",
                message: data.error || "Unknown error"
              });
            }
          }
        } catch (error) {
          newResults.push({
            title: listData.title,
            status: "error",
            message: error.message
          });
        }
      }

      setResults(newResults);
      setIsComplete(true);

      const message = `Seeding complete: ${successCount} created, ${skipCount} skipped`;
      toast.success(message);
      console.log(message);
    } catch (error) {
      console.error("Error seeding lists:", error);
      toast.error("Error seeding lists");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            🌱 Seed Infant Level Lists
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Create all 10 word lists for the Infant level in one click
          </p>
        </div>

        <Card className="p-8 mb-8">
          <div className="space-y-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">10</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Lists</div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">155</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Total Words</div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">1</div>
                <div className="text-xs text-slate-600 dark:text-slate-400">Rank</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-bold text-slate-900 dark:text-white mb-3">Lists to create:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {infantLevelLists.map((list, idx) => (
                  <div key={idx} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-[#75c32c]">✓</span>
                    {list.title} ({list.words.length} words)
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Button
            onClick={handleSeedLists}
            disabled={isLoading || isComplete}
            className="w-full bg-[#75c32c] hover:bg-[#75c32c]/90 h-12 text-lg font-bold"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Lists...
              </>
            ) : isComplete ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Start Seeding
              </>
            )}
          </Button>
        </Card>

        {/* Results */}
        {results.length > 0 && (
          <Card className="p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              📊 Seeding Results
            </h2>
            <div className="space-y-3">
              {results.map((result, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border flex items-start gap-3 ${
                    result.status === "success"
                      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      : result.status === "skip"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                  }`}
                >
                  <div>
                    {result.status === "success" ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    ) : result.status === "skip" ? (
                      <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    )}
                  </div>
                  <div>
                    <div className={`font-bold ${
                      result.status === "success"
                        ? "text-green-900 dark:text-green-100"
                        : result.status === "skip"
                        ? "text-yellow-900 dark:text-yellow-100"
                        : "text-red-900 dark:text-red-100"
                    }`}>
                      {result.title}
                    </div>
                    <div className={`text-sm ${
                      result.status === "success"
                        ? "text-green-700 dark:text-green-300"
                        : result.status === "skip"
                        ? "text-yellow-700 dark:text-yellow-300"
                        : "text-red-700 dark:text-red-300"
                    }`}>
                      {result.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
