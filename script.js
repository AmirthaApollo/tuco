/* ============================================================
   WHY TUCO SHOULD HIRE ME — interactions
   ============================================================ */
(() => {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- footer year ---------- */
  $("#year").textContent = new Date().getFullYear();

  /* ---------- custom cursor ---------- */
  const cursor = $("#cursor");
  const cursorLabel = $(".cursor__label");
  const LABELS = {
    play: "see my case",
    look: "see what i built",
    product: "one of five",
    open: "open project",
    talk: "let's talk",
    link: "open link"
  };

  if (cursor && !prefersReduced && window.matchMedia("(hover:hover) and (pointer:fine)").matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;

    window.addEventListener("pointermove", (e) => { mx = e.clientX; my = e.clientY; }, { passive: true });

    const renderCursor = () => {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    const bindCursor = (el) => {
      const key = el.dataset.cursor;
      el.addEventListener("pointerenter", () => {
        cursor.classList.add("is-hover");
        if (key && LABELS[key]) { cursorLabel.textContent = LABELS[key]; cursor.classList.add("is-label"); }
      });
      el.addEventListener("pointerleave", () => {
        cursor.classList.remove("is-hover", "is-label");
      });
    };

    $$("[data-cursor], a, button, .product, .chip, .node").forEach(bindCursor);
    document.addEventListener("pointerdown", () => cursor.classList.add("is-hover"));
    document.addEventListener("pointerup", () => cursor.classList.remove("is-hover"));
  }

  /* ---------- scroll progress + nav ---------- */
  const progressBar = $("#progressBar");
  const progressPct = $("#progressPct");
  const nav = $("#nav");
  let lastY = window.scrollY;

  const onScroll = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    progressBar.style.width = pct + "%";
    progressPct.textContent = Math.round(pct) + "%";

    nav.classList.toggle("is-scrolled", window.scrollY > 40);
    if (window.scrollY > 400 && window.scrollY > lastY) nav.classList.add("is-hidden");
    else nav.classList.remove("is-hidden");
    lastY = window.scrollY;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- reveal on scroll ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => revealObserver.observe(el));

  /* ---------- animated counters ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(tick);
  };

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((el) => countObserver.observe(el));

  /* ---------- pipeline sequential animation ---------- */
  const pipeline = $("#pipeline");
  const pipelineFill = $("#pipelineFill");
  const steps = $$(".pstep");

  if (pipeline) {
    const pipelineObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        pipelineObserver.disconnect();
        steps.forEach((step, i) => {
          setTimeout(() => {
            step.classList.add("is-on");
            pipelineFill.style.width = ((i + 1) / steps.length) * 100 + "%";
          }, prefersReduced ? 0 : i * 260);
        });
      });
    }, { threshold: 0.35 });
    pipelineObserver.observe(pipeline);
  }

  /* ---------- expandable case studies ---------- */
  $$(".proof-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const proof = btn.nextElementSibling;
      btn.setAttribute("aria-expanded", String(!expanded));
      proof.hidden = expanded;
      btn.firstChild.textContent = expanded ? "See proof " : "Hide proof ";
    });
  });

  /* ---------- 360° orbit readout ---------- */
  const personExample = $("#personExample");
  const readoutLabel = $(".person__readout-label");
  $$(".node").forEach((node) => {
    const show = () => {
      $$(".node").forEach((n) => n.classList.remove("is-active"));
      node.classList.add("is-active");
      readoutLabel.textContent = node.dataset.short;
      personExample.textContent = node.dataset.example;
    };
    node.addEventListener("pointerenter", show);
    node.addEventListener("focus", show);
    node.addEventListener("click", show);
  });

  const orbit = $("#orbit");
  if (orbit) {
    const setRadius = () => {
      orbit.style.setProperty("--r", orbit.clientWidth * 0.4 + "px");
    };
    setRadius();
    window.addEventListener("resize", setRadius);
    window.addEventListener("load", setRadius);
  }

  /* ============================================================
     GROWTH LAB — build a hypothetical experiment
     ============================================================ */
  const LAB = {
    discover: {
      creator:   { phrase: "creator-led content that shows the product in real family routines", test: "seed 6–8 micro-creators with a clear brief", metric: "creator-attributed sessions" },
      community: { phrase: "parent communities where recommendations already happen", test: "run an honest AMA-style presence in 3 parent groups", metric: "community-driven sessions" },
      social:    { phrase: "small social experiments that test hooks and formats", test: "ship 5 hook variations across Reels and Shorts", metric: "thumb-stop rate and CTR" },
      education: { phrase: "educational content that answers real parent questions", test: "publish a 4-part 'what's actually in it' series", metric: "watch-through and saves" }
    },
    trust: {
      ingredients: { phrase: "ingredient storytelling that explains what's inside and why it's safe", test: "build one clear ingredient page per hero product", metric: "time on ingredient page" },
      safety:      { phrase: "safety education that removes doubt before purchase", test: "add a paediatrician-reviewed safety FAQ to PDPs", metric: "FAQ engagement and add-to-cart rate" },
      reviews:     { phrase: "real parent reviews placed exactly where doubt appears", test: "surface review snippets beside price and CTA", metric: "PDP conversion lift" },
      founder:     { phrase: "the founder story that makes the brand feel human", test: "shoot one founder film and place it on the homepage", metric: "homepage-to-PDP click-through" },
      beforeafter: { phrase: "before/after education that sets honest expectations", test: "create a visual 'what to expect in 4 weeks' guide", metric: "return-purchase intent" }
    },
    convert: {
      bundles:  { phrase: "bundles that make trying the full routine lower-risk", test: "launch 2 routine bundles against single units", metric: "AOV and first-purchase conversion" },
      trial:    { phrase: "trial sizes that lower the first-purchase barrier", test: "offer a low-price trial kit for new customers", metric: "trial-to-full-size repurchase" },
      first:    { phrase: "a strong first-purchase offer that rewards action now", test: "A/B test a first-order incentive with a deadline", metric: "first-purchase conversion rate" },
      personal: { phrase: "personalized recommendations that fit each child's needs", test: "add a 3-question 'find the right routine' quiz", metric: "quiz completion and conversion" }
    }
  };

  const selected = { discover: null, trust: null, convert: null };
  const labEmpty = $("#labEmpty");
  const labGrid = $("#labGrid");
  const out = {
    hypothesis: $("#outHypothesis"),
    test: $("#outTest"),
    metric: $("#outMetric"),
    learn: $("#outLearn"),
    iterate: $("#outIterate")
  };

  const buildLab = () => {
    const d = LAB.discover[selected.discover];
    const t = LAB.trust[selected.trust];
    const c = LAB.convert[selected.convert];
    if (!d || !t || !c) return;

    out.hypothesis.textContent =
      `If Tuco reaches parents through ${d.phrase}, earns trust with ${t.phrase}, and converts with ${c.phrase} — then more first-time parents will buy, and we'll learn which message actually moves them.`;

    out.test.textContent =
      `Run a 2-week pilot: ${d.test}; ${t.test}; ${c.test}. Keep budget small and isolate one variable per step.`;

    out.metric.textContent =
      `Primary: ${c.metric}. Supporting: ${d.metric}, ${t.metric}. Compare against a control before scaling.`;

    out.learn.textContent =
      `We'll know quickly whether ${d.metric} brings the right parents, and whether trust is the real bottleneck between interest and purchase.`;

    out.iterate.textContent =
      `Double down on the strongest step, kill the weakest one, and re-run with a single change. Repeat until the funnel compounds.`;

    labEmpty.hidden = true;
    labGrid.hidden = false;
  };

  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const stage = chip.dataset.stage;
      const group = chip.closest(".chips");
      $$(".chip", group).forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      selected[stage] = chip.dataset.key;
      buildLab();
    });
  });

  /* ============================================================
     CONFETTI — celebrate reaching the final pitch
     ============================================================ */
  const canvas = $("#confetti");
  if (canvas && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    const colors = ["#FF6B5E", "#1FB6A6", "#9B7BE0", "#5BB8E8", "#FFC93C", "#AFC93A", "#15110A"];
    let particles = [];
    let raf = null;
    let launched = false;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const burst = () => {
      const r = canvas.getBoundingClientRect();
      const count = 140;
      particles = Array.from({ length: count }, () => ({
        x: r.width * (0.15 + Math.random() * 0.7),
        y: r.height * (0.05 + Math.random() * 0.25),
        vx: (Math.random() - 0.5) * 5,
        vy: Math.random() * 3 + 1,
        g: 0.09 + Math.random() * 0.06,
        s: 5 + Math.random() * 8,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.22,
        color: colors[(Math.random() * colors.length) | 0],
        life: 1
      }));

      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach((p) => {
          p.vy += p.g;
          p.x += p.vx;
          p.y += p.vy;
          p.rot += p.vr;
          if (p.y < canvas.height + 40) alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.globalAlpha = Math.max(0, 1 - p.y / (canvas.height + 40));
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
          ctx.restore();
        });
        if (alive) raf = requestAnimationFrame(draw);
        else { ctx.clearRect(0, 0, canvas.width, canvas.height); raf = null; }
      };
      if (raf) cancelAnimationFrame(raf);
      draw();
    };

    sizeCanvas();
    window.addEventListener("resize", sizeCanvas);

    const confettiObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !launched) {
          launched = true;
          setTimeout(burst, 350);
          confettiObserver.disconnect();
        }
      });
    }, { threshold: 0.4 });
    confettiObserver.observe($("#pitch"));
  }
})();
