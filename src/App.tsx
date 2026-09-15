import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { birthdayAudio } from './utils/birthdayAudio';
import { Music, VolumeX, Sparkles } from 'lucide-react';
import { BirthdayCakeFlow } from './components/BirthdayCakeFlow';

export interface BirthdayPhoto {
  id: string;
  src: string;
  title: string;
  subtitle: string;
}

export const birthdayPhotos: BirthdayPhoto[] = [
  {
    id: 'photo-1',
    src: 'photo1.jpg',
    title: 'Serene Riverbank',
    subtitle: 'Graceful in purple with traditional white bangles',
  },
  {
    id: 'photo-2',
    src: '/images/photo2.jpg',
    title: 'Festive Splendor',
    subtitle: 'Classic orange saree with fresh floral jewelry',
  },
  {
    id: 'photo-3',
    src: '/images/photo3.jpg',
    title: 'Golden Mustard Bloom',
    subtitle: 'Radiant smile among blooming yellow flowers',
  },
  {
    id: 'photo-4',
    src: '/images/photo4.jpg',
    title: 'Monochrome Elegance',
    subtitle: 'Timeless style in printed saree & lace sleeves',
  },
];

export default function App() {
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isCardFoldedOpen, setIsCardFoldedOpen] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [isCakeFlowOpen, setIsCakeFlowOpen] = useState(false);

  // Customization state (defaults to Mehwish exactly as requested)
  const [recipientName] = useState('Mehwish');
  const [birthDate] = useState('27 May');
  const [displayedDate, setDisplayedDate] = useState('');
  const [dateCompleted, setDateCompleted] = useState(false);

  const typingTimerRef = useRef<number | null>(null);

  // Fire celebratory fireworks / confetti
  const triggerConfetti = () => {
    birthdayAudio.playPop();

    // Side cannons
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.7 },
      colors: ['#FF7882', '#FFD166', '#06D6A0', '#4EA8DE', '#B185DB'],
    });
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.7 },
      colors: ['#FF7882', '#FFD166', '#06D6A0', '#4EA8DE', '#B185DB'],
    });
  };

  // Date typing effect matching original script
  useEffect(() => {
    setDisplayedDate('');
    setDateCompleted(false);

    // Starts typing after title animation (approx 5.5s)
    const startDelay = setTimeout(() => {
      let idx = 0;
      const charArr = birthDate.split('');
      const interval = setInterval(() => {
        if (idx < charArr.length) {
          setDisplayedDate((prev) => prev + charArr[idx]);
          idx++;
          birthdayAudio.playChime(500 + idx * 40, 0.15, 'sine');
        } else {
          clearInterval(interval);
          setDateCompleted(true);
          birthdayAudio.playChime(880, 0.4, 'triangle');
        }
      }, 120);

      typingTimerRef.current = interval as unknown as number;
    }, 5500);

    return () => {
      clearTimeout(startDelay);
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, [birthDate]);

  const handleOpenMail = () => {
    setIsMailOpen(true);
    triggerConfetti();
    if (!isPlayingMusic) {
      birthdayAudio.startMelody((playing) => setIsPlayingMusic(playing));
    }
  };

  const handleCloseMail = () => {
    setIsMailOpen(false);
    setIsCardFoldedOpen(false);
  };

  const toggleMusic = () => {
    const state = birthdayAudio.toggleMelody((playing) =>
      setIsPlayingMusic(playing)
    );
    setIsPlayingMusic(state);
  };

  const onHatClick = () => {
    birthdayAudio.playPop();
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.3 },
    });
  };

  const onBalloonClick = () => {
    birthdayAudio.playPop();
    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.5 },
    });
  };

  return (
    <div id="wrapper">
      {/* Top Floating Control Bar */}
      <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
        <button
          id="btn_toggle_music"
          onClick={toggleMusic}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/90 hover:bg-white text-gray-800 border-2 border-gray-800 shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer"
          title="Play birthday music box chime"
        >
          {isPlayingMusic ? (
            <>
              <VolumeX className="w-4 h-4 text-pink-500 animate-pulse" />
              <span>Mute Music</span>
            </>
          ) : (
            <>
              <Music className="w-4 h-4 text-pink-500" />
              <span>Play Tune</span>
            </>
          )}
        </button>

        <button
          id="btn_confetti"
          onClick={triggerConfetti}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 hover:bg-pink-600 text-white border-2 border-gray-800 shadow-sm transition hover:scale-105 active:scale-95 cursor-pointer"
          title="Burst party confetti"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Party</span>
        </button>
      </div>

      {/* Top Birthday Bunting Flags */}
      <div className="flag__birthday">
        <img
          src="/images/1.png"
          alt="Festive Bunting"
          width="350"
          className="flag__left"
        />
        <img
          src="/images/1.png"
          alt="Festive Bunting"
          width="350"
          className="flag__right"
        />
      </div>

      {/* Main Content Area */}
      <div className="content">
        {/* Left Column: Animated Title & Call to Action */}
        <div className="left">
          <div className="title">
            <h1 className="happy">
              <span style={{ ['--t' as string]: '1s' }}>H</span>
              <span style={{ ['--t' as string]: '1.2s' }}>a</span>
              <span style={{ ['--t' as string]: '1.4s' }}>p</span>
              <span style={{ ['--t' as string]: '1.6s' }}>p</span>
              <span style={{ ['--t' as string]: '1.8s' }}>y</span>
            </h1>
            <h1 className="birthday">
              <span style={{ ['--t' as string]: '2.2s' }}>B</span>
              <span style={{ ['--t' as string]: '2.4s' }}>i</span>
              <span style={{ ['--t' as string]: '2.6s' }}>r</span>
              <span style={{ ['--t' as string]: '2.8s' }}>t</span>
              <span style={{ ['--t' as string]: '3.0s' }}>h</span>
              <span style={{ ['--t' as string]: '3.2s' }}>d</span>
              <span style={{ ['--t' as string]: '3.4s' }}>a</span>
              <span style={{ ['--t' as string]: '3.6s' }}>y</span>
            </h1>

            {/* Party Hat falling gracefully */}
            <div className="hat" onClick={onHatClick} title="Click party hat!">
              <img src="/images/hat.png" alt="Party Hat" width="130" />
            </div>
          </div>

          {/* Date of Birth Animated Pill */}
          <div className="date__of__birth">
            {dateCompleted && <i className="fa-solid fa-star"></i>}
            <span>{displayedDate || birthDate}</span>
            {dateCompleted && <i className="fa-solid fa-star"></i>}
          </div>

          {/* Call to Action Button to Open Letter */}
          <div className="btn">
            <button
              id="btn__letter"
              onClick={handleOpenMail}
              aria-label={`Open birthday letter for ${recipientName}`}
            >
              <div className="mail">
                <span>Click Here {recipientName}</span>
                <i className="fa-regular fa-envelope"></i>
              </div>
            </button>
          </div>
        </div>

        {/* Right Column: Account Avatar & Floating Balloons */}
        <div className="right">
          <div className="box__account">
            <div
              className="image"
              onClick={() => {
                setActivePhotoIndex((prev) => (prev + 1) % birthdayPhotos.length);
                birthdayAudio.playPop();
                triggerConfetti();
              }}
              title={`Click to view next photo (${activePhotoIndex + 1}/4: ${birthdayPhotos[activePhotoIndex].title})`}
            >
              <img
                src={birthdayPhotos[activePhotoIndex].src}
                alt={`${recipientName} - ${birthdayPhotos[activePhotoIndex].title}`}
                referrerPolicy="no-referrer"
              />
            </div>

            {/* 4-Photo Switcher Dots */}
            <div className="photo-indicators">
              {birthdayPhotos.map((photo, idx) => (
                <button
                  key={photo.id}
                  className={`photo-dot-btn ${activePhotoIndex === idx ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActivePhotoIndex(idx);
                    birthdayAudio.playChime(520 + idx * 80, 0.15);
                  }}
                  title={`Photo ${idx + 1}: ${photo.title}`}
                  aria-label={`Show photo ${idx + 1}`}
                />
              ))}
              <span className="photo-badge-label">{activePhotoIndex + 1}/4</span>
            </div>

            <div className="name">
              <i className="fa-solid fa-heart"></i>
              <span>Dear {recipientName}</span>
              <i className="fa-solid fa-heart"></i>
            </div>

            <div
              className="balloon_one"
              onClick={onBalloonClick}
              title="Click to pop balloon!"
            >
              <img width="100px" src="/images/balloon1.png" alt="Pink Balloon" />
            </div>

            <div
              className="balloon_two"
              onClick={onBalloonClick}
              title="Click to pop balloon!"
            >
              <img width="100px" src="/images/balloon2.png" alt="Yellow Balloon" />
            </div>
          </div>

          {/* Rotating Circular Badge with Pulsing Heart */}
          <div className="cricle" onClick={triggerConfetti} title="Happy Birthday Badge">
            <div className="text__cricle">
              <span style={{ ['--i' as string]: 1 }}>h</span>
              <span style={{ ['--i' as string]: 2 }}>a</span>
              <span style={{ ['--i' as string]: 3 }}>p</span>
              <span style={{ ['--i' as string]: 4 }}>p</span>
              <span style={{ ['--i' as string]: 5 }}>y</span>
              <span style={{ ['--i' as string]: 6 }}>-</span>
              <span style={{ ['--i' as string]: 7 }}>b</span>
              <span style={{ ['--i' as string]: 8 }}>i</span>
              <span style={{ ['--i' as string]: 9 }}>r</span>
              <span style={{ ['--i' as string]: 10 }}>t</span>
              <span style={{ ['--i' as string]: 11 }}>h</span>
              <span style={{ ['--i' as string]: 12 }}>d</span>
              <span style={{ ['--i' as string]: 13 }}>a</span>
              <span style={{ ['--i' as string]: 14 }}>y</span>
              <span style={{ ['--i' as string]: 15 }}>-</span>
            </div>
            <i className="fa-solid fa-heart"></i>
          </div>
        </div>
      </div>

      {/* Decorative Sparkle Stars */}
      <div className="decorate_star star1" style={{ ['--t' as string]: '4.5s' }}></div>
      <div className="decorate_star star2" style={{ ['--t' as string]: '4.8s' }}></div>
      <div className="decorate_star star3" style={{ ['--t' as string]: '5.1s' }}></div>
      <div className="decorate_star star4" style={{ ['--t' as string]: '5.4s' }}></div>
      <div className="decorate_star star5" style={{ ['--t' as string]: '5.7s' }}></div>

      {/* Decorative Floating Flowers */}
      <div
        className="decorate_flower--one"
        style={{ ['--t' as string]: '4.5s' }}
        onClick={triggerConfetti}
      >
        <img width="28" src="/images/decorate_flower.png" alt="Blossom Flower" />
      </div>
      <div
        className="decorate_flower--two"
        style={{ ['--t' as string]: '4.9s' }}
        onClick={triggerConfetti}
      >
        <img width="28" src="/images/decorate_flower.png" alt="Blossom Flower" />
      </div>
      <div
        className="decorate_flower--three"
        style={{ ['--t' as string]: '5.3s' }}
        onClick={triggerConfetti}
      >
        <img width="28" src="/images/decorate_flower.png" alt="Blossom Flower" />
      </div>

      {/* Bottom Corner Decorations */}
      <div
        className="decorate_bottom"
        onClick={triggerConfetti}
        title="Birthday gift box!"
      >
        <img src="/images/decorate.png" alt="Gift and Streamers" width="100" />
      </div>

      <div
        className="smiley__icon"
        onClick={() => {
          birthdayAudio.playPop();
          triggerConfetti();
        }}
        title="Happy Birthday Smile!"
      >
        <img src="/images/smiley_icon.png" alt="Joyful Smile" width="100" />
      </div>

      {/* ============================================================ */}
      {/* 3D Birthday Card Modal (.boxMail) */}
      {/* ============================================================ */}
      <div className={`boxMail ${isMailOpen ? 'active' : ''}`}>
        {/* Close Button */}
        <i
          className="fa-solid fa-xmark"
          onClick={handleCloseMail}
          title="Close card"
          role="button"
          tabIndex={0}
        ></i>

        {/* 'Cake' Option Button beside the Wish Card as requested */}
        <div className="cake-modal-top-bar">
          <button
            id="btn_cake_option"
            onClick={() => {
              birthdayAudio.playPop();
              setIsCakeFlowOpen(true);
            }}
            className="cake-option-pill-btn"
            title="Click to blow candle & cut birthday cake!"
          >
            <span className="text-xl">🎂</span>
            <span>Cake (কেক কাটুন)</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          </button>
        </div>

        {/* 3D Folding Card Container */}
        <div
          className={`boxMail-container ${isCardFoldedOpen ? 'opened' : ''}`}
          onClick={() => setIsCardFoldedOpen((prev) => !prev)}
          title="Hover or tap to unfold card"
        >
          {/* Card 1: Front Cover that swings open */}
          <div className="card1">
            <div className="userImg">
              <img
                src={birthdayPhotos[activePhotoIndex].src}
                alt={recipientName}
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="username">
              To: {recipientName} 💖<span className="underline"></span>
            </h4>

            <h3>Happy Birthday</h3>

            {/* Photo 3 embedded in front card frame */}
            <div className="imageCute">
              <div className="card-mini-photo-frame" title={birthdayPhotos[2].title}>
                <img
                  src={birthdayPhotos[2].src}
                  alt={birthdayPhotos[2].title}
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            <div className="tap-hint">
              <span>{isCardFoldedOpen ? '✨ Unfolded' : '👈 Hover or Tap to Open'}</span>
            </div>
          </div>

          {/* Card 2: Inner Heartfelt Note */}
          <div className="card2">
            <div className="card2-content">
              <h3>To You!</h3>
              <h2>
                Happy birthday 🥳🎂🥳 chanda the day you come into my life I was not
                really much attached to you but day by day you became close to my heart.
                And now you are truly my younger sister. I wish I could remove some of
                the pain from your life which you are bearing alone. But you're always
                welcome 🤗 you can talk anytime you want to talk specially those which
                you can't say to others. And this year your all dreams come true. I wish
                that your brother could wish you but if couldn't wish on him behalf I am
                wishing you happy birthday 🎈🎂🎈 sana. Don't be Sad ok be happy 😌
              </h2>

              {/* Photo 4 embedded in inside card frame */}
              <div className="imageCute2">
                <div className="card-mini-photo-frame" title={birthdayPhotos[3].title}>
                  <img
                    src={birthdayPhotos[3].src}
                    alt={birthdayPhotos[3].title}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Birthday Cake Cutting & Wishlist Flow Modal */}
      <BirthdayCakeFlow
        isOpen={isCakeFlowOpen}
        onClose={() => setIsCakeFlowOpen(false)}
        recipientName={recipientName}
      />

      {/* Footer attribution watermark matching original */}
      <footer id="copy" className="text-center py-2 text-xs text-gray-500 pointer-events-none">
        <p className="font-semibold text-pink-600">Happy Birthday Website • Dedicated to {recipientName}</p>
      </footer>
    </div>
  );
}
