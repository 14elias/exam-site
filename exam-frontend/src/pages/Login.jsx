import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.username, form.password);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-96 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">Student Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <input 
            className="w-full border rounded-md p-2" 
            placeholder="Username" 
            onChange={(e) => setForm({ ...form, username: e.target.value })} 
          />
          <input 
            className="w-full border rounded-md p-2" 
            type="password" 
            placeholder="Password" 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
          />
          <Button className="w-full" onClick={handleSubmit}>Enter Portal</Button>
        </CardContent>
      </Card>
    </div>
  );
}