// Scroll keyframes for the persistent 3D scene.
// Each keyframe = { y: scroll position, state }. Between keyframes the state is smoothstep-interpolated.
// "Hidden" keyframes keep the orb shrunk to nothing, so it never drifts over dense content
// (the journey cards on mobile, the project grid, the bento tiles).

const HIDDEN = { s: 0, rings: 0, hero: 0, stack: 0, torus: 0 };

function states(hw, hh, mobile) {
  const base = { x: 0, y: 0, s: 0, rings: 0, ringScale: 1, hero: 0, stack: 0, torus: 0, tx: 0, ty: 0 };
  const s = (o) => ({ ...base, ...o });
  if (mobile) {
    return {
      hero: s({ y: hh * 0.45, s: 0.72, rings: 1, ringScale: 0.8, hero: 1 }),
      stack: s({ y: hh * 0.42, s: 0.55, rings: 1, ringScale: 0.72, stack: 1 }),
      contact: s({ x: hw * 0.42, y: hh * 0.77, tx: hw * 0.42, ty: hh * 0.77, torus: 0.2 }),
    };
  }
  return {
    hero: s({ x: hw * 0.44, y: hh * 0.08, s: 1.1, rings: 1, hero: 1 }),
    journey: s({ x: hw * 0.8, y: hh * 0.72, s: 0.3, rings: 0.35, ringScale: 0.8 }),
    stack: s({ x: hw * 0.42, y: -hh * 0.02, s: 0.8, rings: 1, ringScale: 1.12, stack: 1 }),
    contact: s({ x: hw * 0.46, y: -hh * 0.36, tx: hw * 0.46, ty: -hh * 0.36, torus: 0.95 }),
  };
}

const hidden = (st) => ({ ...st, ...HIDDEN });

export function buildKeyframes({ hw, hh, mobile, vh, docHeight, sections }) {
  const S = states(hw, hh, mobile);
  const top = (id) => sections[id]?.top ?? 0;
  const height = (id) => sections[id]?.height ?? 0;
  const center = (id) => top(id) + height(id) / 2 - vh / 2;
  const end = Math.max(0, docHeight - vh);
  const contactY = Math.min(end, Math.max(top("contact") - vh * 0.15, end - 1));
  let k;

  if (mobile) {

    // Orb only appears in the hero, at the top of the stack section and as a small torus in contact.
    k = [
      { y: 0, state: S.hero },
      { y: vh * 0.35, state: hidden(S.hero) },
      { y: top("stack") - vh * 0.15, state: hidden(S.stack) },
      { y: top("stack"), state: S.stack },
      { y: top("stack") + vh * 0.45, state: hidden(S.stack) },
      // rings appear as the contact section scrolls in; their height follows the .contact__rings strip (see Background3D)
      { y: top("contact") - vh * 0.75, state: hidden(S.contact) },
      { y: top("contact") - vh * 0.3, state: S.contact },
    ];
  } else {
    k = [
      { y: 0, state: S.hero },
      { y: top("journey") + Math.min(sections.journey?.pin ?? 0, vh) * 0.5 + vh * 0.2, state: S.journey },
      { y: top("work") - vh * 0.25, state: hidden(S.journey) },
      // stays hidden for the whole work section, then grows in place for the stack
      { y: top("stack") - vh * 0.5, state: hidden(S.stack) },
      { y: Math.max(top("stack") - vh * 0.05, center("stack")), state: S.stack },
      { y: top("offclock") - vh * 0.25, state: hidden(S.stack) },
      { y: top("contact") - vh * 0.5, state: hidden(S.contact) },
      { y: contactY, state: S.contact },
    ];
  }
  // keep keyframes strictly increasing
  for (let i = 1; i < k.length; i++) k[i].y = Math.max(k[i].y, k[i - 1].y + 1);
  return k;
}

export function sampleKeyframes(k, y, smooth) {
  if (!k.length) return null;
  if (y <= k[0].y) return { ...k[0].state };
  for (let i = 0; i < k.length - 1; i++) {
    const a = k[i], b = k[i + 1];
    if (y <= b.y) {
      const t = smooth((y - a.y) / (b.y - a.y));
      const out = {};
      for (const key in a.state) out[key] = a.state[key] + (b.state[key] - a.state[key]) * t;
      return out;
    }
  }
  return { ...k[k.length - 1].state };
}
