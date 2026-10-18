import type { Case } from '@/lib/cases'

// The Quorso insights case. It is only rendered for visitors who entered the
// password (app/projects/quorso-insights), so it lives apart from lib/cases.ts
// and never gets a public static page.

export const QUORSO_INSIGHTS: Case = {
  slug: 'quorso-insights',
  title: 'Quorso: insights from survey responses',
  lede: 'Quorso clients send surveys to their sites. I designed Insights, so district managers can read the answers in Quorso instead of waiting for a spreadsheet.',
  meta: [
    { label: 'Role', value: 'Senior product designer' },
    { label: 'Period', value: '2026' },
    { label: 'Focus', value: 'Survey insights and data export' },
    { label: 'Platform', value: 'Web' },
  ],
  chapters: [
    {
      id: 'context',
      title: 'Context',
      blocks: [
        {
          type: 'p',
          text: 'Clients build their own surveys in Quorso and send them to their sites. The people who act on the answers, district managers, had no way to see them in the product.',
        },
        {
          type: 'p',
          text: 'Until then, the answers travelled the long way round: a client asked us for the responses, we exported them to CSV, and they rebuilt their reports in Excel or Power BI. Every new question meant another request and another export.',
        },
        {
          type: 'image',
          src: '/assets/quorso-insights/survey-builder.webp',
          width: 2400,
          height: 1573,
          caption: '',
          alt: 'The Quorso survey builder: a section with questions, sub-questions and their settings such as required, conditional and follow-up',
          wide: true,
        },
      ],
    },
    {
      id: 'problem',
      title: 'Problem',
      blocks: [
        { type: 'p', text: 'Insights had to work for any survey a client could build, and no two clients build them the same way.' },
        {
          type: 'list',
          ordered: false,
          items: [
            'Configurations vary: sections, sub-questions, conditional and follow-up questions, required and optional ones.',
            'Answers come in six types, single select, multi select, date, text, number and images, and each needs its own way of being shown.',
            'Surveys change over time: questions are added or removed, and older responses still have to make sense next to newer ones.',
            'Clients needed to get the data out themselves, without asking us for an export.',
          ],
        },
      ],
    },
    {
      id: 'approach',
      title: 'Approach',
      blocks: [
        {
          type: 'p',
          text: 'We started from what clients already did with our data: what their current reports looked like, which survey configurations they set up, and what they wanted to get out of them in the end.',
        },
        { type: 'draft', text: 'Draft: what we learned from the client reports and survey configurations, and the decisions it led to.' },
      ],
    },
    {
      id: 'solution',
      title: 'Solution',
      blocks: [{ type: 'draft', text: 'Draft: the Insights screens: how each answer type is shown, how changed surveys are handled, and the export.' }],
    },
    {
      id: 'impact',
      title: 'Impact',
      blocks: [{ type: 'draft', text: 'Draft: what changed for district managers and for the team that used to run the exports.' }],
    },
  ],
}
