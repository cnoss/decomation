gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

document.fonts.ready.then(() => {
  const layout = document.querySelector(".main-header");
  if (!layout) return;
  layout.querySelectorAll("h1, h2, h3").forEach(el => {
    SplitText.create(el, {
      type: "chars, words, lines",

      mask: "lines",
      autoSplit: true,
      onSplit(self) {
        return gsap.from(self.chars, {
          duration: 0.5 + Math.random() * 0.5,
          yPercent: "random([-100, 100])",
          /*rotation: "random([-90, 90])", */
          ease: "back.out(1.7)",
          autoAlpha: 0,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play pause resume reset",
          },
          stagger: {
            amount: 0.3,
            duration: 0.5 + Math.random() * 0.5,
            from: "center",
          }
        });
      }
    });
  })
});

gsap.utils.toArray("h2").forEach(headline => {
  ScrollTrigger.create({
    trigger: headline,
    start: "top 80%",
    onEnter: () => {
      gsap.fromTo(headline,
        // fromVars (nur Startwerte)
        { opacity: 0, rotationY: 90, transformPerspective: 1000 },
        // toVars (Zielwerte + Dauer/Ease etc.)
        { opacity: 1, xPercent: 0, rotationY: 0, duration: 0.8, delay: 0.2 }
      );
    },
    // onLeave: () => gsap.set(headline, { opacity: 0, scale: 1.1 }),
    // onLeaveBack: () => gsap.set(headline, { opacity: 0, scale: 1.1 })
  });
});
