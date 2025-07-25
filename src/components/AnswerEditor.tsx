import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface AnswerEditorProps {
  onSubmit: (content: string) => Promise<void>;
  isVisible: boolean;
  onToggle: (visible: boolean) => void;
}

export const AnswerEditor: React.FC<AnswerEditorProps> = ({
  onSubmit,
  isVisible,
  onToggle,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
      onToggle(false);
    } catch (error) {
      // Error is handled in parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => onToggle(true)}
        variant="outline"
        className="w-full"
      >
        Write an answer...
      </Button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="answer-content">Your Answer</Label>
        <Textarea
          id="answer-content"
          placeholder="Write your answer here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] resize-y"
          required
        />
        <p className="text-sm text-muted-foreground">
          Be specific and clear. Provide examples and explain your reasoning.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className="btn-gradient"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Submit Answer
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            onToggle(false);
            setContent('');
          }}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};