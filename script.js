// Mobile navigation
const menuBtn = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });
}

// Active navigation link
const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage) {
    link.classList.add("active");
  }
});

// Custom cursor for desktop only
if (window.matchMedia("(min-width: 900px)").matches) {
  document.body.classList.add("has-custom-cursor");
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  document.body.appendChild(cursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.16;
    cursorY += (mouseY - cursorY) * 0.16;
    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}

// Typing effect on home page only
const typingElement = document.getElementById("typing");
const typingTexts = ["Nicole Valderama"];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeText() {
  if (!typingElement) return;

  const currentText = typingTexts[textIndex];
  typingElement.textContent = currentText.substring(0, charIndex);

  if (!isDeleting && charIndex < currentText.length) {
    charIndex++;
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
  }

  if (!isDeleting && charIndex === currentText.length) {
    isDeleting = true;
    setTimeout(typeText, 1200);
    return;
  }

  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    textIndex = (textIndex + 1) % typingTexts.length;
  }

  setTimeout(typeText, isDeleting ? 55 : 95);
}

typeText();

// Scroll reveal animation
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.addEventListener("DOMContentLoaded", () => {
  const contactPage = document.querySelector("#contact.ig-contact-page");

  if (!contactPage) return;

  const likeButton = contactPage.querySelector("[data-ig-like]");
  const followButton = contactPage.querySelector("[data-ig-follow]");
  const copyButton = contactPage.querySelector("[data-copy-email]");
  const copyStatus = contactPage.querySelector("[data-copy-status]");

  if (likeButton) {
    likeButton.addEventListener("click", () => {
      const isLiked = likeButton.classList.toggle("is-liked");

      likeButton.setAttribute("aria-pressed", String(isLiked));

      const icon = likeButton.querySelector(".ig-like-icon");
      const text = likeButton.querySelector(".ig-like-text");

      if (icon) icon.textContent = isLiked ? "♥" : "♡";
      if (text) text.textContent = isLiked ? "Liked" : "Like";
    });
  }

  if (followButton) {
    followButton.addEventListener("click", () => {
      const isFollowing = followButton.classList.toggle("is-following");

      followButton.setAttribute("aria-pressed", String(isFollowing));
      followButton.textContent = isFollowing ? "Following" : "Follow";
    });
  }

  function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(value);
    }

    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = value;
    temporaryInput.setAttribute("readonly", "");
    temporaryInput.style.position = "fixed";
    temporaryInput.style.left = "-9999px";

    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    document.body.removeChild(temporaryInput);

    return Promise.resolve();
  }

  if (copyButton && copyStatus) {
    copyButton.addEventListener("click", () => {
      const email = copyButton.getAttribute("data-copy-email");

      copyText(email).then(() => {
        copyStatus.classList.add("is-visible");
        copyButton.textContent = "Copied";

        setTimeout(() => {
          copyStatus.classList.remove("is-visible");
          copyButton.textContent = "Copy Email";
        }, 1800);
      });
    });
  }
});
// =========================
// CONTACT PAGE FAKE IG POST
// Carousel + like + session-only comments
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector("#contact .ig-carousel-container");

  if (!container) return;

  const slides = Array.from(container.querySelectorAll(".ig-slide"));
  const prevBtn = container.querySelector("#prevSlide");
  const nextBtn = container.querySelector("#nextSlide");
  const indicatorBtns = Array.from(container.querySelectorAll("[data-slide-to]"));
  const likeBtn = container.querySelector("#likeBtn");
  const likeText = container.querySelector("#likeText");
  const carouselTrack = container.querySelector(".ig-carousel-track");
  const commentForm = container.querySelector("#igCommentForm");
  const commentInput = container.querySelector("#igCommentInput");
  const commentList = container.querySelector("#igCommentList");

  if (!slides.length) return;

  let currentSlide = 0;
  let liked = false;

  function showSlide(index) {
    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentSlide;

      slide.classList.toggle("active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    indicatorBtns.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === currentSlide;

      button.classList.toggle("active", isActive);

      if (isActive) {
        button.setAttribute("aria-current", "true");
      } else {
        button.removeAttribute("aria-current");
      }
    });
  }

  nextBtn?.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });

  prevBtn?.addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });

  indicatorBtns.forEach((button) => {
    button.addEventListener("click", () => {
      showSlide(Number(button.dataset.slideTo));
    });
  });

  likeBtn?.addEventListener("click", () => {
    liked = !liked;

    likeBtn.classList.toggle("active", liked);
    likeBtn.textContent = liked ? "♥" : "♡";
    likeBtn.setAttribute("aria-pressed", String(liked));

    if (likeText) {
      likeText.textContent = liked ? "Liked by you" : "Be the first to like this";
    }
  });

  carouselTrack?.addEventListener("dblclick", () => {
    if (!liked) likeBtn?.click();

    const heart = document.createElement("div");

    heart.textContent = "♥";
    heart.style.position = "absolute";
    heart.style.left = "50%";
    heart.style.top = "50%";
    heart.style.transform = "translate(-50%, -50%) scale(2)";
    heart.style.fontSize = "60px";
    heart.style.color = "#ff8eb1";
    heart.style.opacity = "1";
    heart.style.transition = "0.5s ease";
    heart.style.pointerEvents = "none";
    heart.style.zIndex = "5";

    carouselTrack.appendChild(heart);

    setTimeout(() => {
      heart.style.opacity = "0";
      heart.style.transform = "translate(-50%, -50%) scale(3)";
    }, 50);

    setTimeout(() => {
      heart.remove();
    }, 600);
  });

  commentForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const commentText = commentInput.value.trim();

    if (!commentText || !commentList) return;

    const comment = document.createElement("p");
    comment.className = "ig-comment";

    const username = document.createElement("strong");
    username.textContent = "ni.kkoi ";

    const text = document.createElement("span");
    text.textContent = commentText;

    comment.append(username, text);
    commentList.appendChild(comment);

    commentInput.value = "";
    commentInput.focus();
  });

  showSlide(0);
});
// CONTACT FORM (NO REDIRECT VERSION)
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("quickNoteForm");

  if (!form) return;

  // create status only ONCE
  const status = document.createElement("p");
  status.className = "form-status";
  form.appendChild(status);

  function setStatus(message, color) {
    status.textContent = message;
    status.style.color = color;
  }

  function clearStatusAfter(ms) {
    setTimeout(() => {
      status.textContent = "";
    }, ms);
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // START STATE
    setStatus("Sending...", "#ffb6c1");

    try {
      const response = await fetch("https://formspree.io/f/xeebolge", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      // SUCCESS
      if (response.ok) {
        setStatus("Message sent successfully 💌", "#7CFFB2");
        form.reset();

        // 🔥 remove "Sending..." automatically
        clearStatusAfter(3000);
      } else {
        setStatus("Failed to send. Try again.", "#ff6b6b");
        clearStatusAfter(4000);
      }
    } catch (err) {
      setStatus("Network error. Please try later.", "#ff6b6b");
      clearStatusAfter(4000);
    }
  });
});