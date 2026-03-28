import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";

type Screen =
  | "intro"
  | "identify"
  | "feeling"
  | "impact"
  | "challenge"
  | "permission"
  | "step"
  | "takeaway"
  | "close";

const SCREENS: Screen[] = [
  "identify",
  "feeling",
  "impact",
  "challenge",
  "permission",
  "step",
  "takeaway",
  "close",
];

const fadeVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const Chip = ({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2.5 rounded-lg text-body text-sm font-medium transition-all duration-200 border ${
      selected
        ? "bg-accent border-accent text-accent-foreground ring-2 ring-accent"
        : "bg-secondary border-secondary text-secondary-foreground hover:brightness-95"
    }`}
  >
    {label}
  </button>
);

const CTA = ({
  label,
  onClick,
  disabled,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base transition-all duration-200 hover:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed"
  >
    {label}
  </button>
);

const AIMessage = ({ text }: { text: string }) => (
  <p className="text-body text-base leading-relaxed">{text}</p>
);

const Prompt = ({ text }: { text: string }) => (
  <p className="text-heading text-lg font-semibold">{text}</p>
);

export default function ChallengingFoodRules() {
  const [screen, setScreen] = useState<Screen>("identify");
  const [rule, setRule] = useState("");
  const [customRule, setCustomRule] = useState("");
  const [feeling, setFeeling] = useState("");
  const [customFeeling, setCustomFeeling] = useState("");
  const [impact, setImpact] = useState("");
  const [customImpact, setCustomImpact] = useState("");
  const [challengeChoice, setChallengeChoice] = useState("");
  const [stepChoice, setStepChoice] = useState("");
  const [showReflection, setShowReflection] = useState(false);
  const [exited, setExited] = useState(false);

  const goNext = () => {
    const idx = SCREENS.indexOf(screen);
    if (idx < SCREENS.length - 1) setScreen(SCREENS[idx + 1]);
  };

  const selectedRule = rule === "__custom" ? customRule : rule;
  const selectedFeeling = feeling === "__custom" ? customFeeling : feeling;
  const selectedImpact = impact === "__custom" ? customImpact : impact;

  const reflections: Record<string, string> = {
    "Is this rule too strict?":
      "Does this feel flexible, or does it create pressure to follow it perfectly?",
    "Is this actually helping me?":
      "Does this rule support your well-being, or add stress or guilt?",
    "What happens when I can't follow it?":
      "What do you notice when this rule doesn't go as planned?",
  };

  const stepResponses: Record<string, string> = {
    "I'll just notice this rule": "That's a good place to start.",
    "I might loosen it slightly": "A small shift is enough.",
    "I'm not ready to change it": "That's completely okay.",
  };

  if (exited) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div {...fadeVariants} transition={{ duration: 0.4 }} className="text-center space-y-4 max-w-sm mx-auto">
          <p className="text-heading text-xl font-semibold">
            Take care of yourself 💛
          </p>
          <p className="text-body">You can come back anytime.</p>
          <CTA label="Start again" onClick={() => { setExited(false); setScreen("identify"); }} />
        </motion.div>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case "identify":
        return (
          <div className="space-y-5">
            <AIMessage text="Let's look at one rule you might have around food." />
            <Prompt text="Does any food rule come to mind? 📝" />
            <div className="flex flex-wrap gap-3">
              {[
                "I shouldn't eat after a certain time",
                "Some foods are off-limits",
                "I need to control portions strictly",
              ].map((opt) => (
                <Chip key={opt} label={opt} selected={rule === opt} onClick={() => setRule(opt)} />
              ))}
              <Chip
                label="Something else..."
                selected={rule === "__custom"}
                onClick={() => setRule("__custom")}
              />
            </div>
            {rule === "__custom" && (
              <input
                className="w-full px-4 py-2.5 rounded-lg bg-muted text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Type your food rule..."
                value={customRule}
                onChange={(e) => setCustomRule(e.target.value)}
              />
            )}
            <CTA
              label="Continue"
              onClick={goNext}
              disabled={!selectedRule}
            />
          </div>
        );

      case "feeling":
        return (
          <div className="space-y-5">
            <AIMessage text="Got it." />
            <Prompt text="When you follow this rule, how does it make you feel?" />
            <div className="flex flex-wrap gap-3">
              {[
                "😟 Anxious",
                "😌 In control",
                "😕 Guilty",
                "😣 Restricted",
                "😴 Tired",
                "😐 Mixed",
              ].map((opt) => (
                <Chip key={opt} label={opt} selected={feeling === opt} onClick={() => setFeeling(opt)} />
              ))}
              <Chip
                label="Something else..."
                selected={feeling === "__custom"}
                onClick={() => setFeeling("__custom")}
              />
            </div>
            {feeling === "__custom" && (
              <input
                className="w-full px-4 py-2.5 rounded-lg bg-muted text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="How does it feel?"
                value={customFeeling}
                onChange={(e) => setCustomFeeling(e.target.value)}
              />
            )}
            <CTA label="Next" onClick={goNext} disabled={!selectedFeeling} />
          </div>
        );

      case "impact":
        return (
          <div className="space-y-5">
            <AIMessage text="Okay." />
            <Prompt text="How does this rule affect your eating? 🍽️" />
            <div className="flex flex-wrap gap-3">
              {[
                "Makes me overthink food",
                "Leads to overeating later",
                "Helps me feel in control",
                "Makes eating stressful",
                "Not sure",
              ].map((opt) => (
                <Chip key={opt} label={opt} selected={impact === opt} onClick={() => setImpact(opt)} />
              ))}
              <Chip
                label="Something else..."
                selected={impact === "__custom"}
                onClick={() => setImpact("__custom")}
              />
            </div>
            {impact === "__custom" && (
              <input
                className="w-full px-4 py-2.5 rounded-lg bg-muted text-foreground border border-border text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="How does it affect you?"
                value={customImpact}
                onChange={(e) => setCustomImpact(e.target.value)}
              />
            )}
            <CTA label="Next" onClick={goNext} disabled={!selectedImpact} />
          </div>
        );

      case "challenge":
        return (
          <div className="space-y-5">
            <AIMessage text="Let's gently look at this from another angle." />
            <Prompt text="Which of these feels most relevant? 🤔" />
            <div className="space-y-3">
              {Object.keys(reflections).map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setChallengeChoice(opt);
                    setShowReflection(true);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    challengeChoice === opt
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground hover:brightness-95"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            <AnimatePresence>
              {showReflection && challengeChoice && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-accent rounded-lg p-4 space-y-3"
                >
                  <p className="text-body text-sm italic">
                    {reflections[challengeChoice]}
                  </p>
                  <p className="text-body text-sm">
                    Noticing this clearly is important.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
            <CTA
              label="Continue"
              onClick={goNext}
              disabled={!showReflection}
            />
          </div>
        );

      case "permission":
        return (
          <div className="space-y-5">
            <AIMessage text="It's okay if this rule isn't helping you anymore. 💛" />
            <AIMessage text="You're allowed to question it." />
            <CTA label="Next" onClick={goNext} />
          </div>
        );

      case "step":
        return (
          <div className="space-y-5">
            <Prompt text="What feels right for you right now? 🌱" />
            <div className="space-y-3">
              {Object.keys(stepResponses).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setStepChoice(opt)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                    stepChoice === opt
                      ? "bg-accent text-accent-foreground"
                      : "bg-primary text-primary-foreground hover:brightness-95"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
            {stepChoice && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-body text-sm"
              >
                {stepResponses[stepChoice]}
              </motion.p>
            )}
            <CTA label="Continue" onClick={goNext} disabled={!stepChoice} />
          </div>
        );

      case "takeaway":
        return (
          <div className="space-y-5">
            <AIMessage text="Here's what you explored: 📌" />
            <div className="bg-muted rounded-lg p-4 space-y-2 text-sm text-body">
              <p>
                <span className="font-semibold text-heading">Rule:</span>{" "}
                {selectedRule}
              </p>
              <p>
                <span className="font-semibold text-heading">Feeling:</span>{" "}
                {selectedFeeling}
              </p>
              <p>
                <span className="font-semibold text-heading">Impact:</span>{" "}
                {selectedImpact}
              </p>
            </div>
            <AIMessage text="This is something you're becoming aware of—not something you need to fix." />
            <CTA label="Next" onClick={goNext} />
          </div>
        );

      case "close":
        return (
          <div className="space-y-5">
            <AIMessage text="You can take this at your own pace. ✨" />
            <Prompt text="Would you like to explore something else, or pause here?" />
            <div className="space-y-3">
              <button
                onClick={() => {
                  setRule("");
                  setCustomRule("");
                  setFeeling("");
                  setCustomFeeling("");
                  setImpact("");
                  setCustomImpact("");
                  setChallengeChoice("");
                  setStepChoice("");
                  setShowReflection(false);
                  setScreen("identify");
                }}
                className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:brightness-95 transition-all"
              >
                Try another activity
              </button>
              <button
                onClick={() => setExited(true)}
                className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:brightness-95 transition-all"
              >
                Pause here
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto text-center">
        {screen === "identify" && (
          <button
            onClick={() => setExited(true)}
            className="flex items-center gap-1.5 text-body text-sm mb-6 hover:text-heading transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {SCREENS.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                i <= SCREENS.indexOf(screen) ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: "easeInOut" }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
