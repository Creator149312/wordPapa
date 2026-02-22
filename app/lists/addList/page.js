"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import apiConfig from "@utils/apiUrlConfig";
import { validateListTitle } from "@utils/Validator";
import { slugify } from "@utils/slugify"; // Import our new utility
import toast from "react-hot-toast";
import { PlusCircle, Loader2, Sparkles } from "lucide-react";

export default function AddList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [words, setWords] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    // Check session
    if (!session?.user?.email) {
      toast.error("Please sign in to create a list.");
      return;
    }

    setError("");
    setIsLoading(true);

    const vlt = validateListTitle(title);
    if (!title || vlt) {
      setError(vlt || "Title is required.");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${apiConfig.apiUrl}/list`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          words,
          createdBy: session.user.email,
        }),
      });

      const resObj = await res.json();

      if (res.ok && !resObj?.error) {
        toast.success("List forged successfully! ✨");

        // Use our new URL structure: /lists/slug-id
        const newSlug = slugify(title);
        const newListId = resObj.id || resObj.list?._id; // Ensure your backend returns the new ID

        // Refresh the dashboard and explore page data
        router.refresh();

        // Redirect directly to the new list
        router.push(`/lists/${newSlug}-${newListId}`);
      } else {
        const errMsg = resObj?.error || "Failed to create list";
        toast.error(errMsg);
        setError(errMsg);
      }
    } catch (err) {
      setError("Network error. Please try again.");
      toast.error("Network error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-[#75c32c]/10 rounded-2xl">
          <PlusCircle className="text-[#75c32c]" size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Create <span className="text-[#75c32c]">List</span>
          </h1>
          <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            New Vocabulary Collection
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-[#75c32c]/5 rounded-[2.5rem] p-8 space-y-6"
      >
        {/* Title Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
            List Title <span className="text-[#75c32c]">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full bg-gray-50 dark:bg-white/5 border-2 rounded-2xl px-5 py-4 font-bold focus:outline-none transition-all ${
              error
                ? "border-red-500/50"
                : "border-transparent focus:border-[#75c32c] dark:text-white"
            }`}
            type="text"
            placeholder="e.g., GRE High Frequency"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 px-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-gray-50 dark:bg-white/5 border-2 border-transparent focus:border-[#75c32c] rounded-2xl px-5 py-4 font-medium focus:outline-none dark:text-white transition-all resize-none"
            placeholder="What is this list about?"
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-wider rounded-xl animate-shake">
            <Sparkles size={14} /> {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full relative overflow-hidden bg-[#75c32c] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-[#75c32c]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} />
              <span>Creating...</span>
            </div>
          ) : (
            "Forge List"
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">
        Wordpapa Engine v3.0 • Fast-Track Learning
      </p>
    </div>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import apiConfig from "@utils/apiUrlConfig";
// import { validateListTitle } from "@utils/Validator";
// import toast from "react-hot-toast";

// export default function AddList() {
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const createdBy = useSession().data?.user?.email;
//   const router = useRouter();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     if (!title) {
//       setError("Title is required.");
//       setIsLoading(false);
//       return;
//     }

//     const vlt = validateListTitle(title);
//     if (vlt) {
//       setError(vlt);
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const res = await fetch(`${apiConfig.apiUrl}/list`, {
//         method: "POST",
//         headers: { "Content-type": "application/json" },
//         body: JSON.stringify({ title, description, createdBy }),
//       });

//       const resObj = await res.json();
//       if (resObj?.error) {
//         toast.error("Failed to create list");
//         setError("Failed to create list");
//       } else {
//         router.push("/dashboard");
//       }
//     } catch (err) {
//       setError("Error creating list");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">
//         Create a New List
//       </h1>

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 space-y-4"
//       >
//         <div>
//           <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
//             List Title <span className="text-red-500">*</span>
//           </label>
//           <input
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-100"
//             type="text"
//             placeholder="Enter a title for your list"
//           />
//         </div>

//         <div>
//           <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
//             Description (optional)
//           </label>
//           <input
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200 dark:bg-gray-800 dark:text-gray-100"
//             type="text"
//             placeholder="Brief description of your list"
//           />
//         </div>

//         {error && <p className="text-red-500 dark:text-red-400 text-sm">{error}</p>}

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 rounded-md shadow hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
//         >
//           {isLoading ? "Creating..." : "Create List"}
//         </button>
//       </form>
//     </div>
//   );
// }
