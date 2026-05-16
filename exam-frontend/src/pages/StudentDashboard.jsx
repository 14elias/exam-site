import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get("/exam/exam/");
      setExams(res.data);
    } catch (err) {
      console.error("Failed to fetch exams", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (examId) => {
    try {
      const res = await api.post("/exam/exam/start/", { exam_id: examId });
      navigate(`/exam/${res.data.attempt_id}`);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to start exam");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return <Badge variant="default">In Progress</Badge>;
      case "SUBMITTED":
        return <Badge variant="secondary">Submitted</Badge>;
      case "AUTO_SUBMITTED":
        return <Badge variant="destructive">Auto-Submitted</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-4 border-b bg-background/70 backdrop-blur sticky top-0 z-50">
        <h1 className="text-xl font-bold">Student Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            Welcome, {user?.username}
          </span>
          <Button variant="outline" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6">Available Exams</h2>

        {loading ? (
          <div className="text-center py-20">Loading exams...</div>
        ) : exams.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No exams available at the moment.</p>
            <p className="text-sm">Check back later for new exams.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {exams.map((exam) => (
              <Card key={exam.id} className="hover:shadow-lg transition">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    {getStatusBadge(exam.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {exam.description || "No description provided."}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{exam.duration} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{exam.total_marks} marks</span>
                    </div>
                  </div>

                  {exam.status === "IN_PROGRESS" ? (
                    <Button 
                      className="w-full" 
                      onClick={() => navigate(`/exam/${exam.attempt_id}`)}
                    >
                      Continue Exam
                    </Button>
                  ) : exam.status === "SUBMITTED" || exam.status === "AUTO_SUBMITTED" ? (
                    <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-medium">Exam Completed</span>
                      </div>
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleStartExam(exam.id)}
                    >
                      Start Exam
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}