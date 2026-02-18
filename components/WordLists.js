"use client";

import Link from "next/link";
import RemoveListBtn from "./RemoveListBtn";
import { HiPencilAlt, HiOutlineEye } from "react-icons/hi";
import { useState, useEffect } from "react";
import apiConfig from "@utils/apiUrlConfig";

export default function WordLists({ createdBy }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data for Dashboard display
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${apiConfig.apiUrl}/list/user/${createdBy}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch lists");
        }

        const data = await response.json();
        setData(data.lists);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (createdBy !== undefined) fetchData();
  }, [createdBy]);

  return (
    <div className="p-4">
      {isLoading && (
        <p className="text-center text-gray-500">Fetching Your Lists ...</p>
      )}
      {error && (
        <p className="text-center text-red-500">Failed to Load Your Lists</p>
      )}

      {/* Show lists if data is found */}
      {data.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600 mb-3">{item.description}</p>
                <p className="text-sm text-gray-500">
                  {item.words.length} Words
                </p>
              </div>

              <div className="flex items-center justify-end gap-4 mt-4 text-gray-600">
                <Link
                  href={`/lists/${item._id}`}
                  className="hover:text-blue-600 transition-colors"
                  title="View List"
                >
                  <HiOutlineEye size={22} />
                </Link>
                <Link
                  href={`/lists/editList/${item._id}`}
                  className="hover:text-green-600 transition-colors"
                  title="Edit List"
                >
                  <HiPencilAlt size={22} />
                </Link>
                <RemoveListBtn id={item._id} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* If loading finished and no lists */}
      {!isLoading && data.length === 0 && (
        <p className="text-center text-gray-500 mt-6">
          No Lists Found. Create Your Lists and Start Learning!
        </p>
      )}
    </div>
  );
}
