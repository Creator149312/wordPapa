"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Trash2,
  Download,
  Upload,
  Loader2,
  Check,
  AlertCircle,
  Edit2
} from "lucide-react";
import toast from "react-hot-toast";
import apiConfig from "@utils/apiUrlConfig";
import {
  exportTemplatesAsCSV,
  importTemplatesFromCSV,
  downloadFile,
  readFileAsText
} from "@utils/excelUtils";

export default function TemplateManager() {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isBulking, setIsBulking] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState(new Set());
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    context: "",
    wordCount: 15,
    level: "beginner",
    rank: "",
    node: "",
    category: ""
  });

  // Fetch templates
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiConfig.apiUrl}/admin/list-templates`);
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      toast.error("Failed to fetch templates");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTemplate = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.context) {
      toast.error("Title and Context are required");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch(`${apiConfig.apiUrl}/admin/list-templates`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (response.ok) {
        setTemplates([data, ...templates]);
        setFormData({
          title: "",
          description: "",
          context: "",
          wordCount: 15,
          level: "beginner",
          rank: "",
          node: "",
          category: ""
        });
        setShowForm(false);
        toast.success("Template created successfully");
      } else {
        toast.error(data.error || "Failed to create template");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm("Delete this template?")) return;

    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/admin/list-templates?id=${id}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setTemplates(templates.filter(t => t._id !== id));
        toast.success("Template deleted");
      } else {
        toast.error("Failed to delete template");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleBulkCreate = async () => {
    if (selectedTemplates.size === 0) {
      toast.error("Select at least one template");
      return;
    }

    if (!confirm(`Create lists from ${selectedTemplates.size} template(s)?`)) {
      return;
    }

    setIsBulking(true);
    try {
      const response = await fetch(
        `${apiConfig.apiUrl}/admin/bulk-create-from-templates`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateIds: Array.from(selectedTemplates)
          })
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success(
          `Created ${data.successCount} lists, ${data.failedCount} failed`
        );
        setSelectedTemplates(new Set());
        fetchTemplates();
      } else {
        toast.error(data.error || "Bulk creation failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsBulking(false);
    }
  };

  const handleExportCSV = () => {
    const csv = exportTemplatesAsCSV(templates);
    downloadFile(csv, "list-templates.csv");
    toast.success("Exported to CSV");
  };

  const handleImportCSV = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await readFileAsText(file);
      const importedTemplates = importTemplatesFromCSV(text);

      // Add each template
      for (const template of importedTemplates) {
        await fetch(`${apiConfig.apiUrl}/admin/list-templates`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template)
        });
      }

      toast.success(`Imported ${importedTemplates.length} templates`);
      fetchTemplates();
    } catch (error) {
      toast.error(`Import failed: ${error.message}`);
    }

    // Reset input
    e.target.value = "";
  };

  const toggleTemplate = (id) => {
    const newSelected = new Set(selectedTemplates);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTemplates(newSelected);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            List Templates
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {templates.length} templates • {selectedTemplates.size} selected
          </p>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </Button>

          <label className="cursor-pointer">
            <Button
              as="span"
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import CSV
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>

          <Button
            onClick={handleBulkCreate}
            disabled={selectedTemplates.size === 0 || isBulking}
            className="bg-[#75c32c] hover:bg-[#75c32c]/90 flex items-center gap-2"
          >
            {isBulking ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Create Lists ({selectedTemplates.size})
          </Button>

          <Button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-6">
          <form onSubmit={handleAddTemplate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="List Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
              <Input
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <Input
                placeholder="Context (e.g., 'fruits and vegetables')"
                value={formData.context}
                onChange={(e) =>
                  setFormData({ ...formData, context: e.target.value })
                }
                required
              />
              <Input
                type="number"
                placeholder="Word Count"
                min="1"
                max="100"
                value={formData.wordCount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    wordCount: parseInt(e.target.value)
                  })
                }
              />
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="elementary">Elementary</option>
                <option value="intermediate">Intermediate</option>
                <option value="upper-intermediate">Upper Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="mastery">Mastery</option>
              </select>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Rank (1-8)"
                  min="1"
                  max="8"
                  value={formData.rank}
                  onChange={(e) =>
                    setFormData({ ...formData, rank: e.target.value })
                  }
                />
                <Input
                  type="number"
                  placeholder="Node (1-5)"
                  min="1"
                  max="5"
                  value={formData.node}
                  onChange={(e) =>
                    setFormData({ ...formData, node: e.target.value })
                  }
                />
              </div>
              <Input
                placeholder="Category (optional)"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-[#75c32c] hover:bg-[#75c32c]/90"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Template"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Templates List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#75c32c]" />
        </div>
      ) : templates.length === 0 ? (
        <Card className="p-8 text-center">
          <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600 dark:text-gray-400">
            No templates yet. Create one to get started.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {templates.map((template) => (
            <Card
              key={template._id}
              className={`p-4 flex items-start gap-4 cursor-pointer transition-all ${
                selectedTemplates.has(template._id)
                  ? "border-[#75c32c] bg-[#75c32c]/5"
                  : ""
              }`}
              onClick={() => toggleTemplate(template._id)}
            >
              <input
                type="checkbox"
                checked={selectedTemplates.has(template._id)}
                onChange={() => {}}
                className="mt-1"
              />

              <div className="flex-1">
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {template.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {template.context}
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded text-blue-900 dark:text-blue-100">
                    {template.wordCount} words
                  </span>
                  <span className="text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded text-green-900 dark:text-green-100">
                    {template.level}
                  </span>
                  {template.rank && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded text-purple-900 dark:text-purple-100">
                      Rank {template.rank}
                    </span>
                  )}
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      template.status === "created"
                        ? "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100"
                        : template.status === "failed"
                        ? "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100"
                        : "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100"
                    }`}
                  >
                    {template.status}
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteTemplate(template._id);
                }}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
