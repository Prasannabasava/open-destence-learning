
"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Quiz {
  quiz_id: string;
  course_id: string;
  question: string;
  options: string; // JSON string of options
  correct: number;
  created_by: string;
  created_at: string;
}

interface QuizManagementProps {
  courseId: string;
  courseTitle: string;
}

const QuizManagement: React.FC<QuizManagementProps> = ({ courseId, courseTitle }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const { toast } = useToast();

  // State for new quiz form
  const [newQuiz, setNewQuiz] = useState({
    question: "",
    options: ["", "", "", ""], // Four options by default
    correct: 0,
  });

  // Fetch quizzes for the course
  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const accesstoken = localStorage.getItem("accesstoken");

      if (!token || !accesstoken) {
        throw new Error("Missing authentication tokens");
      }

      const response = await fetch("http://localhost:5000/quiz/getquizforcompletecourse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          accesstoken,
          course_id: courseId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setQuizzes(data.quizzes || []);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to fetch quizzes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast({
        title: "Error",
        description: "Failed to fetch quizzes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new quiz
  const createQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const accesstoken = localStorage.getItem("accesstoken");

      if (!token || !accesstoken) {
        throw new Error("Missing authentication tokens");
      }

      if (!newQuiz.question || newQuiz.options.some((opt) => !opt) || newQuiz.correct < 0 || newQuiz.correct >= newQuiz.options.length) {
        toast({
          title: "Validation Error",
          description: "Please fill all fields and select a valid correct option",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch("http://localhost:5000/quiz/generateQuizzesAfterCourseComplete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          accesstoken,
          course_id: courseId,
          question: newQuiz.question,
          options: JSON.stringify(newQuiz.options),
          correct: newQuiz.correct,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: data.message || "Quiz created successfully",
        });
        setCreateDialogOpen(false);
        setNewQuiz({ question: "", options: ["", "", "", ""], correct: 0 });
        await fetchQuizzes(); // Refresh quiz list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to create quiz",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to create quiz",
        variant: "destructive",
      });
    }
  };

  // View quiz details
  const viewQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setViewDialogOpen(true);
  };

  // Parse options from JSON string
  const parseOptions = (optionsString: string): string[] => {
    try {
      return JSON.parse(optionsString);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchQuizzes();
    }
  }, [courseId]);

  return (
    <div className="space-y-4 p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold">Quiz Questions</h3>
          <p className="text-sm text-gray-600">Course: {courseTitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {quizzes.length} question{quizzes.length !== 1 ? "s" : ""}
          </Badge>
          <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Quiz
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : quizzes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Plus className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quiz questions yet</h3>
            <p className="text-gray-500 text-center">Create your first quiz question for this course.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {quizzes.map((quiz, index) => (
            <Card key={quiz.quiz_id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-2">Question {index + 1}</h4>
                    <p className="text-sm sm:text-base text-gray-700 line-clamp-2 mb-3">{quiz.question}</p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <span>Created: {new Date(quiz.created_at).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{parseOptions(quiz.options).length} options</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => viewQuiz(quiz)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        console.log("Edit quiz:", quiz.quiz_id); // Placeholder for edit
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        console.log("Delete quiz:", quiz.quiz_id); // Placeholder for delete
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* View Quiz Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Quiz Question Details</DialogTitle>
          </DialogHeader>
          {selectedQuiz && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Question:</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedQuiz.question}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Answer Options:</h4>
                <div className="space-y-2">
                  {parseOptions(selectedQuiz.options).map((option, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        index === selectedQuiz.correct
                          ? "bg-green-50 border-green-200 text-green-800"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {index === selectedQuiz.correct && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Correct Answer
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs sm:text-sm text-gray-500 pt-2 border-t">
                <p>Created: {new Date(selectedQuiz.created_at).toLocaleString()}</p>
                <p>Quiz ID: {selectedQuiz.quiz_id}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Quiz Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Quiz Question</DialogTitle>
          </DialogHeader>
          <form onSubmit={createQuiz} className="space-y-4">
            <div>
              <Label htmlFor="question" className="text-sm sm:text-base">Question</Label>
              <Input
                id="question"
                value={newQuiz.question}
                onChange={(e) => setNewQuiz({ ...newQuiz, question: e.target.value })}
                placeholder="Enter quiz question"
                className="text-sm sm:text-base"
                required
              />
            </div>
            {newQuiz.options.map((option, index) => (
              <div key={index}>
                <Label htmlFor={`option-${index}`} className="text-sm sm:text-base">Option {index + 1}</Label>
                <Input
                  id={`option-${index}`}
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...newQuiz.options];
                    updatedOptions[index] = e.target.value;
                    setNewQuiz({ ...newQuiz, options: updatedOptions });
                  }}
                  placeholder={`Enter option ${index + 1}`}
                  className="text-sm sm:text-base"
                  required
                />
              </div>
            ))}
            <div>
              <Label htmlFor="correct" className="text-sm sm:text-base">Correct Option</Label>
              <select
                id="correct"
                value={newQuiz.correct}
                onChange={(e) => setNewQuiz({ ...newQuiz, correct: parseInt(e.target.value) })}
                className="w-full border rounded-lg p-2 text-sm sm:text-base"
                required
              >
                {newQuiz.options.map((_, index) => (
                  <option key={index} value={index}>
                    Option {index + 1}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="w-full text-sm sm:text-base">Create Quiz</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuizManagement;
