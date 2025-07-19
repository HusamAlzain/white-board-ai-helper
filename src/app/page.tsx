'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Zap, Target, Users, BarChart3, Lightbulb, ArrowRight, Play } from "lucide-react";
import AIAssistantWidget from "@/components/ai-assistant/ai-assistant-widget";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Task Generation",
    description: "Let our AI create comprehensive task breakdowns from your project descriptions",
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: Target,
    title: "Interactive Whiteboard",
    description: "Visualize and organize tasks on an intuitive drag-and-drop whiteboard interface",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: Zap,
    title: "Smart Priority Management",
    description: "Automatically prioritize tasks based on dependencies and urgency",
    color: "from-pink-500 to-red-600"
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Assign tasks to team members and track progress in real-time",
    color: "from-red-500 to-orange-600"
  },
  {
    icon: BarChart3,
    title: "Progress Analytics",
    description: "Get insights into productivity patterns and project completion rates",
    color: "from-orange-500 to-yellow-600"
  },
  {
    icon: Lightbulb,
    title: "Creative Solutions",
    description: "AI suggests innovative approaches to complex project challenges",
    color: "from-yellow-500 to-green-600"
  }
];

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStartCreating = () => {
    setIsLoading(true);
    // Simulate loading state
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-80 w-80 h-80 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
          <div className="absolute -bottom-40 -left-80 w-80 h-80 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="secondary" className="mb-6 px-6 py-2 text-sm font-medium glass glow-primary">
              <Sparkles className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              AI Task Assistant
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your project ideas into organized, actionable tasks with our intelligent AI assistant. 
              Visualize, prioritize, and collaborate like never before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="btn-primary-glow text-lg px-8 py-4"
                onClick={handleStartCreating}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Creating Tasks...
                  </>
                ) : (
                  <>
                    Start Creating Tasks
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg" className="glass text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to turn ideas into achievements
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 * index }}
              >
                <Card className="task-card border-0 h-full">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} p-3 mb-4 glow-primary`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="glass rounded-3xl p-12 glow-primary"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Ready to revolutionize your workflow?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams already using AI to boost their productivity
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="px-4 py-2">✨ No Setup Required</Badge>
              <Badge variant="secondary" className="px-4 py-2">🚀 Instant Results</Badge>
              <Badge variant="secondary" className="px-4 py-2">🔒 Secure & Private</Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  );
}