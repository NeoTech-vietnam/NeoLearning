# Research: Theory and textbook citation audit

- Query: Preserve supplied Chương 1, 2.1, and 2.3; identify minimum conceptual corrections and a defensible source/page strategy.
- Scope: mixed (supplied Word texts, local course textbook, official publisher/university catalogues).
- Date: 2026-10-04

## Findings

### Files read and applicable specs

- `07_mechatronics_engineering_master_program/03_Philosophy/05_capstone_project/Chương 1.docx`: historical conditions, concept/object/functions, three societal roles, 48 numbered citation notes.
- `.../2.1.docx`: worldview and methodological roles for Vietnam science/technology; eight true footnotes, several long political quotations.
- `.../2.3.docx`: five solution groups, eight bibliography items but no reliable inline mapping.
- `.../Nhóm 10 - Đề cương chi tiết.docx`: teacher-approved TWO chapters; concept must derive from textbook and be footnoted. Do not bring back old three-chapter essay.
- Extracts inspected in `C:/Users/daveb/AppData/Local/Temp/philosophy_synthesis_1004/{Chương 1,2.1,2.3,Nhóm 10 - Đề cương chi tiết}.txt` and `2.1_footnotes.xml`.
- Local `03_resources/02_giao-trinh-triet-hoc_hvch-theo khoi-khtn.pdf`: scanned 226 PDF pages; relevant printed pages visually read below.
- `.trellis/workflow.md` and `.trellis/spec/guides/index.md`: research persisted, sources distinguished from assumptions. No document-specific layer spec exists; Examples backend/frontend code specs do not apply.

### Textbook editions: important mismatch

The supplied notes label a book as 2021 published textbook but predominantly cite compact pagination: definition p39, object p40, roles pp42–47, historical materialism pp126–131. These numbers appear consistent with compact draft/reflow versions; DO NOT carry all 48 exact page numbers into the final document as verified 2021 printed pages.

Primary bibliographic checks:

1. Publisher announcement: [NXB Chính trị quốc gia Sự thật, 2021](https://nxbctqg.org.vn/xuat-ban-bo-giao-trinh-ly-luan-chinh-tri-danh-cho-bac-dai-hoc.html) announces non-specialist textbook planned 496 pages. This establishes edition, not exact content pages.
2. VNU's [10-page preview](https://bookworm.vnu.edu.vn/Trailer/giaotrinhtriethocmaclenin20212d7c0f06-0.T.pdf) actually downloaded and parsed in memory: cover/title identify Bộ Giáo dục và Đào tạo, non-specialist university textbook, Hà Nội 2021; printed CIP p2 gives 496 pages, ISBN 9786045765944. Preview ends at start of chapter 1; it DOES NOT verify definition p39 or other internal citations.
3. [UEH official repository](https://digital.lib.ueh.edu.vn/handle/UEH/62220?mode=full) expressly identifies a 2019 manuscript, distributed by ministry in 2020, split into pp1–59/60–130/131–229/230–274. Accession in2021 is NOT publication year2021. File contents not obtained.
4. [VHU catalogue](https://lib.vhu.edu.vn/DigitalDocument/Detail?fileId=7842&treeId=-1) describes a2021 copy with494 scanned pages; catalogue metadata is not a full-text page check. Its viewer/download goes through access checks.
5. Parent's `textbook2021.pdf` from thuviendientutriethocc500 was parked HTML, not PDF. Search-engine indexed text is insufficient to call this source presently accessible or correctly paginated.

Recommended implementation: use exact verified LOCAL2015 page citations for paraphrased overlapping concepts; preserve group's core sentences where correct. A single consolidated footnote per related paragraph is clearer than retaining48 duplicate bibliography-style notes. For any retained2021 textbook note, omit unverified page numbers and use chapter/section only if that section was independently read; otherwise do not present it as content checked. Avoid transferring whole unverified secondary Marx/Lenin quotations into final bibliography as directly consulted works.

### Verified local2015 citation and page mapping

Exact title on visually inspected title page:

**Bộ Giáo dục và Đào tạo (2015), Giáo trình Triết học (Dùng cho khối không chuyên ngành triết học trình độ đào tạo thạc sĩ, tiến sĩ các ngành khoa học tự nhiên, công nghệ), Nxb. Chính trị quốc gia – Sự thật, Hà Nội.**

Note **thạc sĩ, tiến sĩ**; abbreviated older bibliography may have omitted tiến sĩ.

Throughout scanned book: **zero-based PDF index = printed page −3; one-based PDF page = printed page −2**. E.g. printed131 is PDFpage129. Cite PRINTED page, not viewer page. Title is physicalPDFpage1. Visually checked table of contents is physical222–224 (printed224–226).

| Supplied section / citation cluster | Verified2015 printed page(s) | Source content and action |
|---|---|---|
| Ch1 1.1.1, notes1–4 |111–113| Object: most general laws of nature, human society/history, thought; worldview and methodology to know/change world; unity of materialism/dialectics, theory/practice, scientific/revolutionary character. Use paraphrase anchored here. |
| Ch1 1.1.2, notes5–8 |107| Marx philosophy emerges1840s; capitalist class contradictions and proletarian struggles require theory. Page107 does not enumerate Lyon/Chartist/Silesia dates; retain those only with independently checked history source or omit precise enumeration. |
| Ch1 1.1.3, notes9–13 |108,111| German classical philosophy direct philosophical precursor; p111 distinguishes Marxism's THREE components. Avoid conflating the three sources of Marxism overall with exclusively philosophy. |
| Ch1 1.1.4, notes14–16 |108–109| Energy conservation/conversion, cell theory, Darwin evolution; add1859 chronology caveat below. |
| Ch1 1.1.5, notes17–21 |109–111| Marx/Engels transition, collaboration1844, subsequent development; Lenin stages and works. No need to preserve unverified Lenin Toàn tập page151 as if original consulted. |
| Ch1 1.2.1, notes22–31 |112–113,167–171| General methodology and relationship to concrete science; p168 explicitly warns mechanical application can fail; p171 says guidance is not compulsory adhesion to one philosophy. Preserve limitation, reduce guarantees. |
| Ch1 1.2.2, notes32–39 |143–144,155,167–171| Science's relation to social change; mutual science/philosophy relation; avoids treating historical predictions as empirically proven certainty. Specific contemporaryAI claim is group's application, not textbook quote. |
| Ch1 1.2.3, notes40–48 |129,131,143–144| Relations of production/forces, economic base/superstructure, contemporary role. These pages support conceptual paraphrase, NOT every dated Party congress quotation. Cite official Party text for political chronology. |
| 2.1 worldview definition, existingFN2–3 |156| Definition of worldview as system of views about world, human position and relation to world/self. Remove overlapping1986dictionary quotation unless original examined. |
| 2.1 methodological principles |113,112,167–171| Holistic and historically concrete principles; unity theory/practice; philosophy guides general approach alongside specialized methods. |
| 2.3 opening and2.3.1 |129,131| QHSX concerns ownership, production organization, distribution; laws/public policy belong to superstructure. Do not equate all policy with QHSX. |
| 2.3.2 brain-drain and2.3.5 learning |120| Dialectical negation entails objective development and preservation of viable old elements; reversal of migration alone does not demonstrate law. |

Useful textbook-derived concept sentence, with footnote to2015pp111–113:

> Triết học Mác – Lênin nghiên cứu những quy luật chung nhất của tự nhiên, xã hội và tư duy trên lập trường duy vật biện chứng; qua đó cung cấp cơ sở lý luận về thế giới quan và phương pháp luận cho hoạt động nhận thức và cải tạo thế giới.

This is a **paraphrase**, not a verbatim quotation of the2021 p39 definition. It meets teacher's substantive requirement to derive the concept from a textbook and footnote it. If exact2021 wording is retained, source must be checked first; do not pretend2015 contains precisely identical full formulation about class subject.

### Minimum substantive corrections (preserve surrounding supplied paragraphs)

1. **Darwin timeline** — extract `Chương 1.txt:16–17`, WordP30/P32,1.1.4. Replace “nửa đầu thế kỷ XIX” with “thế kỷ XIX”; replace claim all three enabled initial1840s creation with: “Các thành tựu khoa học tự nhiên thế kỷ XIX góp phần hình thành và củng cố cơ sở khoa học cho thế giới quan duy vật biện chứng. Riêng học thuyết tiến hóa của Darwin, công bố trong Nguồn gốc các loài năm1859, bổ sung căn cứ khoa học cho quá trình phát triển tiếp theo của triết học Mác.” Darwin1859 first-edition primary record: https://darwin-online.org.uk/content/record?itemID=F373 ; first edition publication24/11/1859 confirmed by archival introduction. Also replace “phát triển theo quy luật khách quan từ thấp đến cao” with “biến đổi, phân hóa và thích nghi thông qua các quá trình tự nhiên”; biological evolution is not necessarily a ladder of increasing complexity.

2. **Three theoretical sources** — Ch1P22: “Chủ nghĩa Mác hình thành từ ba nguồn gốc lý luận…; trong đó, triết học cổ điển Đức là nguồn gốc lý luận trực tiếp của triết học Mác.” Preserve explanation of Smith/Ricardo/Saint-Simon/Fourier as wider intellectual background, not dismiss it.

3. **Guarantees of success** — `Chương 1.txt:25,28`, P48/P54: replace “tất yếu sẽ dẫn đến thất bại” with “có thể dẫn đến sai lầm và làm giảm hiệu quả thực tiễn”; “bảo chứng cho sự thành công trong mọi hoạt động” with “điều kiện quan trọng để nâng cao hiệu quả nhận thức và hoạt động thực tiễn”. Source2015p168 expressly allows failure despite philosophical framework.

4. **AI absolute** — `Chương 1.txt:31`,P60: keep contemporary relevance, replace “triết học…chỉ rõ…máy móc không thể…” with “Vận dụng quan điểm về con người như một thực thể xã hội – lịch sử, việc phát triểnAI cần được đặt trong các quan hệ lao động, trách nhiệm và lợi ích xã hội. Khả năng xử lý dữ liệu của một hệ thống kỹ thuật không đồng nghĩa với việc nó có địa vị, trách nhiệm và đời sống xã hội như con người.” Mark as essay's application, not2021p68 proven technical statement. Avoid categorical claims about future machine consciousness.

5. **Broad causal assertions** — `2.1.txt:13`,P12, plus Ch1P68: “Phương pháp luận này cung cấp định hướng để xem xét các bài toán chuyển đổi số, kinh tế tri thức và tự chủ công nghệ. Hiệu quả cụ thể còn phụ thuộc vào năng lực chuyên môn, nguồn lực, thể chế và quá trình kiểm nghiệm.” Preserve emphasis on worldview; do not claim every achieved success empirically caused by philosophy.

6. **Basic science** — `2.1.txt:11`,P10: change “nghiên cứu…không được phép dừng…phải xuất phát…sản xuất” to “Hoạt động nghiên cứu cần kết hợp phát triển tri thức nền tảng với giải quyết nhu cầu thực tiễn; việc chuyển giao và ứng dụng kết quả phải được kiểm nghiệm trong điều kiện cụ thể.” Basic/theoretical research can have long-term rather than immediate production objectives.

7. **QHSX and physical infrastructure** — `2.3.txt:2,5`,P4/P10. Replace “quan hệ sản xuất (cơ chế,chính sách)” with “quan hệ sở hữu, tổ chức quản lý và phân phối trong sản xuất, đồng thời là yêu cầu hoàn thiện thể chế, pháp luật tương ứng”. Replace “nguyên lý cuộc cách mạng trong tư duy là tiền đề cho mọi…” with “yêu cầu đổi mới tư duy quản lý gắn với điều kiện thực tiễn”. Textbook2015p131 defines cơ sở hạ tầng as total relations of production, NOT internet networks, labs or physical facilities. When adding material investment use “hạ tầng kỹ thuật/cơ sở vật chất” and keep concepts separate.

8. **Brain-drain misuse** — `2.3.txt:11`,P19: replace “Vận dụng quy luật phủ định biện chứng để biến…” with “Để hạn chế thất thoát nhân lực và tăng khả năng thu hút, giữ chân nhân tài, cần…”; preserve concrete salary/autonomy/environment policies.

9. **Negation in2.3.5** — `2.3.txt:19–20`,P35/P36: use “quan điểm phát triển, kế thừa có chọn lọc và thống nhất giữa lý luận với thực tiễn”. “tiếp nhận→thích nghi→cải tiến→sáng tạo” is a proposed learning pathway, not automatic proof of law of negation of negation. Retain pathway but avoid “quy trình phủ định biện chứng”. Prefer voluntary/commercial research partnerships and contracts; avoid blanket mandatory local-content requirements portrayed as legally available to allFDI.

10. **Historical congress chronology** — Ch1P70: Đại hộiVI1986 initiates Đổi mới; don't imply label “kinh tế thị trường định hướng XHCN” was fully established in1986. Minimal: “Đại hộiVI(1986) khởi xướng công cuộcĐổi mới, mở đầu quá trình đổi mới tư duy kinh tế và hoàn thiện mô hình phát triển trong các giai đoạn tiếp theo.”

11. **Loaded attribution of motives** — Ch1P64: remove “hòng phủ nhận chủ nghĩa Mác” applied together to Fukuyama/Huntington/Toffler, which lacks a checked source and conflates works/dates. Minimal general paragraph: “Các cách lý giải về phát triển xã hội cần được đối chiếu với điều kiện lịch sử, quan hệ kinh tế và thực tiễn. Theo cách tiếp cận duy vật lịch sử, công nghệ là yếu tố quan trọng nhưng cần được xem xét cùng quan hệ sản xuất và các quan hệ xã hội khác.” Retain discussion of critique without invented author motives.

### Quotations and bibliography consolidation

- Convert48 Ch1 end-of-file notes to true footnotes/consolidated cited paragraphs; bibliography should have ONE entry per actually consulted publication, not48 repeated entries.
- Existing2.1 footnotes are genuinely present but page numbers/wording not verified; preserve note placement when converted to paraphrases, substitute consulted source as needed.
- Source3's quote “kết hợp chặt chẽ cả hai loại tri thức…” is also reproduced in TNU journal2019 https://jst.tnu.edu.vn/jst/article/download/1875/pdf (search-indexed content). Do not attach2021p21 simply because it sounds plausible. Safer paraphrase and cite local2015pp167–171.
- Quotation marks around casual emphases (“Kim chỉ nam”, “Thấu kính”, “Tin”, “đứng trên vai…”) can be removed unless a real direct quotation with a checked origin.
- Unverified page-specific Lenin/Marx/Văn kiện quotations: paraphrase, cite the directly read textbook or official fulltext. Include originals in bibliography only if directly consulted; if retaining secondary quote mark “dẫn theo…” and cite source actually used.
- Nghị quyết57 exact title is “về đột phá phát triển khoa học, công nghệ, đổi mới sáng tạo và chuyển đổi số quốc gia”, dated22/12/2024; draft truncated/changed title should be corrected by policy-source agent.

## Caveats / Not Found

- Full printed2021 textbook body could not be verified from an accessible primary university source in this pass; only its bibliographic front matter was read. No automatic2021-page remapping is trustworthy.
- Local2015 textbook is a different title/edition aimed at master's/doctoral natural-science/technology programs; cite it honestly. Its broad conceptual sections overlap the supplied theory without proving every political quotation/date.
- This research did not inspect full Marx/Lenin collected works, Phrô-lốp1986dictionary, or exactVăn kiệnXIIIprintedp232; do not treat those as independently checked.
- Only research file was written; inputDOCXs and final product were not altered.
