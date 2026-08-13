# Contradiction Sweep — Court_Data Full-Text Index
**Date:** 2026-07-29  |  **Source:** Kilo LanceDB index at `D:\Court_Data\lancedb` (453,720 chunks, 10,490 files)
**Method:** single-pass full-text scan, tooling folders excluded; hits capped at 6 per theme.
**Caveats:** index covers .md/.htm/.json only — raw .txt transcripts (464) and PDFs (1,327) are NOT searchable here. Root-level tooling scripts may appear; disregard `create_skill_readmes.py` hits (skill metadata, not case content).
**Cross-check:** pilot items in `HUMAN_REVIEW_PACKET.md` drew from Freeman, Lauren_Deal, Carmen_Love, and Multiple_or_Unconfirmed source folders — themes below map onto those same records.

---

## Freeman–Carmen Love connection (6 hits)

- **`Step-by-Step Guide to Creating a Comprehensive Strategy Development Plan.md`** (lines 106-121)
  > - Relationships that led to the false arrest. **Carmen** Love as the close family member and James Morrison who was **Carmen** Love’s boyfriend and Peter West whose father works at the Sheriff’s office.  - Impact to public perception if not approved - perception of the legal system's ability or willingness to uncover the truth.  - Meta Platforms, Inc. (Facebook) Records:  - Investigate the types of record…

- **`Court_Additions\MEMGRAPHRAG_USER_GUIDE.md`** (lines 64-94)
  > …chunk text + provenance | Interview transcript paragraph from `D:\Court\...` | | **Fact** | Extracted relation triples | `(Detective **Freeman**, interviewed, **Carmen** Love)` | | **Schema** | Generalized patterns | `(Person, interviewed, Person)` |  At query time, the system combines **vector similarity** (BGE embeddings) with **graph propagation** to rank passages and attached facts. Grok (or the CLI)…

- **`001_Discovery\Note To Attorney Mitchell.md`** (lines 7-22)
  > ### REPLY: Sorry, I think it was unclear. I want every email and text message that reference Ben, Lauren Deal, **Carmen** Love, Jo, Jolynda Adcock, or any other person who has provided information about the case to be preserved by a motion to preserve evidence given to the prosecution. I also want to know why I was held long after my bond had been posted if **Freeman** did not have a warrant for my arrest…

- **`001_Discovery\Note To Attorney Mitchell.md`** (lines 167-168)
  > …er to a bonfire as a reason to stay” to she had “chosen to stay and was invited to a bonfire.” This is because she said she had told **Carmen** she had been invited and had rehearsed that story all day. The officers helped her with it as an officer would see it. Then, when **Freeman** left the hospital to get some sleep so he could go to his brother's wedding, they all agreed, not to mention his coming to…

- **`001_Discovery\Note To Attorney Mitchell.md`** (lines 169-176)
  > This is one of the reasons that I want everything in the trial. I want it all. I want **Carmen** prosecuted if she does not show up this time. I still want to preserve my rights. It was not done at all in the last trial through motion or objection. I want every phone call heard and every word spoken to **Freeman** to touch the ears of every juror.  I want the images I have made without photos entered into…

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 557-564)
  > …ice is a serious breach of legal ethics and potentially obstruction of justice. The friendship between this attorney and Detective  **Freeman** adds another layer of potential corruption to the investigation. Systemic Corruption: The connection between Detective  **Freeman** and the defendant's first attorney, given their history of working cases together, suggests a potential network of improper  rela…


## Undisclosed relationship claims (6 hits)

- **`Step-by-Step Guide to Creating a Comprehensive Strategy Development Plan.md`** (lines 122-139)
  > - Explore the role of Steve Freeman as the lead investigator in the matter.  - Examine the evidence suggesting **undisclosed** personal relationships between Freeman and potential witnesses, including Peter West and James Morrison.  - Understand how these relationships may impact the credibility of the investigation and Freeman's testimony.  - Articulate how each piece of requested information is dire…

- **`001_Discovery\Note To Attorney Mitchell.md`** (lines 43-51)
  > …ements. It is more likely that tunnel vision from the ADA was driven by Detective Freeman due to his connection to the case that was **not disclose**d to the court:  "(1) an error occurred, (2) the error was obvious, (3) the error affected substantial rights, and (4) the error seriously impaired the fairness, integrity, or public reputation of judicial  proceedings." United States v. LaPlante, 714 F.3…

- **`001_Discovery\Lie is a Lie An Argument for Strict Protection Journal of Criminal Law and Criminology Volume 101 Is.md`** (lines 120-123)
  > …ry, after trial of information which had been known to the prosecution but  unknown to the defense.”66 In the first situation, “the **undisclosed** evidence demonstrates that the prosecution’s case  includes  perjured testimony and  that  the  prosecution knew, or should have known, of the perjury.”67  In this scenario, the Court reiterated the materiality  standard established in Giglio: that “a co…

- **`001_Discovery\Lie is a Lie An Argument for Strict Protection Journal of Criminal Law and Criminology Volume 101 Is.md`** (lines 132-135)
  > …laces it in a different category.”75   Therefore, the Court established the materiality standard for this situation as  whether the **undisclosed** evidence “creates a reasonable doubt that did not otherwise exist.”76  The Court in Agurs held that the evidence of the victim’s criminal record did not do so. A  comparison  of  the  materiality  standards  for  each  of  the  three categories of Brady…

- **`001_Discovery\Lie is a Lie An Argument for Strict Protection Journal of Criminal Law and Criminology Volume 101 Is.md`** (lines 157-160)
  > …sel for the defense had  made specific requests for “deals,  promises or inducements” offered to the informants, the Government did **not disclose** the fact that the informants had in fact received payment for their assistance with  the  case  and  that their payment  would  be paid “commensurate  with  services  and information rendered.”  The petitioner eventually learned of these contracts for p…

- **`001_Discovery\Motion - Prospective Trial Management Relief Alleden.docx.md`** (lines 326-333)
  > …sarial scrutiny, so that the verdict—whatever it may be—rests on admissible proof rather than narrative supplementation or material, **undisclosed** shifts in theory.  The Defendant attaches representative exhibits to illustrate the record-based concerns described herein and to provide context for the prospective relief requested.  V. PROSPECTIVE TRIAL MANAGEMENT PROCEDURES  In light of the reco…


## Carmen's claims about knowing Lauren (6 hits)

- **`Court_Additions\Interviews\Carmen Love Interviews Analysis Review.md`** (lines 112-129)
  > Fabricated Details of the Assault and Aftermath: **Carmen** introduces dramatic and unsubstantiated details in Interview 2 that were absent in her initial account. Examples include:  Lauren’s pants being "ripped off and burnt in a bonfire" – proven false as pants were recovered.  Lauren running "naked through the woods" and calling **Carmen** for help – contradicted by timeline and lack of phone possessio…

- **`Court_Additions\Interviews\Carmen Love Interview Analysis.md`** (lines 87-95)
  > - Allen’s interview states he **knew Lauren** through his ex-wife, now in Virginia, suggesting a distant acquaintance, not a close relationship.         - Mabel Allen’s letter notes Lauren’s claim of a “position of trust” was based on one Facebook message over five years, contradicting a deep familiarity.     - **Implication**: **Carmen**’s assertion of a strong prior relationship is inconsistent…

- **`Court_Additions\Interviews\Carmen Love Interview Analysis 2.md`** (lines 26-28)
  > | **Carmen**'s Relationship with Lauren            | **Carmen** confirmed that she **knew Lauren**, and said they had known each other for around 15-20 years, as Lauren's family used to live near **Carmen**'s.                                                                                                                                               | | **Carmen**'s Account of the Previous Night       | **Carmen** explai…

- **`Court_Additions\Interviews\Carmen Interview Analysis.md`** (lines 28-30)
  > | **Carmen**'s Relationship with Lauren            | **Carmen** confirmed that she **knew Lauren**, and said they had known each other for around 15-20 years, as Lauren's family used to live near **Carmen**'s.                                                                                                                                               | | **Carmen**'s Account of the Previous Night       | **Carmen** explai…

- **`Court_Additions\Dupes\identity nodeid_1 (2).md`** (lines 69-93)
  > **Carmen**'s desire for an open minded investigation. **Carmen** wants the investigator to approach the case with an open mind not just assuming the defendant's guilt.   identity: nodeid_15  label: **Carmen** Love  **Carmen** continues to add detail to the dramatic scape. She says Lauren came to a path and it led to the road. She says Lauren was scared for her life. Lauren called her mother and stayed on the…

- **`Court_Additions\Motion_Items\Witness Information Carmen Love (7).md`** (lines 115-134)
  > department. The other worked in some capacity for the city but also dated the    family member and witness in this case, **Carmen** Love.            Detail          Context      **Carmen**'s Relationship with Lauren   **Carmen** confirmed that she **knew Lauren**, and                 said they had known each other for around 15-                20 years, as Lauren's family used to live near                 Carme…


## Chain of custody (6 hits)

- **`create_skill_readmes.py`** (lines 84-84)
  > 'Evidence Matrix': 'When exhibits, authentication, hearsay, relevance, **chain of custody**, or linkage to legal elements matter.'

- **`13_Comparative_Case_Research\2022-02-05 Read v Commonwealth Motion for Order Pursuant to Mass. R. Crim. P. 17.md`** (lines 495-505)
  > …marks on O’Keefe’s right arm. It is                                                                   4 A detailed analysis of the **chain of custody** issues relating to the after-the-fact discovery of                  pieces of Ms. Read’s taillight at the crime scene was discussed more fully in Defendant’s Rule                  17 Motion for Complaining Witness’ Phones at p. 11, and is incorpora…

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 325-332)
  > …rred. Missing this evidence can weaken the prosecution's case and also limit the defense's ability to  challenge the allegations.5. **Chain of Custody**Skipped Procedure: The procedure does not mention maintaining a strict **chain of custody**

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 333-340)
  > for the evidence collected, if any was collected after the interviews.Importance: Maintaining an unbroken **chain of custody** is  essential for the admissibility of evidence in court. Any gaps or irregularities can lead to challenges regarding the authenticity  and integrity of the evidence.Legal Framework Response:In a legal defense framework, the attorney would likely focus on the  procedural er…

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 1543-1550)
  > …d from the defendant's  residence. b. Failure to use gloves or evidence bags when collecting items. c. Failure to maintain a proper **chain of custody** for the  collected items, particularly the defendant's pants. d. Failure to thoroughly process the alleged crime scene for DNA or other  forensic evidence. These actions raise concerns about the integrity and admissibility of the evidence under the…

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 1567-1574)
  > …ous doubts about the reliability of Freeman's  testimony and the fairness of the investigation. B. Evidence Collection Practices: • **Chain of Custody**: The lack of proper


## 'No chain of custody exists' statements (6 hits)

- **`Court_Additions\Freeman\'BARTHOLOMEW 07102023 PHOTO OF exhibit (2).md`** (lines 1-23)
  > …FANY MARIE See ’ PHONE VIDEO Cen : a  boo FR - * MOTHER RECORDED  { LIE So OF VICTIM PULLING UP”.  Paik State Published Documents **No chain of custody exists** for this  2 BARTHOLOMEW (07/10/2023 DR KYLE GRIMALDI'S exhibit.  , TIFFANY MARIE cv  5 VL “State. J. 77% Published CoG ~ Documents : **No chain of custody exists** for. this  i oo  BARTHOLOMEW. 07/1022023 a VICTIMS ER MEDICAL | exhibit.  .…

- **`Court_Additions\Freeman\'BARTHOLOMEW 07102023 PHOTO OF exhibit (2).md`** (lines 24-46)
  > BETWEEN BEN AND  LAUREN  02581 ~~ ‘State’. Admitted - ~~ Photo + "**No chain of custody exists** for this ~~  4: Lo BARTHOLOMEW 07/10/2023 copy OF .- -- exhibit. :  | SAE bi © FACEBOOK.  02589 State Published Photo **No chain of custody exists** for this  / 5 BARTHOLOMEW 07/10/2023 PHOTO OF FRONT OF exhibit. -  , TIFFANY MARIE DEFENDANTS HOUSE  a : “State . .'_ ~ Published.” “7. "+" Photo  - = -.…

- **`Court_Additions\Freeman\'BARTHOLOMEW 07102023 PHOTO OF exhibit (2).md`** (lines 47-69)
  > …or this  BARTHOLOMEW 07/10/2023 PHOTO OF KITCHEN exhibit.  , TIFFANY MARIE AND BEDROOM DOOR  02595 “State RE * Publishéd Photo ~.+**No chain of custody exists** for this  pg BARTHOLOMEW 07/10/2023 PHOTO OF. exhibit.  pa 7, TIFFANYMARIE ~:~ =~ ' DEFENDANTS Ce  I EERO FEET BEDROOM, BED, AND _  ba Co BATHROOM DOOR E )  5% State Published Photo **No chain of custody exists** for this  11 -. BARTHOLOM…

- **`Court_Additions\Freeman\'BARTHOLOMEW 07102023 PHOTO OF exhibit (2).md`** (lines 70-93)
  > …14 - BARTHOLOMEW "07/10/2023 . PHOTO OF WOODS ‘exhibit, ’ :  . <TIFFANY MARIE . EEE NEAR DEFENDANTS :  po State Published Photo : **No chain of custody exists** for this  BARTHOLOMEW 07/10/2023 PHOTO OF VICTIMS exhibit.  , TIFFANY MARIE LEFT ARM  Total Count: 102  Printed on 09/14/2023 4:25 PM  ’ Page 2 of 13    u 3 .  Exhibit Log  Case: 19CR051799-520 STATE OF NORTH CAROLINA VS BENJAMIN S…

- **`Court_Additions\Freeman\'BARTHOLOMEW 07102023 PHOTO OF exhibit (2).md`** (lines 94-115)
  > 02605 State Published Photo **No chain of custody exists** for this  9 BARTHOLOMEW 07/10/2023 PHOTO OF VICTIMS exhibit.  , TIFFANY MARIE LEFT FOOT WITH  102618 State +. Published Le ~ ‘Documents I _. "**No chain of custody exists** for this Ee  fo +" BARTHOLOMEW' 07/10/2023". - TW WITNESS. #5 DANIEL exhibit.  ~~, TIFFANYMARIE =~ BE 'LACAMBACAL'S CV Ll Co  2619 State Published Documents No chain of c…

- **`Court_Additions\Freeman\'BARTHOLOMEW 07102023 PHOTO OF exhibit (2).md`** (lines 116-138)
  > …Status Proj. Type Exhibit Flag Custody Custody Detail  Exhibit# Source Date Return / Description Date  02625 State Published Photo **No chain of custody exists** for this  BARTHOLOMEW 07/10/2023 PHOTO OF LAUREN exhibit.  yal , TIFFANY MARIE DEAL'S RIGHT  FOREARM  02626 State” “Published SC Photo TT + ‘No chain of custody: exists for this: .  125. _BARTHOLOMEW. 07/10/2023 - PHOTO OF LAUREN : exh…


## Brady / Giglio material (6 hits)

- **`create_skill_readmes.py`** (lines 141-159)
  > …'chronology_timeline_builder': 'Timeline Tate',         'evidence_matrix_admissibility': 'Evidence Emery',         'discovery_**brady**_**giglio**': 'Discovery Drew',         'transcript_impeachment': 'Impeachment Ira',         'motion_brief_drafting': 'Motion Morgan',         'criminal_defense_strategy': 'Defense Dakota',         'prosecution_case_review': 'Prosecution Parker',         'civil_righ…

- **`Court_Additions\MEMGRAPHRAG_USER_GUIDE.md`** (lines 48-59)
  > …(~3M characters → **4,807 chunks**). That scale is exactly where manual review breaks down and structured memory helps — chronology, **Brady** material, witness statements, motions, and impeachment threads can be queried as a connected graph instead of file-by-file search.

- **`Court_Additions\MEMGRAPHRAG_USER_GUIDE.md`** (lines 199-209)
  > …| Native Python (default) — PyMuPDF, BeautifulSoup, python-docx, email | | Enrich | Tags, entities, relationships from court rules (**Brady**, witnesses, case numbers) | | Metadata | Title, author, dates, page count where available | | Resumable records | `output_root/records/<hash>.json` — safe to interrupt and restart |

- **`Court_Additions\MEMGRAPHRAG_USER_GUIDE.md`** (lines 274-277)
  > ### Why it matters  OpenIE extracts facts from **exact chunk text**. Typos and glued words (`thedefendant`, `**Brady**v`) produce garbage triples. Cleaning text **before** corpus prep improves fact quality without changing legal meaning (prompts forbid fact invention).

- **`Court_Additions\MEMGRAPHRAG_USER_GUIDE.md`** (lines 309-332)
  > …--output D:\Court_Data\memgraphrag_legal\legal-test\subset.jsonl `   --documents 3 `   --min-extensions 2 `   --prefer-tags theme:**brady**-**giglio** ```  Tag-aware flags (require enriched JSONL):  - `--require-tags document:transcript` - `--min-tag-prefixes 2` - `--require-tag-coverage` — fail if diversity not met  Point `legal-test` indexing at this subset before running production.  ---

- **`Court_Additions\MEMGRAPHRAG_USER_GUIDE.md`** (lines 450-465)
  > ### Via Grok (MCP)  Grok calls `memgraph_query` automatically when you ask record-grounded questions (chronology, witnesses, **Brady**, motions, testimony).  Example questions:  - "What does the record say about Detective Freeman's interviews?" - "Which documents mention **Brady** or **Giglio** disclosure?" - "What is the timeline of events around the search warrant?"  **Rules for grounded answers:**  1. Cite…


## Statements to Freeman (6 hits)

- **`001_Discovery\Note To Attorney Mitchell.md`** (lines 161-161)
  > …a pretty big thing not to remember and have to ask Tiffany to find out what happened. Unfortunately for her, Tiffany was an idiot. I **told Freeman** what happened in the interview. She gave them to DeMarco. I

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 1239-1246)
  > …Never claimed I pushed or shoved her Testifies to me pushing her onto the bed She said I was  always forward with her testified and **told Freeman** that I was never foprward with her She stated she had bruises on her wrist from  being held down there were no bruises ever identified She never mentioned running toward a house for help Later claims she did  Isaac Haines never asked if anyhting was co…

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 1399-1406)
  > that she did not want this to happen. That's also what she **told Detective** Freeman at the time when she interviewed right afterwards.  (The jury was told not to pay attention to what she previously said since none of it matched) The initial report to the triage  nurse was that she had been raped. That's also what she reported to Ms. Bredderman, who was doing the sexual assault examination and  g…

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 1664-1671)
  > …rmen had already left the bar   video evidence – time 12:08:22 before Lauren Deal had even approached us. This is what Steve Happel **told Detective** Freeman during  his phone conversation, “ Yeah ,we just we we showed up at Schoolys. We were just chilling. It's kind of like well there was really

- **`15_Media_and_Podcasts\Podcasts\hello everyone and thank you thank you thank you for joining us this afternoon this morning this aft.md`** (lines 169-172)
  > …you didn't get the look of the shooter you told that to the police officer investigating it right uh detective smith right oh yeah i **told detective** smith that okay well now you've just established that smith knew

- **`02_Digital_Evidence_and_Text_Messages\Text_Messages\2019-10-19 Text Messages Tiffany Allen Lauren Incident Evidence Notes.md`** (lines 353-386)
  > …e them to the porch while telling her not to touch them. Frank called when Freeman was there but Freeman refused to talk to him. **Freeman said** for him to call the DA. Frank could have explained then that he was handling it but again  it wouldnt fit the narrative they were building to get paid. When you read my explanation keep in mind that I didnt have access to her medical


## Timeline conflict language (6 hits)

- **`Step-by-Step Guide to Creating a Comprehensive Strategy Development Plan.md`** (lines 5-34)
  > …e rules to the specific facts.  **Conclusion:** Reach a reasoned conclusion.  - Embrace **Critical Thinking** to identify biases and **inconsisten**cies.  - Employ **Causal Chain Reasoning** to trace the sequence of events and their legal implications  - Reflect the analytical depth of Justices like Marshall and Brandeis in the analysis.  - Organize data logically and coherently.  - Ensure the documen…

- **`Step-by-Step Guide to Creating a Comprehensive Strategy Development Plan.md`** (lines 78-81)
  > - **Critical Thinking:** Underpins all analyses, aiming to identify and address biases or **inconsisten**cies.  End State: creation of a comprehensive, accurate, and legally sound SUBPOENA DUCES TECUM document. This meticulous approach reflects the analytical depth and legal acumen reminiscent of esteemed Justices, aiming for justice through thorough and insightful legal work.

- **`create_skill_readmes.py`** (lines 141-159)
  > …'legal_team_orchestrator': 'Orchestrator Oliver (Lead)',         'legal_research_verification': 'Research Rex',         'chronology_**timeline**_builder': '**Timeline** Tate',         'evidence_matrix_admissibility': 'Evidence Emery',         'discovery_brady_giglio': 'Discovery Drew',         'transcript_impeachment': 'Impeachment Ira',         'motion_brief_drafting': 'Motion Morgan',         'criminal…

- **`create_skill_readmes.py`** (lines 83-83)
  > 'Chronology and **Timeline** Builder': 'When facts come from multiple documents, messages, transcripts, logs, pleadings, or orders.'

- **`create_skill_readmes.py`** (lines 86-86)
  > 'Impeachment Analysis': 'When testimony, interviews, prior statements, or reports must be compared for **contradict**ions or omissions.'

- **`Legal_Team_Casebook\casebook_plan.md`** (lines 28-42)
  > …claims, and document provenance. 3. Add a `notes/03_legal_issues.md` file with questions like:    - What are the strongest witness **contradict**ions?    - Which filings support motion strategy?    - Where are the key evidentiary gaps?  ## Phase 4 — Preserve and share  1. Keep the casebook workspace separate from the raw Court_Data tree. 2. Document the exact source paths used for every extra…


## Facebook / Meta records (6 hits)

- **`Step-by-Step Guide to Creating a Comprehensive Strategy Development Plan.md`** (lines 106-121)
  > …e.  - Impact to public perception if not approved - perception of the legal system's ability or willingness to uncover the truth.  - **Meta Platforms**, Inc. (**Facebook**) Records:  - Investigate the types of records that the defendant seeks from **Meta Platforms**, Inc. (**Facebook**). These include basic subscriber information, account content, friend lists, messages, posts, photos, videos, group memberships,…

- **`Step-by-Step Guide to Creating a Comprehensive Strategy Development Plan.md`** (lines 160-176)
  > - Consider the privacy and data protection concerns associated with obtaining personal information and account content from **Meta Platforms**, Inc. (**Facebook**).  - Research the legal and ethical considerations surrounding the handling of sensitive user data in the context of criminal investigations.  - Research which laws apply at the Federal level and at the state level in California where Meta is he…

- **`001_Discovery\Note To Attorney Mitchell.md`** (lines 102-105)
  > The method of coverage isn’t from traditional methods. **Facebook** has caused the rapid distribution of valid news and false allegations. The distribution of family members of those related to this case touches every corner of Lee County and into surrounding jurisdictions, especially Harnett. While the length of time since the false allegation would favor the defense, the ability for information to t…

- **`001_Discovery\Ethics Chapter 2.md`** (lines 113-115)
  > appreciate that their use of social media platforms, such as LinkedIn or **Facebook**, even as a private citizen, may give rise to potential conflicts of interest issues and motions to recuse. For this reason, even lawyers who serve as ad hoc, special, part-time, or private prosecutors should refrain from bragging about prosecutorial assignments or exploits on law firm websites for the purposes of mar…

- **`13_Comparative_Case_Research\2022-02-05 Read v Commonwealth Motion for Order Pursuant to Mass. R. Crim. P. 17.md`** (lines 506-517)
  > …you the most miserable person. It’s a promise.” (Affidavit of Alan J. Jackson at ¶19;               Exhibit R, Tim Albert **Facebook** Post.) Tim Albert is a

- **`13_Comparative_Case_Research\2022-02-05 Read v Commonwealth Motion for Order Pursuant to Mass. R. Crim. P. 17.md`** (lines 518-529)
  > …are not above the law.               If Tim Albert has no problem publicly threatening and intimidating witnesses on               **Facebook** because his brother, Brian Albert, was accused of being implicated in               O’Keefe’s murder, it’s terrifying to imagine what the Alberts are capable of               behind closed doors. As of the filing date of this Motion, six months after the…


## Rape kit / SANE exam (6 hits)

- **`001_Discovery\Motion - Prospective Trial Management Relief Alleden.docx.md`** (lines 46-61)
  > …on her specialized training and experience. That training, funded by public resources, exists to ensure:  Competent evaluation of **SANE** examinations;  Accurate interpretation of DNA evidence;  Understanding of the forensic significance of absent injury; and  Ethical restraint where objective evidence does not corroborate allegations.  Her conduct must be evaluated against that profession…

- **`001_Discovery\Benjamin Allen Motion for Prospective Trial-Management and Evidentiary Safeguards in Advance of Retrial.md`** (lines 18-20)
  > …ant contends did not appear in the contemporaneous police account, did not appear in the structured medical history reflected in the **SANE** materials, and was not grounded in contemporaneous documentation introduced through a qualified witness. On retrial, the Court should require the State to establish the evidentiary foundation for any such testimony outside the jury’s presence before it is offere…

- **`001_Discovery\Motion - Prospective Trial Management Relief Alleden.docx.md`** (lines 112-125)
  > …“Freeze” Narrative  The complaining witness’s testimony evolved during the trial to include a “freeze” response only after:  The **SANE** examination failed to corroborate violent force;  Expected injury patterns were absent; and  Forensic evidence did not support the State’s theory.

- **`001_Discovery\Motion - Prospective Trial Management Relief Alleden.docx.md`** (lines 126-131)
  > The “freeze” narrative is absent from contemporaneous police statements, absent from the **SANE** medical interview, and absent from the **SANE** nurse’s testimony and documentation. The **SANE** protocol is specifically designed to capture dissociation or immobility; none was reported.  Under North Carolina law, later statements do not clarify earlier ones—they compete with them. State v. Mabry, 269 N.C. A…

- **`001_Discovery\Motion - Prospective Trial Management Relief Alleden.docx.md`** (lines 132-171)
  > …nsistent with force  Record Evidence  No bruising to wrists, thighs, hips, or shoulders  No genital injury documented by ER or **SANE** consistent with force  No forensic corroboration of the mechanics described  Notably, tonic immobility or lack of voluntary pelvic relaxation would be expected to increase, not decrease, the likelihood of vaginal abrasions or tearing. The absence of such an…

- **`001_Discovery\Defendants Motion to Preclude 20XX-MM-DD.docx.md`** (lines 46-61)
  > …on her specialized training and experience. That training, funded by public resources, exists to ensure:  Competent evaluation of **SANE** examinations;  Accurate interpretation of DNA evidence;  Understanding of the forensic significance of absent injury; and  Ethical restraint where objective evidence does not corroborate allegations.  Her conduct must be evaluated against that profession…


## Bodycam / 911 call (6 hits)

- **`13_Comparative_Case_Research\2023-03-15 Brooklyn DA Conviction Review Unit Prosecutorial Misconduct.md`** (lines 1784-1791)
  > …as for me or not. It isn’t the first time that officers have shown up to my house. They have  come by a couple of times looking for **911 call**ers they couldn’t’ locate due to the scarcity of towers I would assume. One stated that  someone was hiding in a closet but they couldn’t triangulate their position. Another time officers kept calling my daughter’s phone  saying it was a number that had cal…

- **`Court_Additions\Investigation\Lee County Official Report 2019.md`** (lines 31-31)
  > …was for me or not. It isn’t the first time that officers have shown up to my house. They have come by a couple of times looking for **911 call**ers they couldn’t’ locate due to the scarcity of towers I would assume. One stated that someone was hiding in a closet but they couldn’t triangulate their position. Another time officers kept calling my daughter’s phone saying it was a number that had called…

- **`Court_Additions\Dupes\AI_Case_Review_Jury_Argument.md`** (lines 2176-2201)
  > …to the defense, and specify the nature and extent of the concern of loss or destruction of the evidence. For instance, jails and **911 call** centers often have internal policies regarding retention of audio or video recordings, and labs often have policies regarding testing of small samples of materials that are likely to be destroyed in testing. Where possible, obtain and attach to the mot…

- **`Court_Additions\Duplicates\Transparency In Pleas.md`** (lines 285-287)
  > …se of a broad social and political movement for transparent, data-based criminal jus-tice.  The availability of new technology, from **body camera**s and cell phones to big data analytics and social media, has made injustices in the criminal justice  system  more  apparent  to  the  public.   At  the  same  time,  it  has encouraged a broad coalition of activists,142  prosecutors,143  lawmakers,144

- **`Court_Additions\Duplicates\Government Misconduct and Convicting the innocent.md`** (lines 1644-1647)
  > …uch rule exists anywhere in the United  States, but it’s technologically feasible. Officers, for example, could be required to wear **bodycam**s and to turn them on when talking to witnesses. This is, in fact, one aspect of several general police **bodycam** rules that have been proposed to 285 Ashcraft v. Tennessee, 322 U.S.  143 (1944) (footnotes omitted). 286 See infra  XII.2.b.ii(a). The 26 states i…

- **`Court_Additions\Motion_Items\Trial counsel are granted wide latitude in the scope of jury argument, and control of closing argume (2).md`** (lines 3-3)
  > …nce to the defense, and specify the nature and extent of the concern of loss or destruction of the evidence. For instance, jails and **911 call** centers often have internal policies regarding retention of audio or video recordings, and labs often have policies regarding testing of small samples of materials that are likely to be destroyed in testing. Where possible, obtain and attach to the motion an…


## Text messages (6 hits)

- **`Court_Additions\chadwunsch-Re Modification to the Agreement.htm`** (lines 27-27)
  > …s frustrating.  She seems to think that everything I do has a hidden agenda to rob her somehow.  I kinda lost it tonight and wrote a **text message** that I probably shouldn&#39;t have written.  She is an extortionist that is using her children over 2k. Well, that is what I said anyway.  </div><div><br></div><div>I don&#39;t know what I am going to do

- **`Court_Additions\chadwunsch-Re Modification to the Agreement (2).htm`** (lines 27-27)
  > …s frustrating.  She seems to think that everything I do has a hidden agenda to rob her somehow.  I kinda lost it tonight and wrote a **text message** that I probably shouldn&#39;t have written.  She is an extortionist that is using her children over 2k. Well, that is what I said anyway.  </div><div><br></div><div>I don&#39;t know what I am going to do with this van / car thing.  If she isn&#39;t going…

- **`Court_Additions\chadwunsch-Modification to the Agreement (2).htm`** (lines 29-29)
  > …s frustrating.  She seems to think that everything I do has a hidden agenda to rob her somehow.  I kinda lost it tonight and wrote a **text message** that I probably shouldn&#39;t have written.  She is an extortionist that is using her children over 2k. Well, that is what I said anyway.  </div><div><br></div><div>I don&#39;t know what I am going to do with this van / car thing.  If she isn&#39;t going…

- **`Court_Additions\chadwunsch-Re Modification to the Agreement (3).htm`** (lines 27-27)
  > ght and wrote a **text message** that I probably shouldn&#39;t have written.  She is an extortionist that is using her children over 2k. Well, that is what I said anyway.  </div><div><br></div><div>I don&#39;t know what I am going to do with this van / car thing.  If she isn&#39;t going to accept it then what is the point of giving her any of it if she has to move out on March 1st anyway? I am breakin…

- **`Court_Additions\chadwunsch-Modification to the Agreement.htm`** (lines 29-29)
  > …s frustrating.  She seems to think that everything I do has a hidden agenda to rob her somehow.  I kinda lost it tonight and wrote a **text message** that I probably shouldn&#39;t have written.  She is an extortionist that is using her children over 2k. Well, that is what I said anyway.  </div><div><br></div><div>I don&#39;t know what I am going to do with this van / car thing.  If she isn&#39;t going…

- **`Court_Additions\chadwunsch-Modification to the Agreement (3).htm`** (lines 29-29)
  > …s frustrating.  She seems to think that everything I do has a hidden agenda to rob her somehow.  I kinda lost it tonight and wrote a **text message** that I probably shouldn&#39;t have written.  She is an extortionist that is using her children over 2k. Well, that is what I said anyway.  </div><div><br></div><div>I don&#39;t know what I am going to do with this van / car thing.  If she isn&#39;t going…

