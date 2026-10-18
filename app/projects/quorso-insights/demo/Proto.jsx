'use client'
// The Insights prototype, embedded in the case (neutral sample data).
// Survey Responses — heatmap prototype (rev: cards + drill-down + follow-ups)
import { useState, useEffect, useRef, Fragment } from "react";

// Quorso tokens (from tokens.md)
const C = {
  secondary: "#2E164B",
  white: "#FFFFFF",
  surface100: "#EBECEC",
  mono200: "#C4C5C6",
  mono300: "#9D9FA1",
  mono400: "#76797B",
  mono500: "#4F5255",
  mono600: "#282C2F",
  green300: "#006D41",
  red300: "#C82124",
  link: "#0064FA",
};

const S = { 1: 4, 2: 8, 3: 12, 4: 16, 5: 20, 6: 24, 8: 32 };
const R = { sm: 4, md: 8, lg: 12 };

// ─── Spec §2 — ordinal opacity ramp ─────────────────────────────
// Opacity by answer position (first → last defined answer), percent.
const RAMPS = {
  2: [40, 90],
  3: [14, 40, 90],
  4: [14, 30, 62, 90], // 60 fell in the 60–61 contrast dead zone
  5: [14, 20, 40, 70, 90],
  6: [14, 20, 32, 48, 72, 90], // 50 fell in the 50–61 dead zone
  7: [14, 19, 27, 40, 62, 74, 90], // 56 fell in the 50–61 dead zone
};

function rampOpacity(index, total) {
  if (total <= 1) return 90;
  if (RAMPS[total]) return RAMPS[total][index];
  // N > 7 — spec formula, light → dark from first to last answer.
  // 50–61% is a contrast dead zone (Mono/600 holds 4.5:1 to 49%, white
  // from 62%): snap any value landing there to the nearest legal side.
  const t = Math.round(14 + 76 * Math.pow(index / (total - 1), 1.4));
  if (t >= 50 && t <= 61) return t <= 55 ? 49 : 62;
  return t;
}

// Spec §2 — pre-blend ramp into solid hex over white, so hover /
// selection states never shift the perceived colour.
function blendOverWhite(opacityPct, [r, g, b] = [46, 22, 75]) {
  const a = opacityPct / 100;
  const ch = (v) => Math.round(v * a + 255 * (1 - a));
  return `rgb(${ch(r)}, ${ch(g)}, ${ch(b)})`; // default base: #2E164B
}

// ─── Sample data ────────────────────────────────────────────────
// style: "positive" | "negative" → spec §3 semantic override
const ROWS = [
  {
    id: "1",
    section: "Entrance & Parking",
    num: "1",
    question: "Is the entrance clean, well lit and free of obstacles?",
    type: "Multi choice",
    answers: [
      { label: "Poor", count: 2 },
      { label: "Below", count: 3 },
      { label: "Average", count: 24 },
      { label: "Good", count: 31 },
      { label: "Excellent", count: 99 },
    ],
  },
  {
    id: "1.2",
    section: "",
    num: "1.2",
    question: "Are parking bays clearly marked and in good repair?",
    type: "Single select",
    answers: [
      { label: "No", count: 32, style: "negative" },
      { label: "Yes", count: 118, style: "positive" },
    ],
  },
  {
    id: "1.3",
    section: "",
    num: "1.3",
    question: "Describe anything at the entrance that needs attention.",
    type: "Text",
    value: "90",
  },
  {
    id: "2",
    section: "",
    num: "2",
    question: "Is outdoor signage aligned with the current campaign?",
    type: "Multi choice",
    answers: [
      { label: "Below", count: 18 },
      { label: "Average", count: 22 },
      { label: "Good", count: 12 },
      { label: "Excellent", count: 40 },
    ],
  },
  {
    id: "2.1",
    section: "",
    num: "2.1.",
    question: "Follow up Image",
    followUp: "Q 1.1 Is the entrance clean, well lit and free of obstacles?",
    type: "Image",
    value: "77",
  },
  {
    id: "2.2",
    section: "",
    num: "2.2",
    question: "Was the promo end-cap rebuilt by Monday?",
    type: "Single select",
    answers: [
      { label: "No", count: 0, style: "negative" },
      { label: "Yes", count: 61, style: "positive" },
    ],
  },
  {
    id: "2.3",
    section: "",
    num: "2.3",
    question:
      "When walking the full length of the promotional aisle from the main entrance towards the checkout area, are all seasonal campaign displays, shelf-edge labels, hanging banners and floor stickers present, undamaged, correctly priced and matching the current week's campaign planogram as published in the latest merchandising pack?",
    type: "Multi choice",
    answers: [
      { label: "Below", count: 7 },
      { label: "Average", count: 19 },
      { label: "Good", count: 31 },
      { label: "Excellent", count: 14 },
    ],
  },
  {
    id: "3",
    section: "Coffee Corner",
    num: "3",
    question: "Are all coffee machines working, or have any issues been reported?",
    type: "Multi choice",
    answers: [
      { label: "Poor", count: 0 },
      { label: "Below", count: 4 },
      { label: "Average", count: 27 },
      { label: "Good", count: 33 },
      { label: "Excellent", count: 12 },
    ],
  },
  {
    id: "3.1",
    section: "",
    num: "3.1",
    question: "Are milk fridges stocked to planogram?",
    type: "Multi choice",
    answers: [
      { label: "Poor", count: 0 },
      { label: "Below", count: 0 },
      { label: "Average", count: 0 },
      { label: "Good", count: 0 },
      { label: "Excellent", count: 0 },
    ],
  },
  {
    id: "3.2",
    section: "",
    num: "3.2",
    question: "How would you rate the seating area cleanliness?",
    type: "Multi choice",
    answers: [
      { label: "Poor", count: 0 },
      { label: "Below", count: 0 },
      { label: "Average", count: 0 },
      { label: "Good", count: 12 },
      { label: "Excellent", count: 100 },
    ],
  },
  {
    id: "3.3",
    section: "",
    num: "3.3",
    question: "Which issues were observed this week?",
    type: "Multi choice",
    answers: [
      { label: "Spillage", count: 14 },
      { label: "Queue build-up", count: 9 },
      { label: "Out of stock", count: 22 },
      { label: "Broken equipment", count: 6 },
      { label: "Staffing gap", count: 11 },
      { label: "Signage missing", count: 4 },
      { label: "Temperature", count: 3 },
      { label: "Lighting", count: 2 },
      { label: "Other", count: 7 },
    ],
  },
  {
    id: "3.4",
    section: "",
    num: "3.4",
    question: "Which products were flagged during the audit?",
    type: "Multi choice",
    answers: Array.from({ length: 32 }, (_, i) => ({
      label: `SKU ${1100 + i * 3}`,
      count: i < 28 ? Math.floor(60 / (i + 1)) : 0,
    })),
  },
];

// Link-style hover: text turns Blue/500 on hover
function LinkHover({ style, onClick, children }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      onClick={onClick}
      style={{
        ...style,
        color: h ? C.link : style.color,
        textDecoration: h ? "underline" : "none",
        textUnderlineOffset: 3,
        cursor: "pointer",
        transition: "color 100ms ease",
      }}
    >
      {children}
    </div>
  );
}


// Sections carried onto every row, so filtering can regroup bands correctly
const FILLED_ROWS = (() => {
  let current = "";
  return ROWS.map((r) => {
    if (r.section) current = r.section;
    return { ...r, _section: current };
  });
})();
const ANSWER_TYPES = [...new Set(ROWS.map((r) => r.type))];

// Marks a follow-up question (small dark rounded square with a trend tick)
function FollowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      style={{ verticalAlign: "-3px", marginRight: 6, flex: "none" }}
    >
      <rect x="0.5" y="0.5" width="15" height="15" rx="3.5" fill={C.mono600} />
      <path
        d="M3.5 9.5l2.5-2.5 2 2 4-4"
        stroke={C.white}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Cell ───────────────────────────────────────────────────────
function Tooltip({ answer, inside }) {
  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        ...(inside ? { right: 6 } : { left: "100%", marginLeft: 8 }),
        zIndex: 10,
        backgroundColor: C.white,
        color: C.mono600,
        borderRadius: 12,
        padding: "10px 14px",
        fontSize: 14,
        lineHeight: "21px",
        whiteSpace: "nowrap",
        boxShadow: "0 4px 16px rgba(11, 15, 19, 0.18)",
        pointerEvents: "none",
      }}
    >
      {/* left-pointing tail */}
      <div
        style={{
          position: "absolute",
          left: -4,
          top: "50%",
          width: 10,
          height: 10,
          transform: "translateY(-50%) rotate(45deg)",
          backgroundColor: C.white,
          borderRadius: 2,
        }}
      />
      {answer.label}: {answer.count}
    </div>
  );
}

function BarCell({ answer, opacityPct, onOpen }) {
  const ref = useRef(null);
  const [width, setWidth] = useState(Infinity);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isZero = answer.count === 0 && !answer.isOther;
  // "Label Count" as one string; the ellipsis (…) handles overflow.
  // <40px → nothing (a fragment identifies nothing; tooltip covers it).
  const showLabel = !isZero && width >= 40;
  const showCount = !isZero && !answer.isOther;
  // Tooltip sits inside wide cells (as in Figma), beside narrow ones
  const tooltipInside = width >= 170;

  // Cell colour: semantic override (70%, pre-blended) beats the ramp.
  // Zero cells KEEP their assigned colour — width alone encodes empty.
  let bg, labelColor;
  if (answer.isOther) {
    // §6: aggregated tail — white cell, outside the ramp
    bg = C.white;
    labelColor = C.mono600;
  } else if (answer.style === "positive") {
    bg = blendOverWhite(62, [0, 109, 65]); // Green/300 at 62% — Mono/600 4.8:1
    labelColor = C.mono600; // at 70% neither colour passed 4.5:1
  } else if (answer.style === "negative") {
    bg = blendOverWhite(62, [200, 33, 36]); // Red/300 at 62% — Mono/600 4.6:1
    labelColor = C.mono600;
  } else {
    bg = blendOverWhite(opacityPct);
    // §4: contrast flip at 62% — WCAG-derived for Mono/600: dark holds
    // 4.5:1 up to 49% opacity, white from 62%; 50–61 is a dead zone no
    // ramp step may use (tables + formula enforce it).
    labelColor = opacityPct >= 62 ? C.white : C.mono600;
  }

  // §5 (revised): zero-response cells — fixed 16px, normal colour for
  // their scale position, no label. Non-zero cells are 32px minimum,
  // so empty vs present is a 2× width difference.
  if (isZero) {
    return (
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: "relative",
          flex: "0 0 16px",
          backgroundColor: bg,
          borderRight: `1px solid ${C.white}`,
          boxSizing: "border-box",
        }}
      >
        {hover && <Tooltip answer={answer} inside={false} />}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)}
      onTouchEnd={() => setHover(false)}
      onTouchCancel={() => setHover(false)}
      onClick={() => onOpen(answer)}
      style={{
        position: "relative",
        cursor: "pointer",
        flexGrow: answer.count,
        flexBasis: 0,
        minWidth: answer.isOther ? 80 : 32, // non-zero min 32 (2× zero); "+N more" floors at 80
        borderRight: `1px solid ${C.white}`, // white divider after every cell
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: bg,
          filter: hover ? "brightness(0.92)" : "none", // hover state carried by the cell, not the text
          transition: "filter 100ms ease",
          color: labelColor,
          display: "flex",
          alignItems: "center",
          padding: showLabel ? `0 ${S[2]}px` : 0,
          fontSize: 14,
          lineHeight: "21px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        {showLabel && (
          <span
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
              textDecoration: hover ? "underline" : "none",
              textUnderlineOffset: 3,
            }}
          >
            {answer.label}
            {showCount && (
              <span style={{ marginLeft: 6 }}>{answer.count}</span>
            )}
          </span>
        )}
      </div>
      {hover && <Tooltip answer={answer} inside={tooltipInside} />}
    </div>
  );
}

// ─── Answers column ─────────────────────────────────────────────
function AnswersCell({ row, onOpenResponses, barHeight, bare }) {
  // §7: non-bar answer types show the aggregate value as plain text.
  // The number is a link: hover Blue/500, click opens the responses modal.
  if (!row.answers) {
    return (
      <LinkHover
        onClick={() =>
          onOpenResponses(row, {
            label: row.type,
            count: parseInt(row.value, 10) || 0,
            isDetail: true, // Text/Image/Number → rich answers table
          })
        }
        style={{
          fontSize: 14,
          lineHeight: "21px",
          color: C.mono600,
          paddingLeft: bare ? 0 : S[3],
        }}
      >
        {row.value}
      </LinkHover>
    );
  }

  const total = row.answers.reduce((sum, a) => sum + a.count, 0);

  // §5: all answers zero
  if (total === 0) {
    return (
      <span
        style={{
          fontSize: 14,
          lineHeight: "21px",
          color: C.mono400,
          paddingLeft: bare ? 0 : S[3],
        }}
      >
        No responses yet
      </span>
    );
  }

  // Threshold rule (spec §7):
  // ≤6 options → full heatmap, definition order, positional ramp
  // 7+         → top 5 by count (descending) + white "+N more";
  //              each cell keeps its full-list positional shade, so
  //              shade = which answer it is, sort/width = magnitude.
  //              30+ rows render the same; their data-quality flag /
  //              Builder nudge is an upstream concern, not a layout.
  const n = row.answers.length;
  const sortedTier = n >= 7;
  let cells = row.answers;
  if (sortedTier) {
    const sorted = [...row.answers].sort((a, b) => b.count - a.count);
    const rest = sorted.slice(5);
    cells = [
      ...sorted.slice(0, 5),
      {
        label: `+${rest.length} more`,
        count: rest.reduce((sum, a) => sum + a.count, 0),
        isOther: true,
        breakdown: rest,
      },
    ];
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: 0, // cells sit flush — one continuous bar
        width: "100%",
        minWidth: 0,
        height: barHeight || "100%",
        padding: "4px 0", // Figma: padding 0 horizontal, 4 vertical
        boxSizing: "border-box",
      }}
    >
      {cells.map((a, i) => (
        <BarCell
          key={a.label}
          answer={a}
          // Shade always comes from the answer's position in the FULL
          // defined list (identity in the scale) — even in sorted rows,
          // where display order and shade order can legitimately differ.
          opacityPct={rampOpacity(row.answers.indexOf(a), n)}
          onOpen={(answer) => onOpenResponses(row, answer)}
        />
      ))}
    </div>
  );
}

// ─── Responses modal ────────────────────────────────────────────
// Opens on cell click; lists the individual responses behind an answer.
const DETAIL_NAMES = ["Sarah Collins", "Liam Johnson", "Amelia Roberts", "Mathew Davis", "Priya Shah", "Tom Walker", "Nora Kim"];
const DETAIL_ROLES = ["District manager", "Store manager"];
const DETAIL_ANSWERS = [
  "Long queue at the coffee machine during the morning rush; a second barista on weekdays would help",
  "Card reader at till 3 not working",
  "Customer complained about parking availability",
  "No issues",
  "Bins overflowing near the entrance",
  "Self-checkout screen frozen, restarted it on site",
  "Entrance mat worn through, needs replacing",
  "Promo banner missing from the front window",
  "Spillage by the drinks fridge, cleaned up",
];

function mockDetailResponses(count) {
  const rows = Array.from({ length: count }, (_, i) => ({
    region: `Region ${(i % 4) + 1}`,
    district: `District ${(i % 3) + 1}`,
    store: i % 7 === 1 ? "-" : `Store ${(i % 4) + 1}`,
    // indices step so names and answers vary within each region group
    name: DETAIL_NAMES[(i * 3 + Math.floor(i / 4)) % DETAIL_NAMES.length],
    role: DETAIL_ROLES[(i + Math.floor(i / 4)) % DETAIL_ROLES.length],
    answer: DETAIL_ANSWERS[(i * 5 + Math.floor(i / 4)) % DETAIL_ANSWERS.length],
  }));
  // The table sorts by Region — mobile turns the sort key into group headers
  return rows.sort(
    (a, b) =>
      a.region.localeCompare(b.region) ||
      a.district.localeCompare(b.district) ||
      a.store.localeCompare(b.store)
  );
}

function ResponsesModal({ modal, onClose, onOpenQuestion, onOpenAnswer, mobile }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState("region");
  const [sortDir, setSortDir] = useState(1); // 1 asc, -1 desc
  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (sortRef.current && !sortRef.current.contains(e.target))
        setSortOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  if (!modal) return null;
  const { row, answer, backTo } = modal;
  const isOther = !!answer.isOther;
  const isDetail = !!answer.isDetail;
  const LOC_FIELDS = ["region", "district", "store"];
  const detailRows = isDetail
    ? mockDetailResponses(answer.count)
        .filter((r) => {
          const s = q.trim().toLowerCase();
          return (
            s === "" ||
            r.answer.toLowerCase().includes(s) ||
            r.name.toLowerCase().includes(s) ||
            r.region.toLowerCase().includes(s) ||
            r.district.toLowerCase().includes(s) ||
            r.store.toLowerCase().includes(s)
          );
        })
        .sort(
          (a, b) =>
            sortDir * a[sortKey].localeCompare(b[sortKey]) ||
            a.region.localeCompare(b.region) ||
            a.district.localeCompare(b.district) ||
            a.store.localeCompare(b.store)
        )
    : null;
  const eyebrowOf = (r) =>
    LOC_FIELDS.filter((f) => f !== sortKey)
      .map((f) => r[f])
      .join(" · ");
  const setSort = (key) => {
    if (key === sortKey) setSortDir(-sortDir);
    else {
      setSortKey(key);
      setSortDir(1);
    }
  };
  const responses =
    isOther || isDetail ? null : mockDetailResponses(answer.count);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(11, 15, 19, 0.4)",
        display: "flex",
        alignItems: mobile ? "flex-end" : "center", // bottom sheet on mobile
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: mobile ? "100%" : isDetail ? 880 : 640,
          maxWidth: mobile ? "100%" : "calc(100vw - 48px)",
          maxHeight: mobile ? "85vh" : "80vh",
          display: "flex",
          flexDirection: "column",
          backgroundColor: C.white,
          borderRadius: mobile ? `${R.lg}px ${R.lg}px 0 0` : R.lg,
          boxShadow: "0 12px 40px rgba(11, 15, 19, 0.25)",
        }}
      >
        <div style={{ padding: `${S[5]}px ${S[6]}px ${S[3]}px` }}>
          {backTo && (
            <LinkHover
              onClick={() => onOpenAnswer(row, backTo)}
              style={{
                display: "inline-block",
                fontSize: 13,
                lineHeight: "20px",
                color: C.mono500,
                marginBottom: S[1],
              }}
            >
              ← All answers
            </LinkHover>
          )}
          <div
            style={{
              fontSize: 18,
              lineHeight: "27px",
              fontWeight: 600,
              color: C.mono600,
            }}
          >
            {row.type} answers
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: "21px",
              fontWeight: 600,
              color: C.mono600,
              marginTop: S[2],
            }}
          >
            Q{row.num} {row.question}
          </div>
          <div
            style={{
              fontSize: 14,
              lineHeight: "21px",
              color: C.mono400,
              marginTop: 2,
            }}
          >
            {isOther
              ? `${answer.breakdown.length} more answers · ${answer.count} response${
                  answer.count === 1 ? "" : "s"
                }`
              : isDetail
              ? `${answer.count} response${answer.count === 1 ? "" : "s"}`
              : `${answer.count} - ${answer.label}`}
          </div>
          {isDetail && (
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              style={{
                fontFamily: "inherit",
                fontSize: 14,
                lineHeight: "21px",
                color: C.mono600,
                width: "100%",
                boxSizing: "border-box",
                marginTop: S[3],
                backgroundColor: C.white,
                border: `1px solid ${C.mono200}`,
                borderRadius: R.md,
                padding: `${S[2]}px ${S[3]}px`,
                outline: "none",
              }}
            />
          )}
          {isDetail && mobile && (
            <div
              ref={sortRef}
              style={{
                position: "relative",
                display: "inline-block",
                marginTop: S[3],
              }}
            >
              <button
                onClick={() => setSortOpen(!sortOpen)}
                style={{
                  fontFamily: "inherit",
                  fontSize: 14,
                  lineHeight: "21px",
                  fontWeight: 600,
                  color: C.mono600,
                  backgroundColor: C.white,
                  border: `1px solid ${C.mono200}`,
                  borderRadius: R.md,
                  padding: `${S[1]}px ${S[3]}px`,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: S[1],
                }}
              >
                {sortKey.charAt(0).toUpperCase() + sortKey.slice(1)}{" "}
                {sortDir === 1 ? "↑" : "↓"}
                <span style={{ fontSize: 11 }}>{sortOpen ? "▲" : "▾"}</span>
              </button>
              {sortOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    left: 0,
                    zIndex: 20,
                    minWidth: 170,
                    backgroundColor: C.white,
                    border: `1px solid ${C.surface100}`,
                    borderRadius: R.md,
                    boxShadow: "0 8px 24px rgba(11, 15, 19, 0.12)",
                    padding: S[1],
                  }}
                >
                  {[
                    ["region", "Region"],
                    ["district", "District"],
                    ["store", "Store"],
                  ].map(([key, label]) => {
                    const active = sortKey === key;
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setSort(key); // active → toggles direction
                          setSortOpen(false);
                        }}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: S[3],
                          padding: `${S[2]}px ${S[3]}px`,
                          borderRadius: R.sm,
                          fontSize: 14,
                          lineHeight: "21px",
                          color: C.mono600,
                          cursor: "pointer",
                          backgroundColor: active
                            ? C.surface100
                            : "transparent",
                        }}
                      >
                        <span
                          style={{
                            flex: "none",
                            width: 16,
                            height: 16,
                            borderRadius: "50%",
                            border: `2px solid ${
                              active ? C.mono600 : C.mono300
                            }`,
                            boxSizing: "border-box",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {active && (
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: "50%",
                                backgroundColor: C.mono600,
                              }}
                            />
                          )}
                        </span>
                        {label}
                        {active ? (sortDir === 1 ? " ↑" : " ↓") : ""}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: `0 ${S[6]}px`,
            borderTop: `1px solid ${C.surface100}`,
          }}
        >
          {isDetail && !mobile && detailRows.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "100px 90px 80px 170px 1fr",
                gap: S[3],
                padding: `${S[3]}px 0`,
                borderBottom: `1px solid ${C.surface100}`,
                fontSize: 12,
                lineHeight: "18px",
                fontWeight: 600,
                color: C.mono500,
                position: "sticky",
                top: 0,
                backgroundColor: C.white,
              }}
            >
              {[
                ["region", "Region"],
                ["district", "District"],
                ["store", "Store"],
              ].map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => setSort(key)}
                  style={{ cursor: "pointer", userSelect: "none" }}
                >
                  {label}
                  {sortKey === key ? (sortDir === 1 ? " ↑" : " ↓") : ""}
                </div>
              ))}
              <div>Answered by</div>
              <div>Answer</div>
            </div>
          )}
          {isDetail &&
            detailRows.map((r, i) =>
              mobile ? (
                <Fragment key={i}>
                  {(i === 0 ||
                    detailRows[i - 1][sortKey] !== r[sortKey]) && (
                    <div
                      style={{
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                        backgroundColor: C.white,
                        padding: `${S[2]}px 0`,
                        borderBottom: `1px solid ${C.surface100}`,
                        fontSize: 13,
                        lineHeight: "20px",
                        fontWeight: 700,
                        color: C.mono600,
                      }}
                    >
                      {r[sortKey]}
                    </div>
                  )}
                <div
                  style={{
                    padding: `${S[3]}px 0`,
                    borderBottom:
                      i === detailRows.length - 1
                        ? "none"
                        : `1px solid ${C.surface100}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: "18px",
                      color: C.mono500,
                    }}
                  >
                    {eyebrowOf(r)}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: "21px",
                      marginTop: 2,
                    }}
                  >
                    <span style={{ fontWeight: 600, color: C.mono600 }}>
                      {r.name}
                    </span>{" "}
                    <span style={{ color: C.mono400 }}>· {r.role}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: "21px",
                      color: C.mono600,
                      marginTop: S[1],
                    }}
                  >
                    {r.answer}
                  </div>
                </div>
                </Fragment>
              ) : (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px 90px 80px 170px 1fr",
                    gap: S[3],
                    alignItems: "start",
                    padding: `${S[3]}px 0`,
                    borderBottom:
                      i === detailRows.length - 1
                        ? "none"
                        : `1px solid ${C.surface100}`,
                    fontSize: 14,
                    lineHeight: "21px",
                  }}
                >
                  <div style={{ fontWeight: 600, color: C.mono600 }}>
                    {r.region}
                  </div>
                  <div style={{ color: C.mono600 }}>{r.district}</div>
                  <div style={{ color: C.mono600 }}>{r.store}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: C.mono600 }}>
                      {r.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        lineHeight: "18px",
                        color: C.mono400,
                      }}
                    >
                      {r.role}
                    </div>
                  </div>
                  <div style={{ color: C.mono600, minWidth: 0 }}>
                    {r.answer}
                  </div>
                </div>
              )
            )}
          {isDetail && detailRows.length === 0 && (
            <div
              style={{
                padding: `${S[6]}px 0`,
                textAlign: "center",
                fontSize: 14,
                lineHeight: "21px",
                color: C.mono400,
              }}
            >
              No answers match your search.
            </div>
          )}
          {!isDetail && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isOther ? "1fr 120px" : "1fr 220px",
                gap: S[3],
                padding: `${S[3]}px 0`,
                borderBottom: `1px solid ${C.surface100}`,
                fontSize: 12,
                lineHeight: "18px",
                fontWeight: 600,
                color: C.mono500,
                position: "sticky",
                top: 0,
                backgroundColor: C.white,
              }}
            >
              <div>{isOther ? "Answer" : "Completion location"}</div>
              <div>{isOther ? "Responses" : "Answered by"}</div>
            </div>
          )}
          {!isDetail &&
            (isOther ? answer.breakdown : responses).map((r, i, arr) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: isOther ? "1fr 120px" : "1fr 220px",
                  gap: S[3],
                  alignItems: "start",
                  padding: `${S[3]}px 0`,
                  borderBottom:
                    i === arr.length - 1
                      ? "none"
                      : `1px solid ${C.surface100}`,
                  fontSize: 14,
                  lineHeight: "21px",
                }}
              >
                {isOther ? (
                  <>
                    <div style={{ minWidth: 0 }}>
                      <LinkHover
                        onClick={() => onOpenAnswer(row, r, answer)}
                        style={{
                          display: "inline-block",
                          fontWeight: 600,
                          color: C.mono600,
                        }}
                      >
                        {r.label}
                      </LinkHover>
                      <div
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          color: C.mono400,
                        }}
                      >
                        {answer.count > 0
                          ? Math.round((r.count / answer.count) * 100)
                          : 0}
                        % of these responses
                      </div>
                    </div>
                    <div style={{ color: C.mono600 }}>{r.count}</div>
                  </>
                ) : (
                  <>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: C.mono600 }}>
                        {r.store === "-" ? "No location" : r.store}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          color: C.mono400,
                        }}
                      >
                        {r.region} / {r.district}
                      </div>
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, color: C.mono600 }}>
                        {r.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          lineHeight: "18px",
                          color: C.mono400,
                        }}
                      >
                        {r.role}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: isOther ? "space-between" : "flex-end",
            alignItems: "center",
            padding: `${S[4]}px ${S[6]}px`,
            borderTop: `1px solid ${C.surface100}`,
          }}
        >
          {isOther && (
            <button
              onClick={() => onOpenQuestion(row)}
              style={{
                fontFamily: "inherit",
                fontSize: 14,
                lineHeight: "21px",
                fontWeight: 600,
                color: C.link,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              Open question view
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              fontFamily: "inherit",
              fontSize: 14,
              lineHeight: "21px",
              fontWeight: 600,
              color: C.mono600,
              backgroundColor: C.white,
              border: `1px solid ${C.mono200}`,
              borderRadius: R.md,
              padding: `${S[2]}px ${S[4]}px`,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Focus drill (spec §7b) ─────────────────────────────────────
// One question, per-store rows, ALL answers in definition order —
// no aggregation, standard floors (zero 16 / non-zero 32). Large N is
// handled by width, not by shrinking cells: the bar reserves ~40px per
// option and the drill scrolls horizontally with the Store column
// pinned. Full-list identity shades. "+N more" lands here.
// Groupings the drill can pivot on; entities are mock data
const DRILL_GROUPS = {
  Divisions: ["Division North", "Division South"],
  Regions: ["Region 1", "Region 2", "Region 3", "Region 4"],
  Districts: ["District 1", "District 2", "District 3", "District 4", "District 5", "District 6"],
  Stores: ["Store 1", "Store 2", "Store 3", "Store 4", "Store 5", "Store 6", "Store 7", "Store 8"],
  Roles: ["District manager", "Store manager", "Area coach"],
};
const DRILL_LEVELS = ["Divisions", "Regions", "Districts", "Stores"];
const DRILL_SINGULAR = {
  Divisions: "division",
  Regions: "region",
  Districts: "district",
  Stores: "store",
  Roles: "role",
};

function drillCounts(row, entityIdx, seed) {
  // Deterministic mock split of each answer's total across entities
  return row.answers.map((a, i) => {
    const h = (i * 31 + entityIdx * 17 + seed * 5) % 7;
    return { ...a, count: Math.floor((a.count * (h + 1)) / 10) };
  });
}

function DrillView({ row, onBack, onOpenCell, mobile }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("Regions");
  const [dir, setDir] = useState("asc");
  const [groupOpen, setGroupOpen] = useState(false);
  const [path, setPath] = useState([]); // drill-down scope: [{group, entity}, …]
  const groupRef = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (groupRef.current && !groupRef.current.contains(e.target))
        setGroupOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const n = row.answers.length;
  const singular = DRILL_SINGULAR[group];
  const nextLevel =
    group === "Roles"
      ? null // Roles is a dimension, not a hierarchy level — no drill-down
      : DRILL_LEVELS[DRILL_LEVELS.indexOf(group) + 1] || null;
  const minLevelIdx = path.length
    ? DRILL_LEVELS.indexOf(path[path.length - 1].group) + 1
    : 0;
  // Location levels below the current scope, plus non-location dimensions
  const groupOptions = [...DRILL_LEVELS.slice(minLevelIdx), "Roles"];
  const seed =
    group.length + path.reduce((sum, p) => sum + p.entity.length, 0);
  const drillInto = (entity) => {
    setPath([...path, { group, entity }]);
    setGroup(nextLevel);
    setQuery("");
  };
  const entities = DRILL_GROUPS[group]
    .filter((s) => s.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => (dir === "asc" ? a.localeCompare(b) : b.localeCompare(a)));
  const barMin = Math.max(560, n * 40); // ~40px per option (spec §7b)

  const bar = (si) => (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        height: "100%",
        padding: "4px 0",
        boxSizing: "border-box",
      }}
    >
      {drillCounts(row, si, seed).map((a, i) => (
        <BarCell
          key={a.label}
          answer={a}
          opacityPct={rampOpacity(i, n)}
          onOpen={(answer) => onOpenCell(row, answer)}
        />
      ))}
    </div>
  );

  const sortHeader = (
    <div
      onClick={() => setDir(dir === "asc" ? "desc" : "asc")}
      style={{ cursor: "pointer", userSelect: "none" }}
      title="Toggle sort order"
    >
      {singular.charAt(0).toUpperCase() + singular.slice(1)}{" "}
      {dir === "asc" ? "↑" : "↓"}
    </div>
  );

  return (
    <div style={{ padding: mobile ? S[4] : 0 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: S[3],
          marginBottom: S[4],
        }}
      >
        <button
          onClick={() => {
            if (path.length) {
              const last = path[path.length - 1];
              setPath(path.slice(0, -1));
              setGroup(last.group);
              setQuery("");
            } else onBack();
          }}
          aria-label="Back"
          style={{
            fontFamily: "inherit",
            width: 40,
            height: 40,
            flex: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: C.mono600,
            backgroundColor: C.white,
            border: `1px solid ${C.mono200}`,
            borderRadius: R.md,
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <div
          style={{
            flex: mobile ? "1 1 calc(100% - 56px)" : 1,
            minWidth: 0,
            fontSize: 16,
            lineHeight: "24px",
            fontWeight: 600,
            color: C.mono600,
          }}
        >
          {row.followUp && <FollowIcon />}
          {row.question}
          {row.followUp && (
            <div
              style={{
                fontSize: 12,
                lineHeight: "18px",
                fontWeight: 400,
                color: C.mono400,
                marginTop: 2,
              }}
            >
              {row.followUp}
            </div>
          )}
        </div>
        <div ref={groupRef} style={{ position: "relative", flex: "none" }}>
          <button
            onClick={() => setGroupOpen(!groupOpen)}
            style={{
              fontFamily: "inherit",
              fontSize: 14,
              lineHeight: "21px",
              fontWeight: 600,
              color: C.mono600,
              backgroundColor: C.white,
              border: `1px solid ${C.mono200}`,
              borderRadius: R.md,
              padding: `${S[2]}px ${S[3]}px`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: S[1],
            }}
          >
            {group}{" "}
            <span style={{ fontSize: 11 }}>{groupOpen ? "▲" : "▾"}</span>
          </button>
          {groupOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                right: 0,
                zIndex: 20,
                minWidth: 160,
                backgroundColor: C.white,
                border: `1px solid ${C.surface100}`,
                borderRadius: R.md,
                boxShadow: "0 8px 24px rgba(11, 15, 19, 0.12)",
                padding: S[1],
              }}
            >
              {groupOptions.map((g) => {
                const active = g === group;
                return (
                  <div
                    key={g}
                    onClick={() => {
                      setGroup(g);
                      setGroupOpen(false);
                      setQuery("");
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: S[3],
                      padding: `${S[2]}px ${S[3]}px`,
                      borderRadius: R.sm,
                      fontSize: 14,
                      lineHeight: "21px",
                      color: C.mono600,
                      cursor: "pointer",
                      backgroundColor: active ? C.surface100 : "transparent",
                    }}
                  >
                    {/* radio — grouping is explicitly single-select */}
                    <span
                      style={{
                        flex: "none",
                        width: 16,
                        height: 16,
                        borderRadius: "50%",
                        border: `2px solid ${active ? C.mono600 : C.mono300}`,
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {active && (
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            backgroundColor: C.mono600,
                          }}
                        />
                      )}
                    </span>
                    {g}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search for a ${singular}`}
          style={{
            fontFamily: "inherit",
            fontSize: 14,
            lineHeight: "21px",
            color: C.mono600,
            width: mobile ? "auto" : 260,
            flex: mobile ? "1 1 120px" : "none",
            minWidth: 0,
            backgroundColor: C.white,
            border: `1px solid ${C.mono200}`,
            borderRadius: R.md,
            padding: `${S[2]}px ${S[3]}px`,
            outline: "none",
          }}
        />
      </div>

      {path.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: S[1],
            margin: `-${S[1]}px 0 ${S[3]}px`,
            fontSize: 14,
            lineHeight: "21px",
            color: C.mono500,
          }}
        >
          <LinkHover
            onClick={() => {
              setPath([]);
              setGroup("Regions");
              setQuery("");
            }}
            style={{ color: C.mono500 }}
          >
            All
          </LinkHover>
          {path.map((p, i) => (
            <Fragment key={i}>
              <span>/</span>
              <LinkHover
                onClick={() => {
                  setPath(path.slice(0, i + 1));
                  setGroup(
                    DRILL_LEVELS[DRILL_LEVELS.indexOf(p.group) + 1]
                  );
                  setQuery("");
                }}
                style={{ color: C.mono600 }}
              >
                {p.entity}
              </LinkHover>
            </Fragment>
          ))}
        </div>
      )}

      {mobile ? (
        <div
          style={{
            border: `1px solid ${C.surface100}`,
            borderRadius: R.lg,
            overflow: "hidden",
            backgroundColor: C.white,
          }}
        >
          <div
            style={{
              padding: `${S[3]}px ${S[4]}px`,
              backgroundColor: "#F5F5F5",
              borderBottom: `1px solid ${C.surface100}`,
              fontSize: 12,
              lineHeight: "18px",
              fontWeight: 600,
              color: C.mono500,
            }}
          >
            {sortHeader}
          </div>
          {entities.map((entity, si) => (
            <div
              key={entity}
              style={{ borderBottom: `1px solid ${C.surface100}` }}
            >
              <div style={{ padding: `${S[3]}px ${S[4]}px 0` }}>
                {nextLevel ? (
                  <PressableBlock onPress={() => drillInto(entity)}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: S[2],
                      }}
                    >
                      <LinkHover
                        style={{
                          flex: 1,
                          minWidth: 0,
                          fontSize: 14,
                          lineHeight: "21px",
                          fontWeight: 500,
                          color: C.mono600,
                        }}
                      >
                        {entity}
                      </LinkHover>
                      {/* Structural affordance: this row drills down */}
                      <span
                        style={{
                          flex: "none",
                          fontSize: 20,
                          lineHeight: "21px",
                          color: C.mono300,
                        }}
                      >
                        ›
                      </span>
                    </div>
                  </PressableBlock>
                ) : (
                  <span
                    style={{
                      fontSize: 14,
                      lineHeight: "21px",
                      fontWeight: 500,
                      color: C.mono600,
                    }}
                  >
                    {entity}
                  </span>
                )}
              </div>
              <div
                style={{
                  overflowX: "auto",
                  padding: `${S[1]}px ${S[4]}px ${S[3]}px`,
                }}
              >
                <div style={{ minWidth: barMin, height: 52 }}>{bar(si)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            border: `1px solid ${C.surface100}`,
            borderRadius: R.lg,
            overflowX: "auto",
          }}
        >
          <div style={{ minWidth: 200 + barMin }}>
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                backgroundColor: "#F5F5F5",
                borderBottom: `1px solid ${C.surface100}`,
                fontSize: 12,
                lineHeight: "18px",
                fontWeight: 600,
                color: C.mono500,
              }}
            >
              <div
                style={{
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  flex: "0 0 200px",
                  boxSizing: "border-box",
                  padding: `${S[3]}px ${S[4]}px`,
                  backgroundColor: "#F5F5F5",
                }}
              >
                {sortHeader}
              </div>
            </div>
            {entities.map((entity, si) => (
              <div
                key={entity}
                style={{
                  display: "flex",
                  alignItems: "stretch",
                  minHeight: 54,
                  borderBottom: `1px solid ${C.surface100}`,
                  backgroundColor: C.white,
                }}
              >
                <div
                  style={{
                    position: "sticky",
                    left: 0,
                    zIndex: 1,
                    flex: "0 0 200px",
                    boxSizing: "border-box",
                    display: "flex",
                    alignItems: "center",
                    padding: `0 ${S[4]}px`,
                    backgroundColor: C.white,
                  }}
                >
                  {nextLevel ? (
                    <LinkHover
                      onClick={() => drillInto(entity)}
                      style={{
                        fontSize: 14,
                        lineHeight: "21px",
                        fontWeight: 500,
                        color: C.mono600,
                      }}
                    >
                      {entity}
                    </LinkHover>
                  ) : (
                    <span
                      style={{
                        fontSize: 14,
                        lineHeight: "21px",
                        fontWeight: 500,
                        color: C.mono600,
                      }}
                    >
                      {entity}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    flex: "1 0 0",
                    minWidth: barMin,
                    borderLeft: `1px solid ${C.surface100}`,
                  }}
                >
                  {bar(si)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Touch affordance: pressed-state wash — the tap-time equivalent of hover
function PressableBlock({ onPress, children }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={onPress}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        cursor: "pointer",
        backgroundColor: pressed ? C.hover : "transparent",
        borderRadius: R.sm,
        transition: "background-color 80ms ease",
      }}
    >
      {children}
    </div>
  );
}

// ─── Mobile cards (<640px) ──────────────────────────────────────
// The pinned-column table is the wrong shape for a phone; each question
// becomes a stacked card. Section bands are sticky while their group
// scrolls. The aggregation rule (§7) is what makes bars fit: worst case
// needs 240px of floors, well inside a ~340px content width.
function MobileCards({ items, onOpenResponses, onOpenDrill }) {
  return (
    <div
      style={{
        backgroundColor: C.white,
        border: `1px solid ${C.surface100}`,
        borderRadius: R.lg,
        overflow: "hidden",
      }}
    >
      {items.map(({ row, band }) => (
        <Fragment key={row.id}>
          {band && (
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                backgroundColor: C.white,
                padding: `${S[3]}px ${S[4]}px`,
                borderBottom: `1px solid ${C.surface100}`,
                fontSize: 14,
                lineHeight: "21px",
                fontWeight: 700,
                color: C.mono600,
              }}
            >
              {band}
            </div>
          )}
          <div
            style={{
              padding: S[4],
              borderBottom: `1px solid ${C.surface100}`,
            }}
          >
            <PressableBlock onPress={() => onOpenDrill(row)}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: S[2],
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Eyebrow: one truncatable metadata line — long #s can't
                      steal width from the question below */}
                  <div
                    style={{
                      fontSize: 14,
                      lineHeight: "21px",
                      color: C.mono500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: S[1],
                    }}
                  >
                    {row.num} · {row.type}
                  </div>
                  <LinkHover
                    style={{
                      fontSize: 14,
                      lineHeight: "21px",
                      color: C.link, // questions: blue at rest, hover underlines
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {row.followUp && <FollowIcon />}
                    {row.question}
                  </LinkHover>
                  {row.followUp && (
                    <div
                      style={{
                        fontSize: 12,
                        lineHeight: "18px",
                        color: C.mono400,
                        marginTop: 2,
                      }}
                    >
                      {row.followUp}
                    </div>
                  )}
                </div>
                {/* Structural affordance: this row navigates */}
                <span
                  style={{
                    flex: "none",
                    fontSize: 20,
                    lineHeight: "21px",
                    color: C.mono300,
                  }}
                >
                  ›
                </span>
              </div>
            </PressableBlock>
            <div style={{ marginTop: S[2] }}>
              <AnswersCell
                row={row}
                onOpenResponses={onOpenResponses}
                barHeight={52}
                bare
              />
            </div>
          </div>
        </Fragment>
      ))}
    </div>
  );
}

// ─── Table ──────────────────────────────────────────────────────
// Section, # and Question are pinned; Answer type and Answers scroll.
// Narrow tier (<1024px, iPad): Section leaves the pinned cluster and
// becomes full-width group header bands; Question clamps to 2 lines;
// a shadow on the pinned edge appears once the table is scrolled.
// Section renders as full-width group bands in ALL tiers (no Section column).
const LEFT_GRID = "120px minmax(360px, 1fr)";
const LEFT_GRID_NARROW = "120px minmax(220px, 1fr)";
const LEFT_W = 508; // 16 pad + 120 (#) + 12 + 360 (question min)
const LEFT_W_NARROW = 368; // 16 pad + 120 (#) + 12 + 220

export default function SurveyHeatmapShading() {
  const [modal, setModal] = useState(null);
  const [drillRow, setDrillRow] = useState(null);
  // One-time touch coachmark: cells are content-as-control, so the first
  // teach is explicit instead of per-cell chrome. Production: persist the
  // dismissal (per user), and show it only until the first cell tap.
  const [hintDismissed, setHintDismissed] = useState(false);

  // Question click: bar questions open the drill; Text/Image/Number
  // questions have no answers to bar — they open their detail modal.
  const openQuestion = (row) =>
    row.answers
      ? setDrillRow(row)
      : setModal({
          row,
          answer: {
            label: row.type,
            count: parseInt(row.value, 10) || 0,
            isDetail: true,
          },
        });
  const [typeFilter, setTypeFilter] = useState([]); // empty = all types
  const [searchQ, setSearchQ] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const typeRef = useRef(null);

  // click-outside closes the Answer type dropdown (house convention)
  useEffect(() => {
    const onDown = (e) => {
      if (typeRef.current && !typeRef.current.contains(e.target))
        setTypeOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // Visible rows = selection ∩ type filter ∩ search (ANDed)
  const q = searchQ.trim().toLowerCase();
  const visibleRows = FILLED_ROWS.filter(
    (r) =>
      (typeFilter.length === 0 || typeFilter.includes(r.type)) &&
      (q === "" ||
        r.question.toLowerCase().includes(q) ||
        r.num.toLowerCase().includes(q) ||
        r._section.toLowerCase().includes(q))
  );
  // Band above the first VISIBLE question of each group; # never renumbers
  const items = visibleRows.map((row, i) => ({
    row,
    band:
      i === 0 || visibleRows[i - 1]._section !== row._section
        ? row._section
        : null,
  }));
  const hasFilters = typeFilter.length > 0 || q !== "";
  const [vw, setVw] = useState(
    typeof window === "undefined" ? 1280 : window.innerWidth
  );
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (document.getElementById("quorso-fonts-css")) return;
    const link = document.createElement("link");
    link.id = "quorso-fonts-css";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const narrow = vw < 1024; // iPad tier
  const mobile = vw < 768; // card tier (list-style, one container); measured on container width in production
  const pagePad = S[8]; // 32 everywhere; cards (<768) zero it out below

  const leftClusterStyle = (bg) => ({
    position: "sticky",
    left: 0,
    zIndex: 1,
    // Desktop: the cluster scales too (Question absorbs the growth via its
    // 1fr track) at half the Answers rate, capped at 800px total.
    flex: narrow ? `0 0 ${LEFT_W_NARROW}px` : `1 0 ${LEFT_W}px`,
    maxWidth: narrow ? LEFT_W_NARROW : 678, // Question caps at 530 (508 + 170)
    boxSizing: "border-box",
    display: "grid",
    gridTemplateColumns: narrow ? LEFT_GRID_NARROW : LEFT_GRID,
    gap: S[3],
    alignItems: "center",
    padding: `${S[3]}px 0 ${S[3]}px ${S[4]}px`,
    backgroundColor: bg,
    // scrolled-under cue — the only "more content" hint on touch
    boxShadow: scrolled ? "6px 0 10px -4px rgba(11, 15, 19, 0.14)" : "none",
    transition: "box-shadow 150ms ease",
  });

  const typeCellStyle = {
    flex: "0 0 120px",
    boxSizing: "border-box",
    display: "flex",
    alignItems: "center",
    borderLeft: `1px solid ${C.surface100}`,
    padding: `${S[3]}px ${S[3]}px`,
    minWidth: 0,
  };

  // Answers column minimum: 400px — a chosen comfort floor. Under the
  // three-tier rule the arithmetic floor is only max(6×32, 5×32+80) =
  // 240px; the extra 160px is guaranteed proportional room.
  const answersCellStyle = {
    flex: "2 0 400px", // grows at 2× the Question column's rate
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    borderLeft: `1px solid ${C.surface100}`,
  };

  const tableMinWidth = (narrow ? LEFT_W_NARROW : LEFT_W) + 140 + 400;

  return (
    <div
      style={{
        fontFamily: "Inter, system-ui, sans-serif",
        backgroundColor: C.white,
        color: C.mono600,
        minHeight: "100vh",
        padding: mobile ? S[4] : pagePad, // mobile: page gutter around floating cards
      }}
    >
      {drillRow ? (
        <DrillView
          row={drillRow}
          mobile={mobile}
          onBack={() => setDrillRow(null)}
          onOpenCell={(row, answer) => setModal({ row, answer })}
        />
      ) : (
        <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: S[3],
          padding: 0,
          marginBottom: S[4],
        }}
      >
        <button
          style={{
            fontFamily: "inherit",
            fontSize: 14,
            lineHeight: "21px",
            fontWeight: 600,
            color: C.white,
            backgroundColor: C.secondary,
            border: "none",
            borderRadius: R.md,
            padding: `${S[2]}px ${S[4]}px`,
            cursor: "pointer",
            flex: "none",
          }}
          title="Opens the question picker (working set) — not part of this prototype"
        >
          Select question (125)
        </button>
        <div ref={typeRef} style={{ position: "relative", flex: "none" }}>
          <button
            onClick={() => setTypeOpen(!typeOpen)}
            style={{
              fontFamily: "inherit",
              fontSize: 14,
              lineHeight: "21px",
              fontWeight: 600,
              color: C.mono600,
              backgroundColor: C.white,
              border: `1px solid ${C.mono200}`,
              borderRadius: R.md,
              padding: `${S[2]}px ${S[3]}px`,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: S[2],
            }}
          >
            Answer type
            {typeFilter.length > 0 && (
              <span
                style={{
                  fontSize: 12,
                  lineHeight: "18px",
                  fontWeight: 600,
                  color: C.white,
                  backgroundColor: C.secondary,
                  borderRadius: R.sm,
                  padding: `0 ${S[1]}px`,
                }}
              >
                +{typeFilter.length}
              </span>
            )}
            <span style={{ fontSize: 11 }}>▾</span>
          </button>
          {typeOpen && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 4px)",
                left: 0,
                zIndex: 20,
                minWidth: 180,
                backgroundColor: C.white,
                border: `1px solid ${C.surface100}`,
                borderRadius: R.md,
                boxShadow: "0 8px 24px rgba(11, 15, 19, 0.12)",
                padding: S[1],
              }}
            >
              {ANSWER_TYPES.map((t) => {
                const on = typeFilter.includes(t);
                return (
                  <label
                    key={t}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: S[2],
                      padding: `${S[2]}px ${S[2]}px`,
                      borderRadius: R.sm,
                      fontSize: 14,
                      lineHeight: "21px",
                      color: C.mono600,
                      cursor: "pointer",
                      backgroundColor: on ? "#F5F5F5" : "transparent",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() =>
                        setTypeFilter(
                          on
                            ? typeFilter.filter((x) => x !== t)
                            : [...typeFilter, t]
                        )
                      }
                    />
                    {t}
                  </label>
                );
              })}
            </div>
          )}
        </div>
        <input
          value={searchQ}
          onChange={(e) => setSearchQ(e.target.value)}
          placeholder="Search for name"
          style={{
            fontFamily: "inherit",
            fontSize: 14,
            lineHeight: "21px",
            color: C.mono600,
            marginLeft: "auto",
            width: mobile ? "100%" : 300,
            flex: mobile ? "1 1 100%" : "none",
            backgroundColor: C.white,
            border: `1px solid ${C.mono200}`,
            borderRadius: R.md,
            padding: `${S[2]}px ${S[3]}px`,
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      {items.length === 0 ? (
        <div
          style={{
            border: `1px solid ${C.surface100}`,
            borderRadius: R.lg,
            padding: S[8],
            margin: 0,
            textAlign: "center",
            fontSize: 14,
            lineHeight: "21px",
            color: C.mono400,
          }}
        >
          No questions match your filters.{" "}
          {hasFilters && (
            <button
              onClick={() => {
                setTypeFilter([]);
                setSearchQ("");
              }}
              style={{
                fontFamily: "inherit",
                fontSize: 14,
                fontWeight: 600,
                color: C.link,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          )}
        </div>
      ) : mobile ? (
        <>
        {!hintDismissed && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: S[2],
              backgroundColor: "#EFF4FE", // Alert / info state
              borderRadius: R.md,
              padding: `${S[3]}px ${S[3]}px`,
              marginBottom: S[3],
              fontSize: 13,
              lineHeight: "20px",
              color: C.mono600,
            }}
          >
            {/* info icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              style={{ flex: "none" }}
            >
              <circle cx="8" cy="8" r="7" fill="none" stroke={C.link} strokeWidth="1.5" />
              <circle cx="8" cy="4.8" r="1" fill={C.link} />
              <rect x="7.25" y="6.8" width="1.5" height="4.6" rx="0.75" fill={C.link} />
            </svg>
            <span style={{ flex: 1, minWidth: 0 }}>
              Tap any response in the bar to see who gave it
            </span>
            <button
              onClick={() => setHintDismissed(true)}
              style={{
                fontFamily: "inherit",
                flex: "none",
                fontSize: 13,
                lineHeight: "20px",
                fontWeight: 600,
                color: C.link, // link button per the info-alert component
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
            >
              Got it
            </button>
          </div>
        )}
        <MobileCards
          items={items}
          onOpenDrill={(r) => openQuestion(r)}
          onOpenResponses={(r, answer) => {
            setHintDismissed(true); // first tap = lesson learned
            setModal({ row: r, answer });
          }}
        />
        </>
      ) : (
        <div
          onScroll={(e) => setScrolled(e.currentTarget.scrollLeft > 0)}
          style={{
            overflowX: "auto",
            minWidth: 0,
            // Table caps at 1600px: past that, Answers (~810px effective max)
            // adds eye travel, not resolution. Extra viewport becomes margin.
            maxWidth: "min(100%, 1600px)",
            margin: "0 auto",
            display: "block",
            border: `1px solid ${C.surface100}`,
            borderRadius: R.lg,
          }}
        >
          <div style={{ minWidth: tableMinWidth }}>
            <div
              style={{
                display: "flex",
                alignItems: "stretch",
                backgroundColor: "#F5F5F5",
                borderBottom: `1px solid ${C.surface100}`,
                fontSize: 12,
                lineHeight: "18px",
                fontWeight: 600,
                color: C.mono500,
              }}
            >
              <div style={leftClusterStyle("#F5F5F5")}>
                <div style={{ minWidth: 0 }}>#</div>
                <div style={{ minWidth: 0 }}>Question</div>
              </div>
              <div style={typeCellStyle}>Answer type</div>
              <div style={{ ...answersCellStyle, paddingLeft: S[3] }}>
                Answers
              </div>
            </div>

            {items.map(({ row, band }) => (
              <Fragment key={row.id}>
                {band && (
                  <div
                    style={{
                      borderBottom: `1px solid ${C.surface100}`,
                      backgroundColor: "#FAFAFA",
                      padding: `${S[2]}px 0`,
                    }}
                  >
                    <div
                      style={{
                        position: "sticky",
                        left: 0,
                        width: "fit-content",
                        padding: `0 ${S[4]}px`,
                        fontSize: 13,
                        lineHeight: "20px",
                        fontWeight: 700,
                        color: C.mono600,
                      }}
                    >
                      {band}
                    </div>
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "stretch",
                    minHeight: 60,
                    borderBottom: `1px solid ${C.surface100}`,
                    backgroundColor: C.white,
                  }}
                >
                  <div style={leftClusterStyle(C.white)}>
                    <div
                      style={{
                        minWidth: 0,
                        fontSize: 14,
                        lineHeight: "21px",
                        color: C.mono500,
                      }}
                    >
                      {row.num}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <LinkHover
                        onClick={() => openQuestion(row)}
                        style={{
                          minWidth: 0,
                          fontSize: 14,
                          lineHeight: "21px",
                          color: C.link, // questions: blue at rest, hover underlines
                          // Question clamps at 3 lines with an ellipsis; the
                          // full text lives in the drill header and modal
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {row.followUp && <FollowIcon />}
                        {row.question}
                      </LinkHover>
                      {row.followUp && (
                        <div
                          style={{
                            fontSize: 12,
                            lineHeight: "18px",
                            color: C.mono400,
                            marginTop: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {row.followUp}
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      ...typeCellStyle,
                      fontSize: 14,
                      lineHeight: "21px",
                      color: C.mono500,
                    }}
                  >
                    {row.type}
                  </div>
                  <div style={answersCellStyle}>
                    <AnswersCell
                      row={row}
                      onOpenResponses={(r, answer) =>
                        // Every bar tap opens a modal; "+N more" opens the
                        // folded-answers breakdown (squad-tested, settled)
                        setModal({ row: r, answer })
                      }
                    />
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </div>
      )}
        </>
      )}

      <ResponsesModal
        modal={modal}
        onClose={() => setModal(null)}
        onOpenQuestion={(row) => {
          setModal(null);
          setDrillRow(row);
        }}
        onOpenAnswer={(row, answer, backTo) => setModal({ row, answer, backTo })}
        mobile={mobile}
      />
    </div>
  );
}
