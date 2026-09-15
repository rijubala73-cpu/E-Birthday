/**
 * Happy Birthday Website - Pure Vanilla JavaScript (No React / No Build Tools required!)
 * Dedicated to Ripa
 * 
 * -------------------------------------------------------------
 * 📸 ছবি (Pictures) পরিবর্তনের অপশন:
 * লাইন ৯ থেকে ১৪ এর মধ্যে আপনার ছবির নাম বা পাথ পরিবর্তন করতে পারেন!
 * -------------------------------------------------------------
 */

// লাইন ৯: ছবির তালিকা (Photo List)
const birthdayPhotos = [
  '../images/photo1.jpg', // ছবি ১ (Photo 1) - Hero Main Photo
  '../images/photo2.jpg', // ছবি ২ (Photo 2)
  '../images/photo3.jpg', // ছবি ৩ (Photo 3) - Front Card Photo
  '../images/photo4.jpg', // ছবি ৪ (Photo 4) - Inside Card Note Photo
];

let currentPhotoIndex = 0;
let isMusicPlaying = false;
let audioCtx = null;

// Helper: Web Audio API sound synthesis (Works without external audio files)
function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playPopSound() {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {
    console.log(e);
  }
}

function playChime(freq = 600, duration = 0.25) {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    console.log(e);
  }
}

// Helper: Confetti burst
function triggerCelebration() {
  playPopSound();
  if (window.confetti) {
    window.confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF7882', '#FFD166', '#06D6A0', '#4EA8DE', '#B185DB'],
    });
  }
}

// 1. Photo Switcher Function
function setPhoto(idx) {
  currentPhotoIndex = idx % birthdayPhotos.length;
  const heroImg = document.getElementById('heroPhotoImg');
  const card1Img = document.getElementById('card1UserImg');
  const counter = document.getElementById('photoCounter');
  
  if (heroImg) heroImg.src = birthdayPhotos[currentPhotoIndex];
  if (card1Img) card1Img.src = birthdayPhotos[currentPhotoIndex];
  if (counter) counter.innerText = `${currentPhotoIndex + 1}/4`;

  document.querySelectorAll('.photo-dot-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === currentPhotoIndex);
  });
}

// 2. Initialize Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Photo indicator clicks
  document.querySelectorAll('.photo-dot-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'));
      setPhoto(idx);
      playChime(500 + idx * 80);
    });
  });

  // Hero photo click to cycle photos
  const heroContainer = document.getElementById('heroPhotoContainer');
  if (heroContainer) {
    heroContainer.addEventListener('click', () => {
      setPhoto(currentPhotoIndex + 1);
      playPopSound();
      triggerCelebration();
    });
  }

  // Balloon clicks
  const b1 = document.getElementById('balloon1');
  const b2 = document.getElementById('balloon2');
  if (b1) b1.addEventListener('click', () => { triggerCelebration(); });
  if (b2) b2.addEventListener('click', () => { triggerCelebration(); });

  // Hat & decor clicks
  const hat = document.getElementById('hatIcon');
  if (hat) hat.addEventListener('click', () => { playChime(700); triggerCelebration(); });

  const gift = document.getElementById('giftBox');
  if (gift) gift.addEventListener('click', () => { triggerCelebration(); });

  const smile = document.getElementById('smileIcon');
  if (smile) smile.addEventListener('click', () => { triggerCelebration(); });

  // 3. 3D Mail / Letter Modal handling
  const btnLetter = document.getElementById('btn__letter');
  const boxMail = document.getElementById('boxMailModal');
  const closeMailBtn = document.getElementById('closeMailBtn');
  const cardContainer = document.getElementById('cardContainer');
  const tapHint = document.getElementById('tapHintText');

  if (btnLetter && boxMail) {
    btnLetter.addEventListener('click', () => {
      boxMail.classList.add('active');
      playChime(660);
      triggerCelebration();
    });
  }

  if (closeMailBtn && boxMail) {
    closeMailBtn.addEventListener('click', () => {
      boxMail.classList.remove('active');
      if (cardContainer) cardContainer.classList.remove('opened');
    });
  }

  if (cardContainer) {
    cardContainer.addEventListener('click', () => {
      cardContainer.classList.toggle('opened');
      const isOpened = cardContainer.classList.contains('opened');
      if (tapHint) tapHint.innerText = isOpened ? '✨ Unfolded' : '👈 Hover or Tap to Open';
      playChime(isOpened ? 750 : 450);
      if (isOpened) triggerCelebration();
    });
  }

  // 4. Cake Flow Modal handling
  const btnOpenCake = document.getElementById('btnOpenCakeModal');
  const cakeFlowModal = document.getElementById('cakeFlowModal');
  const closeCakeFlowBtn = document.getElementById('closeCakeFlowBtn');

  if (btnOpenCake && cakeFlowModal) {
    btnOpenCake.addEventListener('click', () => {
      cakeFlowModal.classList.add('active');
      playPopSound();
    });
  }

  if (closeCakeFlowBtn && cakeFlowModal) {
    closeCakeFlowBtn.addEventListener('click', () => {
      cakeFlowModal.classList.remove('active');
    });
  }

  // Cake Step 1: Blow candle & Cut cake
  const candle = document.getElementById('cakeCandle');
  const candleFlame = document.getElementById('candleFlame');
  const candleSmoke = document.getElementById('candleSmoke');
  const btnBlowCandle = document.getElementById('btnBlowCandle');
  const btnCutCake = document.getElementById('btnCutCake');
  const btnSurprise = document.getElementById('btnSurprise');
  const cakeCutLine = document.getElementById('cakeCutLine');
  const cakeKnife = document.getElementById('cakeKnife');
  const cakeInstructionPill = document.getElementById('cakeInstructionPill');

  let isCandleBlown = false;
  let isCakeCut = false;

  function blowCandle() {
    if (isCandleBlown) return;
    isCandleBlown = true;
    if (candleFlame) candleFlame.style.display = 'none';
    if (candleSmoke) candleSmoke.style.display = 'flex';
    if (btnBlowCandle) btnBlowCandle.style.display = 'none';
    if (btnCutCake) btnCutCake.style.display = 'inline-block';
    if (cakeInstructionPill) cakeInstructionPill.innerText = '👇 দারুণ! এবার ছুরিতে বা কেকে চাপ দিয়ে কেক কাটো 🔪🎂';
    playChime(660);
    playChime(880);
  }

  function cutCake() {
    if (!isCandleBlown || isCakeCut) return;
    if (cakeKnife) cakeKnife.classList.add('cutting');

    setTimeout(() => {
      isCakeCut = true;
      if (cakeCutLine) cakeCutLine.style.display = 'block';
      if (btnCutCake) btnCutCake.style.display = 'none';
      if (btnSurprise) btnSurprise.style.display = 'inline-flex';
      if (cakeInstructionPill) cakeInstructionPill.innerText = '🎉 ওয়াও! কেক কাটা সম্পন্ন হয়েছে! নিচে সারপ্রাইজে চাপ দাও 🎁';
      triggerCelebration();
      playChime(523);
      playChime(659);
      playChime(784);
    }, 800);
  }

  if (candle) candle.addEventListener('click', blowCandle);
  if (btnBlowCandle) btnBlowCandle.addEventListener('click', blowCandle);
  if (cakeKnife) cakeKnife.addEventListener('click', cutCake);
  if (btnCutCake) btnCutCake.addEventListener('click', cutCake);

  // Step 2: Surprise Wishlist Form
  const stepCake = document.getElementById('stepCake');
  const stepWishlist = document.getElementById('stepWishlist');
  const stepPlans = document.getElementById('stepPlans');
  const stepBkash = document.getElementById('stepBkash');
  const stepSuccess = document.getElementById('stepSuccess');
  const wishlistForm = document.getElementById('wishlistForm');

  if (btnSurprise) {
    btnSurprise.addEventListener('click', () => {
      triggerCelebration();
      stepCake.style.display = 'none';
      stepWishlist.style.display = 'block';
      document.getElementById('cakeModalTitle').innerText = "Surprise Wishlist • Ripa";
      document.getElementById('cakeModalSubtitle').innerText = "তোমার পছন্দের ৫টি উপহারের তালিকা লিখো 🎁";
    });
  }

  document.getElementById('btnBackToCake')?.addEventListener('click', () => {
    stepWishlist.style.display = 'none';
    stepCake.style.display = 'block';
  });

  // Handle wishlist submit
  let savedWishes = [];
  if (wishlistForm) {
    wishlistForm.addEventListener('submit', (e) => {
      e.preventDefault();
      savedWishes = [
        document.getElementById('wish1')?.value || '',
        document.getElementById('wish2')?.value || '',
        document.getElementById('wish3')?.value || '',
        document.getElementById('wish4')?.value || '',
        document.getElementById('wish5')?.value || '',
      ].filter(w => w.trim().length > 0);

      triggerCelebration();
      stepWishlist.style.display = 'none';
      stepPlans.style.display = 'block';
      document.getElementById('cakeModalTitle').innerText = "Unlock The Planes";
      document.getElementById('cakeModalSubtitle').innerText = "To get all gifts please unlock the plane.";
    });
  }

  // Step 3: Plans Select
  let selectedPlanName = 'Special Delight Plan';
  let selectedPlanAmount = 1500;

  document.querySelectorAll('.plan-card').forEach((card) => {
    card.addEventListener('click', () => {
      selectedPlanName = card.getAttribute('data-plan') || 'Special Delight Plan';
      selectedPlanAmount = card.getAttribute('data-amount') || '1500';

      document.getElementById('bkashPlanInfo').innerText = `নির্বাচিত প্ল্যান: ${selectedPlanName}`;
      document.getElementById('bkashAmountTag').innerText = `৳ ${parseInt(selectedPlanAmount).toLocaleString()}`;

      triggerCelebration();
      stepPlans.style.display = 'none';
      stepBkash.style.display = 'block';
      document.getElementById('cakeModalTitle').innerText = "bKash Payment • Ripa's Gift";
      document.getElementById('cakeModalSubtitle').innerText = "বিকাশ সেন্ড মানি করে উপহারটি কনফার্ম করো";
    });
  });

  document.getElementById('btnBackToForm')?.addEventListener('click', () => {
    stepPlans.style.display = 'none';
    stepWishlist.style.display = 'block';
  });

  document.getElementById('btnBackToPlans')?.addEventListener('click', () => {
    stepBkash.style.display = 'none';
    stepPlans.style.display = 'block';
  });

  // bKash Copy Button
  const btnCopyBkash = document.getElementById('btnCopyBkash');
  if (btnCopyBkash) {
    btnCopyBkash.addEventListener('click', () => {
      navigator.clipboard.writeText('01614778155');
      const textSpan = document.getElementById('copyBtnText');
      if (textSpan) textSpan.innerText = 'কপি হয়েছে!';
      playChime(750, 0.2);
      setTimeout(() => {
        if (textSpan) textSpan.innerText = 'কপি';
      }, 2500);
    });
  }

  // bKash Confirm Button
  const btnConfirmPayment = document.getElementById('btnConfirmPayment');
  if (btnConfirmPayment) {
    btnConfirmPayment.addEventListener('click', () => {
      triggerCelebration();
      triggerCelebration();
      stepBkash.style.display = 'none';
      stepSuccess.style.display = 'block';
      document.getElementById('cakeModalTitle').innerText = "Wishes Confirmed! 🎉";
      document.getElementById('cakeModalSubtitle').innerText = "তোমার সব উপহার খুব শীঘ্রই পৌঁছাবে!";

      const summaryList = document.getElementById('summaryList');
      if (summaryList) {
        summaryList.innerHTML = savedWishes.map((w, idx) => `<li><strong>${idx + 1}.</strong> ${w}</li>`).join('');
      }
    });
  }

  // More confetti
  document.getElementById('btnMoreConfetti')?.addEventListener('click', () => {
    triggerCelebration();
  });

  // Close all
  document.getElementById('btnCloseFlowAll')?.addEventListener('click', () => {
    cakeFlowModal.classList.remove('active');
  });
});
