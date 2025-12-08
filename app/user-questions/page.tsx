/** @format */
"use client";

import { Button } from "@/components/ui/button";
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
  });
  const [newQuestion, setNewQuestion] = useState("");

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
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!selectedQuestion) return;

    try {
      await updateQuestion({
        id: selectedQuestion._id,
        data: editForm,
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
    setIsCreateModalOpen(true);
  };

  const handleCreateSave = async () => {
    if (!newQuestion.trim()) return;

    try {
      await createQuestion({
        question: newQuestion,
      }).unwrap();

      setIsCreateModalOpen(false);
      setNewQuestion("");
    } catch (error) {
      console.error("Failed to create question:", error);
    }
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
    setNewQuestion("");
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
                    <p className="text-gray-800 text-base">
                      {question.question}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
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
            <div className="p-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Question
                </label>
                <Textarea
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="min-h-[120px] resize-none"
                  placeholder="Enter your question here..."
                />
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
