import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-xl font-bold">
          Shimeles Habte Secondary School
        </h1>
        <Button onClick={() => navigate("/login")}>
          Login
        </Button>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Modern Online <br /> Examination System
        </h2>

        <p className="text-muted-foreground max-w-2xl mb-8 text-lg">
          A secure and efficient platform for students to take exams,
          track progress, and receive instant results — built for
          Shimeles Habte Secondary School.
        </p>

        <div className="flex gap-4">
          <Button size="lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-16 bg-muted/40">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Use This Platform?
        </h3>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          <Card>
            <CardContent className="p-6 space-y-3">
              <h4 className="font-semibold text-lg">Secure Exams</h4>
              <p className="text-sm text-muted-foreground">
                Exams are protected with time limits and backend validation
                to ensure fairness.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h4 className="font-semibold text-lg">Instant Results</h4>
              <p className="text-sm text-muted-foreground">
                Students receive their scores immediately after submission.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h4 className="font-semibold text-lg">Easy to Use</h4>
              <p className="text-sm text-muted-foreground">
                Clean interface designed for both students and teachers.
              </p>
            </CardContent>
          </Card>

        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 text-center">
        <h3 className="text-3xl font-bold mb-4">
          Ready to take your exams online?
        </h3>

        <p className="text-muted-foreground mb-6">
          Join the platform and start your exams today.
        </p>

        <Button size="lg" onClick={() => navigate("/login")}>
          Login to Continue
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Shimeles Habte Secondary School. All rights reserved.
      </footer>
    </div>
  );
}