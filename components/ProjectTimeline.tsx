'use client';

import { useState } from 'react';
import { Check, ChevronRight, Clock, Users, Code2, CheckCircle2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const stages = [
  { 
    id: 'OPEN', 
    label: 'Open for Contributors',
    description: 'Project is open and looking for contributors',
    icon: Code2,
    color: '#10B981' // Green
  },
  { 
    id: 'FINDING', 
    label: 'Finding Developers',
    description: 'Actively searching for team members',
    icon: Users,
    color: '#3B82F6' // Blue
  },
  { 
    id: 'WORKING', 
    label: 'Project in Progress',
    description: 'Development is actively underway',
    icon: Clock,
    color: '#F59E0B' // Yellow
  },
  { 
    id: 'COMPLETE', 
    label: 'Project Completed',
    description: 'Project has been successfully completed',
    icon: CheckCircle2,
    color: '#059669' // Dark Green
  },
];

interface ProjectTimelineProps {
  currentStage: string;
  isOwner: boolean;
  projectId: string;
}

export default function ProjectTimeline({ currentStage, isOwner, projectId }: ProjectTimelineProps) {
  const [updating, setUpdating] = useState(false);
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleStageUpdate = async (newStage: string) => {
    if (!isOwner || updating) return;

    setUpdating(true);
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ stage: newStage }),
      });

      if (!response.ok) throw new Error('Failed to update stage');

      toast({
        title: "Success",
        description: "Project stage updated successfully",
      });

      window.location.reload();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update project stage",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const currentStageIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <div className="bg-secondary/50 rounded-lg p-6">
      <h3 className="font-medium mb-6 flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        Project Timeline
      </h3>
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const isComplete = index <= currentStageIndex;
          const isCurrent = stage.id === currentStage;
          const isClickable = isOwner && index <= currentStageIndex + 1;
          const StageIcon = stage.icon;

          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${index !== stages.length - 1 ? 'pb-6' : ''}`}
            >
              <motion.div
                className={`relative flex items-start gap-4 p-4 rounded-lg transition-all ${
                  isClickable ? 'cursor-pointer' : ''
                } ${isCurrent ? 'bg-primary/5 border border-primary/20' : ''}`}
                whileHover={isClickable ? { 
                  scale: 1.02, 
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  transition: { duration: 0.2 }
                } : {}}
                onClick={() => isClickable && handleStageUpdate(stage.id)}
                onHoverStart={() => setHoveredStage(stage.id)}
                onHoverEnd={() => setHoveredStage(null)}
              >
                <div
                  className={`relative h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                    isComplete 
                      ? 'bg-primary text-white' 
                      : 'bg-secondary border-2 border-muted-foreground/30'
                  }`}
                  style={{
                    backgroundColor: isComplete ? stage.color : undefined,
                    borderColor: !isComplete ? stage.color : undefined,
                  }}
                >
                  <AnimatePresence>
                    {isComplete ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <Check className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <StageIcon className="h-5 w-5" style={{ color: stage.color }} />
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span 
                      className={`font-medium transition-colors ${
                        isComplete ? 'text-foreground' : 'text-muted-foreground'
                      }`}
                      style={{ color: isCurrent ? stage.color : undefined }}
                    >
                      {stage.label}
                    </span>
                    {isClickable && hoveredStage === stage.id && !isComplete && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                      >
                        <ChevronRight className="h-4 w-4" style={{ color: stage.color }} />
                      </motion.div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stage.description}
                  </p>
                </div>
              </motion.div>

              {index < stages.length - 1 && (
                <motion.div 
                  className="absolute left-7 ml-[11px] w-[2px] h-6"
                  initial={{ height: 0 }}
                  animate={{ height: '24px' }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                  style={{
                    background: `linear-gradient(to bottom, ${
                      isComplete ? stage.color : 'rgba(255,255,255,0.1)'
                    } 0%, ${
                      isComplete ? stages[index + 1].color : 'rgba(255,255,255,0.1)'
                    } 100%)`
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
