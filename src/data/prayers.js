// Prayers for the homepage RSVP reader (index.astro). The reader plays READER on repeat; with more
// than one entry it alternates them, starting with a random one on each load.

// Benjamin Franklin's "New Version of the Lord's Prayer" [late 1768?], verbatim (Founders Online,
// founders.archives.gov/documents/Franklin/01-15-02-0170). His rewrite, so not red letter; he
// dropped the doxology.
const FRANKLIN = "Heavenly Father, May all revere thee, And become thy dutiful Children and faithful Subjects. May thy Laws be obeyed on Earth as perfectly as they are in Heaven. Provide for us this Day as thou has hitherto daily done. Forgive us our Trespasses, and enable us likewise to forgive those that offend us. Keep us out of Temptation, and deliver us from Evil.";

// The prayer in Aramaic: Matthew 6:9-13 in the Syriac Peshitta (Classical Syriac, an Aramaic
// dialect; translated c. 2nd-5th century). No Aramaic text from Jesus' own day survives; the
// Gospels preserve the prayer in Greek, and the Peshitta is the oldest continuous Aramaic version.
// Scholarly transliteration as given in Wikipedia's "Lord's Prayer" (Peshitta section, after
// Muraoka, Classical Syriac, 2005), one line per petition, without the doxology. Syriac script runs
// right to left and B612 Mono lacks these letters, so the reader shows the transliteration in a
// fallback monospace font (global.css .rsvp-box.syc).
export const PESHITTA = "ʾăḇūn d-ḇa-šmayyā\nneṯqaddaš šmāḵ\ntêṯē malkūṯāḵ\nnēhwē ṣeḇyānāḵ ʾaykannā ḏ-ḇa-šmayyā ʾāp̄ b-ʾarʿā\nhaḇ lan laḥmā ḏ-sūnqānan yawmānā\nwa-šḇoq lan ḥawbayn ʾaykannā ḏ-ʾāp̄ ḥnan šḇaqn l-ḥayyāḇayn\nw-lā ṯaʿlan l-nesyōnā ʾellā p̄aṣṣān men bīšā";

export const READER = [
  { lang: 'en', text: FRANKLIN },
  // On hold: add back to alternate English and Aramaic.
  // { lang: 'syc-Latn', text: PESHITTA },
];

// On hold: prayers Jesus speaks in the Gospels, KJV (bible-api.com), red letter only (narration
// cut). Not used while the reader cycles the Lord's Prayer; swap them back in to restore.
export const ALTERNATES = [
  { ref: "Matthew 11:25-26", text: "I thank thee, O Father, Lord of heaven and earth, because thou hast hid these things from the wise and prudent, and hast revealed them unto babes. Even so, Father: for so it seemed good in thy sight." },
  { ref: "John 11:41-42", text: "Father, I thank thee that thou hast heard me. And I knew that thou hearest me always: but because of the people which stand by I said it, that they may believe that thou hast sent me." },
  { ref: "John 12:27-28", text: "Now is my soul troubled; and what shall I say? Father, save me from this hour: but for this cause came I unto this hour. Father, glorify thy name." },
  { ref: "Matthew 26:39, 42", text: "O my Father, if it be possible, let this cup pass from me: nevertheless not as I will, but as thou wilt. O my Father, if this cup may not pass away from me, except I drink it, thy will be done." },
  { ref: "Luke 23:34", text: "Father, forgive them; for they know not what they do." },
  { ref: "Matthew 27:46", text: "Eli, Eli, lama sabachthani? My God, my God, why hast thou forsaken me?" },
  { ref: "Luke 23:46", text: "Father, into thy hands I commend my spirit:" },
  { ref: "John 17", text: "Father, the hour is come; glorify thy Son, that thy Son also may glorify thee: As thou hast given him power over all flesh, that he should give eternal life to as many as thou hast given him. And this is life eternal, that they might know thee the only true God, and Jesus Christ, whom thou hast sent. I have glorified thee on the earth: I have finished the work which thou gavest me to do. And now, O Father, glorify thou me with thine own self with the glory which I had with thee before the world was. I have manifested thy name unto the men which thou gavest me out of the world: thine they were, and thou gavest them me; and they have kept thy word. Now they have known that all things whatsoever thou hast given me are of thee. For I have given unto them the words which thou gavest me; and they have received them, and have known surely that I came out from thee, and they have believed that thou didst send me. I pray for them: I pray not for the world, but for them which thou hast given me; for they are thine. And all mine are thine, and thine are mine; and I am glorified in them. And now I am no more in the world, but these are in the world, and I come to thee. Holy Father, keep through thine own name those whom thou hast given me, that they may be one, as we are. While I was with them in the world, I kept them in thy name: those that thou gavest me I have kept, and none of them is lost, but the son of perdition; that the scripture might be fulfilled. And now come I to thee; and these things I speak in the world, that they might have my joy fulfilled in themselves. I have given them thy word; and the world hath hated them, because they are not of the world, even as I am not of the world. I pray not that thou shouldest take them out of the world, but that thou shouldest keep them from the evil. They are not of the world, even as I am not of the world. Sanctify them through thy truth: thy word is truth. As thou hast sent me into the world, even so have I also sent them into the world. And for their sakes I sanctify myself, that they also might be sanctified through the truth. Neither pray I for these alone, but for them also which shall believe on me through their word; That they all may be one; as thou, Father, art in me, and I in thee, that they also may be one in us: that the world may believe that thou hast sent me. And the glory which thou gavest me I have given them; that they may be one, even as we are one: I in them, and thou in me, that they may be made perfect in one; and that the world may know that thou hast sent me, and hast loved them, as thou hast loved me. Father, I will that they also, whom thou hast given me, be with me where I am; that they may behold my glory, which thou hast given me: for thou lovedst me before the foundation of the world. O righteous Father, the world hath not known thee: but I have known thee, and these have known that thou hast sent me. And I have declared unto them thy name, and will declare it: that the love wherewith thou hast loved me may be in them, and I in them." },
];
