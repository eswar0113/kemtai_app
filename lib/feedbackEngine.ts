type FeedbackRule = {
  message: string;
  condition: () => boolean;
};

export class FeedbackEngine {
  private lastSpoken = 0;
  private cooldownMs: number;
  private rules: FeedbackRule[];
  private lastActiveRule: FeedbackRule | null = null;
  private conditionStartTime: number = 0;
  private minConditionDuration: number; // How long condition must be true before speaking

  constructor(rules: FeedbackRule[], cooldownMs = 5000, minConditionDuration = 2000) {
    this.rules = rules;
    this.cooldownMs = cooldownMs;
    this.minConditionDuration = minConditionDuration;
  }

  evaluate() {
    const now = Date.now();
    
    // Find the first rule that matches
    const activeRule = this.rules.find((r) => r.condition());
    
    // If no rule is active, reset tracking
    if (!activeRule) {
      this.lastActiveRule = null;
      this.conditionStartTime = 0;
      return null;
    }
    
    // If this is a different rule than before, reset the timer
    if (activeRule !== this.lastActiveRule) {
      this.lastActiveRule = activeRule;
      this.conditionStartTime = now;
      return null;
    }
    
    // Check if condition has been true long enough
    const conditionDuration = now - this.conditionStartTime;
    if (conditionDuration < this.minConditionDuration) {
      return null; // Condition hasn't been true long enough
    }
    
    // Check cooldown - don't speak if we just spoke recently
    if (now - this.lastSpoken < this.cooldownMs) {
      return null;
    }
    
    // All conditions met - speak the feedback
    this.speak(activeRule.message);
    this.lastSpoken = now;
    // Reset condition timer so it won't speak again until condition changes
    this.conditionStartTime = 0;
    
    return activeRule.message;
  }

  private speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    // Cancel any ongoing speech to prevent overlapping
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  }
}



