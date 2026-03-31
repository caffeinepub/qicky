import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  Clock,
  CreditCard,
  ExternalLink,
  FileText,
  IndianRupee,
  Mail,
  MapPin,
  Percent,
  RefreshCw,
  Shield,
  Smartphone,
  Star,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step = "landing" | "otp" | "analysis" | "offers" | "apply" | "thankyou";

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

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

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
    <div className="flex gap-2.5 justify-center" data-ocid="otp.input">
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
          className="w-11 h-12 text-center text-lg font-bold border-2 rounded-lg
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
                  "linear-gradient(135deg, oklch(0.40 0.14 12), oklch(0.33 0.12 12))",
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
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left: Hero panel — same as LandingStep */}
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
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-extrabold text-white">Qicky</span>
          </div>
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

      {/* Right: OTP panel */}
      <div className="w-full lg:w-1/2 min-h-screen bg-[#FAFAFA] flex flex-col px-6 py-10 lg:px-14">
        {/* Logo (mobile + right panel) */}
        <div className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">Qicky</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto lg:mx-0"
          data-ocid="otp.panel"
        >
          {/* OTP Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
            {/* Phone icon */}
            <div className="w-14 h-14 rounded-2xl bg-brand-light flex items-center justify-center mb-6">
              <Smartphone className="w-7 h-7 text-brand" />
            </div>

            <h2 className="text-2xl font-bold text-foreground mb-2">
              OTP has been sent to your phone
            </h2>
            <p className="text-muted-foreground text-sm mb-7 leading-relaxed">
              Kindly enter the code sent by Qicky to{" "}
              <span className="font-semibold text-foreground">
                {maskedMobile}
              </span>{" "}
              to complete verification
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

            {/* Resend */}
            <div className="text-center mt-5 text-sm text-muted-foreground">
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-brand font-semibold hover:underline inline-flex items-center gap-1.5"
                  data-ocid="otp.resend.button"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend OTP
                </button>
              ) : (
                <span>
                  Resend{" "}
                  <span className="font-semibold text-foreground">
                    (in {timer} seconds)
                  </span>
                </span>
              )}
            </div>

            {/* Verify button */}
            <button
              type="button"
              onClick={handleVerify}
              data-ocid="otp.submit_button"
              className="w-full mt-7 py-3.5 bg-brand hover:bg-brand-dark text-white font-bold
                rounded-xl flex items-center justify-center gap-2 transition-colors text-base shadow-md"
            >
              Verify
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Back */}
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

          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ backgroundColor: "#FFF3DC" }}
            >
              <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
                <User className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <p className="text-xs font-semibold text-amber-900 leading-snug">
                Must be a salaried professional
              </p>
            </div>
            <div
              className="rounded-xl p-4 flex items-start gap-3"
              style={{ backgroundColor: "#C8E6A0" }}
            >
              <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
                <IndianRupee className="w-4.5 h-4.5 text-green-700" />
              </div>
              <p className="text-xs font-semibold text-green-900 leading-snug">
                Minimum monthly salary of ₹20,000
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Analysis Step ────────────────────────────────────────────────────────────
function AnalysisStep({
  name,
  onBack,
  onViewOffers,
}: { name: string; onBack: () => void; onViewOffers: () => void }) {
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
            <Zap className="w-4.5 h-4.5 text-white fill-white" />
          </div>
          <span className="font-extrabold text-foreground text-lg">Qicky</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="text-center"
              data-ocid="analysis.loading_state"
            >
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-4 border-brand-light" />
                <div className="absolute inset-0 rounded-full border-4 border-t-brand border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                <div className="absolute inset-3 rounded-full bg-brand-light flex items-center justify-center">
                  <FileText className="w-5 h-5 text-brand" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-3">
                Analysing your profile…
              </h2>
              <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                We're checking your eligibility across 65+ lenders to find the
                best offers.
              </p>
              <div className="flex gap-2 justify-center mt-6">
                {PULSE_DOTS.map((i) => (
                  <div
                    key={`dot-${i}`}
                    className="w-2 h-2 rounded-full bg-brand animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
              data-ocid="analysis.panel"
            >
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-600" />
                </motion.div>
                <h2 className="text-2xl font-extrabold text-foreground mb-2">
                  Congratulations, {firstName}! 🎉
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  You're eligible for a personal loan up to{" "}
                  <span className="text-brand font-bold text-base">
                    ₹35,000
                  </span>
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-border shadow-card mb-5">
                <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-wider">
                  Offer Details
                </h3>
                <div className="space-y-3">
                  {DETAILS.map((d) => (
                    <div
                      key={d.label}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <d.icon className="w-4 h-4" />
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
                  onClick={onViewOffers}
                  data-ocid="analysis.apply.primary_button"
                  className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-bold
                    rounded-xl flex items-center justify-center gap-2 transition-colors text-base shadow-md"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={onViewOffers}
                  data-ocid="analysis.offers.secondary_button"
                  className="w-full mt-3 py-2.5 text-brand font-semibold text-sm
                    hover:underline flex items-center justify-center gap-1 transition-colors"
                >
                  View all offers →
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

// ─── Lenders Data ─────────────────────────────────────────────────────────────
interface Lender {
  id: string;
  name: string;
  fullName?: string;
  category: "nbfc" | "sfb";
  tagline: string;
  interestRate: number;
  maxAmountNum: number;
  maxAmount: string;
  processingFee: string;
  tenure: string;
  approvalChance: number;
  bestMatch: boolean;
  recommended: boolean;
  limitedOffer: boolean;
  logoColor: string;
  logoInitial: string;
  utmLink: string;
}

const LENDERS: Lender[] = [
  {
    id: "poonawala",
    name: "Poonawala Fincorp",
    category: "nbfc",
    tagline: "Fast personal loans, zero paperwork",
    interestRate: 9.99,
    maxAmountNum: 5000000,
    maxAmount: "50,00,000",
    processingFee: "Up to 2%",
    tenure: "12–60 months",
    approvalChance: 92,
    bestMatch: true,
    recommended: true,
    limitedOffer: true,
    logoColor: "#1A56DB",
    logoInitial: "P",
    utmLink:
      "https://www.poonawalafinance.com/personal-loan?utm_source=qicky&utm_medium=partner&utm_campaign=pl_2026",
  },
  {
    id: "abcl",
    name: "ABCL",
    fullName: "Aditya Birla Capital",
    category: "nbfc",
    tagline: "One of India's largest financial conglomerates",
    interestRate: 10.5,
    maxAmountNum: 4000000,
    maxAmount: "40,00,000",
    processingFee: "1%–2%",
    tenure: "12–48 months",
    approvalChance: 85,
    bestMatch: false,
    recommended: true,
    limitedOffer: false,
    logoColor: "#D97706",
    logoInitial: "AB",
    utmLink:
      "https://www.adityabirlacapital.com/abc-of-money/personal-loan?utm_source=qicky&utm_medium=partner&utm_campaign=pl_2026",
  },
  {
    id: "hero",
    name: "Hero Fincorp",
    category: "nbfc",
    tagline: "India's leading NBFC for personal finance",
    interestRate: 11.0,
    maxAmountNum: 3500000,
    maxAmount: "35,00,000",
    processingFee: "2%–3%",
    tenure: "12–36 months",
    approvalChance: 78,
    bestMatch: false,
    recommended: false,
    limitedOffer: true,
    logoColor: "#059669",
    logoInitial: "HF",
    utmLink:
      "https://www.herofincorp.com/personal-loan?utm_source=qicky&utm_medium=partner&utm_campaign=pl_2026",
  },
  {
    id: "smfg",
    name: "SMFG India Credit",
    category: "nbfc",
    tagline: "Powered by Sumitomo Mitsui — Japan's trust in India",
    interestRate: 11.99,
    maxAmountNum: 2500000,
    maxAmount: "25,00,000",
    processingFee: "1.5%–2.5%",
    tenure: "12–60 months",
    approvalChance: 73,
    bestMatch: false,
    recommended: false,
    limitedOffer: false,
    logoColor: "#7C3AED",
    logoInitial: "SM",
    utmLink:
      "https://www.smfgindiacredit.com/personal-loan?utm_source=qicky&utm_medium=partner&utm_campaign=pl_2026",
  },
  {
    id: "unity",
    name: "Unity Small Finance Bank",
    category: "sfb",
    tagline: "Banking for all — swift, secure, simple",
    interestRate: 12.5,
    maxAmountNum: 1500000,
    maxAmount: "15,00,000",
    processingFee: "1%–2%",
    tenure: "12–36 months",
    approvalChance: 68,
    bestMatch: false,
    recommended: false,
    limitedOffer: true,
    logoColor: "#DC2626",
    logoInitial: "U",
    utmLink:
      "https://unitysb.com/loan/personal-loan?utm_source=qicky&utm_medium=partner&utm_campaign=pl_2026",
  },
];

// ─── Countdown Hook ───────────────────────────────────────────────────────────
function useCountdown(initialSeconds: number) {
  const [seconds, setSeconds] = useState(initialSeconds);
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

// ─── Approval Bar ─────────────────────────────────────────────────────────────
function ApprovalBar({ chance }: { chance: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const id = setTimeout(() => setWidth(chance), 200);
    return () => clearTimeout(id);
  }, [chance]);

  const color = chance >= 85 ? "#10B981" : chance >= 70 ? "#F59E0B" : "#F97316";

  return (
    <div className="mt-3">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs text-white/50 font-medium tracking-wide">
          APPROVAL CHANCE
        </span>
        <span className="text-sm font-extrabold" style={{ color }}>
          {chance}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

// ─── Lender Card ──────────────────────────────────────────────────────────────
function LenderCard({
  lender,
  countdown,
  index,
  onApply,
}: {
  lender: Lender;
  countdown: string;
  index: number;
  onApply: (lender: Lender) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="relative rounded-2xl overflow-hidden"
      data-ocid={`offers.item.${index + 1}`}
      style={{
        background: lender.bestMatch
          ? "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(10,10,15,0.95) 60%)"
          : "rgba(255,255,255,0.04)",
        border: lender.bestMatch
          ? "1px solid rgba(99,102,241,0.5)"
          : "1px solid rgba(255,255,255,0.08)",
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Best Match banner */}
      {lender.bestMatch && (
        <div
          className="absolute top-0 left-0 right-0 text-center py-1.5 text-xs font-bold tracking-wider"
          style={{
            background: "linear-gradient(90deg, #6366F1, #8B5CF6)",
            color: "white",
          }}
        >
          ✅ BEST MATCH FOR YOU
        </div>
      )}

      <div className={`p-5 ${lender.bestMatch ? "pt-10" : ""}`}>
        {/* Badge row */}
        <div className="flex flex-wrap gap-2 mb-4">
          {lender.recommended && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(251,146,60,0.2)", color: "#FB923C" }}
            >
              🔥 Recommended for You
            </span>
          )}
          {lender.limitedOffer && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{ background: "rgba(239,68,68,0.2)", color: "#F87171" }}
            >
              ⏰ Limited Time Offer
            </span>
          )}
        </div>

        {/* Header row */}
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0"
            style={{ backgroundColor: lender.logoColor }}
          >
            {lender.logoInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-extrabold text-white text-base leading-tight">
                {lender.name}
              </h3>
              {lender.fullName && (
                <span className="text-white/40 text-xs">
                  ({lender.fullName})
                </span>
              )}
            </div>
            <p className="text-white/50 text-xs mt-0.5 leading-snug">
              {lender.tagline}
            </p>
          </div>
          <div
            className="shrink-0 px-3 py-1.5 rounded-lg text-center"
            style={{ background: "rgba(255,255,255,0.07)" }}
          >
            <div className="text-white font-extrabold text-sm">
              {lender.interestRate}%
            </div>
            <div className="text-white/40 text-xs">p.a.</div>
          </div>
        </div>

        {/* Stats row */}
        <div
          className="grid grid-cols-3 gap-2 mt-4 rounded-xl p-3"
          style={{ background: "rgba(255,255,255,0.04)" }}
        >
          <div className="text-center">
            <div className="text-white/40 text-xs mb-0.5">Max Loan</div>
            <div className="text-white font-bold text-sm">
              ₹{lender.maxAmount}
            </div>
          </div>
          <div
            className="text-center border-x"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div className="text-white/40 text-xs mb-0.5">Tenure</div>
            <div className="text-white font-bold text-sm">{lender.tenure}</div>
          </div>
          <div className="text-center">
            <div className="text-white/40 text-xs mb-0.5">Proc. Fee</div>
            <div className="text-white font-bold text-sm">
              {lender.processingFee}
            </div>
          </div>
        </div>

        {/* Approval bar */}
        <ApprovalBar chance={lender.approvalChance} />

        {/* Countdown */}
        {lender.limitedOffer && (
          <div
            className="mt-3 flex items-center justify-between rounded-lg px-3 py-2"
            style={{ background: "rgba(239,68,68,0.1)" }}
          >
            <span className="text-xs text-red-400 font-medium">
              ⏰ Offer expires in
            </span>
            <span className="text-red-400 font-mono font-extrabold text-sm tracking-wider">
              {countdown}
            </span>
          </div>
        )}

        {/* CTA row */}
        <div className="flex gap-2.5 mt-4">
          <button
            type="button"
            onClick={() => onApply(lender)}
            data-ocid={`offers.item.${index + 1}.button`}
            className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-95"
            style={{
              background: lender.bestMatch
                ? "linear-gradient(135deg, #6366F1, #8B5CF6)"
                : `linear-gradient(135deg, ${lender.logoColor}cc, ${lender.logoColor}88)`,
            }}
          >
            Apply Now →
          </button>
          <button
            type="button"
            className="px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:bg-white/10"
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Offers Step ──────────────────────────────────────────────────────────────
type SortMode = "best" | "rate" | "amount";

function OffersStep({
  name,
  onBack,
  onApply,
}: {
  name: string;
  onBack: () => void;
  onApply: (lender: Lender) => void;
}) {
  const [sort, setSort] = useState<SortMode>("best");
  const [showStickyBar, setShowStickyBar] = useState(false);
  const countdown = useCountdown(86399);
  const firstName = name.split(" ")[0] || name;

  useEffect(() => {
    const timer = setTimeout(() => setShowStickyBar(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const sortedLenders = [...LENDERS].sort((a, b) => {
    if (sort === "rate") return a.interestRate - b.interestRate;
    if (sort === "amount") return b.maxAmountNum - a.maxAmountNum;
    return b.approvalChance - a.approvalChance;
  });

  const nbfcLenders = sortedLenders.filter((l) => l.category === "nbfc");
  const sfbLenders = sortedLenders.filter((l) => l.category === "sfb");
  const bestLender = LENDERS.find((l) => l.bestMatch)!;

  const SORT_TABS: { key: SortMode; label: string }[] = [
    { key: "best", label: "✅ Best Match" },
    { key: "rate", label: "Lowest Rate" },
    { key: "amount", label: "Highest Amount" },
  ];

  return (
    <div
      className="min-h-screen pb-28"
      style={{ background: "#0A0A0F", color: "white" }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-4 py-4 flex items-center gap-3"
        style={{
          background: "rgba(10,10,15,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          data-ocid="offers.back.button"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <ChevronLeft className="w-4 h-4 text-white/70" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-white text-lg">Qicky</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-white/50">Live offers</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(99,102,241,0.2)", color: "#A5B4FC" }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />5 lenders matched · Updated
            just now
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            Your Pre-Approved Offers,{" "}
            <span style={{ color: "#A5B4FC" }}>{firstName} 🎉</span>
          </h1>
          <p className="text-white/50 text-sm mt-2">
            Matched from 65+ lenders based on your profile
          </p>
        </motion.div>

        {/* Sort tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-1 no-scrollbar">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSort(tab.key)}
              data-ocid={`offers.${tab.key}.tab`}
              className="shrink-0 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={
                sort === tab.key
                  ? {
                      background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                      color: "white",
                    }
                  : {
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.6)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* NBFC Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏆</span>
            <h2 className="font-extrabold text-white">Top NBFC Picks</h2>
            <span
              className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: "rgba(99,102,241,0.2)", color: "#A5B4FC" }}
            >
              {nbfcLenders.length} offers
            </span>
          </div>
          <div className="space-y-4">
            {nbfcLenders.map((lender, i) => (
              <LenderCard
                key={lender.id}
                lender={lender}
                countdown={countdown}
                index={i}
                onApply={onApply}
              />
            ))}
          </div>
        </div>

        {/* SFB Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">🏦</span>
            <h2 className="font-extrabold text-white">Small Finance Banks</h2>
            <span
              className="ml-auto text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: "rgba(16,185,129,0.2)", color: "#6EE7B7" }}
            >
              {sfbLenders.length} offer
            </span>
          </div>
          <div className="space-y-4">
            {sfbLenders.map((lender, i) => (
              <LenderCard
                key={lender.id}
                lender={lender}
                countdown={countdown}
                index={nbfcLenders.length + i}
                onApply={onApply}
              />
            ))}
          </div>
        </div>

        {/* Trust strip */}
        <div
          className="rounded-2xl p-4 flex items-center justify-around mt-6 mb-4"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div className="text-center">
            <div className="text-lg font-extrabold text-white">5.7cr+</div>
            <div className="text-xs text-white/40">Customers</div>
          </div>
          <div
            className="w-px h-8"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="text-center">
            <div className="text-lg font-extrabold text-white">65+</div>
            <div className="text-xs text-white/40">Lenders</div>
          </div>
          <div
            className="w-px h-8"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="text-center">
            <div className="text-lg font-extrabold text-white">₹65k Cr+</div>
            <div className="text-xs text-white/40">Disbursed</div>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4"
            style={{
              background: "rgba(10,10,15,0.96)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid rgba(99,102,241,0.3)",
            }}
          >
            <div className="max-w-2xl mx-auto flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white shrink-0"
                style={{ backgroundColor: bestLender.logoColor }}
              >
                {bestLender.logoInitial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm leading-tight">
                  ⚡ {bestLender.name}
                </div>
                <div className="text-white/50 text-xs">
                  {bestLender.approvalChance}% approval ·{" "}
                  {bestLender.interestRate}% p.a.
                </div>
              </div>
              <button
                type="button"
                onClick={() => onApply(bestLender)}
                data-ocid="offers.apply.primary_button"
                className="shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                }}
              >
                Apply Now →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Bureau Verified Badge ────────────────────────────────────────────────────
function BureauBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ml-2 shrink-0"
      style={{ background: "rgba(16,185,129,0.15)", color: "#34D399" }}
    >
      <Shield className="w-2.5 h-2.5" />
      Bureau Verified
    </span>
  );
}

// ─── Form Field ───────────────────────────────────────────────────────────────
function FormField({
  label,
  icon: Icon,
  children,
  accentColor,
  delay,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  accentColor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      <div className="flex items-center mb-1.5">
        <Icon className="w-3.5 h-3.5 mr-1.5" style={{ color: accentColor }} />
        <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
          {label}
        </span>
        <BureauBadge />
      </div>
      {children}
    </motion.div>
  );
}

// ─── Application Form Step ────────────────────────────────────────────────────
function ApplicationFormStep({
  lender,
  name,
  mobile,
  onSubmit,
  onBack,
}: {
  lender: Lender;
  name: string;
  mobile: string;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const inputBase = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "white",
    borderRadius: "12px",
    padding: "12px 16px",
    width: "100%",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  } as React.CSSProperties;

  const focusStyle = {
    border: `1px solid ${lender.logoColor}88`,
    boxShadow: `0 0 0 3px ${lender.logoColor}22`,
  };

  const [focusedField, setFocusedField] = useState<string | null>(null);

  const getInputStyle = (field: string) => ({
    ...inputBase,
    ...(focusedField === field ? focusStyle : {}),
  });

  const SECTION_HEADER_STYLE = {
    color: "rgba(255,255,255,0.35)",
    fontSize: "10px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "16px",
    marginTop: "8px",
    paddingBottom: "10px",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  };

  const accentColor = lender.logoColor;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#0A0A0F", color: "white" }}
      data-ocid="apply.panel"
    >
      {/* Sticky Header */}
      <div
        className="sticky top-0 z-30 px-4 py-3.5 flex items-center gap-3"
        style={{
          background: "rgba(10,10,15,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          data-ocid="apply.back.button"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/10"
          style={{ border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <ChevronLeft className="w-4 h-4 text-white/70" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-white text-lg">Qicky</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-white text-xs"
            style={{ backgroundColor: lender.logoColor }}
          >
            {lender.logoInitial}
          </div>
          <span className="text-white/60 text-xs font-medium hidden sm:block">
            {lender.name}
          </span>
        </div>
      </div>

      {/* Equifax Bureau Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-4 mt-4 rounded-2xl p-4"
        style={{
          background: "rgba(16,185,129,0.08)",
          border: "1px solid rgba(16,185,129,0.25)",
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "rgba(16,185,129,0.15)" }}
          >
            <Shield className="w-5 h-5" style={{ color: "#10B981" }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p
                className="font-extrabold text-sm"
                style={{ color: "#34D399" }}
              >
                Equifax Credit Bureau Report Fetched
              </p>
              <span
                className="font-mono text-xs font-bold px-2 py-0.5 rounded shrink-0"
                style={{
                  background: "rgba(16,185,129,0.2)",
                  color: "#10B981",
                  letterSpacing: "0.08em",
                }}
              >
                EQUIFAX
              </span>
            </div>
            <p
              className="text-xs mt-1 leading-relaxed"
              style={{ color: "rgba(52,211,153,0.8)" }}
            >
              We've pre-filled your application using your Equifax credit report
              to make your journey seamless.
            </p>
            <p
              className="text-xs mt-2 font-medium"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              ✎ All fields are editable. Please review before submitting.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Form */}
      <form
        onSubmit={handleFormSubmit}
        className="max-w-2xl mx-auto px-4 pb-10"
      >
        {/* Personal Details */}
        <div className="mt-6">
          <div style={SECTION_HEADER_STYLE}>
            <User className="w-3.5 h-3.5" style={{ color: accentColor }} />
            Personal Details
          </div>
          <div className="space-y-4">
            <FormField
              label="Full Name"
              icon={User}
              accentColor={accentColor}
              delay={0.05}
            >
              <input
                type="text"
                defaultValue={name || "Rahul Sharma"}
                data-ocid="apply.name.input"
                style={getInputStyle("name")}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>

            <FormField
              label="Date of Birth"
              icon={Calendar}
              accentColor={accentColor}
              delay={0.1}
            >
              <input
                type="text"
                defaultValue="15/03/1990"
                data-ocid="apply.dob.input"
                style={getInputStyle("dob")}
                onFocus={() => setFocusedField("dob")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>

            <FormField
              label="PAN Number"
              icon={CreditCard}
              accentColor={accentColor}
              delay={0.15}
            >
              <input
                type="text"
                defaultValue="ABCDE1234F"
                data-ocid="apply.pan.input"
                style={getInputStyle("pan")}
                onFocus={() => setFocusedField("pan")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>

            <FormField
              label="Mobile Number"
              icon={Smartphone}
              accentColor={accentColor}
              delay={0.2}
            >
              <div className="flex gap-2">
                <span
                  className="inline-flex items-center px-3 rounded-xl text-sm font-medium shrink-0"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    color: "rgba(255,255,255,0.6)",
                  }}
                >
                  +91
                </span>
                <input
                  type="tel"
                  defaultValue={mobile || "9876543210"}
                  data-ocid="apply.mobile.input"
                  style={{ ...getInputStyle("mobile") }}
                  onFocus={() => setFocusedField("mobile")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </FormField>

            <FormField
              label="Email Address"
              icon={Mail}
              accentColor={accentColor}
              delay={0.25}
            >
              <input
                type="email"
                defaultValue="rahul.sharma@gmail.com"
                data-ocid="apply.email.input"
                style={getInputStyle("email")}
                onFocus={() => setFocusedField("email")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>
          </div>
        </div>

        {/* Financial Details */}
        <div className="mt-8">
          <div style={SECTION_HEADER_STYLE}>
            <IndianRupee
              className="w-3.5 h-3.5"
              style={{ color: accentColor }}
            />
            Financial Details
          </div>
          <div className="space-y-4">
            {/* Monthly Income — highlighted */}
            <motion.div
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.3 }}
            >
              <div className="flex items-center mb-1.5">
                <IndianRupee
                  className="w-3.5 h-3.5 mr-1.5"
                  style={{ color: accentColor }}
                />
                <span className="text-xs font-semibold text-white/60 uppercase tracking-wide">
                  Monthly Net Income
                </span>
                <BureauBadge />
              </div>
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  border: `1.5px solid ${lender.logoColor}60`,
                  boxShadow: `0 0 16px ${lender.logoColor}20`,
                }}
              >
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold"
                  style={{ color: accentColor }}
                >
                  ₹
                </span>
                <input
                  type="text"
                  defaultValue="75,000"
                  data-ocid="apply.income.input"
                  style={{
                    ...inputBase,
                    paddingLeft: "32px",
                    fontWeight: 700,
                    fontSize: "16px",
                    border: "none",
                    boxShadow: "none",
                    borderRadius: "10px",
                    color: "white",
                  }}
                  onFocus={() => setFocusedField("income")}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
              <p
                className="text-xs mt-1.5 font-medium"
                style={{ color: accentColor }}
              >
                ✓ Income verified via Equifax credit pull
              </p>
            </motion.div>

            <FormField
              label="Employment Type"
              icon={Briefcase}
              accentColor={accentColor}
              delay={0.35}
            >
              <select
                data-ocid="apply.employment.select"
                defaultValue="Salaried"
                style={getInputStyle("employment")}
                onFocus={() => setFocusedField("employment")}
                onBlur={() => setFocusedField(null)}
              >
                <option value="Salaried" style={{ background: "#1a1a24" }}>
                  Salaried
                </option>
                <option value="Self-Employed" style={{ background: "#1a1a24" }}>
                  Self-Employed
                </option>
                <option value="Business" style={{ background: "#1a1a24" }}>
                  Business
                </option>
              </select>
            </FormField>

            <FormField
              label="Employer Name"
              icon={Building}
              accentColor={accentColor}
              delay={0.4}
            >
              <input
                type="text"
                defaultValue="Infosys Limited"
                data-ocid="apply.employer.input"
                style={getInputStyle("employer")}
                onFocus={() => setFocusedField("employer")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>

            <FormField
              label="Work Experience"
              icon={Clock}
              accentColor={accentColor}
              delay={0.45}
            >
              <input
                type="text"
                defaultValue="5 Years"
                data-ocid="apply.experience.input"
                style={getInputStyle("experience")}
                onFocus={() => setFocusedField("experience")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>
          </div>
        </div>

        {/* Loan Details */}
        <div className="mt-8">
          <div style={SECTION_HEADER_STYLE}>
            <FileText className="w-3.5 h-3.5" style={{ color: accentColor }} />
            Loan Details
          </div>
          <div className="space-y-4">
            <FormField
              label="Loan Amount Required"
              icon={IndianRupee}
              accentColor={accentColor}
              delay={0.5}
            >
              <input
                type="text"
                defaultValue="₹5,00,000"
                data-ocid="apply.loan_amount.input"
                style={getInputStyle("loanAmount")}
                onFocus={() => setFocusedField("loanAmount")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>

            <FormField
              label="Loan Purpose"
              icon={FileText}
              accentColor={accentColor}
              delay={0.55}
            >
              <select
                data-ocid="apply.purpose.select"
                defaultValue="Home Renovation"
                style={getInputStyle("purpose")}
                onFocus={() => setFocusedField("purpose")}
                onBlur={() => setFocusedField(null)}
              >
                <option style={{ background: "#1a1a24" }}>
                  Home Renovation
                </option>
                <option style={{ background: "#1a1a24" }}>
                  Medical Emergency
                </option>
                <option style={{ background: "#1a1a24" }}>Education</option>
                <option style={{ background: "#1a1a24" }}>Wedding</option>
                <option style={{ background: "#1a1a24" }}>Travel</option>
                <option style={{ background: "#1a1a24" }}>
                  Debt Consolidation
                </option>
                <option style={{ background: "#1a1a24" }}>Others</option>
              </select>
            </FormField>

            <FormField
              label="Preferred Tenure"
              icon={Calendar}
              accentColor={accentColor}
              delay={0.6}
            >
              <input
                type="text"
                defaultValue="36 months"
                data-ocid="apply.tenure.input"
                style={getInputStyle("tenure")}
                onFocus={() => setFocusedField("tenure")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>

            <FormField
              label="City"
              icon={MapPin}
              accentColor={accentColor}
              delay={0.65}
            >
              <input
                type="text"
                defaultValue="Mumbai"
                data-ocid="apply.city.input"
                style={getInputStyle("city")}
                onFocus={() => setFocusedField("city")}
                onBlur={() => setFocusedField(null)}
              />
            </FormField>
          </div>
        </div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="mt-8"
        >
          <button
            type="submit"
            data-ocid="apply.submit_button"
            className="w-full py-4 rounded-xl font-extrabold text-base text-white transition-all hover:opacity-90 active:scale-[0.98]"
            style={{
              background: `linear-gradient(135deg, ${lender.logoColor}, ${lender.logoColor}99)`,
              boxShadow: `0 8px 32px ${lender.logoColor}40`,
            }}
          >
            Submit Application →
          </button>
          <p
            className="text-center text-xs mt-3 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            By submitting, you authorise {lender.name} to access your credit
            information and process your loan application.
          </p>
        </motion.div>
      </form>
    </div>
  );
}

// ─── EMI Calculator ───────────────────────────────────────────────────────────
function calcEMI(
  principal: number,
  annualRate: number,
  months: number,
): number {
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);
}

function fmtINR(n: number): string {
  return new Intl.NumberFormat("en-IN").format(Math.round(n));
}

// ─── Thank You Step ───────────────────────────────────────────────────────────
function ThankYouStep({
  lender,
  name,
  onBackToOffers,
}: {
  lender: Lender;
  name: string;
  onBackToOffers: () => void;
}) {
  const emi = calcEMI(500000, lender.interestRate, 36);

  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: "#0A0A0F", color: "white" }}
      data-ocid="thankyou.panel"
    >
      {/* Header */}
      <div
        className="px-4 py-3.5 flex items-center gap-3"
        style={{
          background: "rgba(10,10,15,0.95)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-white text-lg">Qicky</span>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-10 text-center">
        {/* Animated success ring */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 16,
            delay: 0.15,
          }}
          className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center relative"
          style={{
            border: `3px solid ${lender.logoColor}`,
            background: `${lender.logoColor}15`,
            boxShadow: `0 0 40px ${lender.logoColor}30`,
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 240,
              damping: 14,
              delay: 0.45,
            }}
          >
            <CheckCircle2
              className="w-14 h-14"
              style={{ color: lender.logoColor }}
            />
          </motion.div>
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid ${lender.logoColor}40` }}
            animate={{ scale: [1, 1.25, 1.5], opacity: [0.6, 0.3, 0] }}
            transition={{
              duration: 1.8,
              repeat: 2,
              ease: "easeOut",
              delay: 0.6,
            }}
          />
        </motion.div>

        {/* Lender logo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-white text-xl mx-auto mb-5"
          style={{ backgroundColor: lender.logoColor }}
        >
          {lender.logoInitial}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.45 }}
        >
          <h1 className="text-3xl font-extrabold text-white mb-2">
            Application Submitted!
          </h1>
          <p className="text-white/50 text-sm leading-relaxed">
            Your application to{" "}
            <span className="text-white font-semibold">{lender.name}</span> has
            been successfully submitted.
          </p>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="mt-8 rounded-2xl p-5 text-left"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(12px)",
          }}
        >
          <h3
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Application Summary
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Applicant Name",
                value: name || "Rahul Sharma",
                icon: User,
              },
              {
                label: "Loan Amount",
                value: "₹5,00,000",
                icon: IndianRupee,
              },
              {
                label: "Est. Monthly EMI",
                value: `₹${fmtINR(emi)} / month`,
                icon: TrendingUp,
              },
              {
                label: "Approval Timeline",
                value: "2-4 business hours",
                icon: Clock,
              },
              {
                label: "Lender",
                value: lender.name,
                icon: Building,
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <row.icon
                    className="w-4 h-4"
                    style={{ color: "rgba(255,255,255,0.35)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                  >
                    {row.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-white">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Equifax note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <Shield className="w-3.5 h-3.5" style={{ color: "#10B981" }} />
          <span className="text-xs font-medium" style={{ color: "#34D399" }}>
            Application powered by Equifax verified data ✓
          </span>
        </motion.div>

        {/* Primary CTA — UTM link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.45 }}
          className="mt-8"
        >
          <button
            type="button"
            onClick={() => window.open(lender.utmLink, "_blank")}
            data-ocid="thankyou.proceed.primary_button"
            className="w-full py-4 rounded-xl font-extrabold text-base text-white transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2.5"
            style={{
              background: `linear-gradient(135deg, ${lender.logoColor}, ${lender.logoColor}bb)`,
              boxShadow: `0 8px 32px ${lender.logoColor}40`,
            }}
          >
            Continue Your Journey on {lender.name}
            <ExternalLink className="w-4.5 h-4.5" />
          </button>
          <p
            className="text-center text-xs mt-3 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            You will be redirected to {lender.name}'s official platform to
            complete KYC &amp; documentation.
          </p>
        </motion.div>

        {/* Back to offers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.4 }}
          className="mt-6"
        >
          <button
            type="button"
            onClick={onBackToOffers}
            data-ocid="thankyou.back.link"
            className="text-sm font-semibold transition-colors hover:text-white"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            ← Back to All Offers
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <div
        className="mt-12 border-t text-center pt-6 pb-4 px-4"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
          © {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="underline hover:opacity-70 transition-opacity"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState<Step>("landing");
  const [formData, setFormData] = useState<FormData>({ name: "", mobile: "" });
  const [selectedLender, setSelectedLender] = useState<Lender | null>(null);

  const handleLandingNext = useCallback((data: FormData) => {
    setFormData(data);
    setStep("otp");
  }, []);

  const handleOtpVerify = useCallback(() => {
    setStep("analysis");
  }, []);

  const handleViewOffers = useCallback(() => {
    setStep("offers");
  }, []);

  const handleBack = useCallback(() => {
    setStep("landing");
  }, []);

  const handleApply = useCallback((lender: Lender) => {
    setSelectedLender(lender);
    setStep("apply");
  }, []);

  const handleSubmitForm = useCallback(() => {
    setStep("thankyou");
  }, []);

  const handleBackToOffers = useCallback(() => {
    setStep("offers");
    setSelectedLender(null);
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
          <AnalysisStep
            name={formData.name}
            onBack={handleBack}
            onViewOffers={handleViewOffers}
          />
        </motion.div>
      )}
      {step === "offers" && (
        <motion.div
          key="offers"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <OffersStep
            name={formData.name}
            onBack={handleBack}
            onApply={handleApply}
          />
        </motion.div>
      )}
      {step === "apply" && selectedLender && (
        <motion.div
          key="apply"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <ApplicationFormStep
            lender={selectedLender}
            name={formData.name}
            mobile={formData.mobile}
            onSubmit={handleSubmitForm}
            onBack={() => setStep("offers")}
          />
        </motion.div>
      )}
      {step === "thankyou" && selectedLender && (
        <motion.div
          key="thankyou"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <ThankYouStep
            lender={selectedLender}
            name={formData.name}
            onBackToOffers={handleBackToOffers}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
