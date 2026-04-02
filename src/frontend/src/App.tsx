import {
  ArrowLeft,
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
  Lock,
  Mail,
  MapPin,
  Percent,
  RefreshCw,
  Shield,
  ShieldCheck,
  Smartphone,
  Star,
  TrendingUp,
  User,
  Users,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import AIChatBot from "./components/AIChatBot";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step =
  | "landing"
  | "otp"
  | "analysis"
  | "offers"
  | "alt-offers"
  | "apply"
  | "thankyou";

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

interface AltLender {
  id: string;
  name: string;
  category: "gold-loan" | "fd-card";
  tagline: string;
  interestRate: number;
  keyBenefit: string;
  approvalChance: number;
  logoColor: string;
  logoInitial: string;
  utmLink: string;
}

const _ALT_LENDERS: AltLender[] = [
  {
    id: "muthoot",
    name: "Muthoot Finance",
    category: "gold-loan",
    tagline: "India's #1 gold loan company — instant disbursal",
    interestRate: 9.96,
    keyBenefit: "Loan in 30 minutes",
    approvalChance: 97,
    logoColor: "#B45309",
    logoInitial: "MF",
    utmLink: "https://www.muthootfinance.com/gold-loan?utm_source=qicky",
  },
  {
    id: "manappuram",
    name: "Manappuram Finance",
    category: "gold-loan",
    tagline: "Quick gold loans with flexible repayment options",
    interestRate: 10.5,
    keyBenefit: "Highest LTV on gold",
    approvalChance: 95,
    logoColor: "#D97706",
    logoInitial: "MN",
    utmLink: "https://www.manappuram.com/gold-loan?utm_source=qicky",
  },
  {
    id: "sbi-fd",
    name: "SBI FD Credit Card",
    category: "fd-card",
    tagline: "Credit card secured against your SBI Fixed Deposit",
    interestRate: 18.0,
    keyBenefit: "No credit score required",
    approvalChance: 98,
    logoColor: "#1A56DB",
    logoInitial: "SBI",
    utmLink:
      "https://www.sbi.co.in/web/personal-banking/cards/credit-card/sbi-card?utm_source=qicky",
  },
  {
    id: "axis-fd",
    name: "Axis Bank FD Card",
    category: "fd-card",
    tagline: "Turn your Fixed Deposit into spending power instantly",
    interestRate: 17.5,
    keyBenefit: "Up to 100% of FD as limit",
    approvalChance: 96,
    logoColor: "#7C3AED",
    logoInitial: "AX",
    utmLink:
      "https://www.axisbank.com/retail/cards/credit-card/fd-credit-card?utm_source=qicky",
  },
];

const STATS = [
  { value: "5.7cr+", label: "Satisfied Customers" },
  { value: "65+", label: "Lending Partners" },
  { value: "₹65k Cr+", label: "Loans Disbursed" },
];

const LOAN_CARDS = [
  {
    title: "Loans from ₹50,000 to ₹15,00,000",
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

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: User,
    title: "Enter Details",
    desc: "Fill your name & mobile in seconds",
  },
  {
    step: "02",
    icon: Smartphone,
    title: "Verify OTP",
    desc: "Quick 6-digit verification",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Get Analysis",
    desc: "We match you with 65+ lenders",
  },
  {
    step: "04",
    icon: Zap,
    title: "Choose Offer",
    desc: "Pick the best deal & apply",
  },
];

const ANALYSIS_STAGES = [
  {
    label: "Fetching your Equifax Credit Report...",
    icon: FileText,
    progress: 25,
  },
  { label: "Analysing your credit profile...", icon: TrendingUp, progress: 55 },
  { label: "Matching with 65+ lenders...", icon: Users, progress: 80 },
  { label: "Calculating best offers for you...", icon: Zap, progress: 100 },
];

const LENDER_TICKER = [
  "Poonawala Fincorp",
  "ABCL",
  "Hero Fincorp",
  "SMFG India Credit",
  "Unity Small Finance Bank",
  "Bajaj Finance",
  "HDFC Bank",
  "Axis Finance",
];

// ─── useCountUp hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, trigger = true) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number | null = null;
    const tick = (ts: number) => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration, trigger]);
  return count;
}

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

// ─── EMI Helpers ──────────────────────────────────────────────────────────────
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

// ─── Landing Step ─────────────────────────────────────────────────────────────
function LandingStep({ onNext }: { onNext: (data: FormData) => void }) {
  const [form, setForm] = useState<FormData>({ name: "", mobile: "" });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [emiAmount, setEmiAmount] = useState(500000);
  const [emiRate, setEmiRate] = useState(12);
  const [emiTenure, setEmiTenure] = useState(36);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

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

  const FLOATING_DOTS = [
    { id: "p1", x: "15%", y: "20%", size: 8, delay: 0 },
    { id: "p2", x: "80%", y: "15%", size: 12, delay: 0.8 },
    { id: "p3", x: "10%", y: "65%", size: 6, delay: 1.2 },
    { id: "p4", x: "75%", y: "70%", size: 10, delay: 0.4 },
    { id: "p5", x: "50%", y: "10%", size: 5, delay: 1.6 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Split */}
      <section className="flex flex-col lg:flex-row min-h-[90vh]">
        {/* Left: Hero Image */}
        <div
          className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-12 overflow-hidden"
          style={{
            backgroundImage: "url(/assets/generated/hero-loan.dim_760x900.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/60 to-navy/20" />
          {/* Maroon radial glow */}
          <div
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.40 0.14 12 / 0.35) 0%, transparent 70%)",
              transform: "translate(-30%, 20%)",
            }}
          />
          {/* Floating particles */}
          {FLOATING_DOTS.map((dot, i) => (
            <motion.div
              key={dot.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: dot.x,
                top: dot.y,
                width: dot.size,
                height: dot.size,
                background: "oklch(0.40 0.14 12 / 0.5)",
              }}
              animate={{ y: [0, -14, 0], opacity: [0.4, 0.8, 0.4] }}
              transition={{
                duration: 3 + i * 0.5,
                delay: dot.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
          <div className="relative z-10">
            {/* Star review pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              4.8/5 from 2,30,000+ reviews
            </div>
            <div className="inline-flex items-center gap-2 bg-brand/20 backdrop-blur-sm border border-brand/30 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6 ml-3">
              <Shield className="w-3.5 h-3.5 text-green-400" />
              Trusted by 5.7 Crore+ Indians
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-4"
            >
              Quick disbursals with
              <br />
              <span className="text-brand">minimal documentation</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/80 text-lg leading-relaxed max-w-md"
            >
              Get your instant personal loan in 15 minutes by following just 4
              easy steps.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex gap-8 mt-8"
            >
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-extrabold text-white">
                    {s.value}
                  </div>
                  <div className="text-white/60 text-xs mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Right: Form Panel */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#FAFAFA] px-6 py-12 lg:px-16 relative overflow-hidden">
          {/* subtle top maroon accent bar */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 h-1 origin-left"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.40 0.14 12), oklch(0.55 0.18 12), oklch(0.40 0.14 12))",
            }}
          />
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
              Get up to ₹15 Lakhs
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

              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Lock className="w-3 h-3 text-green-500" />
                100% Secure · No spam · No hidden charges
              </div>

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
            <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-border">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                <Shield className="w-3.5 h-3.5" />
                Bank-grade security
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-brand-light text-brand border border-brand/20">
                <Clock className="w-3.5 h-3.5" />
                15-min disbursal
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                <BadgeCheck className="w-3.5 h-3.5" />
                RBI Compliant
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* EMI Calculator Section */}
      <section className="bg-[#FAFAFA] py-16 px-6" id="emi-calculator">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-brand-light text-brand text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Calculate Your EMI
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              EMI Calculator
            </h3>
            <p className="text-muted-foreground mt-2 text-sm">
              Plan your loan repayment before you apply
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg border border-border overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Sliders */}
              <div className="p-8 space-y-8">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-foreground">
                      Loan Amount
                    </span>
                    <span className="text-sm font-bold text-brand bg-brand-light px-3 py-1 rounded-full">
                      ₹{fmtINR(emiAmount)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={1500000}
                    step={10000}
                    value={emiAmount}
                    onChange={(e) => setEmiAmount(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-brand"
                    style={{
                      background: `linear-gradient(to right, #800020 ${((emiAmount - 50000) / (1500000 - 50000)) * 100}%, #e5e7eb ${((emiAmount - 50000) / (1500000 - 50000)) * 100}%)`,
                    }}
                    data-ocid="emi.amount.input"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>₹50,000</span>
                    <span>₹15,00,000</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-foreground">
                      Interest Rate (p.a.)
                    </span>
                    <span className="text-sm font-bold text-brand bg-brand-light px-3 py-1 rounded-full">
                      {emiRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={9}
                    max={36}
                    step={0.5}
                    value={emiRate}
                    onChange={(e) => setEmiRate(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-brand"
                    style={{
                      background: `linear-gradient(to right, #800020 ${((emiRate - 9) / (36 - 9)) * 100}%, #e5e7eb ${((emiRate - 9) / (36 - 9)) * 100}%)`,
                    }}
                    data-ocid="emi.rate.input"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>9%</span>
                    <span>36%</span>
                  </div>
                </div>

                {/* Tenure */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-foreground">
                      Loan Tenure
                    </span>
                    <span className="text-sm font-bold text-brand bg-brand-light px-3 py-1 rounded-full">
                      {emiTenure} months
                    </span>
                  </div>
                  <input
                    type="range"
                    min={6}
                    max={60}
                    step={6}
                    value={emiTenure}
                    onChange={(e) => setEmiTenure(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer accent-brand"
                    style={{
                      background: `linear-gradient(to right, #800020 ${((emiTenure - 6) / (60 - 6)) * 100}%, #e5e7eb ${((emiTenure - 6) / (60 - 6)) * 100}%)`,
                    }}
                    data-ocid="emi.tenure.input"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>6 mo</span>
                    <span>60 mo</span>
                  </div>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gradient-to-br from-brand to-[#5c001a] p-8 flex flex-col justify-between text-white">
                <div>
                  <p className="text-white/70 text-sm font-medium mb-1">
                    Monthly EMI
                  </p>
                  <p className="text-4xl font-extrabold tracking-tight">
                    ₹{fmtINR(calcEMI(emiAmount, emiRate, emiTenure))}
                  </p>
                  <p className="text-white/60 text-xs mt-1">
                    per month for {emiTenure} months
                  </p>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Principal Amount</span>
                    <span className="font-semibold">₹{fmtINR(emiAmount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/70">Total Interest</span>
                    <span className="font-semibold">
                      ₹
                      {fmtINR(
                        calcEMI(emiAmount, emiRate, emiTenure) * emiTenure -
                          emiAmount,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-white/20 pt-3">
                    <span className="text-white/70">Total Payable</span>
                    <span className="font-bold text-base">
                      ₹
                      {fmtINR(
                        calcEMI(emiAmount, emiRate, emiTenure) * emiTenure,
                      )}
                    </span>
                  </div>
                </div>

                {/* Stacked bar */}
                <div className="mt-6">
                  <p className="text-white/60 text-xs mb-2">Breakup</p>
                  <div className="flex h-5 rounded-full overflow-hidden w-full">
                    <div
                      className="bg-white/90"
                      style={{
                        width: `${(emiAmount / (calcEMI(emiAmount, emiRate, emiTenure) * emiTenure)) * 100}%`,
                      }}
                    />
                    <div className="bg-white/30 flex-1" />
                  </div>
                  <div className="flex gap-4 mt-2 text-xs text-white/70">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-white/90 inline-block" />
                      Principal
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm bg-white/30 inline-block" />
                      Interest
                    </span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    document
                      .getElementById("full-name")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="mt-6 w-full bg-white text-brand font-bold py-3 rounded-xl hover:bg-white/90 transition-all duration-200 text-sm"
                  type="button"
                  data-ocid="emi.primary_button"
                >
                  Check Your Eligibility →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-light text-brand text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              Why Qicky
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Built for <span className="text-brand">speed & simplicity</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f, idx) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl border border-border
                  hover:border-brand/40 hover:shadow-lg transition-all group cursor-default"
              >
                <div className="absolute top-3 left-3 text-xs font-extrabold text-brand/30 group-hover:text-brand/60 transition-colors">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <div className="w-14 h-14 rounded-2xl bg-brand-light group-hover:bg-brand/20 flex items-center justify-center mb-4 transition-all group-hover:scale-110">
                  <f.icon className="w-7 h-7 text-brand" />
                </div>
                <p className="font-semibold text-foreground text-sm leading-snug">
                  {f.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section — maroon banner */}
      <section
        ref={statsRef}
        className="py-14 px-6"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.40 0.14 12), oklch(0.33 0.12 12))",
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6 text-center">
            <StatItem
              value={570}
              suffix="cr+"
              label="Satisfied Customers"
              trigger={statsVisible}
            />
            <StatItem
              value={65}
              suffix="+"
              label="Lending Partners"
              trigger={statsVisible}
            />
            <StatItem
              value={65}
              suffix="k Cr+"
              label="Loans Disbursed"
              prefix="₹"
              trigger={statsVisible}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#FAFAFA] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-brand-light text-brand text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
              How It Works
            </div>
            <h3 className="text-2xl font-bold text-foreground">
              Get your loan in{" "}
              <span className="text-brand">4 simple steps</span>
            </h3>
          </div>
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-8">
            {/* connector line desktop */}
            <div
              className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-px"
              style={{
                background:
                  "repeating-linear-gradient(90deg, oklch(0.40 0.14 12 / 0.3) 0, oklch(0.40 0.14 12 / 0.3) 8px, transparent 8px, transparent 16px)",
              }}
            />
            {HOW_IT_WORKS.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4 relative z-10"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.40 0.14 12), oklch(0.50 0.16 12))",
                    boxShadow: "0 8px 24px oklch(0.40 0.14 12 / 0.3)",
                  }}
                >
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-xs font-extrabold text-brand mb-1">
                  STEP {step.step}
                </div>
                <h4 className="font-bold text-foreground mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Cards */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {LOAN_CARDS.map((c, idx) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
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
      <footer
        className="py-8 px-6"
        style={{ background: "oklch(0.14 0.055 10)" }}
      >
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

// ─── StatItem ─────────────────────────────────────────────────────────────────
function StatItem({
  value,
  suffix,
  label,
  prefix = "",
  trigger,
}: {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
  trigger: boolean;
}) {
  const count = useCountUp(value, 1400, trigger);
  return (
    <div>
      <div className="text-3xl font-extrabold text-white">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="text-white/60 text-sm mt-1">{label}</div>
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
  const [showPanModal, setShowPanModal] = useState(false);
  const [showManualPan, setShowManualPan] = useState(false);
  const [manualPan, setManualPan] = useState("");
  const [panError, setPanError] = useState("");

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
    setShowPanModal(true);
  };

  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const handleManualPanContinue = () => {
    const pan = manualPan.trim().toUpperCase();
    if (!PAN_REGEX.test(pan)) {
      setPanError("Please enter a valid 10-character PAN (e.g. ABCDE1234F)");
      return;
    }
    setPanError("");
    setShowManualPan(false);
    setShowPanModal(false);
    onVerify();
  };

  const maskedMobile = `+91 ${mobile.slice(0, 2)}****${mobile.slice(-3)}`;

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left: Hero panel */}
        <div
          className="hidden lg:flex lg:w-1/2 relative flex-col justify-end p-12 overflow-hidden"
          style={{
            backgroundImage: "url(/assets/generated/hero-loan.dim_760x900.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-navy/95 via-navy/60 to-navy/20" />
          <div
            className="absolute bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, oklch(0.40 0.14 12 / 0.3) 0%, transparent 70%)",
              transform: "translate(-20%, 20%)",
            }}
          />
          <div className="relative z-10">
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
        <div className="w-full lg:w-1/2 min-h-screen bg-[#FAFAFA] flex flex-col px-6 py-10 lg:px-14 relative overflow-hidden">
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="absolute top-0 left-0 right-0 h-1 origin-left"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.40 0.14 12), oklch(0.55 0.18 12), oklch(0.40 0.14 12))",
            }}
          />
          <div className="flex items-center gap-2 mb-10">
            <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-2xl font-extrabold text-foreground">
              Qicky
            </span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="flex-1 flex flex-col justify-center max-w-md w-full mx-auto lg:mx-0"
            data-ocid="otp.panel"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
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
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div
                className="rounded-xl p-4 flex items-start gap-3"
                style={{ backgroundColor: "#FFF3DC" }}
              >
                <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-amber-600" />
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
                  <IndianRupee className="w-4 h-4 text-green-700" />
                </div>
                <p className="text-xs font-semibold text-green-900 leading-snug">
                  Minimum monthly salary of ₹20,000
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* PAN Details Modal */}
      {showPanModal && !showManualPan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          data-ocid="pan.modal"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-6 py-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-brand" />
              </div>
              <h2 className="text-xl font-extrabold text-foreground mb-2">
                PAN Details Found
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                A PAN linked to your mobile number has been found. Please
                confirm if this is your PAN.
              </p>
            </div>
            <div className="rounded-xl border-2 border-brand/30 bg-brand/5 px-6 py-4 text-center mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">
                PAN Number
              </p>
              <p className="text-2xl font-extrabold tracking-[0.25em] text-brand font-mono">
                ABCDE1234F
              </p>
            </div>
            <p className="text-xs text-muted-foreground text-center mb-6 leading-relaxed px-2">
              This PAN was auto-filled to speed up the process. If this is not
              your PAN, you may enter it manually.
            </p>
            <button
              type="button"
              data-ocid="pan.confirm_button"
              onClick={() => {
                setShowPanModal(false);
                onVerify();
              }}
              className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors text-base shadow-md mb-3"
            >
              Yes, This Is My PAN
            </button>
            <button
              type="button"
              data-ocid="pan.manual_button"
              onClick={() => setShowManualPan(true)}
              className="w-full py-3 border-2 border-brand text-brand font-bold rounded-xl hover:bg-brand/5 transition-colors text-base"
            >
              No, Enter Manually
            </button>
          </div>
        </div>
      )}

      {/* Manual PAN Entry Modal */}
      {showManualPan && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
          data-ocid="pan.manual.modal"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md px-6 py-8">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mb-4">
                <CreditCard className="w-7 h-7 text-brand" />
              </div>
              <h2 className="text-xl font-extrabold text-foreground mb-2">
                Enter Your PAN
              </h2>
              <p className="text-sm text-muted-foreground">
                Please enter your PAN number to continue
              </p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="pan-input"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                PAN Number
              </label>
              <input
                type="text"
                maxLength={10}
                value={manualPan}
                onChange={(e) => {
                  setManualPan(e.target.value.toUpperCase());
                  setPanError("");
                }}
                placeholder="e.g. ABCDE1234F"
                id="pan-input"
                data-ocid="pan.input"
                className="w-full border-2 border-gray-200 focus:border-brand rounded-xl px-4 py-3 text-base font-mono tracking-widest outline-none transition-colors uppercase placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
              />
              <p className="text-xs text-muted-foreground mt-2">
                10-character alphanumeric (e.g. ABCDE1234F)
              </p>
              {panError && (
                <p
                  className="text-xs text-destructive mt-2"
                  data-ocid="pan.error_state"
                >
                  {panError}
                </p>
              )}
            </div>
            <button
              type="button"
              data-ocid="pan.submit_button"
              onClick={handleManualPanContinue}
              className="w-full py-3.5 bg-brand hover:bg-brand-dark text-white font-bold rounded-xl transition-colors text-base shadow-md mb-3"
            >
              Continue
            </button>
            <button
              type="button"
              data-ocid="pan.back.button"
              onClick={() => {
                setShowManualPan(false);
                setManualPan("");
                setPanError("");
              }}
              className="w-full py-2.5 text-muted-foreground hover:text-foreground flex items-center justify-center gap-1.5 text-sm transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to PAN Confirmation
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Analysis Step ────────────────────────────────────────────────────────────
function AnalysisStep({
  name,
  onBack,
  onViewOffers,
  onViewAltOffers,
}: {
  name: string;
  onBack: () => void;
  onViewOffers: () => void;
  onViewAltOffers: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [stageIndex, setStageIndex] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [creditScore, setCreditScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const isEligible = !["a", "e", "i", "o", "u"].includes(
    (name.trim()[0] || "").toLowerCase(),
  );
  useEffect(() => {
    const timings = [0, 500, 1000, 1500, 2200];
    const timers: ReturnType<typeof setTimeout>[] = [];
    ANALYSIS_STAGES.forEach((stage, i) => {
      timers.push(
        setTimeout(() => {
          setStageIndex(i);
          setProgressWidth(stage.progress);
        }, timings[i]),
      );
    });
    timers.push(
      setTimeout(() => {
        setLoading(false);
        setShowConfetti(true);
        // animate credit score
        let s = 0;
        const target = isEligible ? 750 : 580;
        const stepSize = isEligible ? 12 : 9;
        const step = () => {
          s += stepSize;
          if (s >= target) {
            setCreditScore(target);
            return;
          }
          setCreditScore(s);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }, 2200),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEligible]);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(
      () => setTickerIdx((i) => (i + 1) % LENDER_TICKER.length),
      600,
    );
    return () => clearInterval(id);
  }, [loading]);

  const firstName = name.split(" ")[0] || name;

  const DETAILS = [
    {
      icon: TrendingUp,
      label: "Loan Amount Range",
      value: "₹50,000 – ₹15,00,000",
    },
    { icon: Calendar, label: "Tenure", value: "3 – 24 Months" },
    { icon: Percent, label: "Processing Fee", value: "1% – 3% of loan amount" },
    { icon: Star, label: "Credit Score", value: `${creditScore} / 900` },
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

  // SVG gauge for credit score
  const RADIUS = 40;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
  const scoreRatio = creditScore / 900;
  const gaugeColor = isEligible ? "oklch(0.40 0.14 12)" : "#F59E0B";
  const dashOffset = CIRCUMFERENCE * (1 - scoreRatio);

  // Confetti dots
  const CONFETTI = Array.from({ length: 10 }, (_, i) => ({
    id: `conf-${i}`,
    angle: (i / 10) * 360,
    distance: 80 + (i % 3) * 30,
    color:
      i % 3 === 0 ? "oklch(0.40 0.14 12)" : i % 3 === 1 ? "#22c55e" : "#f59e0b",
  }));

  const CurrentStageIcon = ANALYSIS_STAGES[stageIndex]?.icon ?? Zap;

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
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
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.3 }}
              className="text-center w-full max-w-sm"
              data-ocid="analysis.loading_state"
            >
              {/* Animated icon */}
              <div className="relative w-24 h-24 mx-auto mb-8">
                {/* outer glow */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle, oklch(0.40 0.14 12 / 0.15) 0%, transparent 70%)",
                  }}
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
                <div className="absolute inset-0 rounded-full border-4 border-brand/20" />
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-t-brand border-r-brand/40 border-b-transparent border-l-transparent"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="absolute inset-3 rounded-full bg-brand-light flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={stageIndex}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <CurrentStageIcon className="w-6 h-6 text-brand" />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Stage label */}
              <AnimatePresence mode="wait">
                <motion.h2
                  key={stageIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-xl font-bold text-foreground mb-2"
                >
                  {ANALYSIS_STAGES[stageIndex]?.label}
                </motion.h2>
              </AnimatePresence>

              {/* Stage counter */}
              <p className="text-muted-foreground text-sm mb-6">
                Stage {stageIndex + 1} of {ANALYSIS_STAGES.length}
              </p>

              {/* Progress bar */}
              <div className="w-full bg-border rounded-full h-3 overflow-hidden mb-2">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.40 0.14 12), oklch(0.55 0.18 12))",
                  }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
              <p className="text-brand font-bold text-sm mb-6">
                {progressWidth}% complete
              </p>

              {/* Lender ticker */}
              <div className="bg-white rounded-xl px-4 py-3 border border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Checking eligibility at
                </p>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={tickerIdx}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="font-bold text-foreground text-sm"
                  >
                    {LENDER_TICKER[tickerIdx]}...
                  </motion.p>
                </AnimatePresence>
              </div>

              {/* Pulse dots */}
              <div className="flex gap-2 justify-center mt-6">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={`pulse-${i}`}
                    className="w-2 h-2 rounded-full bg-brand"
                    animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.15,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
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
              <div className="text-center mb-8 relative">
                {/* Confetti burst */}
                {showConfetti &&
                  CONFETTI.map((c, _i) => (
                    <motion.div
                      key={c.id}
                      className="absolute w-2 h-2 rounded-full pointer-events-none"
                      style={{ left: "50%", top: "50%", background: c.color }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                      animate={{
                        x: Math.cos((c.angle * Math.PI) / 180) * c.distance,
                        y: Math.sin((c.angle * Math.PI) / 180) * c.distance,
                        opacity: 0,
                        scale: 0.5,
                      }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  ))}

                {/* Credit score gauge */}
                <div className="relative w-28 h-28 mx-auto mb-5">
                  <svg
                    role="img"
                    aria-label="Credit score gauge"
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r={RADIUS}
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r={RADIUS}
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      initial={{ strokeDashoffset: CIRCUMFERENCE }}
                      animate={{ strokeDashoffset: dashOffset }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className="text-xl font-extrabold leading-none"
                      style={{ color: gaugeColor }}
                    >
                      {creditScore}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 900</span>
                  </div>
                </div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 180, damping: 14 }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isEligible ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">
                    {isEligible ? "Eligible!" : "Limited Eligibility"}
                  </span>
                </motion.div>

                {!isEligible && (
                  <p className="text-amber-600 text-xs font-medium mb-2">
                    Your profile qualifies for secured loan options
                  </p>
                )}

                <h2 className="text-2xl font-extrabold text-foreground mb-2">
                  {isEligible
                    ? `Congratulations, ${firstName}! 🎉`
                    : `Hi ${firstName}, we have options for you! 🌟`}
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {isEligible ? (
                    <>
                      You're eligible for a personal loan up to{" "}
                      <span className="text-brand font-bold text-base">
                        ₹15,00,000
                      </span>
                    </>
                  ) : (
                    <>
                      We found{" "}
                      <span className="text-amber-600 font-bold text-base">
                        secured loan options
                      </span>{" "}
                      that match your profile
                    </>
                  )}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm mb-5">
                <div
                  className="h-1 rounded-full mb-5 -mx-6 -mt-6 rounded-t-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.40 0.14 12), oklch(0.55 0.18 12))",
                  }}
                />
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
                  onClick={isEligible ? onViewOffers : onViewAltOffers}
                  data-ocid="analysis.apply.primary_button"
                  className="w-full mt-6 py-3.5 bg-brand hover:bg-brand-dark text-white font-bold
                    rounded-xl flex items-center justify-center gap-2 transition-colors text-base shadow-md"
                >
                  {isEligible ? "Apply Now" : "View Secured Options"}
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={isEligible ? onViewOffers : onViewAltOffers}
                  data-ocid="analysis.offers.secondary_button"
                  className="w-full mt-3 py-2.5 text-brand font-semibold text-sm
                    hover:underline flex items-center justify-center gap-1 transition-colors"
                >
                  {isEligible
                    ? "View all offers →"
                    : "Explore gold loans & FD cards →"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BENEFITS.map((b) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="bg-white rounded-xl p-5 border border-border shadow-sm flex gap-3"
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

// ─── Lender Card (Card Grid) ──────────────────────────────────────────────────
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
  const isBest = lender.bestMatch;

  const approvalColor =
    lender.approvalChance >= 85
      ? "linear-gradient(90deg, #059669, #34d399)"
      : lender.approvalChance >= 70
        ? "linear-gradient(90deg, #d97706, #fbbf24)"
        : "linear-gradient(90deg, #dc2626, #f87171)";

  const approvalTextColor =
    lender.approvalChance >= 85
      ? "#059669"
      : lender.approvalChance >= 70
        ? "#d97706"
        : "#dc2626";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      data-ocid={`offers.item.${index + 1}`}
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="relative flex flex-col rounded-2xl bg-white overflow-hidden cursor-default"
      style={{
        boxShadow: isBest
          ? "0 2px 16px oklch(0.40 0.14 12 / 0.12), 0 0 0 2px oklch(0.40 0.14 12 / 0.25)"
          : "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      {/* Best Match top bar */}
      {isBest && (
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.40 0.14 12), oklch(0.52 0.16 12))",
          }}
        />
      )}

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-extrabold text-sm shrink-0 shadow-sm"
              style={{ backgroundColor: lender.logoColor }}
            >
              {lender.logoInitial}
            </div>
            <div>
              <div className="font-extrabold text-foreground text-sm leading-tight">
                {lender.name}
              </div>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                  style={
                    lender.category === "nbfc"
                      ? {
                          background: "oklch(0.40 0.14 12 / 0.08)",
                          color: "oklch(0.40 0.14 12)",
                        }
                      : {
                          background: "oklch(0.55 0.14 155 / 0.10)",
                          color: "oklch(0.35 0.14 155)",
                        }
                  }
                >
                  {lender.category === "nbfc" ? "NBFC" : "SFB"}
                </span>
                {lender.recommended && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                    Top Pick
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {isBest && (
              <span
                className="text-[10px] font-extrabold px-2.5 py-1 rounded-full text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.40 0.14 12), oklch(0.52 0.16 12))",
                }}
              >
                BEST
              </span>
            )}
            {lender.limitedOffer && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500 border border-red-100">
                ⏱ {countdown}
              </span>
            )}
          </div>
        </div>

        {/* Hero rate */}
        <div
          className="flex items-baseline gap-1.5 mb-4 pb-4"
          style={{ borderBottom: "1px solid #f1f3f5" }}
        >
          <span
            className="text-3xl font-extrabold tracking-tight"
            style={{ color: lender.logoColor }}
          >
            {lender.interestRate}%
          </span>
          <span className="text-sm text-muted-foreground font-medium">
            p.a. onwards
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="text-xs font-extrabold text-foreground leading-tight">
              ₹{lender.maxAmount}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Max Loan
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="text-xs font-extrabold text-foreground leading-tight">
              {lender.tenure}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Tenure
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="text-xs font-extrabold text-foreground leading-tight">
              {lender.processingFee}
            </div>
            <div className="text-[10px] text-muted-foreground mt-0.5">
              Proc. Fee
            </div>
          </div>
        </div>

        {/* Approval bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-muted-foreground">
              Approval Probability
            </span>
            <span
              className="text-xs font-extrabold"
              style={{ color: approvalTextColor }}
            >
              {lender.approvalChance}%
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${lender.approvalChance}%` }}
              transition={{
                duration: 0.9,
                delay: index * 0.08 + 0.35,
                ease: "easeOut",
              }}
              className="h-full rounded-full"
              style={{ background: approvalColor }}
            />
          </div>
        </div>

        {/* Apply CTA */}
        <button
          type="button"
          onClick={() => onApply(lender)}
          data-ocid={`offers.item.${index + 1}.button`}
          className="w-full py-3 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] mt-auto"
          style={{
            background: isBest
              ? "linear-gradient(135deg, oklch(0.40 0.14 12), oklch(0.52 0.16 12))"
              : `linear-gradient(135deg, ${lender.logoColor}ee, ${lender.logoColor}bb)`,
          }}
        >
          Apply Now →
        </button>
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

  const bestLender = LENDERS.find((l) => l.bestMatch)!;

  const SORT_TABS: { key: SortMode; label: string }[] = [
    { key: "best", label: "Best Match" },
    { key: "rate", label: "Lowest Rate" },
    { key: "amount", label: "Highest Amount" },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F4] pb-28">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-4 py-3.5 flex items-center gap-3 border-b border-gray-100 shadow-sm">
        <button
          type="button"
          onClick={onBack}
          data-ocid="offers.back.button"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 border border-gray-100"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-foreground text-base">
            Qicky
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-muted-foreground font-medium">
            Live offers
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-7">
        {/* Hero text */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />5 lenders matched · Updated
            just now
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
            Your Pre-Approved Offers,{" "}
            <span style={{ color: "oklch(0.40 0.14 12)" }}>{firstName} 🎉</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
            Compare and apply instantly — all offers reserved for you.
          </p>
        </motion.div>

        {/* Sort tabs — pill style */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
          {SORT_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSort(tab.key)}
              data-ocid={`offers.${tab.key}.tab`}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={
                sort === tab.key
                  ? {
                      background: "oklch(0.40 0.14 12)",
                      color: "white",
                      boxShadow: "0 2px 8px oklch(0.40 0.14 12 / 0.3)",
                    }
                  : {
                      background: "white",
                      color: "#6b7280",
                      border: "1px solid #e5e7eb",
                    }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Offer cards grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6"
        >
          {sortedLenders.map((lender, i) => (
            <LenderCard
              key={lender.id}
              lender={lender}
              countdown={countdown}
              index={i}
              onApply={onApply}
            />
          ))}
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="rounded-2xl p-4 flex items-center justify-around mb-4 bg-white border border-gray-100 shadow-sm"
        >
          <div className="text-center">
            <div className="text-lg font-extrabold text-foreground">5.7cr+</div>
            <div className="text-xs text-muted-foreground">Customers</div>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <div className="text-lg font-extrabold text-foreground">65+</div>
            <div className="text-xs text-muted-foreground">Lenders</div>
          </div>
          <div className="w-px h-8 bg-gray-100" />
          <div className="text-center">
            <div className="text-lg font-extrabold text-foreground">
              ₹65k Cr+
            </div>
            <div className="text-xs text-muted-foreground">Disbursed</div>
          </div>
        </motion.div>
      </div>

      {/* Sticky bottom bar */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-0 left-0 right-0 z-40 px-4 py-4 bg-white/95 backdrop-blur-md"
            style={{
              borderTop: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div className="max-w-3xl mx-auto flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-white shrink-0 text-sm"
                style={{ backgroundColor: bestLender.logoColor }}
              >
                {bestLender.logoInitial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  Best match for you
                </div>
                <div className="text-foreground font-bold text-sm leading-tight">
                  {bestLender.name}
                </div>
                <div className="text-muted-foreground text-xs">
                  {bestLender.approvalChance}% approval ·{" "}
                  {bestLender.interestRate}% p.a.
                </div>
              </div>
              <button
                type="button"
                onClick={() => onApply(bestLender)}
                data-ocid="offers.apply.primary_button"
                className="shrink-0 px-6 py-3 rounded-2xl font-bold text-sm text-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.40 0.14 12), oklch(0.52 0.16 12))",
                  boxShadow: "0 2px 12px oklch(0.40 0.14 12 / 0.35)",
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
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ml-2 shrink-0 bg-green-50 text-green-700 border border-green-200">
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
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
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
  lender: Lender | AltLender;
  name: string;
  mobile: string;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const inputBase = {
    background: "white",
    border: "1px solid #e5e7eb",
    color: "#1a1a1a",
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
    color: "oklch(0.40 0.14 12)",
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
    borderBottom: "1px solid #e5e7eb",
  };

  const accentColor = lender.logoColor;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]" data-ocid="apply.panel">
      {/* Sticky Header */}
      <div className="sticky top-0 z-30 px-4 py-3.5 flex items-center gap-3 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <button
          type="button"
          onClick={onBack}
          data-ocid="apply.back.button"
          className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100 border border-gray-200"
        >
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-foreground text-lg">Qicky</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-white text-xs"
            style={{ backgroundColor: lender.logoColor }}
          >
            {lender.logoInitial}
          </div>
          <span className="text-muted-foreground text-xs font-medium hidden sm:block">
            {lender.name}
          </span>
        </div>
      </div>

      {/* Equifax Bureau Banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-4 mt-4 rounded-2xl p-4 bg-green-50 border border-green-200"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 bg-green-100">
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <p className="font-extrabold text-sm text-green-700">
                Equifax Credit Bureau Report Fetched
              </p>
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-green-100 text-green-700 shrink-0">
                EQUIFAX
              </span>
            </div>
            <p className="text-xs mt-1 leading-relaxed text-green-600">
              We've pre-filled your application using your Equifax credit report
              to make your journey seamless.
            </p>
            <p className="text-xs mt-2 font-medium text-muted-foreground">
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
                <span className="inline-flex items-center px-3 rounded-xl text-sm font-medium shrink-0 bg-gray-100 border border-gray-200 text-muted-foreground">
                  +91
                </span>
                <input
                  type="tel"
                  defaultValue={mobile || "9876543210"}
                  data-ocid="apply.mobile.input"
                  style={getInputStyle("mobile")}
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
            {/* Monthly Income */}
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
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Monthly Net Income
                </span>
                <BureauBadge />
              </div>
              <div
                className="relative rounded-xl overflow-hidden"
                style={{
                  border: `1.5px solid ${lender.logoColor}60`,
                  boxShadow: `0 0 16px ${lender.logoColor}15`,
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
                <option value="Salaried">Salaried</option>
                <option value="Self-Employed">Self-Employed</option>
                <option value="Business">Business</option>
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
                <option>Home Renovation</option>
                <option>Medical Emergency</option>
                <option>Education</option>
                <option>Wedding</option>
                <option>Travel</option>
                <option>Debt Consolidation</option>
                <option>Others</option>
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
              boxShadow: `0 8px 32px ${lender.logoColor}30`,
            }}
          >
            Submit Application →
          </button>
          <p className="text-center text-xs mt-3 leading-relaxed text-muted-foreground">
            By submitting, you authorise {lender.name} to access your credit
            information and process your loan application.
          </p>
        </motion.div>
      </form>
    </div>
  );
}

// ─── Thank You Step ───────────────────────────────────────────────────────────
function ThankYouStep({
  lender,
  name,
  onBackToOffers,
}: {
  lender: Lender | AltLender;
  name: string;
  onBackToOffers: () => void;
}) {
  const emi = calcEMI(500000, lender.interestRate, 36);

  return (
    <div className="min-h-screen pb-16 bg-[#FAFAFA]" data-ocid="thankyou.panel">
      {/* Header */}
      <div className="px-4 py-3.5 flex items-center gap-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-foreground text-lg">Qicky</span>
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
            background: `${lender.logoColor}12`,
            boxShadow: `0 0 40px ${lender.logoColor}25`,
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
          <h1 className="text-3xl font-extrabold text-foreground mb-2">
            Application Submitted!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your application to{" "}
            <span className="text-foreground font-semibold">{lender.name}</span>{" "}
            has been successfully submitted.
          </p>
        </motion.div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.45 }}
          className="mt-8 rounded-2xl p-5 text-left bg-white border border-gray-200 shadow-sm"
        >
          <h3 className="text-xs font-bold uppercase tracking-wider mb-4 text-muted-foreground">
            Application Summary
          </h3>
          <div className="space-y-3">
            {[
              {
                label: "Applicant Name",
                value: name || "Rahul Sharma",
                icon: User,
              },
              { label: "Loan Amount", value: "₹5,00,000", icon: IndianRupee },
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
              { label: "Lender", value: lender.name, icon: Building },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <row.icon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {row.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.4 }}
          className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200"
        >
          <Shield className="w-3.5 h-3.5 text-green-600" />
          <span className="text-xs font-medium text-green-700">
            Application powered by Equifax verified data ✓
          </span>
        </motion.div>

        {/* Primary CTA */}
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
              boxShadow: `0 8px 32px ${lender.logoColor}30`,
            }}
          >
            Continue Your Journey on {lender.name}
            <ExternalLink className="w-4 h-4" />
          </button>
          <p className="text-center text-xs mt-3 leading-relaxed text-muted-foreground">
            You will be redirected to {lender.name}'s official platform to
            complete KYC &amp; documentation.
          </p>
        </motion.div>

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
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to All Offers
          </button>
        </motion.div>
      </div>

      <div className="mt-12 border-t border-gray-200 text-center pt-6 pb-4 px-4">
        <p className="text-xs text-muted-foreground">
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

// ─── Alt Offers Step ─────────────────────────────────────────────────────────
function AltOffersStep({
  name,
  onBack,
  onApply: _onApply,
}: {
  name: string;
  onBack: () => void;
  onApply: (lender: AltLender) => void;
}) {
  const firstName = name.split(" ")[0] || name;

  const rejectionReasons = [
    {
      icon: "🏦",
      title: "Lender Eligibility Criteria Not Met",
      description:
        "Your profile does not currently match the minimum criteria set by our lending partners. This could be related to credit score, income, or employment type.",
      color: "#f59e0b",
    },
    {
      icon: "📍",
      title: "Pincode Not Serviceable",
      description:
        "Unfortunately, loan services are not available in your area at this time. Our lenders are expanding coverage and may become available soon.",
      color: "#ef4444",
    },
    {
      icon: "🔄",
      title: "Existing / Ongoing Loan with Lenders",
      description:
        "You may already have an active or ongoing loan with one or more of our lending partners. Lenders typically limit concurrent lending relationships.",
      color: "#8b5cf6",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 pb-16">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3.5 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          data-ocid="alt-offers.back.button"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="font-extrabold text-foreground text-base leading-tight">
            Loan Eligibility Check
          </h1>
        </div>
        <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
          <Zap className="w-4 h-4 text-white fill-white" />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-8">
        {/* Animated icon + headline */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <motion.div
            animate={{
              scale: [1, 1.08, 1, 1.04, 1],
              rotate: [0, -4, 4, -2, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatDelay: 1.5,
              ease: "easeInOut",
            }}
            className="w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-xl"
            style={{
              background:
                "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fbbf24 100%)",
              boxShadow:
                "0 0 0 8px rgba(251,191,36,0.12), 0 0 0 16px rgba(251,191,36,0.06)",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              role="img"
              aria-label="No eligible offers"
            >
              <circle cx="24" cy="24" r="22" fill="#fbbf24" opacity="0.2" />
              <path
                d="M24 14v12M24 32v2"
                stroke="#92400e"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M24 6 L42 38 H6 Z"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl font-extrabold text-foreground leading-tight mb-3"
          >
            No Eligible Loan Offers
            <br />
            <span className="text-amber-600">Found at the Moment</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-muted-foreground text-sm leading-relaxed max-w-xs"
          >
            Hi <strong className="text-foreground">{firstName}</strong>, we
            checked 65+ lenders but couldn&apos;t find a match for your profile
            right now.
          </motion.p>
        </motion.div>

        {/* Rejection reasons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="font-extrabold text-foreground text-base mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
              !
            </span>
            Possible Reasons
          </h2>
          <div className="space-y-3">
            {rejectionReasons.map((reason, i) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.6 + i * 0.15,
                  duration: 0.45,
                  ease: "easeOut",
                }}
                className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-4 overflow-hidden relative"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: reason.color,
                }}
              >
                <div className="text-2xl shrink-0 mt-0.5">{reason.icon}</div>
                <div>
                  <h3 className="font-bold text-foreground text-sm mb-1">
                    {reason.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What to do next */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm mb-8"
        >
          <h2 className="font-extrabold text-foreground text-sm mb-4">
            💡 What You Can Do Next
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">
                  Improve your profile
                </strong>{" "}
                — pay down existing debts, maintain timely repayments, and try
                again in{" "}
                <span className="text-brand font-semibold">30 days</span>.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">
                  Contact our support team
                </strong>{" "}
                — our advisors can guide you on the fastest path to eligibility.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <strong className="text-foreground">
                  Check your credit report
                </strong>{" "}
                — ensure there are no errors on your Equifax or CIBIL report.
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <button
            type="button"
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.40 0.14 12), oklch(0.50 0.16 12))",
            }}
            data-ocid="alt-offers.advisor.primary_button"
          >
            💬 Talk to Our Advisor
          </button>
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3.5 rounded-2xl font-semibold text-foreground text-sm border border-gray-200 bg-white hover:bg-gray-50 transition-all active:scale-95"
            data-ocid="alt-offers.back.secondary_button"
          >
            ← Go Back
          </button>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-10 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()}. Built with ❤️ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand font-semibold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState<Step>("landing");
  const [formData, setFormData] = useState<FormData>({ name: "", mobile: "" });
  const [selectedLender, setSelectedLender] = useState<
    Lender | AltLender | null
  >(null);

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
  const handleViewAltOffers = useCallback(() => {
    setStep("alt-offers");
  }, []);
  const handleBack = useCallback(() => {
    setStep("landing");
  }, []);

  const handleApply = useCallback((lender: Lender | AltLender) => {
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
    <>
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
              onViewAltOffers={handleViewAltOffers}
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
        {step === "alt-offers" && (
          <motion.div
            key="alt-offers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AltOffersStep
              name={formData.name}
              onBack={() => setStep("landing")}
              onApply={(lender) => {
                setSelectedLender(lender);
                setStep("apply");
              }}
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
      <AIChatBot />
    </>
  );
}
