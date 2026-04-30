import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, BarChart3 } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 border-b backdrop-blur bg-background/70 sticky top-0 z-50">
        <h1 className="text-xl font-bold tracking-tight">
          Shimeles Habte Secondary School
        </h1>
        <Button onClick={() => navigate("/login")}>
          Login
        </Button>
      </header>

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
        
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 blur-3xl opacity-50" />

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-bold mb-6 leading-tight relative z-10"
        >
          Smart Online <br /> Examination Platform
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground max-w-2xl mb-8 text-lg relative z-10"
        >
          A secure, fast, and reliable system for managing exams digitally.
          Built for students and teachers of Shimeles Habte Secondary School.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 relative z-10"
        >
          <Button size="lg" onClick={() => navigate("/login")}>
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </motion.div>
      </section>

      {/* Features */}
      <section className="px-8 py-20">
        <h3 className="text-3xl font-bold text-center mb-14">
          Built for Modern Education
        </h3>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          <FeatureCard
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Secure Exams"
            description="Strict backend validation and timed sessions ensure fairness and integrity."
          />

          <FeatureCard
            icon={<Clock className="w-6 h-6" />}
            title="Real-Time Timer"
            description="Accurate countdown system with automatic submission when time expires."
          />

          <FeatureCard
            icon={<BarChart3 className="w-6 h-6" />}
            title="Instant Results"
            description="Students get immediate feedback and performance insights after submission."
          />

        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 text-center bg-muted/40">
        <motion.h3
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-4"
        >
          Ready to take your exams online?
        </motion.h3>

        <p className="text-muted-foreground mb-6">
          Access your exams anytime, anywhere with a seamless experience.
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

// 🔹 Reusable Feature Card
function FeatureCard({ icon, title, description }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="transition"
    >
      <Card className="h-full hover:shadow-xl transition">
        <CardContent className="p-6 space-y-4">
          <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
          <h4 className="font-semibold text-lg">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}