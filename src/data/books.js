// The shelf. Drives /library (ledger + filters + sort) and /library/[slug]
// (field-note pages). Array order is the default "shelf" order: grouped by
// category (business, strategy, fiction, memoir, faith, textbook, document),
// alphabetical by title within each group. The /library page also offers sorting
// by year and by title; shelf order is what you get back when you reset that
// control, and it's also what the per-book "NN / total" index number is drawn
// from, so a book keeps its catalog number no matter how the list is currently
// sorted.
// `pd: true` marks works in the US public domain whose full text will be hosted
// under /library/<slug>/text/; `notes` holds Daniel's analysis paragraphs, and
// an empty array renders the page with a NOTES PENDING placeholder.
// `url` is optional and points at the canonical copy of a source document we
// link out to rather than host. It is deliberately separate from `pd`: some of
// the filings below are federal works and so are public domain, but `pd` also
// promises full text under /library/<slug>/text/, which we are not doing for
// them, so they carry `pd: false` and a `url` instead.
// Author/year/hooks are researched, not invented; a blank year means the
// printing/edition on the shelf isn't pinned down, not that the work has no date.
export const categories = ['business', 'strategy', 'fiction', 'memoir', 'faith', 'textbook', 'document'];

export const books = [
  // -- business --
  { slug: 'exponential-organizations-2', title: 'Exponential Organizations 2.0',
    author: 'Salim Ismail, Peter H. Diamandis & Michael S. Malone', year: '2023', category: 'business',
    hook: 'Updated framework for organizations using exponential technologies to scale rapidly, based on the 2014 original.',
    pd: false, notes: [] },
  { slug: 'introductory-management-science', title: 'Introductory Management Science: Decision Modeling with Spreadsheets',
    author: 'Gary D. Eppen, F. J. Gould, C. P. Schmidt, J. H. Moore & L. R. Weatherford', year: '5th ed.',
    category: 'business',
    hook: 'Operations research textbook covering quantitative decision-making methods using spreadsheet modeling.',
    pd: false, notes: [] },
  { slug: 'nail-it-then-scale-it', title: 'Nail It Then Scale It', author: 'Nathan Furr & Paul Ahlstrom',
    year: '2011', category: 'business',
    hook: 'Outlines a process for validating a startup idea before scaling it, based on customer discovery and lean methodology.',
    pd: false, notes: [] },
  { slug: 'the-mom-test', title: 'The Mom Test', author: 'Rob Fitzpatrick', year: '2013',
    category: 'business',
    hook: 'Teaches founders how to interview potential customers without leading questions that produce false validation.',
    pd: false, notes: [] },
  { slug: 'the-art-of-the-deal', title: 'Trump: The Art of the Deal', author: 'Donald Trump & Tony Schwartz',
    year: '1987', category: 'business',
    hook: "Memoir and business-advice book describing Trump's real estate deals in New York during the 1970s and 1980s.",
    pd: false, notes: [] },

  // -- strategy --
  { slug: 'bushido-the-soul-of-japan', title: 'Bushido: The Soul of Japan', author: 'Inazo Nitobe',
    year: '1900', category: 'strategy',
    hook: 'English-language essay explaining samurai ethics and Japanese moral tradition to Western readers, first published in 1900.',
    pd: true, notes: [] },
  { slug: 'common-language-in-cybersecurity-science', title: 'Common Language in Cybersecurity Science',
    author: 'Shawn P. Riley', year: '', category: 'strategy',
    hook: 'Establishes shared vocabulary and definitions for treating cybersecurity as a measurable, testable scientific discipline.',
    pd: false, notes: [] },
  { slug: 'pale-blue-dot', title: 'Pale Blue Dot: A Vision of the Human Future in Space', author: 'Carl Sagan',
    year: '1994', category: 'strategy',
    hook: "Reflection on humanity's place in the cosmos, prompted by the Voyager 1 photograph of Earth as a single pixel from 3.7 billion miles away.",
    pd: false, notes: [] },
  { slug: 'the-48-laws-of-power', title: 'The 48 Laws of Power', author: 'Robert Greene', year: '1998',
    category: 'strategy',
    hook: 'Presents 48 strategies for gaining and maintaining power, illustrated with historical examples.',
    pd: false, notes: [] },
  { slug: 'the-art-of-war', title: 'The Art of War', author: 'Sun Tzu, translated by Lionel Giles', year: '1910 tr.',
    category: 'strategy',
    hook: "1910 English translation of Sun Tzu's ancient Chinese military treatise, now in the public domain.",
    pd: true, notes: [] },
  { slug: 'the-book-of-ninja', title: 'The Book of Ninja', author: 'Antony Cummins & Yoshie Minami',
    year: '2013', category: 'strategy',
    hook: 'English translation of the 1676 Bansenshukai, a historical manual compiling ninjutsu techniques from the Iga clans.',
    pd: false, notes: [] },

  // -- fiction --
  { slug: '1984', title: '1984', author: 'George Orwell', year: '1949',
    category: 'fiction',
    hook: 'Dystopian novel depicting a totalitarian surveillance state under the rule of Big Brother and the Party.',
    pd: false, notes: [] },
  { slug: 'animal-farm', title: 'Animal Farm', author: 'George Orwell', year: '1945',
    category: 'fiction',
    hook: 'Allegorical novella using farm animals to satirize the Russian Revolution and its aftermath.',
    pd: false, notes: [] },
  { slug: 'chapterhouse-dune', title: 'Chapterhouse: Dune', author: 'Frank Herbert', year: '1985',
    category: 'fiction',
    hook: 'Sixth and final Dune novel Frank Herbert wrote, continuing the Bene Gesserit storyline.',
    pd: false, notes: [] },
  { slug: 'children-of-dune', title: 'Children of Dune', author: 'Frank Herbert', year: '1976',
    category: 'fiction',
    hook: 'Third Dune novel, centering on the Atreides twins and the ecological transformation of Arrakis.',
    pd: false, notes: [] },
  { slug: 'contact', title: 'Contact', author: 'Carl Sagan', year: '1985',
    category: 'fiction',
    hook: "Novel about a scientist's discovery of an extraterrestrial radio signal and the first-contact protocol that follows.",
    pd: false, notes: [] },
  { slug: 'cryptonomicon', title: 'Cryptonomicon', author: 'Neal Stephenson', year: '1999',
    category: 'fiction',
    hook: 'Novel spanning WWII codebreaking and a 1990s effort to build an offshore data haven, following two generations of the same families.',
    pd: false, notes: [] },
  { slug: 'dune', title: 'Dune', author: 'Frank Herbert', year: '1965',
    category: 'fiction',
    hook: "Science fiction novel set on the desert planet Arrakis, first in Herbert's Dune series.",
    pd: false, notes: [] },
  { slug: 'dune-messiah', title: 'Dune Messiah', author: 'Frank Herbert', year: '1969',
    category: 'fiction',
    hook: 'Second Dune novel, following Paul Atreides in the years after the events of the first book.',
    pd: false, notes: [] },
  { slug: 'fahrenheit-451', title: 'Fahrenheit 451', author: 'Ray Bradbury', year: '1953',
    category: 'fiction',
    hook: 'Dystopian novel about a fireman whose job is burning books, in a future where reading is outlawed.',
    pd: false, notes: [] },
  { slug: 'god-emperor-of-dune', title: 'God Emperor of Dune', author: 'Frank Herbert', year: '1981',
    category: 'fiction',
    hook: 'Fourth Dune novel, set roughly 3,500 years later, centering on the ruler Leto II.',
    pd: false, notes: [] },
  { slug: 'heretics-of-dune', title: 'Heretics of Dune', author: 'Frank Herbert', year: '1984',
    category: 'fiction',
    hook: 'Fifth Dune novel, set many centuries after the fourth, following the Bene Gesserit and rival factions.',
    pd: false, notes: [] },
  { slug: 'moby-dick', title: 'Moby-Dick; or, The Whale', author: 'Herman Melville', year: '1851',
    category: 'fiction',
    hook: 'Novel narrated by Ishmael about a whaling voyage led by Captain Ahab in pursuit of a white whale.',
    pd: true, notes: [] },
  { slug: 'neuromancer', title: 'Neuromancer', author: 'William Gibson', year: '1984',
    category: 'fiction',
    hook: 'Novel that coined the term "cyberspace," following a burned-out hacker hired for one last job in a world of AI and megacorporations.',
    pd: false, notes: [] },
  { slug: 'snow-crash', title: 'Snow Crash', author: 'Neal Stephenson', year: '1992',
    category: 'fiction',
    hook: 'Novel following a hacker-samurai pizza-delivery driver investigating a computer virus that also destroys the minds of its human users.',
    pd: false, notes: [] },
  { slug: 'the-hitchhikers-guide-to-the-galaxy', title: "The Hitchhiker's Guide to the Galaxy",
    author: 'Douglas Adams', year: '1979', category: 'fiction',
    hook: "Comic science fiction novel adapted from Adams' BBC radio series, following Arthur Dent offworld.",
    pd: false, notes: [] },

  // -- memoir --
  { slug: 'life-undercover', title: 'Life Undercover', author: 'Amaryllis Fox', year: '2019',
    category: 'memoir',
    hook: 'Memoir by a former CIA clandestine operations officer recounting her decade working undercover against global terrorism networks.',
    pd: false, notes: [] },

  // -- faith --
  { slug: 'the-holy-bible', title: 'The Holy Bible', author: '', year: '',
    category: 'faith',
    hook: 'Collection of religious texts sacred to Judaism and Christianity, compiled over many centuries by multiple authors.',
    pd: false, notes: [] },
  { slug: 'the-holy-quran', title: 'The Holy Quran', author: '', year: '',
    category: 'faith',
    hook: "Religious text central to Islam, regarded by Muslims as God's word revealed to Muhammad in the 7th century CE.",
    pd: false, notes: [] },
  { slug: 'the-vedas', title: 'The Vedas: Rig, Yajur, Sama & Atharva', author: '', year: '',
    category: 'faith',
    hook: 'Four ancient Sanskrit scripture collections central to Hinduism, traditionally regarded as having no single human author.',
    pd: false, notes: [] },

  // -- textbook --
  { slug: 'campbell-biology', title: 'Campbell Biology',
    author: 'Lisa A. Urry, Michael L. Cain, Steven A. Wasserman & Peter V. Minorsky', year: '',
    category: 'textbook',
    hook: 'Surveys cellular, genetic, evolutionary, and ecological principles across the biological sciences for undergraduates.',
    pd: false, notes: [] },
  { slug: 'zumdahl-chemistry', title: "Chemistry (Instructor's Annotated Edition)",
    author: 'Steven S. Zumdahl & Susan A. Zumdahl', year: '', category: 'textbook',
    hook: 'Covers general chemistry principles, from atomic structure and bonding through thermodynamics and equilibrium reactions.',
    pd: false, notes: [] },
  { slug: 'cnc-machining-handbook', title: 'CNC Machining Handbook: Basic Theory, Production Data, and Machining Procedures',
    author: 'James Madison', year: '1996', category: 'textbook',
    hook: 'Explains CNC machining theory, machine setup, and production procedures for milling, turning, and grinding.',
    pd: false, notes: [] },
  { slug: 'engineering-design', title: 'Engineering Design', author: 'George E. Dieter', year: '',
    category: 'textbook',
    hook: 'Presents the engineering design process, covering conceptual design, material selection, and design for manufacturing.',
    pd: false, notes: [] },
  { slug: 'engineering-mechanics-dynamics', title: 'Engineering Mechanics: Dynamics', author: 'Russell C. Hibbeler',
    year: '', category: 'textbook',
    hook: 'Covers kinematics and kinetics of particles and rigid bodies in classical Newtonian mechanics.',
    pd: false, notes: [] },
  { slug: 'electric-circuits', title: 'Fundamentals of Electric Circuits',
    author: 'Charles K. Alexander & Matthew N. O. Sadiku', year: '6th ed.', category: 'textbook',
    hook: 'Introduces DC and AC circuit analysis methods, theorems, and applications for electrical engineering students.',
    pd: false, notes: [] },
  { slug: 'engineering-thermodynamics', title: 'Fundamentals of Engineering Thermodynamics',
    author: 'Michael J. Moran & Howard N. Shapiro', year: '', category: 'textbook',
    hook: 'Covers energy, entropy, and thermodynamic cycles underlying mechanical and chemical engineering system design.',
    pd: false, notes: [] },
  { slug: 'heat-and-mass-transfer', title: 'Fundamentals of Heat and Mass Transfer',
    author: 'Theodore L. Bergman, Adrienne S. Lavine, Frank P. Incropera & David P. DeWitt', year: '7th ed.',
    category: 'textbook',
    hook: 'Covers conduction, convection, radiation, and mass transfer principles for thermal engineering analysis.',
    pd: false, notes: [] },
  { slug: 'how-to-keep-your-volkswagen-alive',
    title: 'How to Keep Your Volkswagen Alive: A Manual of Step-by-Step Procedures for the Compleat Idiot',
    author: 'John Muir & Tosh Gregg, illustrated by Peter Aschwanden', year: '1969', category: 'textbook',
    hook: 'Covers step-by-step maintenance and repair for air-cooled Volkswagen Beetles, written in a countercultural voice with hand-drawn illustrations.',
    pd: false, notes: [] },
  { slug: 'mechanics-of-materials', title: 'Mechanics of Materials', author: 'Barry J. Goodno & James M. Gere',
    year: '9th ed.', category: 'textbook',
    hook: 'Covers stress, strain, and deformation analysis of structural and mechanical engineering components under load.',
    pd: false, notes: [] },
  { slug: 'pocket-book-of-technical-writing', title: 'Pocket Book of Technical Writing for Engineers and Scientists',
    author: 'Leo Finkelstein Jr.', year: '', category: 'textbook',
    hook: 'Covers technical writing conventions, formats, and style for engineering and science professionals and students.',
    pd: false, notes: [] },
  { slug: 'shigleys-mechanical-engineering-design', title: "Shigley's Mechanical Engineering Design",
    author: 'Richard G. Budynas & J. Keith Nisbett', year: '', category: 'textbook',
    hook: 'Covers machine element design, including fasteners, shafts, gears, bearings, and failure theory.',
    pd: false, notes: [] },
  { slug: 'mechanical-measurements', title: 'Theory and Design for Mechanical Measurements',
    author: 'Richard S. Figliola & Donald E. Beasley', year: '', category: 'textbook',
    hook: 'Covers measurement theory, instrumentation, uncertainty analysis, and design of mechanical measurement systems.',
    pd: false, notes: [] },
  { slug: 'vector-calculus', title: 'Vector Calculus', author: 'Jerrold E. Marsden & Anthony J. Tromba',
    year: '6th ed.', category: 'textbook',
    hook: "Covers multivariable calculus, including vector fields, line and surface integrals, and the generalized Stokes' theorem.",
    pd: false, notes: [] },
  { slug: 'volkswagen-service-manual-type-1',
    title: 'Volkswagen Beetle and Karmann Ghia Service Manual, Type 1: 1966, 1967, 1968, 1969',
    author: 'Volkswagen of America (Bentley Publishers)', year: '1972', category: 'textbook',
    hook: 'Provides factory-level technical service and repair procedures for 1966 to 1969 Volkswagen Beetle and Karmann Ghia models.',
    pd: false, notes: [] },

  // -- document --
  // Primary sources behind the big-tech user-trust timeline. Hosted at their
  // canonical URLs, not mirrored here.
  { slug: 'amazon-response-to-senator-markey', title: 'Amazon Response to Senator Markey',
    author: 'Amazon', year: '2022', category: 'document',
    hook: "Letter made public by Sen. Ed Markey's office showing Ring frequently makes its own good-faith determinations as to whether to hand surveillance footage to law enforcement absent a warrant or the owner's consent.",
    url: 'https://www.markey.senate.gov/imo/media/doc/amazon_response_to_senator_markey-july_13_2022.pdf',
    pd: false, notes: [] },
  { slug: 'facebook-sealed-exhibits', title: 'Facebook Sealed Exhibits',
    author: 'Released by lawsuit, published by NBC News', year: '2019', category: 'document',
    hook: "Over 4,000 pages of internal Facebook documents revealing how the company cut off developer access to data, planned to track Android users' locations, and considered charging developers for access to user data.",
    url: 'https://dataviz.nbcnews.com/projects/20191104-facebook-leaked-documents/assets/facebook-sealed-exhibits.pdf',
    pd: false, notes: [] },
  { slug: 'ftc-facebook-complaint', title: 'FTC Complaint: In the Matter of Facebook, Inc.',
    author: 'US Federal Trade Commission', year: '2012', category: 'document',
    hook: "Complaint alleging Facebook engaged in unfair and deceptive practices by making misleading privacy promises to users and sharing their personal information with third parties without consent.",
    url: 'https://www.ftc.gov/sites/default/files/documents/cases/2012/08/120810facebookcmpt.pdf',
    pd: false, notes: [] },
  { slug: 'ftc-facebook-order', title: 'FTC Order: In the Matter of Facebook, Inc.',
    author: 'US Federal Trade Commission', year: '2012', category: 'document',
    hook: 'The consent order accompanying the 2012 complaint, and the order the FTC found Facebook had violated when it imposed a $5 billion penalty in 2019.',
    url: 'https://www.ftc.gov/sites/default/files/documents/cases/2012/08/120810facebookdo.pdf',
    pd: false, notes: [] },
  { slug: 'united-states-v-microsoft', title: 'United States v. Microsoft',
    author: 'US District Court for the District of Columbia', year: '1999', category: 'document',
    hook: 'Federal district court ruling that Microsoft acted as a monopoly and violated multiple sections of the Sherman Anti-Trust Act (1890), in the antitrust case brought by the Justice Department.',
    url: 'https://www.justice.gov/sites/default/files/atr/legacy/2006/04/11/msjudge.pdf',
    pd: false, notes: [] },
];

// A typo fails the build instead of silently rendering an unfilterable row.
const seen = new Set();
for (const b of books) {
  if (seen.has(b.slug)) throw new Error(`books.js: duplicate slug "${b.slug}"`);
  seen.add(b.slug);
  if (!categories.includes(b.category))
    throw new Error(`books.js: "${b.slug}" has unknown category "${b.category}"`);
}

// Sort key helper shared with library/index.astro: pulls the first 4-digit run
// out of a year string ("1910 tr." -> 1910), or null when the printing/edition
// on the shelf has no pinned year ("7th ed.", "").
export function sortYear(book) {
  const m = /\d{4}/.exec(book.year);
  return m ? Number(m[0]) : null;
}
