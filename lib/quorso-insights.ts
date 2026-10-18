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
          text: 'Clients build their own surveys in Quorso and send them to their sites. Surveys had become one of the biggest drivers of engagement, both in pilots and in full rollouts.',
        },
        {
          type: 'p',
          text: 'Seeing the answers was another matter. Past responses sat in the completed column of Mission Control until they were archived, one survey at a time. Anything more meant a request: we exported the responses to CSV, and the client\'s BI team rebuilt reports in Excel or Power BI. None of that was visible in Quorso.',
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
        { type: 'p', text: 'Survey answers held two kinds of value that clients could not reach inside the product.' },
        { type: 'h3', text: 'Trends across sites' },
        {
          type: 'p',
          text: 'Surveys collect input straight from the front line. Added up, they show multi-site managers which operational issues keep coming back. AI-extracted themes covered part of this, but managers still needed to see the trends store by store.',
        },
        { type: 'h3', text: 'Compliance and ad hoc requests' },
        {
          type: 'p',
          text: 'Central operations teams kept receiving requests for survey data from HR, legal and asset protection, for disciplinary cases, compliance checks and investigations. The exports existed, but those teams often could not get to them, and the frustration landed on central ops.',
        },
        { type: 'h3', text: 'Why it mattered' },
        {
          type: 'list',
          ordered: false,
          items: [
            'Quorso is meant to be the one tool operators work in, yet survey results sent them to a BI tool or an emailed spreadsheet.',
            'Without a native way to get answers out, Quorso was gaining a reputation as a product that is hard to get data out of.',
            'The responses Quorso already gathers could become insights clients get nowhere else, and give senior users a reason to stay in the product.',
            'To be seen as a best-in-class survey tool, this had to work in the app.',
          ],
        },
        { type: 'h3', text: 'The design challenge' },
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
        {
          type: 'image',
          src: '/assets/quorso-insights/client-report.webp',
          width: 2400,
          height: 693,
          caption: '',
          alt: 'A recreated client report in Power BI, with made-up data: survey questions by section, the count of each answer from Poor to Excellent and Yes or No, shaded as a heatmap, with filters for business unit, district, region and site',
          wide: true,
        },
        {
          type: 'p',
          text: 'This report covered one client and one survey. Other clients configured theirs differently, with other sections, answer types and scales, so a report built around one survey would not carry over to the next. What we needed was a single template that works for every configuration.',
        },
        {
          type: 'p',
          text: 'We then talked to our clients about what they wanted from the answers. A few things came up again and again:',
        },
        {
          type: 'list',
          ordered: false,
          items: [
            'Access to the underlying response data was an absolute must.',
            'Questions with predefined answer sets, often the same across sections and questions, were of most interest.',
            'Percentages of responses mattered more than summaries of free text.',
            'Not every answer should be rolled up, so they needed to choose which ones are.',
            'They wanted to know whether stores are on track, aggregated up the location hierarchy.',
            'For surveys with follow-ups, they wanted the follow-up completion rate for the latest or current survey.',
          ],
        },
        {
          type: 'image',
          src: '/assets/quorso-insights/client-notes.webp',
          width: 1624,
          height: 1166,
          caption: '',
          alt: 'Notes from client conversations on sticky notes: what to roll up, store progress up the location hierarchy, percentages over free-text summaries, predefined answer sets, follow-up completion, and access to the raw data',
          wide: true,
        },
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
