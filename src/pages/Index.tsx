import { motion } from 'framer-motion';
import AIAssistantWidget from '@/components/ai-assistant/ai-assistant-widget';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Sparkles, Zap, Target, Layers3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Task Generation",
      description: "Describe your project and let AI break it down into actionable tasks",
      color: "text-primary"
    },
    {
      icon: Layers3,
      title: "Visual Task Organization",
      description: "Organize tasks on an interactive whiteboard with drag-and-drop",
      color: "text-secondary"
    },
    {
      icon: Target,
      title: "Smart Prioritization",
      description: "AI automatically assigns priorities based on project requirements",
      color: "text-accent"
    },
    {
      icon: Zap,
      title: "Instant Workflow",
      description: "From idea to organized task list in seconds",
      color: "text-warning"
    }
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float [animation-delay:2s]" />
        <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float [animation-delay:4s]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 glass rounded-full px-6 py-3 mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Sparkles className="h-5 w-5 text-accent animate-glow" />
            <span className="text-sm font-medium">AI Task Assistant 2040</span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-holographic bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Future of
            <br />
            Task Management
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Transform your ideas into organized, actionable tasks with AI-powered intelligence. 
            Experience the most advanced task management system ever created.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button size="lg" className="text-lg px-8 py-4">
              <Bot className="h-5 w-5 mr-2" />
              Start Creating Tasks
            </Button>
            <Button variant="glass" size="lg" className="text-lg px-8 py-4">
              <Sparkles className="h-5 w-5 mr-2" />
              See Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
            >
              <Card className="task-card border-l-4 border-l-primary/20 h-full">
                <CardHeader className="pb-4">
                  <div className={cn("w-12 h-12 rounded-xl glass flex items-center justify-center mb-4", feature.color)}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="glass rounded-2xl p-12 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to revolutionize your workflow?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Click the AI assistant button in the bottom right to get started.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Badge className="bg-primary/10 text-primary border-primary/20">
                AI-Powered
              </Badge>
              <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                Real-time Collaboration
              </Badge>
              <Badge className="bg-accent/10 text-accent border-accent/20">
                Smart Automation
              </Badge>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  );
};

export default Index;
