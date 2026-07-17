const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
        Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
        WidthType, ShadingType, PageNumber, PageBreak, ExternalHyperlink } = require('docx');

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2E75B6" },
        paragraph: { spacing: { before: 180, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "1F4E79" },
        paragraph: { spacing: { before: 140, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "State v. Allen | Case No. 19CR 051799 | Lee County, NC", size: 18, color: "666666", font: "Arial" })]
      })] })
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Page ", size: 18, color: "666666", font: "Arial" }), new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "666666", font: "Arial" })]
      })] })
    },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [
        new TextRun({ text: "MEMORANDUM", bold: true, size: 36, font: "Arial", color: "1F4E79" })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [
        new TextRun({ text: "No Remedial Action After Alleged ADA Witness Coaching", bold: true, size: 28, font: "Arial", color: "2E75B6" })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 120 }, children: [
        new TextRun({ text: "The Happel Incident, Exhibit 4 Authentication Failures, and the Pattern of Misrepresentation", size: 26, font: "Arial", color: "2E75B6" })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
        new TextRun({ text: "Case: State v. Benjamin Allen | Lee County File No. 19CR 051799", size: 22, font: "Arial" })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 80 }, children: [
        new TextRun({ text: "Document Type: Post-Trial Memorandum / Disciplinary Reference", size: 22, font: "Arial" })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
        new TextRun({ text: "Date: July 2026", size: 22, font: "Arial" })
      ]}),

      // SECTION I
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("I. INTRODUCTION AND EXECUTIVE SUMMARY")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("This memorandum addresses a critical and documented failure in the administration of justice in State v. Allen: sworn testimony that Assistant District Attorney Tiffany Bartholomew coached a state witness in the courthouse lobby immediately before trial, and the complete absence of any remedial action by the trial court, the prosecutor's office, or the North Carolina State Bar. The witness, Steven Happel, reported the incident under oath during a pre-trial colloquy. Despite the gravity of the allegation, the court permitted the trial to proceed without investigation, without curative instruction, without recusal or disqualification of the prosecutor, and without reporting the matter to oversight authorities. The State Bar — which had already received and investigated complaints about Bartholomew in this same case — took no action.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The failure to act was not a close call. It was a knowing decision to prioritize trial continuity over witness integrity and prosecutorial ethics. The consequences were immediate and measurable: the complainant's trial testimony introduced precisely the elements Bartholomew was alleged to have coached — \"fear of witnesses\" and a \"freeze\" response — none of which appeared in her 2019 statements to investigators. Forensic linguistic analysis confirms a collapse in narrative consistency (cosine similarity dropping from 1.0 to 0.28) that aligns structurally with the coached transition from situational recall to legalistic element-filling.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("This memorandum also ties the Happel coaching incident to two other documented failures in the same trial record: (1) the overruling of authentication and hearsay objections to State's Exhibit 4 — a Facebook message screenshot that the exhibit itself attributed to another user, \"Matt,\" using the defendant's phone — and the State's failure to satisfy the court's own conditional foundation requirement; and (2) the ADA's misrepresentation during plea negotiations that sperm evidence had been found, which she later characterized as a \"misunderstanding\" despite her extensive experience and specialization in sexual assault prosecution. These failures are not isolated. They are branches of the same tree: a prosecution that relied on manufactured evidence, coached testimony, and misrepresentation to sustain a case that the objective record could not support.")] }),

      // SECTION II
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("II. THE HAPPEL COLLOQUY: THE FACTUAL RECORD")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("On the morning of trial, before Steven Happel was called to testify, defense counsel brought to the court's attention that Happel had reported an improper contact with the prosecution team. The court conducted an in-chambers colloquy with Happel, placed him under oath, and took the following sworn account:")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "Sworn Testimony (Steven Happel, Court Colloquy):", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "\"I was told to present myself at 2 p.m. yesterday in the old courthouse, and I waited in the lobby. I did go out to my car to kind of relax. I came back in. I talked to the investigator Scott. I don't know his last name. I forgot. That's the only person I talked to about the case, answering questions. And as I was sitting in the main lobby around 2 to 3 p.m. yesterday, Ms. Bartholomew and the victim and other witnesses, maybe, or her family walked in through the front door and were talking about the trial and how the defendant pleaded or was going to plead, something like that, and then I heard Ms. Bartholomew tell the victim that she should have said that the victim was afraid of the witnesses, which is me and Joseph DeMarco, and I felt intimidated, maybe like my feelings or thought process was trying to be played with, and felt very uncomfortable.\"", italics: true })] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Happel further testified that he did not confront Bartholomew at the time, that he believed the incident would affect the trial, and that the ethical question \"kind of disturbed\" him. The court asked whether he believed the contact would affect his testimony. Happel replied: \"The only answers I'll give are truthful answers that I can recall.\"")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "The Court's Ruling:", bold: true }), new TextRun(" After the colloquy, the court stated: \"I'm satisfied this witness is prepared to tell the truth, the whole truth and nothing but the truth, as he indicated under his oath. So we'll go ahead, then, bring in the jury at this time.\" The jury was brought in, and Happel testified directly for the State without any curative instruction, without any investigation of the coaching allegation, and without any sanction or admonishment of ADA Bartholomew.")] }),

      // SECTION III
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("III. WHAT REMEDIAL ACTION WAS REQUIRED")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The alleged conduct — a prosecutor coaching a witness to claim fear of the defense witnesses — is among the most serious forms of prosecutorial misconduct. It strikes at the heart of the fact-finding process and implicates the defendant's due process right to a fair trial. The following remedial options were available and, under controlling authority, required:")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "A. Mistrial or Continuance", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("A trial court has inherent authority to declare a mistrial when prosecutorial misconduct prejudices the defendant's right to a fair trial. See N.C. Gen. Stat. § 15A-1061. Where a prosecutor is alleged to have coached a witness, the contamination is not curable by a simple instruction. The witness's testimony is tainted at its source. A mistrial, or at minimum a continuance to permit investigation and potential substitution of counsel, was the constitutionally appropriate response.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "B. Prosecutor Disqualification or Recusal", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("North Carolina courts have authority to disqualify a prosecutor where conduct violates the rules of professional conduct or deprives the defendant of a fair trial. See N.C. RPC 3.8 (special responsibilities of a prosecutor); N.C. RPC 8.4 (misconduct). The alleged coaching — directing a witness to fabricate an emotional response to defense witnesses — is precisely the type of conduct that requires disqualification. The trial court took no step to remove Bartholomew from the case or to refer the matter to the district attorney's office for internal review.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "C. Curative Instruction", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Even if the court declined to declare a mistrial or disqualify counsel, it was obligated to provide a curative instruction to the jury. The jury should have been told that an attorney's attempt to influence witness testimony is improper, that they should scrutinize any testimony that seemed to align with a litigation strategy rather than independent recollection, and that the prosecutor's conduct was itself evidence of potential witness manipulation. No such instruction was given.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "D. Investigation and Referral to Oversight Authorities", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The court was obligated to report the misconduct to the North Carolina State Bar and to the judicial oversight authorities. See N.C. RPC 3.3 (candor toward tribunal); N.C. RPC 8.3 (reporting professional misconduct). The record shows that the State Bar had already received complaints about Bartholomew in this case and had taken no action. The trial court's failure to report ensured that the disciplinary record remained incomplete and that the Bar's prior inaction was insulated from correction.")] }),

      // SECTION IV
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("IV. THE COURT'S FAILURE TO ACT: A RECONSTRUCTION")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The trial court's response to Happel's sworn allegation can be summarized in three sentences: it held a colloquy, it found Happel credible enough to testify, and it brought the jury in. That is all. There was no investigation, no mistrial, no disqualification, no curative instruction, and no referral to the State Bar.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The colloquy itself reveals the inadequacy of the court's response. The court treated the incident as a credibility question for Happel — \"Are you prepared to tell the truth?\" — rather than as an ethical crisis requiring structural intervention. This framing mistake converted a prosecutorial misconduct problem into a witness reliability problem, which is precisely the opposite of what the situation required. The question was not whether Happel would tell the truth; the question was whether the State's case had been manufactured by the prosecutor's office before the jury ever sat down.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The record also shows that the court was aware of the seriousness of the allegation. In chambers, before the colloquy, the court stated that it had been \"brought to my attention by the defense attorneys that Mr. Happel may have indicated to them in the last hours that he felt the assistant district attorney prosecuting the case had somehow overstepped her bounds in preparing for trial.\" The court's own language recognized \"overstepped her bounds\" — yet the remedy was nothing.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The State Bar's prior inaction in this case compounds the failure. As documented elsewhere in the record, Bartholomew had already been reported and investigated for misconduct in State v. Allen, and the State Bar had taken no action. The trial court's failure to report the Happel incident meant that the Bar's file remained incomplete. An oversight body that does not investigate cannot discipline; a court that does not report ensures that the oversight body never learns what it must investigate.")] }),

      // SECTION V
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("V. THE CONSEQUENCES: NARRATIVE ENGINEERING VERIFIED")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The absence of remedial action did not merely leave an allegation unanswered. It permitted the very outcome the coaching was designed to produce: a complainant whose trial testimony incorporated the coached elements with precision.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "A. The Linguistic Shift", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Forensic linguistic analysis comparing Lauren Deal's 2019 statements to investigators with her 2023 trial testimony reveals a dramatic collapse in consistency. The cosine similarity score between her early and late accounts dropped from 1.0 (perfect consistency) to 0.28 (heavily engineered). The shift is not random. It is directional:")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("She began claiming she \"froze\" — a term absent from her 2019 interviews and introduced only at trial.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun("She began invoking \"fear of witnesses\" — precisely the element Bartholomew was alleged to have coached her to claim.")] }),
      new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 200 }, children: [new TextRun("Her speech register shifted from situational, concrete vocabulary (\"truck,\" \"bathroom,\" \"keys,\" \"firewood\") to legalistic, element-filling language (\"force,\" \"fear,\" \"trust,\" \"freezing,\" \"triggers\").")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("This is not natural memory evolution. It is the signature of coached testimony: the witness's substantive center moves from \"what happened\" to \"what the jury needs to hear to convict.\" The timing — the shift occurring between 2019 and 2023, with the coached elements first appearing at trial — is consistent with pre-trial preparation, not with delayed disclosure or maturation of recall.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "B. The Physical Impossibility", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The \"fear of witnesses\" element was not merely linguistically engineered. It was physically implausible. Happel and DeMarco were the defense witnesses. The complainant claimed she was afraid of them. Yet the record shows she was in the same bar, the same vehicle, and the same house with these individuals throughout the evening, initiating contact and social interaction at multiple points. A person who is genuinely afraid of two individuals does not follow them to a house, enter the house alone, and then claim terror as the narrative requires. The coaching supplied the legal vocabulary to paper over this physical inconsistency, and the trial court's failure to act allowed the jury to hear that vocabulary without context.")] }),

      // SECTION VI - NEW
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("VI. EXHIBIT 4: AUTHENTICATION FAILURE AND THE COURT'S CONDITIONAL ADMISSION")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The Happel coaching incident did not occur in isolation. It was part of a broader pattern of evidentiary manipulation that included the State's handling of Exhibit 4, a December 3, 2016 Facebook message screenshot offered to prove the \"position of trust\" aggravating factor. The authentication and hearsay problems with Exhibit 4 are directly tied to the same prosecutorial culture that produced the Happel coaching: a willingness to use evidence in ways the record does not support, and to rely on the court's procedural failures when objections are overruled.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "A. The Authentication Problem", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("State's Exhibit 4 was a partial screenshot of Facebook messages. The exhibit's own content identified the sender as \"Matt\" using the defendant's phone. The defendant himself stated at the end of the thread that he did not have possession of his phone. Despite these indicia of disputed authorship, the prosecutor offered the exhibit as a message between the complainant and the defendant, and the court overruled the defense objection.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Defense counsel Wunsch objected on the record: \"In this message, it clearly states — I mean, she is picking out part of it, but in this message, it clearly states that this is not Ben. It's Matt. I'm using his phone... at the very end, Ben comes on, identified himself, saying, I didn't have my phone. I'm sorry.\" The court overruled the objection and found the exhibit \"admissible and sufficiently reliable to be admitted.\"")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "B. The Court's Conditional Foundation Requirement", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The court did not simply admit the exhibit unconditionally. It imposed a condition under Rule 104(b): the exhibit was admissible only if the State linked it to a prior conversation before 1:49 p.m. on December 3, 2016, so the page would have context and a plausible basis for attribution. The court stated: \"If she testifies that they had a discussion prior to December 3, 2016, at 1:49, then that would give this particular page context... they will need to link this up with a conversation prior to December 3, 2016.\"")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Bartholomew did not satisfy that condition. She asked Deal whether she and the defendant had discussed the bonfire before 1:49 p.m. Having Deal read a text that says \"Remember when I said I was having that bonfire...\" is not independent testimony that the prior conversation occurred. The exhibit was introduced to support an aggravating factor — special position of trust — founded on a three-year-old partial screenshot in which the identified sender is disputed by the exhibit's own content.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "C. The Rule of Completeness Violation", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The State offered only the first page of the Facebook exchange. Later pages identified another user of the phone and undermined the attribution the State was attempting to prove. Under N.C. R. Evid. 106, the defense was entitled to have the complete context admitted. The judge recognized this problem, yet the State proceeded as though the condition had been met and the completeness concern had been resolved. The effect was to present a misleading impression of authorship and continuity to the jury.")] }),

      // SECTION VII - NEW
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("VII. DEMARCO STATEMENTS, ILLUSTRATIVE PHOTOS/VIDEO, AND THE OVERRULING OF HEARSAY OBJECTIONS")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The trial record also reflects the court's willingness to overrule defense objections and admit evidence that was either hearsay, illustrative only, or materially inconsistent with the witness's own recorded statement. These rulings share the same structural flaw as the Happel colloquy and the Exhibit 4 admission: the court prioritized the State's narrative over the rules of evidence and the defendant's right to a fair trial.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "A. DeMarco's Affidavit vs. Recorded Statement", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("Detective Freeman's affidavit stated that Joseph DeMarco \"made the decision to get his vehicle and ride in an attempt to locate her.\" DeMarco's own recorded statement says no such thing. He got afraid and left — he did not decide to search. He incidentally saw Deal while driving. Freeman upgraded a chance encounter into a deliberate search, a material change that shapes how Deal was found and implies active corroboration of her escape account. Additionally, Deal told police she was hiding behind a tree; DeMarco says he saw her running through a field. These accounts cannot both be true. Yet the affidavit, with its upgraded narrative, was used to support probable cause and was never corrected.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "B. Illustrative Photos and Video", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("During Lauren Deal's direct examination, the State offered illustrative photos of the woods and the residence. Defense counsel objected, noting that the pictures were of the woods and lacked proper foundation. The court overruled the objection: \"I will overrule the objection, and the photos are admissible for illustrative purposes.\" The court then permitted Deal to use the photos to describe her testimony, stepping down from the witness stand to point out locations on the exhibits.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The problem with this ruling is twofold. First, the photos were offered as illustrative of Deal's testimony about where she was, what she saw, and how she moved — but the very conditions under which she claimed to have run (complete darkness, unfamiliar terrain, terror) make illustrative photos a poor substitute for the sensory and perceptual reality she described. Second, the court's use of the term \"illustrative\" effectively insulated the photos from hearsay scrutiny, allowing the jury to see the location as Deal described it without requiring independent proof that the photos accurately depicted the scene as it existed on the night in question. The bar video, which would have provided objective documentation of the evening's events, was available but was not used to contextualize or contradict Deal's illustrative testimony.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: "C. The Pattern of Overruling Defense Objections", bold: true })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The transcript reflects multiple instances in which the court overruled defense objections to the State's evidence. Each overruling removed a potential barrier to the State's narrative. Each ruling was framed in terms of discretion — \"illustrative purposes,\" \"sufficiently reliable\" — but the cumulative effect was to lower the State's evidentiary burden at precisely the points where the record was weakest. The court did not merely err in individual rulings; it created a procedural environment in which the State could present a manufactured case with minimal judicial scrutiny.")] }),

      // SECTION VIII - NEW
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("VIII. THE \"MISUNDERSTANDING\" DEFENSE: PLEA NEGOTIATION MISREPRESENTATION")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("During plea discussions, ADA Bartholomew represented to the defendant that there was sperm evidence linking him to the complainant. The record states: \"We found your sperm and DNA on her.\" This representation was false. The SBI report, dated May 11, 2020, stated: \"No spermatozoa present.\" The Y-STR analysis found a non-individualizing profile matching 1 in 518 Caucasian males, including all paternal relatives — a result that could not be attributed to the defendant with any specificity. The sample was subsequently consumed without defense notice.")] }),

      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("When the misrepresentation was discovered, Bartholomew did not acknowledge error or correct the record. Instead, she characterized the situation as a \"misunderstanding.\" This explanation is not credible given her background: approximately ten years as an Assistant District Attorney in Moore County, where she achieved one of the highest conviction rates for sexual assault in the state; appointment by Governor Roy Cooper as a District Court Judge; specialized training by the U.S. Secret Service in digital evidence and by UNC experts in evidence interpretation in child abuse and sexual assault cases; certification as a Criminal Justice Instructor; and training in evidence-based prosecution methods. A prosecutor with this level of experience and specialization does not \"misunderstand\" whether sperm evidence exists in a case she is prosecuting. She knows the difference between a positive serological result and a negative one. She knows the difference between individualizing DNA and a profile that matches hundreds of thousands of men. The \"misunderstanding\" explanation is not a mistake. It is a post-hoc rationalization for a deliberate misrepresentation designed to coerce a plea.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The lie during plea negotiations is directly tied to the Happel coaching incident and the Exhibit 4 authentication failure. All three events reflect the same prosecutorial disposition: to use the tools of the courtroom — witness testimony, electronic evidence, forensic claims — in ways that the record does not support, and to rely on procedural leniency when those tools are challenged. The \"misunderstanding\" explanation is the connective tissue: it reveals a prosecutor who expects to be forgiven for overreach because the system is designed to protect her from consequences.")] }),

      // SECTION IX
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("IX. THE JURY'S VERDICT AS INDIRECT CORROBORATION")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The jury acquitted Benjamin Allen of first-degree forcible rape by a vote of 12-0. The jury hung on the lesser charge of second-degree forcible rape. This verdict pattern is consistent with a jury that rejected the most serious allegation — the one most dependent on the coached \"fear of witnesses\" and \"freeze\" narrative — but was unable to reach consensus on a lesser-included offense where the evidence was thinner and the legal standards less distinct. The acquittal on the primary charge is, in effect, a jury rejection of the manufactured testimony that the prosecution had spent years building.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The hung jury on the lesser charge does not validate the prosecution's case. It reflects the difficulty of achieving unanimity when the evidence is compromised and the witness has been coached. A prosecutor who has manufactured testimony has not strengthened the State's case; she has created a fragile foundation that may sustain a mistrial or a split verdict but cannot sustain a unanimous conviction on the primary charge.")] }),

      // SECTION X
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("X. LEGAL AND ETHICAL CONCLUSIONS")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The Happel incident, the Exhibit 4 authentication failure, the DeMarco statement distortion, the illustrative photo rulings, and the plea negotiation misrepresentation are not separate scandals. They are a single prosecutorial strategy executed across multiple stages of the case: investigation, charging, plea negotiation, trial preparation, and trial itself. Each stage featured the same pattern — evidence manipulated, objections overruled, and witnesses coached — and each stage was met with the same institutional failure: no remedial action, no investigation, no accountability.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The court's failure to act was not a mistake. It was a choice. The court chose to treat witness coaching as a credibility issue rather than an ethical crisis. It chose to overrule authentication objections and admit evidence the record could not support. It chose to permit a prosecutor who had misrepresented forensic evidence during plea negotiations to continue unfettered, and to accept her explanation of \"misunderstanding\" without inquiry. It chose to leave the State Bar's incomplete file untouched. And it chose to permit a prosecutor who had been previously investigated for misconduct in the same case to continue without consequence.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("That choice has consequences. It sends a message to prosecutors that witness coaching will be tolerated so long as the witness can be sworn and the trial can proceed. It sends a message that authentication objections will be overruled and hearsay concerns will be brushed aside when the State needs to fill gaps in its narrative. It sends a message that misrepresentation during plea negotiations can be explained away as \"misunderstanding\" when the prosecutor's experience makes the lie undeniable. And it sends a message to the public that the integrity of the fact-finding process is subordinate to the efficiency of the docket and the protection of prosecutorial power.")] }),

      // SECTION XI
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("XI. REQUESTED RELIEF AND RECOMMENDATIONS")] }),
      new Paragraph({ spacing: { after: 120 }, children: [new TextRun("Based on the foregoing, the following relief is appropriate and necessary:")] }),

      new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "Referral to the North Carolina State Bar", bold: true }), new TextRun(" for formal investigation of ADA Tiffany Bartholomew under N.C. RPC 3.3, 3.4, 3.8, and 8.4, based on the sworn testimony of Steven Happel, the Exhibit 4 authentication failure, the DeMarco statement distortion, and the plea negotiation misrepresentation.")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "Judicial referral", bold: true }), new TextRun(" of the trial judge to the North Carolina Judicial Standards Commission for failure to report known prosecutorial misconduct, for overruling authentication and hearsay objections without adequate foundation, and for failure to take appropriate remedial action when misconduct was brought to the court's attention under oath.")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "District Attorney review", bold: true }), new TextRun(" of all cases prosecuted by ADA Bartholomew during her tenure, with particular attention to cases involving witness preparation, lobby or hallway conversations with witnesses, late-stage narrative shifts in witness testimony, conditional admission of electronic evidence, and plea negotiations involving forensic misrepresentations.")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: "Preservation of the record", bold: true }), new TextRun(" ensuring that the Happel colloquy transcript, the forensic linguistic analysis, the Exhibit 4 foundation hearings, the DeMarco statement recordings, and all exhibits documenting the coaching allegation and authentication failures are preserved as part of the official court record and made available to any future disciplinary or appellate proceeding.")] }),
      new Paragraph({ numbering: { reference: "numbers", level: 0 }, spacing: { after: 200 }, children: [new TextRun({ text: "Public transparency", bold: true }), new TextRun(" requiring the Lee County Clerk of Court and the North Carolina Administrative Office of the Courts to maintain and publish a complete index of all complaints, investigations, and disciplinary actions related to this case, including the Happel coaching allegation, the Exhibit 4 authentication failure, the DeMarco statement distortion, and the State Bar's prior inaction.")] }),

      // SECTION XII
      new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("XII. CONCLUSION")] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The Happel incident is not a story about what happened during a trial. It is a story about what the system permitted to happen and then chose to ignore. A witness came forward under oath. He reported that the prosecutor had tried to shape his testimony and the complainant's testimony before the jury ever sat. The court heard him, thanked him, and sent him to the stand. The State Bar had already seen the prosecutor's file and done nothing. The system worked exactly as designed: it protected the process from disruption, and it protected the prosecutor from accountability.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The defendant was acquitted of the primary charge. That acquittal is a testament to the jury's ability to see through manufactured testimony. But acquittal is not the same as justice. Justice requires that the process be clean, that the witnesses be uncoached, that the evidence be properly authenticated, that the prosecutors be honest in their representations to the court and to defendants during plea negotiations, and that the officers of the court be held to the standards they impose on everyone else. None of those things happened in this case.")] }),

      new Paragraph({ spacing: { after: 200 }, children: [new TextRun("The Happel incident remains, in the record, as a documented coaching attempt with no consequence, no investigation, and no accountability. Exhibit 4 was admitted over objection, with the State failing to satisfy the very condition the court imposed for its admission. DeMarco's statement was distorted in the affidavit, and the illustrative photos were admitted over hearsay and authentication objections. The ADA lied about sperm evidence during plea negotiations and called it a misunderstanding. The system protected the process from disruption. It protected the prosecutor from accountability. And it left the defendant to wonder whether justice is anything more than a word we use to describe the outcome when the machinery of the state decides to stop grinding.")] }),
    ]
  }],
  tables: []
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("D:\\Web_Page\\pages-main\\documents\\Happel_Coaching_No_Remedial_Action_Updated.docx", buffer);
  console.log("Updated document created successfully.");
});
