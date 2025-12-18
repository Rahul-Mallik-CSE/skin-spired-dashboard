/** @format */
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit2, Plus, X } from "lucide-react";
import React, { useState } from "react";
import {
  useGetAllQuestionsQuery,
  useUpdateQuestionMutation,
  useCreateQuestionMutation,
} from "@/redux/feature/userQuestionsAPI";
import Loading from "@/components/Loading";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

interface Question {
  _id: string;
  question: string;
  isVisible: boolean;
  option?: string[];
  updatedAt?: string;
}

const UserQuestionsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [editForm, setEditForm] = useState({
    question: "",
    isVisible: false,
    option: [] as string[],
  });
  const [newQuestion, setNewQuestion] = useState("");
  const [newOptions, setNewOptions] = useState<string[]>(["", ""]);

  const { data, isLoading } = useGetAllQuestionsQuery({
    page: 1,
    limit: 100,
  });

  const [updateQuestion, { isLoading: isUpdating }] =
    useUpdateQuestionMutation();
  const [createQuestion, { isLoading: isCreating }] =
    useCreateQuestionMutation();

  const questions: Question[] = data?.data?.result || [];

  const handleEditClick = (question: Question) => {
    setSelectedQuestion(question);
    setEditForm({
      question: question.question,
      isVisible: question.isVisible,
      option:
        question.option && question.option.length > 0
          ? question.option
          : ["", ""],
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedQuestion) return;

    try {
      // Filter out empty options
      const filteredOptions = editForm.option.filter(
        (opt) => opt.trim() !== ""
      );

      await updateQuestion({
        id: selectedQuestion._id,
        data: {
          question: editForm.question,
          isVisible: editForm.isVisible,
          option: filteredOptions,
        },
      }).unwrap();

      setIsModalOpen(false);
      setSelectedQuestion(null);
    } catch (error) {
      console.error("Failed to update question:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedQuestion(null);
  };

  const handleCreateClick = () => {
    setNewQuestion("");
    setNewOptions(["", ""]);
    setIsCreateModalOpen(true);
  };

  const handleCreateSave = async () => {
    if (!newQuestion.trim()) return;

    try {
      // Filter out empty options
      const filteredOptions = newOptions.filter((opt) => opt.trim() !== "");

      await createQuestion({
        question: newQuestion,
        option: filteredOptions,
      }).unwrap();

      setIsCreateModalOpen(false);
      setNewQuestion("");
      setNewOptions(["", ""]);
    } catch (error) {
      console.error("Failed to create question:", error);
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    setNewQuestion("");
    setNewOptions(["", ""]);
  };

  // Options management for edit modal
  const handleEditOptionChange = (index: number, value: string) => {
    const updatedOptions = [...editForm.option];
    updatedOptions[index] = value;
    setEditForm((prev) => ({ ...prev, option: updatedOptions }));
  };

  const addEditOption = () => {
    setEditForm((prev) => ({ ...prev, option: [...prev.option, ""] }));
  };

  const removeEditOption = (index: number) => {
    if (editForm.option.length <= 2) return; // Keep at least 2 options
    const updatedOptions = editForm.option.filter((_, i) => i !== index);
    setEditForm((prev) => ({ ...prev, option: updatedOptions }));
  };

  // Options management for create modal
  const handleNewOptionChange = (index: number, value: string) => {
    const updatedOptions = [...newOptions];
    updatedOptions[index] = value;
    setNewOptions(updatedOptions);
  };

  const addNewOption = () => {
    setNewOptions([...newOptions, ""]);
  };

  const removeNewOption = (index: number) => {
    if (newOptions.length <= 2) return; // Keep at least 2 options
    setNewOptions(newOptions.filter((_, i) => i !== index));
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <div className="overflow-hidden bg-white rounded-md mx-6 mt-12">
        <div className="flex justify-between items-center px-3 pb-6">
          <h2 className="text-3xl font-medium text-primary py-6 px-3">
            Questions List
          </h2>
          <Button
            onClick={handleCreateClick}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Questions
          </Button>
        </div>

        {/* questions section */}
        <div className="px-6 pb-6">
          <div className="space-y-3">
            {questions.length > 0 ? (
              questions.map((question) => (
                <div
                  key={question._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-gray-800 text-base font-medium">
                      {question.question}
                    </p>

                    {/* Display Options */}
                    {question.option && question.option.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {question.option.map((opt, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full"
                          >
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-3">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          question.isVisible
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {question.isVisible ? "Visible" : "Hidden"}
                      </span>
                      {question.updatedAt && (
                        <span className="text-xs text-gray-500">
                          Updated:{" "}
                          {new Date(question.updatedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(question)}
                    className="ml-4"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                No questions found
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isModalOpen && selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Edit Question
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Question Textarea */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <Textarea
                  value={editForm.question}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      question: e.target.value,
                    }))
                  }
                  className="min-h-[100px] resize-none"
                  placeholder="Enter question..."
                />
              </div>

              {/* Answer Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Answer Options
                  </label>
                  <Button
                    type="button"
                    onClick={addEditOption}
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {editForm.option.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleEditOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 text-gray-800"
                      />
                      {editForm.option.length > 2 && (
                        <Button
                          type="button"
                          onClick={() => removeEditOption(index)}
                          size="sm"
                          variant="outline"
                          className="h-10 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Visibility Switch */}
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Visibility
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    {editForm.isVisible
                      ? "Question is visible to users"
                      : "Question is hidden from users"}
                  </p>
                </div>
                <Switch
                  checked={editForm.isVisible}
                  onCheckedChange={(checked) =>
                    setEditForm((prev) => ({
                      ...prev,
                      isVisible: checked,
                    }))
                  }
                  className="data-[state=checked]:bg-[#45b1b4]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-white hover:opacity-90"
                disabled={isUpdating}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Create Question Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative w-full max-w-lg rounded-xl bg-white shadow-2xl mx-4">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Add New Question
              </h2>
              <button
                onClick={handleCreateCancel}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <Textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="min-h-[100px] resize-none"
                  placeholder="Enter your question here..."
                />
              </div>

              {/* Answer Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    Answer Options
                  </label>
                  <Button
                    type="button"
                    onClick={addNewOption}
                    size="sm"
                    variant="outline"
                    className="h-7 px-2"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="space-y-2">
                  {newOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) =>
                          handleNewOptionChange(index, e.target.value)
                        }
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 text-black"
                      />
                      {newOptions.length > 2 && (
                        <Button
                          type="button"
                          onClick={() => removeNewOption(index)}
                          size="sm"
                          variant="outline"
                          className="h-10 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <Button
                onClick={handleCreateCancel}
                variant="outline"
                className="flex-1"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateSave}
                className="flex-1 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 text-white hover:opacity-90"
                disabled={isCreating || !newQuestion.trim()}
              >
                {isCreating ? "Creating..." : "Create Question"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserQuestionsPage;
