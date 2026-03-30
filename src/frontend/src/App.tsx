import {
  ArrowRight,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  FileText,
  Percent,
  RefreshCw,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = "landing" | "otp" | "analysis";

interface FormData {
  name: string;
  mobile: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: Zap, label: "Fully Digital Borrowing Process" },
  { icon: BadgeCheck, label: "Highest Approval Chances" },
  { icon: Users, label: "End-to-End Expert Assistance" },
  { icon: FileText, label: "Minimal Documentation Required" },
];

const STATS = [
  { value: "5.7cr+", label: "Satisfied Customers" },
  { value: "65+", label: "Lending Partners" },
  { value: "₹65k Cr+", label: "Loans Disbursed" },
];

const LOAN_CARDS = [
  {
    title: "Loans from ₹8,000 to ₹35,000",
    desc: "Flexible loan amounts tailored to your needs and repayment capacity.",
    icon: TrendingUp,
  },
  {
    title: "No Early Repayment Charges",
    desc: "Pay interest only for the period that you borrow, no hidden fees.",
    icon: Percent,
  },
];

const OTP_INDICES = [0, 1, 2, 3, 4, 5] as const;

// ─── OTP Input ────────────────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, ch: string) => {
    if (!/^[0-9]?$/.test(ch)) return;
    const next = [...value];
    next[i] = ch;
    onChange(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !value[i] && i > 0) {
      refs.current[i - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const next = Array(6).fill("");
    pasted.split("").forEach((c, i) => {
      next[i] = c;
    });
    onChange(next);
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center" data-ocid="otp.input">
      {OTP_INDICES.map((i) => (
        <input
          key={`otp-${i}`}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          className="w-12 h-14 text-center text-xl font-bold border-2 rounded-xl
            border-border focus:border-brand focus:ring-2 focus:ring-brand/20
            outline-none transition-all bg-white text-foreground"
        />
      ))}
    </div>
  );
}

// ─── Landing Step ─────────────────────────────────────────────────────────────
function LandingStep({ onNext }: { onNext: (data: FormData) => void }) {
  const [form, setForm] = useState<FormData>({ name: "", mobile: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = () => {
    const e: Partial<FormData> = {};
    if (!form.name.trim()) e.name = "Please enter your full name";
    if (!/^[6-9]\d{9}$/.test(form.mobile))
      e.mobile = "Enter a valid 10-digit mobile number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) onNext(form);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Split */}
      <section className="flex flex-col lg:flex-row min-h-[90vh]">
        {/* Left: Hero Image */}
        <div
          className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-12"
          style={{
            backgroundImage: "url(/assets/generated/hero-loan.dim_760x900.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/50 to-transparent" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-brand/20 backdrop-blur-sm border border-brand/30 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
              <Star className="w-3.5 h-3.5 fill-brand text-brand" />
              Trusted by 5.7 Crore+ Indians
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4">
              Quick disbursals with
              <br />
              <span className="text-brand">minimal documentation</span>
            </h1>
            <p className="text-white/80 text-lg leading-relaxed max-w-md">
              Get your instant personal loan in 15 minutes by following just 4
              easy steps.
            </p>
            <div className="flex gap-6 mt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold text-white">
                    {s.value}
                  </div>
                  <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FAFAFA] px-6 py-12 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md"
          >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-2xl font-extrabold text-foreground">
                Qicky
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 bg-brand-light text-brand font-semibold text-xs px-3 py-1 rounded-full mb-4">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Instant Personal Loan
            </div>

            <h2 className="text-3xl font-extrabold text-foreground leading-tight mb-1">
              Get up to ₹50 Lakhs
            </h2>
            <p className="text-muted-foreground text-base mb-8">
              Starting at{" "}
              <span className="text-brand font-bold">9.98% p.a.</span> · No
              hidden charges
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
              data-ocid="onboarding.panel"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="full-name"
                  className="block text-sm font-semibold text-foreground mb-1.5"
                >
                  Full Name{" "}
                  <span className="text-muted-foreground font-normal">
                    (as on your PAN)
                  </span>
                </label>
                <input
                  id="full-name"
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  data-ocid="onboarding.name.input"
                  className="w-full px-4 py-3 border border-border rounded-xl text-sm
                    focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                    transition-all bg-white placeholder:text-muted-foreground/50"
                />
                {errors.name && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="onboarding.name.error"
                  >
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label
                  htmlFor="mobile-number"
                  className="block text-sm font-semibold text-foreground mb-1.5"
                >
                  Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-3 border border-r-0 border-border rounded-l-xl bg-muted text-sm text-foreground font-medium">
                    🇮🇳 +91
                  </span>
                  <input
                    id="mobile-number"
                    type="tel"
                    placeholder="Enter 10-digit number"
                    value={form.mobile}
                    maxLength={10}
                    onChange={(e) =>
                      setForm((f) => ({
                        ...f,
                        mobile: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    data-ocid="onboarding.mobile.input"
                    className="flex-1 px-4 py-3 border border-border rounded-r-xl text-sm
                      focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand
                      transition-all bg-white placeholder:text-muted-foreground/50"
                  />
                </div>
                {errors.mobile && (
                  <p
                    className="text-destructive text-xs mt-1"
                    data-ocid="onboarding.mobile.error"
                  >
                    {errors.mobile}
                  </p>
                )}
              </div>

              <button
                type="submit"
                data-ocid="onboarding.submit_button"
                className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl
                  flex items-center justify-center gap-2 transition-colors text-base shadow-md hover:shadow-lg mt-2"
              >
                Check Eligibility
                <ArrowRight className="w-5 h-5" />
              </button>

              <p className="text-xs text-muted-foreground text-center leading-relaxed">
                By submitting this form, you have read and agree to the{" "}
                <span className="text-brand underline underline-offset-2 cursor-pointer">
                  Credit Report Terms
                </span>
                ,{" "}
                <span className="text-brand underline underline-offset-2 cursor-pointer">
                  Terms of Use
                </span>{" "}
                &amp;{" "}
                <span className="text-brand underline underline-offset-2 cursor-pointer">
                  Privacy Policy
                </span>
                .
              </p>
            </form>

            {/* Trust badges */}
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-green-500" />
                Bank-grade security
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5 text-brand" />
                15-min disbursal
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BadgeCheck className="w-3.5 h-3.5 text-blue-500" />
                RBI Compliant
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-center text-2xl font-bold text-foreground mb-10">
            Why choose <span className="text-brand">Qicky</span>?
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-border hover:border-brand/30 hover:shadow-card transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-light group-hover:bg-brand/20 flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-brand" />
                </div>
                <p className="font-semibold text-foreground text-sm leading-snug">
                  {f.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#FAFAFA] py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            {STATS.map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-extrabold text-brand">
                  {s.value}
                </div>
                <div className="text-muted-foreground text-sm mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Cards */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {LOAN_CARDS.map((c) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative overflow-hidden rounded-2xl p-7 text-white"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.65 0.175 30), oklch(0.58 0.18 20))",
              }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/10 translate-x-8 -translate-y-8" />
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-bold mb-2">{c.title}</h4>
              <p className="text-white/80 text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
              <Zap className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-white font-bold text-lg">Qicky</span>
          </div>
          <div className="flex gap-6 text-sm">
            <span className="text-white/60 hover:text-white transition-colors cursor-pointer">
              Terms &amp; Conditions
            </span>
            <span className="text-white/60 hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </span>
          </div>
          <p className="text-white/40 text-xs">
            Copyright &copy; {new Date().getFullYear()} Qicky | All Rights
            Reserved
          </p>
        </div>
        <div className="max-w-5xl mx-auto mt-4 pt-4 border-t border-white/10 text-center">
          <p className="text-white/30 text-xs">
            Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              className="text-white/50 hover:text-white transition-colors underline"
              target="_blank"
              rel="noreferrer"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

// ─── OTP Step ─────────────────────────────────────────────────────────────────
function OtpStep({
  mobile,
  onVerify,
  onBack,
}: {
  mobile: string;
  onVerify: () => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const id = setTimeout(() => setTimer((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timer]);

  const handleResend = () => {
    setTimer(30);
    setCanResend(false);
    setOtp(Array(6).fill(""));
    setError("");
  };

  const handleVerify = () => {
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    setError("");
    onVerify();
  };

  const maskedMobile = `+91 ${mobile.slice(0, 2)}****${mobile.slice(-3)}`;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-xl font-extrabold text-foreground">Qicky</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
          data-ocid="otp.panel"
        >
          <div className="bg-white rounded-2xl p-8 shadow-card border border-border">
            <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-8 h-8 text-brand" />
            </div>

            <h2 className="text-2xl font-extrabold text-foreground text-center mb-2">
              Let&apos;s verify your number
            </h2>
            <p className="text-muted-foreground text-sm text-center mb-8">
              We&apos;ve sent a 6-digit OTP to{" "}
              <span className="font-semibold text-foreground">
                {maskedMobile}
              </span>
            </p>

            <OtpInput value={otp} onChange={setOtp} />

            {error && (
              <p
                className="text-destructive text-xs text-center mt-3"
                data-ocid="otp.error_state"
              >
                {error}
              </p>
            )}

            <div className="text-center mt-5 text-sm text-muted-foreground">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-brand font-semibold hover:underline flex items-center gap-1 mx-auto"
                  data-ocid="otp.resend.button"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend OTP
                </button>
              ) : (
                <span>
                  Resend OTP in{" "}
                  <span className="font-bold text-foreground">{timer}s</span>
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleVerify}
              data-ocid="otp.submit_button"
              className="w-full mt-7 py-3.5 bg-brand hover:bg-brand-dark text-white font-bold
                rounded-xl flex items-center justify-center gap-2 transition-colors text-base shadow-md"
            >
              Verify &amp; Continue
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={onBack}
              data-ocid="otp.back.button"
              className="w-full mt-3 py-2.5 text-muted-foreground hover:text-foreground
                flex items-center justify-center gap-1.5 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 rounded-full bg-brand" />
            <div className="w-2 h-2 rounded-full bg-brand" />
            <div className="w-2 h-2 rounded-full bg-border" />
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// ─── Analysis Step ────────────────────────────────────────────────────────────
function AnalysisStep({ name, onBack }: { name: string; onBack: () => void }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(id);
  }, []);

  const firstName = name.split(" ")[0] || name;

  const DETAILS = [
    { icon: TrendingUp, label: "Loan Amount Range", value: "₹8,000 – ₹35,000" },
    { icon: Calendar, label: "Tenure", value: "3 – 24 Months" },
    { icon: Percent, label: "Processing Fee", value: "1% – 3% of loan amount" },
  ];

  const BENEFITS = [
    {
      icon: Zap,
      title: "Instant Disbursal",
      desc: "Amount credited to your bank account within 15 minutes of approval.",
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      desc: "Your data is protected with 256-bit encryption and is never shared.",
    },
  ];

  const PULSE_DOTS = [0, 1, 2, 3] as const;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-xl font-extrabold text-foreground">Qicky</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-6"
              data-ocid="analysis.loading_state"
            >
              <div className="relative w-20 h-20">
                <div className="absolute inset-0 rounded-full border-4 border-brand-light" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-brand animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-brand fill-brand" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">
                  Analyzing your eligibility...
                </h3>
                <p className="text-muted-foreground text-sm mt-1">
                  This will take just a moment
                </p>
              </div>
              <div className="flex gap-2 mt-2">
                {PULSE_DOTS.map((i) => (
                  <motion.div
                    key={`dot-${i}`}
                    className="w-2 h-2 rounded-full bg-brand"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 1,
                      delay: i * 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg"
              data-ocid="analysis.panel"
            >
              <div className="bg-white rounded-2xl p-8 shadow-card border border-border mb-6">
                <div className="flex justify-center mb-5">
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-600 font-semibold text-sm px-4 py-2 rounded-full border border-green-100">
                    <CheckCircle2 className="w-4 h-4 fill-green-100" />
                    You are eligible!
                  </div>
                </div>

                <h2 className="text-2xl font-extrabold text-foreground text-center mb-1">
                  Congratulations, {firstName}! 🎉
                </h2>
                <p className="text-muted-foreground text-sm text-center mb-6">
                  Based on your profile, here&apos;s your pre-approved offer
                </p>

                <div className="bg-[#FAFAFA] rounded-xl p-5 text-center mb-5">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide font-semibold mb-1">
                    Pre-approved Amount
                  </p>
                  <p className="text-5xl font-extrabold text-brand">₹15,000</p>
                  <div className="inline-flex items-center gap-1.5 mt-3 bg-brand-light text-brand text-xs font-semibold px-3 py-1 rounded-full">
                    <Percent className="w-3 h-3" />
                    Starting at 9.98% p.a.
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  {DETAILS.map((d) => (
                    <div
                      key={d.label}
                      className="flex items-center justify-between py-3 border-b border-border last:border-0"
                    >
                      <div className="flex items-center gap-2.5 text-muted-foreground">
                        <d.icon className="w-4 h-4 text-brand" />
                        <span className="text-sm">{d.label}</span>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  data-ocid="analysis.apply.primary_button"
                  className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-bold
                    rounded-xl flex items-center justify-center gap-2 transition-colors text-base shadow-md"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  data-ocid="analysis.offers.secondary_button"
                  className="w-full mt-3 py-2.5 text-brand font-semibold text-sm
                    hover:underline flex items-center justify-center gap-1 transition-colors"
                >
                  View all offers
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BENEFITS.map((b) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="bg-white rounded-xl p-5 border border-border shadow-xs flex gap-3"
                  >
                    <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center shrink-0">
                      <b.icon className="w-5 h-5 text-brand" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground mb-0.5">
                        {b.title}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {b.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button
                type="button"
                onClick={onBack}
                data-ocid="analysis.back.button"
                className="w-full mt-5 py-2.5 text-muted-foreground hover:text-foreground
                  flex items-center justify-center gap-1.5 text-sm transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Start over
              </button>

              <div className="flex items-center justify-center gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-brand" />
                <div className="w-2 h-2 rounded-full bg-brand" />
                <div className="w-2 h-2 rounded-full bg-brand" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState<Step>("landing");
  const [formData, setFormData] = useState<FormData>({ name: "", mobile: "" });

  const handleLandingNext = useCallback((data: FormData) => {
    setFormData(data);
    setStep("otp");
  }, []);

  const handleOtpVerify = useCallback(() => {
    setStep("analysis");
  }, []);

  const handleBack = useCallback(() => {
    setStep("landing");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {step === "landing" && (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <LandingStep onNext={handleLandingNext} />
        </motion.div>
      )}
      {step === "otp" && (
        <motion.div
          key="otp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <OtpStep
            mobile={formData.mobile}
            onVerify={handleOtpVerify}
            onBack={handleBack}
          />
        </motion.div>
      )}
      {step === "analysis" && (
        <motion.div
          key="analysis"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <AnalysisStep name={formData.name} onBack={handleBack} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
