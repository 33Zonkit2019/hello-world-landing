(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var header = document.getElementById("header");
  var burger = document.getElementById("burger");
  var mobileNav = document.getElementById("mobileNav");
  var candleCountEl = document.getElementById("candleCount");
  var candlesContainer = document.getElementById("candles");
  var toast = document.getElementById("toast");
  var CANDLE_KEY = "egor_candles";

  /* Header scroll */
  function onScroll() {
    if (window.scrollY > 20) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  function toggleMenu() {
    var isOpen = burger.classList.toggle("burger--active");
    mobileNav.classList.toggle("mobile-nav--open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  function closeMenu() {
    burger.classList.remove("burger--active");
    mobileNav.classList.remove("mobile-nav--open");
    document.body.style.overflow = "";
  }

  if (burger) {
    burger.addEventListener("click", toggleMenu);
  }

  if (mobileNav) {
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* Scroll reveal */
  var revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal--visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealElements.forEach(function (el) {
      el.classList.add("reveal--visible");
    });
  }

  /* Candle counter */
  function getCandleCount() {
    try {
      return parseInt(localStorage.getItem(CANDLE_KEY), 10) || 0;
    } catch (e) {
      return 0;
    }
  }

  function setCandleCount(n) {
    try {
      localStorage.setItem(CANDLE_KEY, String(n));
    } catch (e) {
      /* ignore */
    }
    if (candleCountEl) {
      candleCountEl.textContent = n;
    }
  }

  setCandleCount(getCandleCount());

  function spawnCandle() {
    if (!candlesContainer) return;

    var candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = Math.random() * 100 + "%";
    candle.style.animationDuration = 3 + Math.random() * 2 + "s";
    candlesContainer.appendChild(candle);

    setTimeout(function () {
      candle.remove();
    }, 5000);
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("toast--visible");
    setTimeout(function () {
      toast.classList.remove("toast--visible");
    }, 3000);
  }

  function lightCandle() {
    var count = getCandleCount() + 1;
    setCandleCount(count);

    for (var i = 0; i < 5; i++) {
      setTimeout(spawnCandle, i * 80);
    }

    showToast("Свеча зажжена. Егор, мы помним.");
  }

  ["candleBtn", "candleBtnMobile", "memorialBtn"].forEach(function (id) {
    var btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", function () {
        lightCandle();
        if (id === "candleBtnMobile") closeMenu();
      });
    }
  });

  /* Animated stats */
  var statNums = document.querySelectorAll(".stat-card__num[data-target]");

  function animateStat(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var duration = 1500;
    var start = performance.now();

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && statNums.length) {
    var statsObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateStat(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNums.forEach(function (el) {
      statsObserver.observe(el);
    });
  } else {
    statNums.forEach(function (el) {
      el.textContent = el.getAttribute("data-target");
    });
  }

  /* Smooth anchor scroll */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
})();
