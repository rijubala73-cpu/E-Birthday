import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { birthdayAudio } from '../utils/birthdayAudio';
import { Sparkles, Gift, Check, Copy, Heart, X, CheckCircle2, ChevronRight, Award } from 'lucide-react';

export interface BirthdayCakeFlowProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
}

export type FlowStep = 'cake' | 'surprise_form' | 'plans' | 'bkash' | 'success';

interface PlanOption {
  id: string;
  name: string;
  badge: string;
  amount: number;
  highlight?: boolean;
  description: string;
  perks: string[];
}

const PLANS: PlanOption[] = [
  {
    id: 'plan-1',
    name: 'Starter Sweet Plan',
    badge: 'Basic',
    amount: 1000,
    description: 'তোমার পছন্দের প্রাথমিক বিশেষ উপহার আনলক হবে',
    perks: ['পছন্দের ১টি স্পেশাল গিফট', 'বার্থডে সারপ্রাইজ কার্ড', 'ইনস্ট্যান্ট ডেলিভারি অগ্রাধিকার'],
  },
  {
    id: 'plan-2',
    name: 'Special Delight Plan',
    badge: 'Popular',
    amount: 1500,
    highlight: true,
    description: 'সেরা উপহারের সুন্দর কালেকশন আনলক হবে',
    perks: ['পছন্দের ২টি মূল গিফট', 'হ্যান্ডমেড স্পেশাল নোট', 'চকলেট ও বার্থডে ট্রিট বক্স'],
  },
  {
    id: 'plan-3',
    name: 'Royal Premium Plan',
    badge: 'Royal',
    amount: 3000,
    description: 'রাজকীয় ভালোবাসায় মোড়ানো স্পেশাল উইশ প্যাকেজ',
    perks: ['পছন্দের ৪টি বড় গিফট', 'ভিআইপি গিফট র‍্যাপিং', 'স্পেশাল সারপ্রাইজ মেমোরি বক্স'],
  },
  {
    id: 'plan-4',
    name: 'Ultimate Dream Plan',
    badge: 'VIP Ultimate',
    amount: 5000,
    highlight: true,
    description: 'তোমার লিস্টের সবকটি ৫টি স্বপ্নের উপহারই সরাসরি পূরণ হবে!',
    perks: ['লিস্টের সম্পূর্ণ ৫টি গিফটই কনফার্ম!', 'আনলিমিটেড বার্থডে ভালোবাসা', 'এক্সক্লুসিভ পার্সোনালাইজড সারপ্রাইজ'],
  },
];

export const BirthdayCakeFlow: React.FC<BirthdayCakeFlowProps> = ({
  isOpen,
  onClose,
  recipientName,
}) => {
  const [step, setStep] = useState<FlowStep>('cake');

  // Cake state
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [knifeActive, setKnifeActive] = useState(false);

  // Form state (5 wishes)
  const [wishes, setWishes] = useState<string[]>(['', '', '', '', '']);
  const [formError, setFormError] = useState('');

  // Selected plan & bKash state
  const [selectedPlan, setSelectedPlan] = useState<PlanOption>(PLANS[1]);
  const [copiedBkash, setCopiedBkash] = useState(false);
  const [senderBkashNum, setSenderBkashNum] = useState('');
  const [transactionId, setTransactionId] = useState('');

  const bkashNumber = '01614778155';

  if (!isOpen) return null;

  // Sound & confetti trigger
  const triggerCelebration = () => {
    birthdayAudio.playPop();
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF7882', '#FFD166', '#06D6A0', '#4EA8DE', '#B185DB'],
    });
  };

  // 1. Blow candle
  const handleBlowCandle = () => {
    if (isCandleBlown) return;
    setIsCandleBlown(true);
    birthdayAudio.playChime(660, 0.4, 'sine');
    birthdayAudio.playChime(880, 0.5, 'triangle');
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.5 },
    });
  };

  // 2. Cut cake
  const handleCutCake = () => {
    if (!isCandleBlown || isCakeCut) return;
    setKnifeActive(true);

    setTimeout(() => {
      setIsCakeCut(true);
      setKnifeActive(false);
      triggerCelebration();
      birthdayAudio.playChime(523, 0.3, 'triangle');
      birthdayAudio.playChime(659, 0.3, 'triangle');
      birthdayAudio.playChime(784, 0.5, 'triangle');
    }, 900);
  };

  // 3. Wish input update
  const handleWishChange = (index: number, val: string) => {
    const updated = [...wishes];
    updated[index] = val;
    setWishes(updated);
    if (formError) setFormError('');
  };

  // 4. Submit wishes
  const handleSubmitWishes = (e: React.FormEvent) => {
    e.preventDefault();
    const filledCount = wishes.filter((w) => w.trim().length > 0).length;
    if (filledCount === 0) {
      setFormError('দয়া করে অন্তত ১টি বা তোমার পছন্দের উপহারগুলো লিখো! 🎁');
      return;
    }
    triggerCelebration();
    setStep('plans');
  };

  // 5. Select plan
  const handleSelectPlan = (plan: PlanOption) => {
    setSelectedPlan(plan);
    birthdayAudio.playPop();
    triggerCelebration();
    setStep('bkash');
  };

  // Copy bKash number
  const handleCopyBkash = () => {
    navigator.clipboard.writeText(bkashNumber);
    setCopiedBkash(true);
    birthdayAudio.playChime(750, 0.2);
    setTimeout(() => setCopiedBkash(false), 2500);
  };

  // Confirm payment done
  const handleConfirmPaid = () => {
    triggerCelebration();
    triggerCelebration();
    setStep('success');
  };

  // Reset entire flow
  const handleReset = () => {
    setStep('cake');
    setIsCandleBlown(false);
    setIsCakeCut(false);
    setWishes(['', '', '', '', '']);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-[#222] overflow-hidden my-auto animate-in fade-in zoom-in duration-300">
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 px-6 py-4 flex items-center justify-between text-white border-b-4 border-[#222]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🎂</span>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-dancing tracking-wide">
                {step === 'cake' && `Happy Birthday ${recipientName} • Cake Time`}
                {step === 'surprise_form' && `Surprise Wishlist • ${recipientName}`}
                {step === 'plans' && `Unlock The Planes`}
                {step === 'bkash' && `bKash Payment • ${recipientName}'s Gift`}
                {step === 'success' && `Wishes Confirmed! 🎉`}
              </h2>
              <p className="text-xs font-sans opacity-90">
                {step === 'cake' && 'মমবাতি নিভিয়ে কেক কাটো! 🕯️🔪'}
                {step === 'surprise_form' && 'তোমার পছন্দের ৫টি উপহারের তালিকা লিখো 🎁'}
                {step === 'plans' && 'To get all gifts please unlock the plane'}
                {step === 'bkash' && 'বিকাশ সেন্ড মানি করে উপহারটি কনফার্ম করো'}
                {step === 'success' && 'তোমার সব উপহার খুব শীঘ্রই পৌঁছাবে!'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white text-white hover:text-gray-900 flex items-center justify-center transition border-2 border-white/40 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 max-h-[80vh] overflow-y-auto font-sans">
          {/* ============================================================ */}
          {/* STEP 1: CAKE, CANDLE & KNIFE */}
          {/* ============================================================ */}
          {step === 'cake' && (
            <div className="text-center flex flex-col items-center">
              {/* Instruction banner */}
              <div className="mb-4 inline-block px-4 py-2 rounded-full bg-pink-100 border-2 border-pink-400 text-pink-700 text-sm sm:text-base font-semibold shadow-sm">
                {!isCandleBlown
                  ? '👇 মমবাতিতে চাপ দিয়ে ফুঁ দিয়ে নিভিয়ে দাও 🕯️'
                  : !isCakeCut
                  ? '👇 দারুণ! এবার ছুরিতে বা কেকে চাপ দিয়ে কেক কাটো 🔪🎂'
                  : '🎉 ওয়াও! কেক কাটা সম্পন্ন হয়েছে! নিচে সারপ্রাইজে চাপ দাও 🎁'}
              </div>

              {/* Interactive Cake Illustration Box */}
              <div className="relative w-72 h-64 sm:w-80 sm:h-72 my-2 flex items-center justify-center">
                {/* Plate */}
                <div className="absolute bottom-4 w-64 sm:w-72 h-8 bg-slate-200 rounded-full border-4 border-slate-700 shadow-md"></div>

                {/* Cake Base Layers */}
                <div
                  className={`relative cursor-pointer transition-transform duration-300 ${
                    !isCandleBlown ? 'hover:scale-105' : ''
                  }`}
                  onClick={() => {
                    if (!isCandleBlown) handleBlowCandle();
                    else if (!isCakeCut) handleCutCake();
                  }}
                  title={
                    !isCandleBlown
                      ? 'মমবাতি নেভাতে চাপ দাও'
                      : !isCakeCut
                      ? 'কেক কাটতে চাপ দাও'
                      : 'কেক কাটা হয়ে গেছে!'
                  }
                >
                  {/* Layer 2 (Bottom layer) */}
                  <div className="relative w-56 sm:w-64 h-24 bg-gradient-to-r from-amber-200 via-rose-200 to-amber-200 rounded-2xl border-4 border-[#222] shadow-inner flex items-center justify-around px-4 overflow-hidden">
                    {/* Frosting drips */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-pink-500 rounded-b-xl flex justify-between px-2">
                      <span className="w-4 h-6 bg-pink-500 rounded-b-full inline-block"></span>
                      <span className="w-4 h-8 bg-pink-500 rounded-b-full inline-block"></span>
                      <span className="w-4 h-5 bg-pink-500 rounded-b-full inline-block"></span>
                      <span className="w-4 h-7 bg-pink-500 rounded-b-full inline-block"></span>
                      <span className="w-4 h-6 bg-pink-500 rounded-b-full inline-block"></span>
                    </div>
                    {/* Decorative cherries/sprinkles */}
                    <span className="text-xl">🍓</span>
                    <span className="text-xl">🍒</span>
                    <span className="text-xl">🍓</span>
                    <span className="text-xl">🍒</span>
                  </div>

                  {/* Layer 1 (Top layer) */}
                  <div className="relative -mt-4 mx-auto w-40 sm:w-48 h-20 bg-gradient-to-r from-pink-200 via-yellow-100 to-pink-200 rounded-2xl border-4 border-[#222] flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-bold text-pink-600 tracking-wider">
                      ★ {recipientName} ★
                    </span>
                  </div>

                  {/* Cut Slice line indicator */}
                  {isCakeCut && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-1 h-36 bg-red-600 border-x border-amber-300 shadow-md animate-pulse"></div>
                  )}

                  {/* Candle Stick */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBlowCandle();
                    }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer group"
                    title="মমবাতিতে চাপ দিয়ে নিভিয়ে দাও"
                  >
                    {/* Candle Flame */}
                    {!isCandleBlown ? (
                      <div className="relative flex flex-col items-center">
                        <div className="w-5 h-7 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-100 rounded-full animate-bounce shadow-[0_0_15px_#ffaa00]"></div>
                        <span className="text-[10px] text-amber-500 font-bold animate-pulse -mt-1">
                          ফুঁ দাও!
                        </span>
                      </div>
                    ) : (
                      /* Blown out smoke effect */
                      <div className="h-6 flex flex-col items-center text-xs text-gray-500 animate-pulse">
                        <span className="text-sm">💨</span>
                        <span className="text-[10px] font-semibold text-gray-400">নিভেছে ✨</span>
                      </div>
                    )}

                    {/* Candle Wax Body */}
                    <div className="w-3 h-10 bg-gradient-to-b from-blue-300 via-pink-300 to-yellow-300 rounded-t-sm border-2 border-[#222]"></div>
                  </div>
                </div>

                {/* Birthday Knife (Churi) */}
                <div
                  onClick={handleCutCake}
                  className={`absolute right-1 bottom-12 cursor-pointer transition-all duration-700 select-none ${
                    knifeActive
                      ? 'translate-x-[-120px] translate-y-[-40px] rotate-[-45deg] scale-125 z-40'
                      : isCakeCut
                      ? 'translate-y-8 rotate-12 opacity-80'
                      : isCandleBlown
                      ? 'animate-bounce'
                      : 'opacity-70'
                  }`}
                  title={isCandleBlown && !isCakeCut ? 'কেক কাটতে ছুরিতে চাপ দাও!' : 'কেক কাটার ছুরি'}
                >
                  <div className="relative flex items-center">
                    {/* Blade */}
                    <div className="w-20 h-6 bg-gradient-to-r from-gray-200 via-white to-gray-400 border-2 border-gray-700 rounded-l-full shadow-lg flex items-center justify-end pr-1">
                      <span className="text-[9px] font-mono text-gray-500">STAINLESS</span>
                    </div>
                    {/* Knife Handle */}
                    <div className="w-10 h-7 bg-amber-800 border-2 border-[#222] rounded-r-md shadow-md flex items-center justify-center">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block"></span>
                    </div>
                  </div>
                  {isCandleBlown && !isCakeCut && (
                    <span className="block text-[11px] font-bold text-pink-600 mt-1 bg-white px-1 rounded shadow">
                      চাপ দাও 🔪
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons for Step 1 */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                {!isCandleBlown && (
                  <button
                    onClick={handleBlowCandle}
                    className="px-5 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold border-2 border-[#222] shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <span>🕯️</span> মমবাতি নিভাও
                  </button>
                )}

                {isCandleBlown && !isCakeCut && (
                  <button
                    onClick={handleCutCake}
                    disabled={knifeActive}
                    className="px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold border-2 border-[#222] shadow-md transition transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer animate-pulse"
                  >
                    <span>🔪</span> কেক কাটো! (Cut Cake)
                  </button>
                )}

                {/* Once cake is cut -> SURPRISE button appears as requested! */}
                {isCakeCut && (
                  <button
                    onClick={() => {
                      triggerCelebration();
                      setStep('surprise_form');
                    }}
                    className="px-8 py-3 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white font-extrabold text-lg border-3 border-[#222] shadow-xl transition transform hover:scale-110 active:scale-95 flex items-center gap-2 cursor-pointer animate-bounce"
                  >
                    <Gift className="w-6 h-6" />
                    <span>Surprise 🎁 (সারপ্রাইজ)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 2: 5 GIFTS WISHLIST FORM */}
          {/* ============================================================ */}
          {step === 'surprise_form' && (
            <div className="max-w-lg mx-auto">
              <div className="text-center mb-5">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-pink-100 border-2 border-pink-400 text-pink-600 mb-2">
                  <Gift className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 font-dancing">
                  {recipientName}'s 5 Birthday Wishes 💖
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  তোমার পছন্দের ৫টি জিনিসের নাম লিখো যা তুমি উপহার হিসেবে পেতে চাও:
                </p>
              </div>

              {formError && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border-2 border-red-300 text-red-700 text-sm font-medium text-center">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitWishes} className="space-y-3">
                {[0, 1, 2, 3, 4].map((idx) => (
                  <div key={idx} className="relative">
                    <label className="block text-xs font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-pink-500 text-white text-[11px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      উপহার {idx + 1} (Gift Wish {idx + 1}):
                    </label>
                    <input
                      type="text"
                      value={wishes[idx]}
                      onChange={(e) => handleWishChange(idx, e.target.value)}
                      placeholder={
                        idx === 0
                          ? 'যেমন: পছন্দের ড্রেস / জামদানি শাড়ি'
                          : idx === 1
                          ? 'যেমন: পছন্দের পারফিউম / মেকআপ বক্স'
                          : idx === 2
                          ? 'যেমন: পছন্দের হাতঘড়ি / স্মার্টওয়াচ'
                          : idx === 3
                          ? 'যেমন: পছন্দের বই বা ব্যাগ'
                          : 'যেমন: স্পেশাল ডিনার / সারপ্রাইজ ট্রিট'
                      }
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-300 focus:border-pink-500 focus:outline-none text-sm transition bg-white shadow-sm"
                    />
                  </div>
                ))}

                <div className="pt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('cake')}
                    className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-semibold transition"
                  >
                    ← কেক পেইজে ফিরুন
                  </button>
                  <button
                    type="submit"
                    className="px-7 py-3 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold border-2 border-[#222] shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Wishes (সাবমিট)</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 3: 4 PLANS POPUP MODAL */}
          {/* ============================================================ */}
          {step === 'plans' && (
            <div>
              {/* Requested exact English title */}
              <div className="text-center mb-6">
                <span className="inline-block px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">
                  Special Gift Plans
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  To get all gifts please unlock the plane.
                </h3>
                <p className="text-sm text-gray-600 mt-1.5 max-w-md mx-auto">
                  নিচের ৪টি প্ল্যানের যেকোনো একটি পছন্দ করে আনলক করুন এবং আপনার পছন্দের সব উপহার নিশ্চিত করুন:
                </p>
              </div>

              {/* 4 Plans Grid: 1000, 1500, 3000, 5000 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                {PLANS.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan)}
                    className={`relative p-5 rounded-2xl border-3 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                      plan.highlight
                        ? 'border-pink-500 bg-pink-50/50 shadow-lg hover:shadow-xl hover:-translate-y-1'
                        : 'border-gray-800 bg-white shadow-md hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[11px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
                          plan.highlight
                            ? 'bg-pink-500 text-white border-pink-600'
                            : 'bg-gray-100 text-gray-700 border-gray-300'
                        }`}
                      >
                        {plan.badge}
                      </span>
                      <Award className="w-5 h-5 text-amber-500" />
                    </div>

                    {/* Plan Name & Amount */}
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">{plan.name}</h4>
                      <div className="my-2 flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-pink-600 font-mono">
                          ৳ {plan.amount.toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">/ এককালীন</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-3">{plan.description}</p>

                      {/* Perks */}
                      <ul className="space-y-1.5 text-xs text-gray-700 border-t border-gray-200 pt-3 mb-4">
                        {plan.perks.map((perk, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Button */}
                    <button
                      type="button"
                      className={`w-full py-2.5 rounded-xl font-bold text-sm border-2 border-[#222] transition flex items-center justify-center gap-1.5 shadow-sm ${
                        plan.highlight
                          ? 'bg-pink-500 hover:bg-pink-600 text-white'
                          : 'bg-gray-900 hover:bg-gray-800 text-white'
                      }`}
                    >
                      <span>Unlock This Plan</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t">
                <button
                  onClick={() => setStep('surprise_form')}
                  className="text-gray-600 hover:underline font-semibold"
                >
                  ← উইশলিস্টে ফিরে যান
                </button>
                <span>🔒 সুরক্ষিত বিকাশ পেমেন্ট সুবিধা</span>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 4: BKASH PAYMENT MODAL */}
          {/* ============================================================ */}
          {step === 'bkash' && (
            <div className="max-w-md mx-auto">
              {/* bKash Header Badge */}
              <div className="bg-[#DF146E] text-white p-4 rounded-2xl shadow-md mb-5 text-center relative overflow-hidden border-2 border-[#222]">
                <div className="relative z-10">
                  <div className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold mb-1">
                    bKash Personal Payment
                  </div>
                  <h3 className="text-2xl font-black tracking-wide">bKash বিকাশ</h3>
                  <p className="text-xs opacity-90 mt-1">
                    নির্বাচিত প্ল্যান: <span className="font-bold">{selectedPlan.name}</span>
                  </p>
                  <div className="mt-2 text-3xl font-black tracking-tight font-mono bg-white text-[#DF146E] py-1.5 px-4 rounded-xl inline-block shadow">
                    ৳ {selectedPlan.amount.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Number Card */}
              <div className="bg-pink-50 border-2 border-pink-300 rounded-2xl p-4 mb-4 text-center">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1">
                  নিচের বিকাশ নম্বরে Send Money করুন:
                </p>
                <div className="flex items-center justify-center gap-3 my-2">
                  <span className="text-2xl sm:text-3xl font-mono font-black text-gray-900 tracking-wider">
                    {bkashNumber}
                  </span>
                  <button
                    onClick={handleCopyBkash}
                    className="px-3 py-1.5 rounded-lg bg-white border-2 border-gray-800 text-xs font-bold text-gray-800 hover:bg-gray-50 flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer"
                    title="নম্বর কপি করুন"
                  >
                    {copiedBkash ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        <span className="text-green-600">কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>কপি</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-pink-700 font-semibold">
                  (Personal Account • সেন্ড মানি করুন)
                </p>
              </div>

              {/* Simple confirmation input */}
              <div className="space-y-3 mb-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    যে বিকাশ নম্বর থেকে টাকা পাঠাচ্ছেন (ঐচ্ছিক):
                  </label>
                  <input
                    type="text"
                    value={senderBkashNum}
                    onChange={(e) => setSenderBkashNum(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-gray-300 focus:border-[#DF146E] focus:outline-none text-sm font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    bKash TrxID (যদি থাকে):
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="e.g. BL92A..."
                    className="w-full px-3.5 py-2 rounded-xl border-2 border-gray-300 focus:border-[#DF146E] focus:outline-none text-sm font-mono uppercase"
                  />
                </div>
              </div>

              {/* Submit / Done button */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConfirmPaid}
                  className="w-full py-3 rounded-full bg-[#DF146E] hover:bg-[#c2105e] text-white font-bold text-base border-2 border-[#222] shadow-lg transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>টাকা পাঠিয়েছি / Confirm Payment 💖</span>
                </button>
                <button
                  onClick={() => setStep('plans')}
                  className="text-xs text-gray-500 hover:text-gray-800 py-1 font-semibold text-center"
                >
                  ← অন্য প্ল্যান পছন্দ করতে ফিরে যান
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* STEP 5: SUCCESS CELEBRATION */}
          {/* ============================================================ */}
          {step === 'success' && (
            <div className="text-center py-6 max-w-md mx-auto">
              <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-500 text-green-600 flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h3 className="text-3xl font-extrabold text-gray-800 font-dancing mb-2">
                Congratulations {recipientName}! 🎉
              </h3>
              <p className="text-sm font-semibold text-pink-600 mb-4">
                তোমার পছন্দের উপহারের প্ল্যান (৳{selectedPlan.amount}) সফলভাবে আনলক হয়েছে!
              </p>

              {/* Wishes recap */}
              <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-4 text-left mb-6">
                <h4 className="text-xs font-bold text-gray-700 uppercase mb-2">
                  তোমার জমাকৃত উইশলিস্ট:
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-700 font-medium">
                  {wishes.filter((w) => w.trim().length > 0).map((wish, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <span>{wish}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                ধন্যবাদ মেহউইশ! তোমার এই বিশেষ জন্মদিনে তোমার সব স্বপ্ন ও ইচ্ছা পূরণ হোক।
                খুব শীঘ্রই তোমার সব উপহার তোমার হাতে পৌঁছে যাবে! 🎂✨
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={triggerCelebration}
                  className="px-5 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold border-2 border-[#222] shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" /> আরও কনফেটি উড়াও!
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 text-white text-sm font-bold border-2 border-[#222] shadow transition cursor-pointer"
                >
                  সমাপ্ত (Close)
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
