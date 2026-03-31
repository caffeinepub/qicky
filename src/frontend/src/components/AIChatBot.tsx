import { Bot, MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "bot";
  text: string;
  chips?: string[];
}

const INITIAL_CHIPS = [
  "Am I eligible for a loan?",
  "What documents do I need?",
  "What are the interest rates?",
  "How is EMI calculated?",
  "Tell me about gold loans",
];

function getResponse(input: string): { text: string; chips: string[] } {
  const q = input.toLowerCase();

  if (/\b(hi|hello|hey|howdy|greet)\b/.test(q)) {
    return {
      text: "👋 Hello! Welcome to Qicky. I'm your AI loan assistant. I can help you with eligibility, interest rates, documents, EMI calculation, and much more. What would you like to know?",
      chips: [
        "Am I eligible?",
        "What are the interest rates?",
        "What documents do I need?",
      ],
    };
  }

  if (/eligib/.test(q)) {
    return {
      text: "✅ **Personal Loan Eligibility:**\n\n• Age: 21–60 years\n• Employment: Salaried or self-employed\n• Minimum salary: ₹15,000/month\n• CIBIL score: 650 or above\n• Work experience: 1+ year (salaried), 2+ years (self-employed)\n\nMeeting these basic criteria gets you started. Higher income and better credit score can unlock better rates!",
      chips: [
        "What documents do I need?",
        "What are interest rates?",
        "How is CIBIL calculated?",
      ],
    };
  }

  if (/document|doc|paper|kyc/.test(q)) {
    return {
      text: "📄 **Documents Required:**\n\n• Identity: Aadhaar Card, PAN Card\n• Address Proof: Aadhaar / Utility Bill\n• Income: Last 3 months salary slips\n• Bank Statement: 6 months\n• Tax: Form 16 (for salaried)\n• Photograph: Recent passport-size\n\nFor gold loans, just bring your gold jewellery + KYC documents.",
      chips: [
        "What is the processing fee?",
        "How long for disbursement?",
        "Am I eligible?",
      ],
    };
  }

  if (/interest|rate|roi|percent|%/.test(q)) {
    return {
      text: "📊 **Interest Rates by Lender:**\n\n**Top NBFCs:**\n• Poonawala Fincorp: 10.99%–24% p.a.\n• ABCL (Aditya Birla): 11%–22% p.a.\n• Hero Fincorp: 11.5%–22% p.a.\n• SMFG India Credit: 11%–21% p.a.\n\n**Small Finance Banks:**\n• Unity SFB: 12%–24% p.a.\n\n**Secured Loans:**\n• Gold Loan: 9.5%–12% p.a.\n• FD-Backed Card: FD rate + 2.5%\n\n💡 A CIBIL score of 750+ gets you the best rates!",
      chips: [
        "How is EMI calculated?",
        "Which lender is best for me?",
        "What is CIBIL score?",
      ],
    };
  }

  if (/emi|equated monthly|instalment|installment/.test(q)) {
    return {
      text: "🧮 **EMI Calculation:**\n\nEMI = [P × R × (1+R)^N] / [(1+R)^N - 1]\n\nWhere:\n• P = Principal loan amount\n• R = Monthly interest rate (annual rate ÷ 12 ÷ 100)\n• N = Loan tenure in months\n\n**Example:** ₹5 lakh at 12% p.a. for 36 months\n→ EMI ≈ ₹16,607/month\n\nUse our online EMI calculator on the offers page for instant results!",
      chips: [
        "What is the loan amount range?",
        "What are the tenures available?",
        "What are interest rates?",
      ],
    };
  }

  if (/gold loan|gold|jewel|muthoot|manappuram/.test(q)) {
    return {
      text: "🥇 **Gold Loans:**\n\n• **Loan Against:** Gold jewellery (18–24 karat)\n• **LTV:** Up to 75% of gold value\n• **Interest Rate:** 9.5%–12% p.a.\n• **Approval:** Same day (instant!)\n• **Tenure:** 3–24 months\n\n**Top Lenders:**\n• **Muthoot Finance:** 9.96% p.a., India's #1 gold loan NBFC\n• **Manappuram Finance:** 10.5% p.a., fast disbursement\n\n💡 Perfect if your credit score is below 650!",
      chips: [
        "What is LTV?",
        "Tell me about FD-backed card",
        "How is EMI calculated?",
      ],
    };
  }

  if (
    /fd.backed|fd card|fixed deposit card|axis.*fd|sbi.*fd|fd.*credit/.test(q)
  ) {
    return {
      text: "💳 **FD-Backed Credit Cards:**\n\n• Credit card issued against your Fixed Deposit\n• **Credit Limit:** 90%–100% of FD amount\n• **Approval:** Guaranteed (no CIBIL check)\n• **Interest:** FD rate + 2.5% (only if you revolve)\n\n**Top Options:**\n• **SBI FD Card:** 90% of FD as limit\n• **Axis Bank Insta Easy Card:** Up to 100% of FD\n\n💡 Best option for building credit history!",
      chips: [
        "Tell me about gold loans",
        "How do I apply?",
        "What are interest rates?",
      ],
    };
  }

  if (/poonawala/.test(q)) {
    return {
      text: "🏦 **Poonawala Fincorp:**\n\n• Type: NBFC\n• Interest Rate: 10.99%–24% p.a.\n• Loan Amount: Up to ₹30 Lakhs\n• Tenure: 12–60 months\n• Process: 100% digital, quick approval\n• Special: No foreclosure charges after 12 EMIs\n\n⭐ Qicky's #1 recommended lender with 92% approval rate!",
      chips: [
        "Tell me about ABCL",
        "What documents are needed?",
        "How to apply?",
      ],
    };
  }

  if (/abcl|aditya birla/.test(q)) {
    return {
      text: "🏦 **ABCL (Aditya Birla Capital):**\n\n• Type: NBFC\n• Interest Rate: 11%–22% p.a.\n• Loan Amount: Up to ₹40 Lakhs (highest!)\n• Tenure: 12–60 months\n• Special: Instant online approval for pre-approved customers",
      chips: [
        "Tell me about Hero Fincorp",
        "What are the interest rates?",
        "Am I eligible?",
      ],
    };
  }

  if (/hero fincorp/.test(q)) {
    return {
      text: "🏦 **Hero Fincorp:**\n\n• Type: NBFC\n• Interest Rate: 11.5%–22% p.a.\n• Loan Amount: Up to ₹25 Lakhs\n• Tenure: 12–60 months\n• Special: Strong network, quick rural/semi-urban coverage",
      chips: [
        "Tell me about SMFG",
        "What documents are needed?",
        "How is EMI calculated?",
      ],
    };
  }

  if (/smfg|shinsei/.test(q)) {
    return {
      text: "🏦 **SMFG India Credit:**\n\n• Type: NBFC\n• Interest Rate: 11%–21% p.a.\n• Loan Amount: Up to ₹25 Lakhs\n• Tenure: 12–60 months\n• Special: Japanese-backed, known for transparent processes",
      chips: [
        "Tell me about Unity SFB",
        "What are interest rates?",
        "Am I eligible?",
      ],
    };
  }

  if (/unity|small finance/.test(q)) {
    return {
      text: "🏦 **Unity Small Finance Bank:**\n\n• Type: Small Finance Bank\n• Interest Rate: 12%–24% p.a.\n• Loan Amount: Up to ₹15 Lakhs\n• Tenure: 12–60 months\n• Special: Ideal for first-time borrowers and underserved segments",
      chips: [
        "Compare all lenders",
        "What are interest rates?",
        "How to apply?",
      ],
    };
  }

  if (/processing fee|charges|fee/.test(q)) {
    return {
      text: "💰 **Processing Fees:**\n\n• Personal Loans: 1%–3% of loan amount\n• Gold Loans: 0.5%–1% (very low!)\n• FD-Backed Cards: Nil to minimal\n\n**Example:** ₹5 lakh loan with 2% fee = ₹10,000 one-time charge\n\n⚠️ Always check for hidden charges before signing!",
      chips: [
        "What are prepayment charges?",
        "What is the loan amount range?",
        "What are interest rates?",
      ],
    };
  }

  if (/amount|how much|loan limit|maximum loan/.test(q)) {
    return {
      text: "💵 **Loan Amount Range:**\n\n• **Minimum:** ₹50,000\n• **Maximum:** ₹15,00,000\n\nAmount depends on:\n• Monthly income (typically 20–30x salary)\n• Existing obligations (FOIR ≤ 50%)\n• CIBIL score\n• Employment stability",
      chips: [
        "Am I eligible?",
        "What are interest rates?",
        "How is EMI calculated?",
      ],
    };
  }

  if (/tenure|duration|period|months|years/.test(q)) {
    return {
      text: "📅 **Loan Tenure Options:**\n\n• **Range:** 12 to 60 months (1–5 years)\n• **Shorter tenure:** Higher EMI, less total interest\n• **Longer tenure:** Lower EMI, more total interest\n\n💡 Choose a tenure where EMI ≤ 40% of your monthly income for comfortable repayment.",
      chips: [
        "How is EMI calculated?",
        "What are prepayment charges?",
        "What is the loan amount range?",
      ],
    };
  }

  if (/cibil|credit score|bureau|credit report/.test(q)) {
    return {
      text: "📈 **Credit Score / CIBIL:**\n\n• **What it is:** 3-digit score (300–900) based on repayment history\n• **Minimum required:** 650 for most lenders\n• **Best rates:** 750+ score\n\n**Score Ranges:**\n• 750–900 → Excellent (best rates)\n• 700–749 → Good\n• 650–699 → Fair (eligible but higher rates)\n• Below 650 → Consider gold loan or FD card\n\n💡 Pay EMIs on time to improve your score!",
      chips: [
        "How to improve credit score?",
        "Tell me about gold loans",
        "Am I eligible?",
      ],
    };
  }

  if (/ltv|loan.to.value|loan to value/.test(q)) {
    return {
      text: "📐 **Loan-to-Value (LTV) Ratio:**\n\nLTV = (Loan Amount ÷ Asset Value) × 100\n\n**Example:** Gold worth ₹1 lakh → you can get up to ₹75,000 (75% LTV)\n\n**RBI Guidelines for Gold Loans:** Maximum 75% LTV\n\nHigher LTV = more loan but more risk for the lender.",
      chips: [
        "Tell me about gold loans",
        "Tell me about FD-backed card",
        "What are interest rates?",
      ],
    };
  }

  if (/prepay|foreclose|foreclosure|early repay|preclos/.test(q)) {
    return {
      text: "⚠️ **Prepayment & Foreclosure:**\n\n• **Foreclosure charge:** Typically 2%–4% of outstanding principal\n• **Part-prepayment:** Usually 1%–2% fee\n• **Lock-in period:** Most lenders have 6–12 month lock-in\n• **After lock-in:** Some lenders offer zero foreclosure charges\n\n💡 Always check foreclosure terms before taking a loan!",
      chips: [
        "What is processing fee?",
        "What are interest rates?",
        "How is EMI calculated?",
      ],
    };
  }

  if (
    /disburse|when.*get.*money|how long|approval.*time|time.*approval/.test(q)
  ) {
    return {
      text: "⏱️ **Disbursement Timeline:**\n\n• **Personal Loan:** 24–48 hours after approval\n• **Gold Loan:** Same day (within hours!)\n• **FD-Backed Card:** 2–7 working days\n\nSteps: Application → Bureau check → Offer → e-Sign → Disbursal",
      chips: ["How do I apply?", "What documents do I need?", "Am I eligible?"],
    };
  }

  if (/apply|process|how.*apply|application|steps/.test(q)) {
    return {
      text: "🚀 **Application Process:**\n\n1️⃣ Fill online form (2 minutes)\n2️⃣ Bureau/CIBIL check (instant)\n3️⃣ Receive personalized offers\n4️⃣ Choose your lender\n5️⃣ e-Sign documents digitally\n6️⃣ Loan disbursed to your account!\n\n✅ 100% paperless, end-to-end digital journey with Qicky!",
      chips: [
        "What documents do I need?",
        "Am I eligible?",
        "What are interest rates?",
      ],
    };
  }

  if (/improve.*credit|boost.*score|increase.*cibil/.test(q)) {
    return {
      text: "📈 **How to Improve Credit Score:**\n\n• Pay all EMIs and credit card bills on time\n• Keep credit utilization below 30%\n• Don't apply for too many loans at once\n• Maintain a healthy credit mix\n• Check your CIBIL report for errors\n• Use an FD-backed credit card to build history\n\n💡 Score improvement typically takes 3–6 months of disciplined repayment.",
      chips: [
        "Tell me about FD-backed card",
        "Am I eligible?",
        "What is CIBIL score?",
      ],
    };
  }

  return {
    text: "🤔 I didn't quite understand that. Here are some things I can help you with:",
    chips: INITIAL_CHIPS,
  };
}

// Render bold markdown (**text**) simply - uses part content as key
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={part}>{part.slice(2, -2)}</strong>;
    }
    return <span key={part}>{part}</span>;
  });
}

function renderMessage(text: string) {
  return text.split("\n").map((line) => (
    <p key={line || " "} className={line === "" ? "h-2" : "leading-relaxed"}>
      {renderText(line)}
    </p>
  ));
}

export default function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: "👋 Hi! I'm **Qicky AI**, your personal loan assistant. I can help you with:\n\n• Loan eligibility & documents\n• Interest rates & EMI calculations\n• Lender comparisons\n• Gold loans & FD-backed cards\n\nWhat would you like to know?",
      chips: INITIAL_CHIPS,
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message/typing changes
  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleOpen() {
    setOpen(true);
    setHasOpened(true);
  }

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        const { text: responseText, chips } = getResponse(text);
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: "bot",
          text: responseText,
          chips,
        };
        setMessages((prev) => [...prev, botMsg]);
        setTyping(false);
      },
      600 + Math.random() * 400,
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-ocid="chatbot.panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] rounded-2xl shadow-2xl overflow-hidden border border-gray-200 flex flex-col"
            style={{ maxHeight: "520px", height: "520px" }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 text-white"
              style={{
                background: "linear-gradient(135deg, #8B1A1A 0%, #6B0F0F 100%)",
              }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">Qicky AI Assistant</p>
                <p className="text-xs text-white/70">
                  Finance &amp; Loan Expert
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-white/70">Online</span>
              </div>
              <button
                type="button"
                data-ocid="chatbot.close_button"
                onClick={() => setOpen(false)}
                className="ml-2 w-7 h-7 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-gray-50 px-3 py-3 space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {msg.role === "bot" && (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-1"
                      style={{ background: "#8B1A1A" }}
                    >
                      Q
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-2`}
                  >
                    <div
                      className={`rounded-2xl px-3 py-2 text-sm ${
                        msg.role === "user"
                          ? "text-white rounded-tr-sm"
                          : "bg-white text-gray-800 rounded-tl-sm shadow-sm border border-gray-100"
                      }`}
                      style={
                        msg.role === "user" ? { background: "#8B1A1A" } : {}
                      }
                    >
                      {renderMessage(msg.text)}
                    </div>
                    {msg.chips && msg.chips.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {msg.chips.map((chip) => (
                          <button
                            type="button"
                            key={chip}
                            data-ocid="chatbot.button"
                            onClick={() => sendMessage(chip)}
                            className="text-xs px-2.5 py-1 rounded-full border bg-white hover:bg-red-50 transition-colors font-medium"
                            style={{ borderColor: "#8B1A1A", color: "#8B1A1A" }}
                          >
                            {chip}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {typing && (
                <div className="flex gap-2 items-end">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                    style={{ background: "#8B1A1A" }}
                  >
                    Q
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-3 shadow-sm border border-gray-100 flex gap-1">
                    {([0, 1, 2] as const).map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-gray-400"
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input bar */}
            <div className="bg-white border-t border-gray-200 px-3 py-2.5 flex gap-2 items-center">
              <input
                ref={inputRef}
                data-ocid="chatbot.input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about loans, EMI, eligibility..."
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-4 py-2 outline-none focus:border-red-800 focus:bg-white transition-colors"
              />
              <button
                type="button"
                data-ocid="chatbot.submit_button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || typing}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:opacity-90 disabled:opacity-40 flex-shrink-0"
                style={{ background: "#8B1A1A" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        type="button"
        data-ocid="chatbot.open_modal_button"
        onClick={handleOpen}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white"
        style={{
          background: "linear-gradient(135deg, #8B1A1A 0%, #6B0F0F 100%)",
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6" />
              {!hasOpened && (
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-400 border-2 border-white animate-pulse" />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip on first view */}
      <AnimatePresence>
        {!hasOpened && !open && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ delay: 1.5, duration: 0.3 }}
            className="fixed bottom-8 right-20 sm:right-24 z-50 bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap"
          >
            Ask me about loans! 💬
            <div className="absolute right-[-5px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
