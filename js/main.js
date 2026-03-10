const words = [
  { text: "radical", colorClass: "color-cyan", themeClass: "theme-cyan" },
  { text: "saudável", colorClass: "color-green", themeClass: "theme-green" },
  { text: "divertida", colorClass: "color-pink", themeClass: "theme-pink" }
];

const wordElement = document.getElementById("dynamic-word");
const bodyElement = document.body;

const EXIT_DURATION = 320;
const ENTER_DURATION = 340;
const HOLD_DURATION = 1900;

let currentIndex = 0;

function applyTheme(themeClass) {
  bodyElement.classList.remove("theme-cyan", "theme-green", "theme-pink");
  bodyElement.classList.add(themeClass);
}

function cycleWord() {
  if (!wordElement) return;

  const nextIndex = (currentIndex + 1) % words.length;
  const nextWord = words[nextIndex];

  wordElement.classList.remove("is-enter");
  wordElement.classList.add("is-exit");

  window.setTimeout(() => {
    wordElement.textContent = nextWord.text;
    wordElement.classList.remove("color-cyan", "color-pink", "color-green");
    wordElement.classList.add(nextWord.colorClass);

    applyTheme(nextWord.themeClass);

    wordElement.classList.remove("is-exit");
    wordElement.classList.add("is-enter");

    currentIndex = nextIndex;

    window.setTimeout(() => {
      wordElement.classList.remove("is-enter");
      window.setTimeout(cycleWord, HOLD_DURATION);
    }, ENTER_DURATION);
  }, EXIT_DURATION);
}

if (wordElement && bodyElement) {
  applyTheme(words[0].themeClass);
  window.setTimeout(cycleWord, HOLD_DURATION);
}

const galleryCards = Array.from(document.querySelectorAll(".gallery-grid .card-image"));
let galleryRevealObserver = null;

function initGalleryReveal() {
  if (galleryCards.length === 0) return;

  if (galleryRevealObserver) {
    galleryRevealObserver.disconnect();
    galleryRevealObserver = null;
  }

  galleryCards.forEach((card, index) => {
    card.classList.add("reveal-init");
    card.classList.remove("is-visible");
    card.style.setProperty("--reveal-delay", `${index * 240}ms`);
  });

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    galleryCards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  if (!("IntersectionObserver" in window)) {
    galleryCards.forEach((card) => card.classList.add("is-visible"));
    return;
  }

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      galleryRevealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            window.requestAnimationFrame(() => {
              entry.target.classList.add("is-visible");
            });
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -10% 0px"
        }
      );

      galleryCards.forEach((card) => galleryRevealObserver.observe(card));
    });
  });
}

initGalleryReveal();
window.addEventListener("pageshow", initGalleryReveal);
