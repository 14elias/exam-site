import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function Exam() {
  const { id } = useParams(); // This is the Attempt ID
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [timer, setTimer] = useState(0);
  const [answers, setAnswers] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const res = await api.get(`/exam/exam/${id}/questions/`);
      setData(res.data);
      setTimer(res.data.remaining_seconds);
      
      const saved = {};
      res.data.questions.forEach(q => {
        saved[q.id] = q.current_answer.choice_id;
      });
      setAnswers(saved);
    } catch (err) {
      console.error("Fetch error", err);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Timer logic
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          submitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const saveAnswer = async (questionId, choiceId) => {
    setAnswers({ ...answers, [questionId]: choiceId });
    await api.post(`/exam/exam/${id}/answer/`, {
      question_id: questionId,
      choice_id: choiceId
    });
  };

  const submitExam = async () => {
    await api.post(`/exam/exam/${id}/submit/`);
    navigate("/dashbord");
    alert("Exam Submitted Successfully!");
  };

  if (!data) return <div className="p-10 text-center">Loading Exam...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="sticky top-0 bg-white z-10 pb-4 border-b flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{data.exam_title}</h1>
          <p className="text-sm text-red-500 font-mono">Time Remaining: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</p>
        </div>
        <Button variant="destructive" onClick={submitExam}>Finish Exam</Button>
      </div>

      <Progress value={(timer / (data.remaining_seconds || 1)) * 100} className="h-2" />

      {data.questions.map((q, idx) => (
        <Card key={q.id} className="shadow-sm">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-medium">{idx + 1}. {q.text}</h3>
            <div className="grid gap-3">
              {q.choices.map((c) => (
                <label key={c.id} className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${answers[q.id] === c.id ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                  <input
                    type="radio"
                    name={`q-${q.id}`}
                    className="hidden"
                    checked={answers[q.id] === c.id}
                    onChange={() => saveAnswer(q.id, c.id)}
                  />
                  <span className="ml-2 text-sm">{c.text}</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}