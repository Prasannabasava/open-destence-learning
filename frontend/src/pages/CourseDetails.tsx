import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";

interface Video {
  video_id: number;
  video_title: string;
  video_url: string;
}

interface Topic {
  topic_id: number;
  topic_title: string;
  videos: Video[];
}

interface Module {
  module_id: number;
  module_name: string;
  topics: Topic[];
}

interface Course {
  course_id: number;
  course_title: string;
  course_description: string;
  modules: Module[];
}

interface QuizQuestion {
  quiz_id: number;
  question: string;
  options: string[];
  correct: number;
  topic_id: number;
  course_id: number;
}

interface QuizScore {
  quiz_id: number;
  score: number;
}

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizModuleId, setQuizModuleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const accesstoken = localStorage.getItem("accesstoken");

        if (!token || !accesstoken) {
          setError("Authentication required. Please log in.");
          navigate("/login");
          return;
        }

        const response = await axios.post(
          "http://localhost:5000/courses/viewcoursedetails",
          {
            token,
            accesstoken,
            course_id: courseId,
          },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success) {
          setCourse(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch course details");
        }
      } catch (err: AxiosError | any) {
        console.error("Fetch Error:", err);
        const message =
          err.response?.data?.message || "Error fetching course details";
        setError(message);
        if (
          message.includes("Invalid user token") ||
          message.includes("Authorization")
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId, navigate]);

  const startQuiz = (moduleId: number) => {
    setQuizModuleId(moduleId);
  };

  if (loading) return <p className="text-center mt-4">Loading course details...</p>;
  if (error) return <p className="text-center text-red-500 mt-4">{error}</p>;
  if (!course) return <p className="text-center mt-4">No course data available</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{course.course_title}</h2>
      <p className="text-gray-600 mb-4">{course.course_description}</p>

      {course.modules.map((mod) => (
        <div key={mod.module_id} className="mb-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-2">{mod.module_name}</h3>

          {mod.topics.map((topic) => (
            <div key={topic.topic_id} className="ml-4 mb-4">
              <h4 className="font-medium text-gray-800">{topic.topic_title}</h4>

              <ul className="ml-6 list-disc text-sm text-gray-700">
                {topic.videos.length > 0 ? (
                  topic.videos.map((video) => (
                    <li key={video.video_id}>
                      <button
                        onClick={() =>
                          navigate("/play-video", {
                            state: {
                              videoUrl: video.video_url,
                              videoTitle: video.video_title,
                              course_id: course.course_id,
                              module_id: mod.module_id,
                              topic_id: topic.topic_id,
                              video_id: video.video_id,
                            },
                          })
                        }
                        className="text-blue-500 underline hover:text-blue-700"
                      >
                        {video.video_title}
                      </button>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-400 italic">No videos</li>
                )}
              </ul>
            </div>
          ))}

          <button
            onClick={() => startQuiz(mod.module_id)}
            className="ml-4 mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Take Quiz
          </button>
        </div>
      ))}

      {quizModuleId && (
        <QuizComponent
          moduleId={quizModuleId}
          onClose={() => setQuizModuleId(null)}
          token={localStorage.getItem("token") || ""}
          accesstoken={localStorage.getItem("accesstoken") || ""}
        />
      )}

      {/* Back Button */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
        >
          Back
        </button>
      </div>
    </div>
  );
};

const QuizComponent: React.FC<{
  moduleId: number;
  onClose: () => void;
  token: string;
  accesstoken: string;
}> = ({ moduleId, onClose, token, accesstoken }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [scoreSaved, setScoreSaved] = useState<boolean>(false);
  const [scoreError, setScoreError] = useState<string | null>(null);
  const [alreadyTaken, setAlreadyTaken] = useState<boolean>(false);
  const [existingScores, setExistingScores] = useState<QuizScore[]>([]);
  const navigate = useNavigate();

  // Fetch quiz and check if already taken on mount
  useEffect(() => {
    const fetchQuestionsAndScores = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!token || !accesstoken) {
          setError("Authentication required. Please log in.");
          navigate("/login");
          return;
        }

        // Fetch quiz questions
        const response = await axios.post(
          "http://localhost:5000/enroll/getquiz",
          { token, accesstoken, module_id: moduleId },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.success && response.data.quizzes) {
          setQuestions(response.data.quizzes);

          // Collect quiz_ids for score check
          const quizIds = response.data.quizzes.map((q: QuizQuestion) => q.quiz_id);
          // Check if quiz is already taken for all
          if (quizIds.length > 0) {
            const scoreRes = await axios.post(
              "http://localhost:5000/enroll/getscore",
              { token, accesstoken, quiz_ids: quizIds },
              { headers: { "Content-Type": "application/json" } }
            );
            if (
              scoreRes.data.success &&
              Array.isArray(scoreRes.data.scores) &&
              scoreRes.data.scores.length === quizIds.length &&
              scoreRes.data.scores.every((s: QuizScore) => typeof s.score === "number")
            ) {
              setAlreadyTaken(true);
              setExistingScores(scoreRes.data.scores);
              // Calculate overall score percent
              const total = scoreRes.data.scores.reduce((acc: number, s: QuizScore) => acc + (s.score || 0), 0);
              setScore((total / quizIds.length) * 100);
            } else {
              setAlreadyTaken(false);
              setExistingScores(scoreRes.data.scores || []);
            }
          } else {
            setAlreadyTaken(false);
            setExistingScores([]);
          }
        } else {
          setQuestions([]);
          setError(response.data.message || "Failed to fetch quiz questions.");
        }
      } catch (err: AxiosError | any) {
        console.error("Quiz/Score Fetch Error:", err);
        const message =
          err.response?.data?.message ||
          "An error occurred while fetching quiz questions.";
        setError(message);
        if (
          message.includes("Invalid user token") ||
          message.includes("Authorization")
        ) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionsAndScores();
  }, [moduleId, token, accesstoken, navigate]);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  // Save the score for all quizzes in this module
  const submitQuiz = async () => {
    // Only allow if not already taken
    if (alreadyTaken) return;

    let correctCount = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.correct) {
        correctCount++;
      }
    });
    const quizScore = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;
    setScore(quizScore);

    setScoreError(null);
    setScoreSaved(false);

    try {
      for (let i = 0; i < questions.length; i++) {
        const quiz_id = questions[i].quiz_id;
        if (!quiz_id) continue;
        await axios.post(
          "http://localhost:5000/enroll/savescore",
          {
            token,
            accesstoken,
            quiz_id,
            score: answers[i] === questions[i].correct ? 1 : 0,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      setScoreSaved(true);
      setAlreadyTaken(true);
    } catch (err: any) {
      setScoreError(
        err.response?.data?.message ||
          err.message ||
          "Failed to save your quiz score."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl sm:max-w-lg md:max-w-xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Module Quiz</h2>
        {loading ? (
          <p className="text-center text-gray-600">Loading questions...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : questions.length > 0 ? (
          alreadyTaken ? (
            <>
              <p className="text-xl text-center font-semibold text-blue-700 mb-4">
                You have already taken this quiz.
              </p>
              <ul>
                {questions.map((q, idx) => {
                  const scoreObj = existingScores.find((s) => s.quiz_id === q.quiz_id);
                  return (
                    <li key={q.quiz_id} className="mb-2">
                      <span className="font-medium">{q.question}</span>
                      <span className="ml-2 text-sm text-gray-500">
                        {scoreObj
                          ? scoreObj.score === 1
                            ? "Correct"
                            : "Incorrect"
                          : "Not answered"}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-center text-lg font-bold text-green-700">
                Your Score: {score !== null ? score.toFixed(1) : "0"}%
              </p>
              <button
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 mt-4"
              >
                Close
              </button>
            </>
          ) : (
            <>
              {questions.map((q, index) => (
                <div key={q.quiz_id || index} className="mb-6">
                  <p className="text-lg font-semibold text-gray-800">{q.question}</p>
                  <div className="mt-2 space-y-2">
                    {q.options.map((option, optIndex) => (
                      <label key={optIndex} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`question-${index}`}
                          checked={answers[index] === optIndex}
                          onChange={() => handleAnswer(index, optIndex)}
                          className="form-radio text-indigo-600"
                          disabled={score !== null}
                        />
                        <span className="text-gray-600">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <button
                  onClick={submitQuiz}
                  disabled={
                    alreadyTaken ||
                    Object.keys(answers).length < questions.length ||
                    score !== null
                  }
                  className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
                >
                  Submit Quiz
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
              {score !== null && (
                <p className="mt-4 text-center text-lg font-semibold text-gray-800">
                  Your Score: {score.toFixed(1)}%
                </p>
              )}
              {scoreSaved && (
                <p className="mt-2 text-green-600 text-center">
                  Your score has been saved!
                </p>
              )}
              {scoreError && (
                <p className="mt-2 text-red-600 text-center">{scoreError}</p>
              )}
            </>
          )
        ) : (
          <p className="text-center text-gray-600">
            No quiz questions available for this module.
          </p>
        )}
      </div>
    </div>
  );
};
export default CourseDetails;