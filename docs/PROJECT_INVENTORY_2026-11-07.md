# Complete GitHub project inventory — 7 November 2026

## Scope and completeness

The authenticated GitHub repository listing for `bkaankaya` returned **13 owned repositories**. The previous portfolio data contained seven projects. This update includes one project entry for every repository, including the personal portfolio itself, rather than selecting a subset.

The independent inventory snapshot is `docs/project-repositories-2026-11-07.json`. The display data is in `lib/portfolio-data.ts`. Every project has at least two distinct gallery frames and descriptive alternative text; ReZero retains its four existing frames, for **28 frames across 13 projects**.

| GitHub repository | Portfolio project | Gallery frames | Source access |
| --- | --- | ---: | --- |
| AI-Receptionist | DoraVoice | 2 | Private |
| Vague- | Vague | 2 | Private |
| QuickScan | QuickScan | 2 | Private |
| T2-Software-Leave-Approval-Application | T2 Leave Approval | 2 | Public |
| STM32_Modbus_DataMonitor | STM32 Data Monitor | 2 | Public |
| CineEmbed-A-Multi-Modal-Unsupervised-Film-Recommendation-System | CineEmbed | 2 | Public |
| White-Wine-Quality-Prediction | White Wine Quality | 2 | Public |
| DNN-Universal-Function-Approximator | Neural Function Approximator | 2 | Public |
| Hospital-Management-System | Hospital Management System | 2 | Public |
| YemekSepetiDapp | YemekSepeti DApp | 2 | Public |
| Software-Persona-JS-Project | Software Persona · Task Manager | 2 | Public |
| ReZero-2D-Game | ReZero 2D Game | 4 | Private |
| bkaankaya.github.io | Personal Portfolio | 2 | Public |

Private source repositories are represented as portfolio projects, with no source-code link that would fail for a public visitor. Public projects link to their exact GitHub repository. Private source code, authentication material and deployment configuration are not part of this site's media assets.

## Media provenance

Identity marks remain in the small project badges. Large previews contain application screens, research figures or explicitly labeled design concepts. `mediaNote` distinguishes these cases in each project dialog.

| Project | Preview provenance |
| --- | --- |
| DoraVoice | Two existing owner-provided design previews; preserved as concepts rather than described as live product captures. |
| Vague | Original representative storefront and product-page concepts, inspired by premium sports-commerce presentation. |
| QuickScan | Teacher dashboard and results-publication screenshots from the private repository; displayed records are seeded demonstration data. |
| T2 Leave Approval | Original compiled React UI with synthetic local account/request data; manager approval table and employee leave-status captures (`t2-manager.jpg`, `t2-employee.jpg`). The preview fixture responses were produced by running the actual Java 21 / Spring Boot 4.0.9 backend against a new in-memory H2 database and making authenticated API requests. |
| STM32 Data Monitor | A source-derived register-protocol diagram plus the native Qt interface loaded from the checked-in `embeddedGui/mainwindow.ui`. No hardware was attached and no sensor measurements are claimed. |
| CineEmbed | An architecture/evaluation figure redrawn from `figures/high-level-architecture.png` and `artifacts/eval/results.json`; plus the original `artifacts/figures/umap/umap_dec_z64_k21_genre.png`. |
| White Wine Quality | Exact stored five-fold cross-validation F1 means/standard deviations from `winequality.ipynb`, and permutation-importance means/standard deviations from `Wine_Quality-Explainable AI(XAI).ipynb`, redrawn for legibility. |
| Neural Function Approximator | A scatter visualization computed from the committed `data/train.csv`, paired with the original `outputs/plots/training_curves.png`. No model was retrained and no hidden-test result is implied. |
| Hospital Management System | Actual checked-in Java Swing `LoginPanel` and `PatientDashboardPanel` components compiled and rendered locally; no database connection, real account or medical record was used. |
| YemekSepeti DApp | Running original frontend with its built-in sample restaurant catalog; no wallet connection, payment or on-chain order. |
| Software Persona | Running task-manager UI with demonstration tasks; overview and edit-dialog captures (`persona-overview.jpg`, `persona-edit.jpg`). |
| ReZero 2D Game | Four existing original gameplay/menu captures from the project's visual QA evidence. |
| Personal Portfolio | Captures of the implemented homepage and complete project archive. |

### Research accuracy

The wine README calls 0.609 a weighted F1 result, but its stored classification report distinguishes positive-class F1 from weighted F1. The portfolio does not repeat that imprecise label. Its comparison figure uses the separately recorded five-fold validation means, including Random Forest F1 **0.571 ± 0.029**.

CineEmbed's diagram names the exact recorded `dec_z64_k21` model. Its NMI values come directly from the versioned JSON, not a simulated dashboard. The DNN data visualization is clearly labeled as raw training-data relationships rather than predictions. The Modbus request bytes and CRC are calculated from the source protocol, with 8N1 described as the demonstration configuration rather than a standards-compliance claim.

## Source revisions inspected

| Repository | Commit |
| --- | --- |
| CineEmbed-A-Multi-Modal-Unsupervised-Film-Recommendation-System | `b094a2262c1a49a88c197b261730c1e0a3e7872e` |
| DNN-Universal-Function-Approximator | `6c93ba3364acb9718de5ef58da674c617e173a5a` |
| Hospital-Management-System | `c19da6e5a4ba489870d605b3cdd9c785ebd0d5f7` |
| STM32_Modbus_DataMonitor | `47455e3c5bb7f7f7ed93e49b5b990ebff48cfb89` |
| Software-Persona-JS-Project | `ad88c113d17788f48bf8ad339fbeeae12b4ac0a5` |
| T2-Software-Leave-Approval-Application | `40779261ab86d308367bc9372111130de8d21856` |
| White-Wine-Quality-Prediction | `f0c0ea6b1c685dda2b8113228d30ed7baac73d06` |
| YemekSepetiDapp | `b5fbd3106584b47c377a42ff71aa219e072b49da` |

The public source checkouts were used for inspection/builds only; no changes were pushed to these project repositories.

## Reproducing the research figures

The optional authoring script `scripts/render-research-previews.py` requires Python with NumPy, pandas and Matplotlib. It adds no frontend/runtime dependency. Pass a directory containing the source checkouts at the revisions above:

```sh
python3 scripts/render-research-previews.py --source-root /path/to/source-checkouts
```

The script writes the two wine figures, DNN dataset analysis, embedded protocol diagram and CineEmbed architecture/evaluation figure to `public/projects/`. Original research artifacts are copied from the source files named in the provenance table. Source repositories, their datasets, local test credentials and temporary capture fixtures are not included in this portfolio.
