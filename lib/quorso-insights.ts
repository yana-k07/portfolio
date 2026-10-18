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
        {
          type: 'p',
          text: 'Survey answers held value clients could not reach inside the product. Multi-site managers wanted to see which issues kept coming back across stores, and AI-extracted themes covered only part of that. HR, legal and asset protection kept asking central ops for survey data for compliance checks and investigations, and the exports were hard to get to.',
        },
        {
          type: 'p',
          text: 'So operators left Quorso, meant to be the one tool they work in, for a BI tool or an emailed spreadsheet, and the product was getting known as hard to get data out of.',
        },
        { type: 'h3', text: 'The design challenge' },
        { type: 'p', text: 'Insights had to work for any survey a client could build:' },
        {
          type: 'list',
          ordered: false,
          items: [
            'Any configuration: sections, sub-questions, conditional and follow-up questions.',
            'Six answer types, from single select to images, each shown in its own way.',
            'Surveys that change over time, with older responses still making sense next to newer ones.',
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
      id: 'testing',
      title: 'Testing',
      blocks: [
        {
          type: 'p',
          text: 'I tested the first concept as a working prototype I built with Claude, so participants clicked through realistic data instead of static screens. It had two views: By question, with a column for every answer option and a green heatmap, and By location, comparing stores across the questions you pick.',
        },
        {
          type: 'image-pair',
          images: [
            {
              src: '/assets/quorso-insights/prototype-by-question.webp',
              width: 2400,
              height: 1600,
              alt: 'First prototype, By question view: survey questions by section with a column per answer option and a green heatmap',
            },
            {
              src: '/assets/quorso-insights/prototype-by-location.webp',
              width: 2400,
              height: 1600,
              alt: 'First prototype, By location view: stores in rows and the answers to selected questions in columns',
            },
          ],
        },
        {
          type: 'p',
          text: 'Five participants from client teams went through tasks on reading the heatmap, comparing locations and switching between surveys.',
        },
        {
          type: 'image',
          src: '/assets/quorso-insights/usability-testing.webp',
          width: 2400,
          height: 2017,
          caption: '',
          alt: 'Usability testing results: tasks in rows, five participants in columns, green where a task went smoothly and yellow where people struggled',
          wide: true,
        },
        { type: 'p', text: 'What we saw:' },
        {
          type: 'list',
          ordered: false,
          items: [
            'Everyone read the numbers and the colours correctly, but when most answers were Excellent, real problems did not stand out.',
            'Changing the date range and switching surveys worked for everyone.',
            'The By question and By location toggle, and the remove button that only appeared on hover, were easy to miss.',
            'Filtering by answer type felt technical; people wanted to filter by question or section instead.',
            'By location became hard to read as soon as more questions were added.',
          ],
        },
        { type: 'h3', text: 'What changed after testing' },
        {
          type: 'list',
          ordered: false,
          items: [
            'One Answer column instead of a column for every answer option. Depending on the question type it shows a total, for text, date and number answers, or a breakdown of the options, for single and multi select. The table stays readable for any survey configuration, and engineering builds one column instead of a layout per answer type.',
            'The heatmap stayed, but moved from green to purple, so colour reads as how often an answer was given rather than whether it is good. It also respects the colours clients assign to answers when they build a survey.',
            'We dropped the By location view. A survey can have dozens of questions, and comparing stores across all of them in one wide table was not readable.',
          ],
        },
      ],
    },
    {
      id: 'solution',
      title: 'Solution',
      blocks: [
        {
          type: 'p',
          text: 'The final table is one template for any survey. Every question gets a single Answers bar: options keep their defined order, shaded from light to dark purple by position, and each segment is as wide as its share of responses. Yes and No keep their meaning in green and red. Text, number, date and image answers show a count that opens the responses behind it.',
        },
        {
          type: 'p',
          text: 'Clicking an answer shows who gave it and where. Clicking a question opens it by region, district or store, so locations are compared one question at a time instead of in one wide table. Long answer lists fold into the top five and "+N more", and questions without responses say so.',
        },
        { type: 'h3', text: 'Edge cases' },
        {
          type: 'p',
          text: 'One template has to hold up for any survey a client builds, so I specified the cases engineering would otherwise have to guess: follow-up and conditional questions, archived questions that still have answers, hover states, and how wide each column can grow. Every answer with responses keeps at least 32px so its label stays readable, and answers nobody chose shrink to a fixed 16px but stay in the bar, so the scale is always complete.',
        },
        {
          type: 'image',
          src: '/assets/quorso-insights/spec-states.webp',
          width: 2400,
          height: 1600,
          caption: '',
          alt: 'Spec for question types (follow-up, conditional), archived questions with an archive date tooltip, hover states and column widths',
          wide: true,
        },
        {
          type: 'p',
          text: 'Colour follows rules too. Answers marked Positive or Negative keep green and red; Special, Amber and Neutral cover the rest. Everything else is shaded from the client’s secondary brand colour by its position in the scale, with the first answer always at 15% and the last at 90%, so the same answer looks the same whatever the counts. The spec also covers equal counts and options with zero responses.',
        },
        {
          type: 'image',
          src: '/assets/quorso-insights/spec-colour.webp',
          width: 2400,
          height: 1600,
          caption: '',
          alt: 'Colour spec: semantic colours for positive and negative answers, shading by position in the scale, and bars with equal or zero responses',
          wide: true,
        },
        { type: 'h3', text: 'Mobile' },
        {
          type: 'p',
          text: 'On a phone the table turns into a list of cards, one per question, with the same bar underneath. Section names stay pinned while you scroll, responses open as a bottom sheet, and a one-time hint explains that the bar can be tapped.',
        },
        { type: 'p', text: 'The prototype is live: open it, hover a bar, click an answer or a question, and switch between the desktop and mobile views.' },
        {
          type: 'prototype',
          src: '/projects/quorso-insights/demo',
          video: '/assets/quorso-insights/prototype-walkthrough.webm',
          poster: '/assets/quorso-insights/prototype-walkthrough-poster.webp',
          title: 'Survey insights prototype',
        },
        { type: 'draft', text: 'Draft: the export.' },
      ],
    },
    {
      id: 'impact',
      title: 'Impact',
      blocks: [{ type: 'draft', text: 'Draft: what changed for district managers and for the team that used to run the exports.' }],
    },
  ],
}
