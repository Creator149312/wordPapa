import apiConfig from "@utils/apiUrlConfig";
import { validateObjectID } from "@utils/Validator";
import ListClientWrapper from "./ListClientWrapper";

export async function generateMetadata({ params }) {
  const id = params.listid;
  if (!validateObjectID(id)) return { title: "Invalid List | WordPapa" };

  try {
    const res = await fetch(`${apiConfig.apiUrl}/list/${id}`);
    const data = await res.json();
    return {
      title: `${data.list.title} | WordPapa Learning`,
      description: `Master ${data.list.words.length} words from this collection.`,
    };
  } catch {
    return { title: "List Not Found | WordPapa" };
  }
}

export default async function Page({ params }) {
  const id = params.listid;
  let wordsList = null;
  let error = null;

  if (validateObjectID(id)) {
    try {
      const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        wordsList = data.list;
      } else {
        error = "Failed to fetch list";
      }
    } catch (err) {
      error = err.message;
    }
  } else {
    error = "Invalid ID";
  }

  return <ListClientWrapper wordsList={wordsList} listerror={error} />;
}

// import ListDisplay from "@components/ListDisplay";
// import apiConfig from "@utils/apiUrlConfig";
// import { validateObjectID } from "@utils/Validator";
// import { ChevronLeft, AlertCircle } from "lucide-react";
// import Link from "next/link";

// export async function generateMetadata({ params }) {
//   let listdata = null;
//   const id = params.listid;

//   if (validateObjectID(id)) {
//     try {
//       const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
//         cache: "no-store",
//       });
//       if (response.ok) {
//         listdata = (await response.json()).list;
//       }
//     } catch (error) {
//       console.error("Metadata fetch error:", error);
//     }
//   }

//   if (listdata) {
//     return {
//       title: `${listdata.title} | WordPapa Learning`,
//       description: `Master ${listdata.words.length} words from the "${listdata.title}" collection.`,
//     };
//   }
//   return { title: "List Not Found | WordPapa" };
// }

// export default async function Page({ params }) {
//   let wordsList = null;
//   let listerror = null;
//   const id = params.listid;

//   if (validateObjectID(id)) {
//     try {
//       const response = await fetch(`${apiConfig.apiUrl}/list/${id}`, {
//         cache: "no-store",
//       });
//       if (!response.ok) throw new Error("Failed to fetch list");
//       const data = await response.json();
//       wordsList = data.list;
//     } catch (error) {
//       listerror = error;
//     }
//   } else {
//     listerror = { message: "Invalid ID" };
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
//       <div className="mx-auto px-4 sm:px-6 py-8 max-w-4xl">
        
//         {/* Navigation Header */}
//         <header className="mb-8 flex items-center justify-between">
//           <Link
//             href="/dashboard"
//             className="group flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#75c32c] transition-colors"
//           >
//             <div className="p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm group-hover:shadow-[#75c32c]/20 border border-gray-100 dark:border-gray-800">
//               <ChevronLeft size={18} />
//             </div>
//             Back to Dashboard
//           </Link>
          
//           <div className="hidden sm:block">
//              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#75c32c] bg-[#75c32c]/10 px-3 py-1 rounded-full">
//                Collection Mode
//              </span>
//           </div>
//         </header>

//         {/* Main Content Area */}
//         <main className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//           {wordsList && !listerror ? (
//             <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-[#75c32c]/5 border border-white dark:border-gray-800">
//               <div className="bg-white dark:bg-gray-900 rounded-[2.2rem] overflow-hidden">
//                 <ListDisplay
//                   title={wordsList.title}
//                   description={wordsList.description}
//                   words={wordsList.words}
//                 />
//               </div>
//             </div>
//           ) : (
//             /* Enhanced Error State */
//             <div className="max-w-md mx-auto mt-20 text-center space-y-6">
//               <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
//                 <AlertCircle size={40} />
//               </div>
//               <div className="space-y-2">
//                 <h2 className="text-2xl font-black text-gray-900 dark:text-white">
//                   List Not Found
//                 </h2>
//                 <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
//                   We can't find this collection. It may have been moved or deleted by the creator.
//                 </p>
//               </div>
//               <Link
//                 href="/dashboard"
//                 className="inline-block px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg"
//               >
//                 Return to Dashboard
//               </Link>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// }