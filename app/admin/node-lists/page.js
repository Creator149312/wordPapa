"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import { isAdminEmail } from "@utils/isAdminEmail";

export default function NodeListsAdminPage() {
  const { status, data: session } = useSession();
  const [selectedRank, setSelectedRank] = useState(1);
  const [selectedNode, setSelectedNode] = useState(1);
  const [availableLists, setAvailableLists] = useState([]);
  const [assignedLists, setAssignedLists] = useState([]);
  const [loading, setLoading] = useState(false);

  if (status === "unauthenticated") {
    redirect("/login");
  }

  if (status === "authenticated" && !isAdminEmail(session?.user?.email)) {
    redirect("/");
  }

  // Fetch all lists
  useEffect(() => {
    fetchAvailableLists();
  }, []);

  // Fetch assigned lists for selected node
  useEffect(() => {
    fetchAssignedLists();
  }, [selectedRank, selectedNode]);

  const fetchAvailableLists = async () => {
    try {
      const res = await fetch(`/api/list`);
      if (res.ok) {
        const { lists } = await res.json();
        setAvailableLists(lists || []);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
      toast.error("Failed to fetch available lists");
    }
  };

  const fetchAssignedLists = async () => {
    try {
      const res = await fetch(
        `/api/admin/node-lists?rank=${selectedRank}&node=${selectedNode}`
      );
      if (res.ok) {
        const { assignments } = await res.json();
        setAssignedLists(assignments || []);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const handleAssignList = async (listId) => {
    console.log("handleAssignList called with listId:", listId);
    
    if (assignedLists.some((a) => a.listId._id === listId)) {
      toast.error("This list is already assigned to this node");
      return;
    }

    setLoading(true);
    try {
      console.log("Sending POST request to assign list:", {
        rank: selectedRank,
        node: selectedNode,
        listId,
      });

      const res = await fetch(`/api/admin/node-lists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rank: selectedRank,
          node: selectedNode,
          listId,
        }),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok) {
        toast.success("List assigned successfully");
        await fetchAssignedLists();
        fetchAvailableLists(); // Refresh available lists too
      } else {
        toast.error(data.error || "Failed to assign list");
      }
    } catch (error) {
      console.error("Error assigning list:", error);
      toast.error("Error assigning list: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAssignment = async (assignmentId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/node-lists?assignmentId=${assignmentId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Assignment removed");
        fetchAssignedLists();
      } else {
        toast.error("Failed to remove assignment");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error removing assignment");
    } finally {
      setLoading(false);
    }
  };

  const getAssignedListIds = () =>
    assignedLists.map((a) => a.listId._id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            🎯 Assign Lists to Journey Nodes
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Select a rank and node, then assign lists for users to practice.
          </p>
        </div>

        {/* Node Selection */}
        <Card className="p-8 mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Select Journey Node
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Rank Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Rank
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((rank) => (
                  <button
                    key={rank}
                    onClick={() => setSelectedRank(rank)}
                    className={`py-2 px-3 rounded font-semibold transition ${
                      selectedRank === rank
                        ? "bg-blue-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {rank}
                  </button>
                ))}
              </div>
            </div>

            {/* Node Selection */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Node
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((node) => (
                  <button
                    key={node}
                    onClick={() => setSelectedNode(node)}
                    className={`py-2 px-3 rounded font-semibold transition ${
                      selectedNode === node
                        ? "bg-green-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-300 dark:hover:bg-slate-600"
                    }`}
                  >
                    {node}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-400">
            Selected: <strong>Rank {selectedRank}, Node {selectedNode}</strong>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Available Lists */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              📚 Available Lists ({availableLists.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableLists.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No lists created yet. Create lists using Bulk Creator first.
                </p>
              ) : (
                availableLists.map((list) => (
                  <div
                    key={list._id}
                    className={`p-3 rounded-lg border transition ${
                      getAssignedListIds().includes(list._id)
                        ? "bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                        : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                          {list.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          {list.words?.length || 0} words • by {list.createdBy}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          console.log("Button clicked for list:", list._id);
                          handleAssignList(list._id);
                        }}
                        disabled={
                          loading ||
                          getAssignedListIds().includes(list._id)
                        }
                        className={`ml-2 px-3 py-1 rounded text-xs font-semibold transition cursor-pointer ${
                          getAssignedListIds().includes(list._id)
                            ? "bg-green-600 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                      >
                        {getAssignedListIds().includes(list._id)
                          ? "✓ Assigned"
                          : "Assign"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Assigned Lists */}
          <Card className="p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              ✅ Assigned to Rank {selectedRank}, Node {selectedNode} (
              {assignedLists.length})
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {assignedLists.length === 0 ? (
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  No lists assigned to this node yet.
                </p>
              ) : (
                assignedLists.map((assignment) => (
                  <div
                    key={assignment._id}
                    className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-white text-sm">
                        {assignment.listId.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {assignment.listId.words?.length || 0} words
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleRemoveAssignment(assignment._id)
                      }
                      disabled={loading}
                      className="ml-2 px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-400 text-white rounded text-xs font-semibold transition"
                    >
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="p-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4">
            💡 How This Works
          </h3>
          <ol className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
            <li>
              <strong>1. Create Lists:</strong> Use the Bulk Creator to generate
              lists from CSV/Excel
            </li>
            <li>
              <strong>2. Assign to Nodes:</strong> Select a rank and node here,
              then assign lists
            </li>
            <li>
              <strong>3. User Practice:</strong> When users click on a node in
              their journey, they see assigned lists
            </li>
            <li>
              <strong>4. Progress Tracking:</strong> User progress on each list
              is tracked and shown on the node
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
