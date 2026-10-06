// About page content. Edit freely.
export const about = {
  facts: [
    { label: "Focus", value: "Complex B2B interfaces" },
    { label: "Industries", value: "Fintech, energy, retail, trading analytics" },
    { label: "Toolkit", tools: ["figma", "claude", "cursor", "posthog", "mixpanel"] },
  ],
  work: [
    "I’m drawn to the screens people spend their whole working day in: dashboards, onboarding, roles and permissions, and anywhere a lot of information needs to feel simple.",
    "I take ideas from research and user flows in Figma all the way to working prototypes in React and Tailwind. That way engineers get something close to the real product, not just a picture of it.",
  ],
  outside: {
    text: "When I’m not designing, I’m usually out for a run or planning the next trip, and lately I’ve started filming both. My YouTube channel is where those vlogs live. The first one takes you from London to Brighton and the white cliffs of the Seven Sisters.",
    linkLabel: "Watch on YouTube",
  },
  photosCaption: "Shot on Fujifilm X100V",
  // Drop your photos into /public/images/photos with these names.
  photos: ["01", "02", "03", "04", "05", "06"].map((n) => `/images/photos/${n}.jpg`),
};
