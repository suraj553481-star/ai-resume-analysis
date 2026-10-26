// =====================================================
// AI RESUME ANALYZER - COMPLETE SCRIPT.JS
// =====================================================


// =====================================================
// GLOBAL VARIABLES
// =====================================================

let selectedTemplate = "professional";

window.jobMatches = [];


// =====================================================
// MENU
// =====================================================

function toggleMenu() {

    const menu = document.getElementById("navMenu");

    if (menu) {
        menu.classList.toggle("open");
    }

}


// =====================================================
// CLOSE MOBILE MENU AFTER CLICK
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const navLinks = document.querySelectorAll("#navMenu a");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            const menu = document.getElementById("navMenu");

            if (menu) {
                menu.classList.remove("open");
            }

        });

    });

});


// =====================================================
// PDF.JS WORKER
// =====================================================

if (typeof pdfjsLib !== "undefined") {

    pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

}


// =====================================================
// FILE SELECT
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const resumeInput =
        document.getElementById("resume");

    const fileName =
        document.getElementById("fileName");


    if (!resumeInput) return;


    resumeInput.addEventListener("change", function () {

        if (!this.files || !this.files.length) {

            if (fileName) {
                fileName.textContent = "";
            }

            return;
        }


        const file = this.files[0];


        if (fileName) {

            fileName.textContent =
                "Selected: " + file.name;

        }

    });

});


// =====================================================
// EXTRACT PDF TEXT
// =====================================================

async function extractPDFText(file) {

    if (typeof pdfjsLib === "undefined") {

        throw new Error(
            "PDF.js library not loaded."
        );

    }


    const arrayBuffer =
        await file.arrayBuffer();


    const pdf =
        await pdfjsLib.getDocument({
            data: arrayBuffer
        }).promise;


    let text = "";


    for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
    ) {

        const page =
            await pdf.getPage(pageNumber);


        const content =
            await page.getTextContent();


        const pageText =
            content.items
                .map(function (item) {
                    return item.str;
                })
                .join(" ");


        text += pageText + "\n";

    }


    return text;

}


// =====================================================
// FIND SKILLS
// =====================================================

function findSkills(text) {

    const skillsList = [

        "python",
        "java",
        "javascript",
        "html",
        "css",
        "sql",
        "mysql",
        "c++",
        "c",
        "machine learning",
        "deep learning",
        "artificial intelligence",
        "ai",
        "data science",
        "data analysis",
        "nlp",
        "natural language processing",
        "react",
        "node.js",
        "git",
        "github",
        "excel",
        "power bi",
        "tableau"

    ];


    const lowerText =
        text.toLowerCase();


    const detected = [];


    skillsList.forEach(function (skill) {

        if (
            lowerText.includes(skill)
        ) {

            detected.push(skill);

        }

    });


    return detected;

}


// =====================================================
// FIND EDUCATION
// =====================================================

function findEducation(text) {

    const lower =
        text.toLowerCase();


    if (
        lower.includes("b.tech") ||
        lower.includes("btech") ||
        lower.includes("bachelor of technology")
    ) {

        return "B.Tech / Bachelor of Technology";

    }


    if (
        lower.includes("b.e") ||
        lower.includes("bachelor of engineering")
    ) {

        return "Bachelor of Engineering";

    }


    if (
        lower.includes("m.tech") ||
        lower.includes("mtech")
    ) {

        return "M.Tech";

    }


    if (
        lower.includes("diploma")
    ) {

        return "Diploma";

    }


    if (
        lower.includes("12th") ||
        lower.includes("hsc")
    ) {

        return "12th / HSC";

    }


    if (
        lower.includes("10th") ||
        lower.includes("ssc")
    ) {

        return "10th / SSC";

    }


    return "Education not detected";

}


// =====================================================
// FIND EXPERIENCE
// =====================================================

function findExperience(text) {

    const lower =
        text.toLowerCase();


    const match =
        lower.match(
            /(\d+(?:\.\d+)?)\s*\+?\s*years?/i
        );


    if (match) {

        return match[1] + " years";

    }


    if (
        lower.includes("fresher") ||
        lower.includes("fresh graduate")
    ) {

        return "Fresher";

    }


    if (
        lower.includes("internship") ||
        lower.includes("intern")
    ) {

        return "Internship experience";

    }


    return "Experience not detected";

}


// =====================================================
// FIND NAME
// =====================================================

function findName(text) {

    const lines =
        text
            .split("\n")
            .map(function (line) {
                return line.trim();
            })
            .filter(function (line) {
                return line.length > 2;
            });


    for (let line of lines) {

        const clean =
            line
                .replace(
                    /[^a-zA-Z .]/g,
                    ""
                )
                .trim();


        const words =
            clean.split(/\s+/);


        if (
            words.length >= 2 &&
            words.length <= 4 &&
            clean.length < 50
        ) {

            return clean;

        }

    }


    return "Name not detected";

}


// =====================================================
// FIND EMAIL
// =====================================================

function findEmail(text) {

    const match =
        text.match(
            /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i
        );


    return match
        ? match[0]
        : "Email not detected";

}


// =====================================================
// FIND PHONE
// =====================================================

function findPhone(text) {

    const match =
        text.match(
            /(?:\+91[\s-]?)?[6-9]\d{9}/
        );


    return match
        ? match[0]
        : "Phone not detected";

}


// =====================================================
// FIND PROJECTS
// =====================================================

function findProjects(text) {

    const lower =
        text.toLowerCase();


    if (
        lower.includes("project") ||
        lower.includes("projects")
    ) {

        return "Projects detected";

    }


    return "No projects detected";

}


// =====================================================
// FIND CERTIFICATIONS
// =====================================================

function findCertifications(text) {

    const lower =
        text.toLowerCase();


    const certifications = [];


    if (
        lower.includes("certification")
    ) {

        certifications.push(
            "Certification"
        );

    }


    if (
        lower.includes("certificate")
    ) {

        certifications.push(
            "Certificate"
        );

    }


    if (
        lower.includes("nptel")
    ) {

        certifications.push(
            "NPTEL"
        );

    }


    return certifications.length
        ? certifications.join(", ")
        : "No certifications detected";

}


// =====================================================
// JOB DATABASE
// =====================================================

const jobDatabase = [

    {
        name: "AI / Machine Learning Engineer",

        icon: "🤖",

        category: "AI / ML",

        description:
            "Build intelligent applications using Artificial Intelligence, Machine Learning, Python and NLP techniques.",

        skills: [
            "python",
            "machine learning",
            "deep learning",
            "artificial intelligence",
            "nlp",
            "data science"
        ]

    },


    {
        name: "Java Software Developer",

        icon: "💻",

        category: "Software",

        description:
            "Develop software applications, backend systems and database-driven solutions using Java and related technologies.",

        skills: [
            "java",
            "sql",
            "mysql",
            "html",
            "css",
            "javascript"
        ]

    },


    {
        name: "Data Analyst",

        icon: "📊",

        category: "Data",

        description:
            "Analyze datasets, identify useful patterns and create meaningful business insights using modern data tools.",

        skills: [
            "python",
            "sql",
            "mysql",
            "excel",
            "power bi",
            "data analysis"
        ]

    }

];


// =====================================================
// SMART JOB MATCHING
// =====================================================

function calculateJobMatches(skills) {

    return jobDatabase.map(function (job) {

        let matched = 0;


        job.skills.forEach(function (skill) {

            if (
                skills.includes(skill)
            ) {

                matched++;

            }

        });


        const percentage =
            Math.round(
                (matched / job.skills.length) * 100
            );


        return {

            ...job,

            percentage: percentage,

            matchedSkills:
                job.skills.filter(function (skill) {
                    return skills.includes(skill);
                }),

            missingSkills:
                job.skills.filter(function (skill) {
                    return !skills.includes(skill);
                })

        };

    }).sort(function (a, b) {

        return b.percentage - a.percentage;

    });

}


// =====================================================
// MATCH SCORE
// =====================================================

function calculateScore(skills) {

    if (!skills || skills.length === 0) {

        return 35;

    }


    if (skills.length >= 7) {

        return 95;

    }


    return Math.min(
        90,
        40 + skills.length * 7
    );

}


// =====================================================
// ANALYZE RESUME
// =====================================================

async function analyzeResume() {

    const input =
        document.getElementById("resume");


    const result =
        document.getElementById("result");


    const score =
        document.getElementById("matchScore");


    if (!input || !result) {

        return;

    }


    if (
        !input.files ||
        !input.files.length
    ) {

        result.innerHTML = `
            <p class="empty">
                ⚠️ Please upload your resume first.
            </p>
        `;

        return;

    }


    const file =
        input.files[0];


    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();


    if (
        extension === "doc" ||
        extension === "docx"
    ) {

        result.innerHTML = `
            <p class="empty">
                📄 DOC/DOCX selected.
                <br><br>
                Please upload a PDF resume for analysis.
            </p>
        `;

        return;

    }


    if (
        extension !== "pdf"
    ) {

        result.innerHTML = `
            <p class="empty">
                ❌ Please upload a PDF resume.
            </p>
        `;

        return;

    }


    if (score) {

        score.textContent = "...";

    }


    result.innerHTML = `

        <div style="text-align:center;padding:30px">

            <div style="font-size:40px">
                🧠
            </div>

            <h3>
                Reading Resume...
            </h3>

            <p>
                Extracting text and detecting skills
            </p>

        </div>

    `;


    try {

        const text =
            await extractPDFText(file);


        if (
            !text.trim()
        ) {

            throw new Error(
                "No text found in PDF"
            );

        }


        const skills =
            findSkills(text);


        const education =
            findEducation(text);


        const experience =
            findExperience(text);


        const name =
            findName(text);


        const email =
            findEmail(text);


        const phone =
            findPhone(text);


        const projects =
            findProjects(text);


        const certifications =
            findCertifications(text);


        window.jobMatches =
            calculateJobMatches(skills);


        const match =
            calculateScore(skills);


        if (score) {

            score.textContent =
                match + "%";

        }


        // =========================================
        // RESULT HTML
        // =========================================

        result.innerHTML = `

            <div class="profile-grid">

                <div class="profile-box">

                    <h4>Candidate Name</h4>

                    <p>
                        ${name}
                    </p>

                </div>


                <div class="profile-box">

                    <h4>Email</h4>

                    <p>
                        ${email}
                    </p>

                </div>


                <div class="profile-box">

                    <h4>Phone</h4>

                    <p>
                        ${phone}
                    </p>

                </div>


                <div class="profile-box">

                    <h4>Education</h4>

                    <p>
                        ${education}
                    </p>

                </div>


                <div class="profile-box">

                    <h4>Experience</h4>

                    <p>
                        ${experience}
                    </p>

                </div>


                <div class="profile-box">

                    <h4>Resume</h4>

                    <p>
                        PDF successfully processed
                    </p>

                </div>

            </div>


            <div
                class="profile-box"
                style="margin-top:18px"
            >

                <h4>
                    Detected Skills
                </h4>

                <div class="chips">

                    ${
                        skills.length

                        ?

                        skills.map(function (skill) {

                            return `
                                <span>
                                    ${skill}
                                </span>
                            `;

                        }).join("")

                        :

                        `
                            <span>
                                No skills detected
                            </span>
                        `
                    }

                </div>

            </div>


            <div
                class="profile-box"
                style="margin-top:12px"
            >

                <h4>
                    Projects
                </h4>

                <p>
                    ${projects}
                </p>

            </div>


            <div
                class="profile-box"
                style="margin-top:12px"
            >

                <h4>
                    Certifications
                </h4>

                <p>
                    ${certifications}
                </p>

            </div>


            <div
                class="profile-box"
                style="margin-top:12px"
            >

                <h4>
                    AI Resume Analysis
                </h4>

                <p>
                    Resume text was successfully
                    extracted. Detected skills,
                    education and experience can
                    now be used for job matching.
                </p>

            </div>


            <div
                class="profile-box"
                style="margin-top:12px"
            >

                <h4>
                    Smart Job Matching
                </h4>

                <p>
                    Jobs are matched according to
                    detected resume skills.
                </p>

                <div class="job-match-list">

                    ${
                        window.jobMatches.map(function (job) {

                            return `

                                <div class="job-match-item">

                                    <div class="job-match-top">

                                        <span>
                                            ${job.icon}
                                            ${job.name}
                                        </span>

                                        <strong>
                                            ${job.percentage}%
                                        </strong>

                                    </div>


                                    <div class="job-match-bar">

                                        <div
                                            style="
                                            width:${job.percentage}%;
                                            "
                                        ></div>

                                    </div>

                                </div>

                            `;

                        }).join("")

                    }

                </div>

            </div>

        `;


        // SHOW DOWNLOAD REPORT BUTTON

        const reportButton =
            document.getElementById(
                "downloadReportBtn"
            );


        if (reportButton) {

            reportButton.style.display =
                "inline-block";

        }


        console.log(
            "Resume text:",
            text
        );


    }

    catch (error) {

        console.error(
            "Resume analysis error:",
            error
        );


        if (score) {

            score.textContent = "--";

        }


        result.innerHTML = `

            <p class="empty">

                ❌ Unable to read this PDF.

                <br><br>

                Make sure the PDF contains
                selectable text.

                <br><br>

                Error:
                ${error.message}

            </p>

        `;

    }

}


// =====================================================
// SKILL GAP
// =====================================================

function getSkillGap(jobName) {

    const matchedJob =
        window.jobMatches.find(function (item) {

            return item.name === jobName;

        });


    if (!matchedJob) {

        return {
            matched: [],
            missing: []
        };

    }


    return {

        matched:
            matchedJob.matchedSkills || [],

        missing:
            matchedJob.missingSkills || []

    };

}

// =====================================================
// LEARNING RECOMMENDATIONS
// =====================================================

function getLearningRecommendations(
    missingSkills
) {

    const courses = {

        "python":
            "Learn Python fundamentals & problem solving",

        "java":
            "Learn Java programming & OOP",

        "javascript":
            "Learn JavaScript & DOM",

        "html":
            "Learn HTML5 & semantic web design",

        "css":
            "Learn CSS3 & responsive web design",

        "sql":
            "Learn SQL queries & database concepts",

        "mysql":
            "Learn MySQL database management",

        "c":
            "Learn C programming fundamentals",

        "c++":
            "Learn C++ & object-oriented programming",

        "machine learning":
            "Learn Machine Learning algorithms",

        "deep learning":
            "Learn Neural Networks & Deep Learning",

        "artificial intelligence":
            "Learn Artificial Intelligence fundamentals",

        "ai":
            "Learn Artificial Intelligence concepts",

        "data science":
            "Learn Data Science & statistics",

        "data analysis":
            "Learn Data Analysis with Python",

        "nlp":
            "Learn Natural Language Processing",

        "natural language processing":
            "Learn NLP techniques",

        "react":
            "Learn React.js & component development",

        "node.js":
            "Learn Node.js backend development",

        "git":
            "Learn Git version control",

        "github":
            "Learn GitHub & project collaboration",

        "excel":
            "Learn Advanced Excel & data analysis",

        "power bi":
            "Learn Power BI dashboards",

        "tableau":
            "Learn Tableau data visualization"

    };


    return missingSkills.map(function (skill) {

        return courses[
            skill.toLowerCase()
        ] || `Learn ${skill}`;

    });

}


// =====================================================
// JOB DETAILS - IMPORTANT
// =====================================================
function jobDetails(jobName) {

    console.log(
        "View Details clicked:",
        jobName
    );


    const modal =
        document.getElementById(
            "jobModal"
        );


    const content =
        document.getElementById(
            "jobModalContent"
        );


    if (!modal || !content) {

        alert(
            "Job Details modal not found in HTML."
        );

        return;

    }


    const job =
        jobDatabase.find(function (item) {

            return item.name === jobName;

        });


    if (!job) {

        alert(
            "Job details not found."
        );

        return;

    }


    const skillGap =
        getSkillGap(jobName);


    const recommendations =
        getLearningRecommendations(
            skillGap.missing
        );


    let matchPercentage = 0;


    const matchedJob =
        window.jobMatches.find(function (item) {

            return item.name === jobName;

        });


    if (matchedJob) {

        matchPercentage =
            matchedJob.percentage;

    }


    content.innerHTML = `

        <h2 class="job-modal-title">

            ${job.icon}
            ${job.name}

        </h2>


        <span class="job-modal-tag">

            ${job.category}

        </span>


        <div class="job-modal-section">

            <h4>
                📝 Job Description
            </h4>

            <p>
                ${job.description}
            </p>

        </div>


        <div class="job-modal-section">

            <h4>
                🛠️ Required Skills
            </h4>

            <div class="job-modal-skills">

                ${
                    job.skills.map(function (skill) {

                        const hasSkill =
                            skillGap.matched.includes(
                                skill
                            );


                        return `

                            <span
                                style="
                                opacity:${hasSkill ? "1" : "0.6"};
                                "
                            >
                                ${hasSkill ? "✓ " : ""}
                                ${skill}
                            </span>

                        `;

                    }).join("")

                }

            </div>

        </div>


        <div class="job-modal-match">

            <div class="job-modal-match-top">

                <span>
                    🎯 Resume Match
                </span>

                <strong>
                    ${matchPercentage}%
                </strong>

            </div>


            <div class="job-modal-match-bar">

                <div
                    style="
                    width:${matchPercentage}%;
                    "
                ></div>

            </div>

        </div>


        <div class="job-modal-section">

            <h4>
                ✅ Your Matching Skills
            </h4>

            <div class="job-modal-skills">

                ${
                    skillGap.matched.length

                    ?

                    skillGap.matched.map(function (skill) {

                        return `
                            <span>
                                ✓ ${skill}
                            </span>
                        `;

                    }).join("")

                    :

                    `
                        <p>
                            No matching skills detected yet.
                        </p>
                    `
                }

            </div>

        </div>


        <div class="job-modal-section">

            <h4>
                📚 Skills To Learn
            </h4>

            ${
                skillGap.missing.length

                ?

                `
                    <ul>
                        ${
                            recommendations.map(
                                function (item) {

                                    return `
                                        <li>
                                            ${item}
                                        </li>
                                    `;

                                }
                            ).join("")
                        }
                    </ul>
                `

                :

                `
                    <p>
                        🎉 All required skills detected.
                    </p>
                `
            }

        </div>

    `;


    // OPEN MODAL

    modal.classList.add(
        "active"
    );


    document.body.style.overflow =
        "hidden";


    // Update URL safely

    try {

        history.pushState(
            {
                page: "job",
                modal: true
            },
            "",
            "#job"
        );

    }

    catch (error) {

        console.log(
            "History API unavailable"
        );

    }

}


// =====================================================
// CLOSE JOB MODAL
// =====================================================

function closeJobModal() {

    const modal =
        document.getElementById(
            "jobModal"
        );


    if (!modal) return;


    modal.classList.remove(
        "active"
    );


    document.body.style.overflow =
        "";


    if (
        window.location.hash === "#job"
    ) {

        try {

            history.back();

        }

        catch (error) {

            console.log(error);

        }

    }

}


// =====================================================
// CLICK OUTSIDE MODAL TO CLOSE
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "jobModal"
            );


        if (!modal) return;


        if (
            event.target === modal
        ) {

            closeJobModal();

        }

    }
);

// =====================================================
// ESC KEY CLOSE
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            closeJobModal();

        }

    }
);

// =====================================================
// BROWSER BACK BUTTON
// =====================================================

window.addEventListener(
    "popstate",
    function () {

        const modal =
            document.getElementById(
                "jobModal"
            );


        if (modal) {

            modal.classList.remove(
                "active"
            );

        }


        document.body.style.overflow =
            "";

    }
);


// =====================================================
// RESUME BUILDER - LIVE PREVIEW
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const fields = [

            {
                input: "resumeName",
                output: "previewName",
                defaultText: "Your Name"
            },

            {
                input: "resumeRole",
                output: "previewRole",
                defaultText: "Job Title"
            },

            {
                input: "resumeEducation",
                output: "previewEducation",
                defaultText:
                    "Your education will appear here."
            },

            {
                input: "resumeSkills",
                output: "previewSkills",
                defaultText:
                    "Your skills will appear here."
            },

            {
                input: "resumeProjects",
                output: "previewProjects",
                defaultText:
                    "Your projects will appear here."
            },

            {
                input: "resumeExperience",
                output: "previewExperience",
                defaultText:
                    "Your experience will appear here."
            },

            {
                input: "resumeObjective",
                output: "previewObjective",
                defaultText:
                    "Your career objective will appear here."
            }

        ];


        fields.forEach(function (item) {

            const input =
                document.getElementById(
                    item.input
                );


            const output =
                document.getElementById(
                    item.output
                );


            if (!input || !output) return;


            input.addEventListener(
                "input",
                function () {

                    output.textContent =
                        input.value.trim()
                        ||
                        item.defaultText;

                }
            );

        });


        updateContactPreview();


        [
            "resumeEmail",
            "resumePhone",
            "resumeLocation"
        ].forEach(function (id) {

            const input =
                document.getElementById(id);


            if (input) {

                input.addEventListener(
                    "input",
                    updateContactPreview
                );

            }

        });

    }
);

// =====================================================
// CONTACT PREVIEW
// =====================================================

function updateContactPreview() {

    const email =
        document.getElementById(
            "resumeEmail"
        );


    const phone =
        document.getElementById(
            "resumePhone"
        );


    const location =
        document.getElementById(
            "resumeLocation"
        );


    const output =
        document.getElementById(
            "previewContact"
        );


    if (!output) return;


    const values = [];


    if (
        email &&
        email.value.trim()
    ) {

        values.push(
            email.value.trim()
        );

    }


    if (
        phone &&
        phone.value.trim()
    ) {

        values.push(
            phone.value.trim()
        );

    }


    if (
        location &&
        location.value.trim()
    ) {

        values.push(
            location.value.trim()
        );

    }


    output.textContent =
        values.length
        ? values.join(" | ")
        : "Email | Phone | Location";

}



// =====================================================
// CHANGE TEMPLATE
// =====================================================

function changeTemplate(template) {

    selectedTemplate =
        template;


    const preview =
        document.getElementById(
            "resumePreview"
        );


    if (!preview) return;


    preview.classList.remove(
        "template-professional",
        "template-modern",
        "template-developer",
        "template-creative",
        "template-ats"
    );


    preview.classList.add(
        "template-" + template
    );


    console.log(
        "Selected template:",
        template
    );

}

// =====================================================
// DOWNLOAD RESUME PDF
// =====================================================

async function downloadResumePDF() {

    const resume =
        document.getElementById(
            "resumePreview"
        );


    if (!resume) {

        alert(
            "Resume preview not found."
        );

        return;

    }


    if (
        typeof html2canvas === "undefined"
    ) {

        alert(
            "html2canvas library not loaded."
        );

        return;

    }


    if (
        typeof window.jspdf === "undefined"
    ) {

        alert(
            "jsPDF library not loaded."
        );

        return;

    }


    try {

        const canvas =
            await html2canvas(
                resume,
                {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: "#ffffff"
                }
            );


        const imgData =
            canvas.toDataURL(
                "image/png"
            );


        const {
            jsPDF
        } = window.jspdf;


        const pdf =
            new jsPDF(
                "p",
                "mm",
                "a4"
            );


        const pageWidth =
            pdf.internal.pageSize.getWidth();


        const pageHeight =
            pdf.internal.pageSize.getHeight();


        const margin = 8;
const imgWidth =
            pageWidth -
            margin * 2;


        const imgHeight =
            (
                canvas.height *
                imgWidth
            ) /
            canvas.width;


        let heightLeft =
            imgHeight;


        let position =
            margin;


        pdf.addImage(
            imgData,
            "PNG",
            margin,
            position,
            imgWidth,
            imgHeight
        );


        heightLeft -=
            pageHeight -
            margin * 2;


        while (
            heightLeft > 0
        ) {

            position =
                heightLeft -
                imgHeight +
                margin;


            pdf.addPage();


            pdf.addImage(
                imgData,
                "PNG",
                margin,
                position,
                imgWidth,
                imgHeight
            );


            heightLeft -=
                pageHeight -
                margin * 2;

        }


        const nameInput =
            document.getElementById(
                "resumeName"
            );


        let fileName =
            "AI-Resume";


        if (
            nameInput &&
            nameInput.value.trim()
        ) {

            fileName =
                nameInput.value
                    .trim()
                    .replace(
                        /\s+/g,
                        "-"
                    );

        }


        pdf.save(
            fileName +
            "-Resume.pdf"
        );


    }

    catch (error) {

        console.error(error);

        alert(
            "Unable to generate Resume PDF."
        );

    }

}
// =====================================================
// DOWNLOAD ANALYSIS REPORT
// =====================================================

function downloadReport() {

    if (
        typeof window.jspdf === "undefined"
    ) {

        alert(
            "jsPDF library not loaded."
        );

        return;

    }


    if (
        !window.jobMatches ||
        !window.jobMatches.length
    ) {

        alert(
            "Please analyze a resume first."
        );

        return;

    }


    const {
        jsPDF
    } = window.jspdf;


    const pdf =
        new jsPDF();


    const name =
        document.querySelector(
            ".profile-grid .profile-box p"
        );


    const match =
        document.getElementById(
            "matchScore"
        );


    pdf.setFontSize(20);

    pdf.text(
        "AI Resume Analysis Report",
        20,
        20
    );


    pdf.setFontSize(12);


    pdf.text(
        "Candidate Name: " +
        (
            name
                ? name.textContent.trim()
                : "Not detected"
        ),
        20,
        35
    );
pdf.text(
        "Resume Match: " +
        (
            match
                ? match.textContent
                : "--"
        ),
        20,
        45
    );


    pdf.setFontSize(15);


    pdf.text(
        "Recommended Jobs",
        20,
        65
    );


    let y = 78;


    window.jobMatches.forEach(
        function (job, index) {

            pdf.setFontSize(11);


            pdf.text(
                (
                    index + 1
                ) +
                ". " +
                job.name,
                20,
                y
            );


            pdf.text(
                "Match: " +
                job.percentage +
                "%",
                30,
                y + 8
            );


            y += 20;


            if (
                y > 270
            ) {

                pdf.addPage();

                y = 20;

            }

        }
    );


    pdf.save(
        "AI-Resume-Analysis.pdf"
    );

}

// =====================================================
// PAGE LOAD CHECK
// =====================================================

window.addEventListener(
    "load",
    function () {

        console.log(
            "AI Resume Analyzer loaded successfully."
        );


        console.log(
            "PDF.js:",
            typeof pdfjsLib
        );


        console.log(
            "jsPDF:",
            typeof window.jspdf
        );


        console.log(
            "html2canvas:",
            typeof html2canvas
        );

    }
);
// =====================================================
// JOB DETAILS - FIXED VERSION
// =====================================================

function jobDetails(jobName) {

    console.log("JOB DETAILS:", jobName);

    const modal = document.getElementById("jobModal");
    const content = document.getElementById("jobModalContent");

    if (!modal || !content) {
        alert("Job modal HTML not found!");
        return;
    }

    let job = null;

    if (jobName === "AI / Machine Learning Engineer") {

        job = {
            name: "AI / Machine Learning Engineer",
            icon: "🤖",
            category: "AI / ML",
            description:
                "Build intelligent applications using Artificial Intelligence, Machine Learning, Python and NLP.",
            skills: [
                "Python",
                "Machine Learning",
                "Deep Learning",
                "NLP",
                "Data Science"
            ]
        };

    }

    else if (jobName === "Java Software Developer") {

        job = {
            name: "Java Software Developer",
            icon: "💻",
            category: "Software",
            description:
                "Develop software applications, backend systems and database-driven solutions using Java and databases.",
            skills: [
                "Java",
                "SQL",
                "MySQL",
                "HTML",
                "CSS"
            ]
        };

    }

    else if (jobName === "Data Analyst") {

        job = {
            name: "Data Analyst",
            icon: "📊",
            category: "Data",
            description:
                "Analyze datasets and create useful business insights using Python, SQL and data tools.",
            skills: [
                "Python",
                "SQL",
                "Excel",
                "Power BI",
                "Data Analysis"
            ]
        };

    }

    else {
        alert("Job not found!");
        return;
    }


    // -----------------------------------------
    // GET MATCH DATA
    // -----------------------------------------

    let match = 0;
    let matchedSkills = [];
    let missingSkills = [];

    if (
        window.jobMatches &&
        Array.isArray(window.jobMatches)
    ) {

        const found =
            window.jobMatches.find(function (item) {
                return item.name === jobName;
            });

        if (found) {

            match = found.percentage || 0;

            matchedSkills =
                found.matchedSkills || [];

            missingSkills =
                found.missingSkills || [];

        }
    }
    // -----------------------------------------
    // MODAL CONTENT
    // -----------------------------------------

    content.innerHTML = `

        <h2 style="
            margin-top:0;
            margin-bottom:10px;
        ">
            ${job.icon} ${job.name}
        </h2>


        <div style="
            display:inline-block;
            padding:6px 12px;
            border-radius:20px;
            background:#eef2ff;
            margin-bottom:20px;
            font-size:13px;
        ">
            ${job.category}
        </div>


        <div style="
            margin-bottom:20px;
        ">

            <h3>📝 Job Description</h3>

            <p>
                ${job.description}
            </p>

        </div>


        <div style="
            margin-bottom:20px;
        ">

            <h3>🛠️ Required Skills</h3>

            <div>

                ${
                    job.skills.map(function(skill) {

                        return `
                            <span style="
                                display:inline-block;
                                padding:7px 10px;
                                margin:4px;
                                border-radius:15px;
                                background:#f1f5f9;
                                font-size:13px;
                            ">
                                ${skill}
                            </span>
                        `;

                    }).join("")
                }

            </div>

        </div>


        <div style="
            padding:15px;
            border-radius:12px;
            background:#f8fafc;
            margin-bottom:20px;
        ">

            <div style="
                display:flex;
                justify-content:space-between;
                margin-bottom:8px;
            ">

                <strong>
                    🎯 Resume Match
                </strong>

                <strong>
                    ${match}%
                </strong>

            </div>


            <div style="
                width:100%;
                height:10px;
                background:#e5e7eb;
                border-radius:10px;
                overflow:hidden;
            ">

                <div style="
                    width:${match}%;
                    height:100%;
                    background:#2563eb;
                    border-radius:10px;
                "></div>

            </div>

        </div>

          <div style="
            margin-bottom:20px;
        ">

            <h3>✅ Matching Skills</h3>

            ${
                matchedSkills.length

                ?

                matchedSkills.map(function(skill) {

                    return `
                        <span style="
                            display:inline-block;
                            padding:7px 10px;
                            margin:4px;
                            border-radius:15px;
                            background:#dcfce7;
                        ">
                            ✓ ${skill}
                        </span>
                    `;

                }).join("")

                :

                "<p>No matching skills detected.</p>"
            }

        </div>


        <div>

            <h3>📚 Skills To Learn</h3>

            ${
                missingSkills.length

                ?

                `
                <ul>
                    ${
                        missingSkills.map(function(skill) {
                            return `
                                <li style="
                                    margin-bottom:8px;
                                ">
                                    Learn ${skill}
                                </li>
                            `;
                        }).join("")
                    }
                </ul>
                `

                :

                `
                    <p>
                        🎉 All required skills detected.
                    </p>
                `
            }

        </div>

    `;

    // -----------------------------------------
    // FORCE OPEN MODAL
    // -----------------------------------------

    modal.style.display = "flex";

    modal.style.position = "fixed";

    modal.style.top = "0";

    modal.style.left = "0";

    modal.style.right = "0";

    modal.style.bottom = "0";

    modal.style.width = "100%";

    modal.style.height = "100%";

    modal.style.zIndex = "999999";

    modal.style.background = "rgba(0,0,0,0.65)";

    modal.style.alignItems = "center";

    modal.style.justifyContent = "center";

    modal.style.padding = "20px";

    modal.style.boxSizing = "border-box";

    document.body.style.overflow = "hidden";


    const modalBox =
        modal.querySelector(".job-modal-content");


    if (modalBox) {

        modalBox.style.display = "block";

        modalBox.style.position = "relative";

        modalBox.style.width = "100%";

        modalBox.style.maxWidth = "650px";

        modalBox.style.maxHeight = "90vh";

        modalBox.style.overflowY = "auto";

        modalBox.style.background = "#ffffff";

        modalBox.style.borderRadius = "18px";

        modalBox.style.padding = "25px";

        modalBox.style.boxSizing = "border-box";

    }

}


// =====================================================
// CLOSE JOB MODAL
// =====================================================

function closeJobModal() {

    const modal =
        document.getElementById("jobModal");

    if (!modal) return;

    modal.style.display = "none";

    document.body.style.overflow = "";

}

// =====================================================
// CLICK OUTSIDE MODAL
// =====================================================

document.addEventListener("click", function(event) {

    const modal =
        document.getElementById("jobModal");

    if (!modal) return;

    if (event.target === modal) {

        closeJobModal();

    }

});


// =====================================================
// ESC CLOSE
// =====================================================

document.addEventListener("keydown", function(event) {

    if (event.key === "Escape") {

        closeJobModal();

    }

});
// =====================================================
// DIRECT RESUME PDF DOWNLOAD
// =====================================================

function downloadResumePDF() {

    console.log("Download Resume clicked");


    if (
        typeof window.jspdf === "undefined"
    ) {

        alert(
            "jsPDF is not loaded. Check internet connection."
        );

        return;

    }


    const jsPDF =
        window.jspdf.jsPDF;


    const pdf =
        new jsPDF();


    function getValue(id, fallback) {

        const el =
            document.getElementById(id);

        if (
            el &&
            el.value &&
            el.value.trim()
        ) {

            return el.value.trim();

        }

        return fallback;

    }


    const name =
        getValue(
            "resumeName",
            "Your Name"
        );


    const role =
        getValue(
            "resumeRole",
            "Job Title"
        );


    const email =
        getValue(
            "resumeEmail",
            "Email not provided"
        );


    const phone =
        getValue(
            "resumePhone",
            "Phone not provided"
        );


    const location =
        getValue(
            "resumeLocation",
            "Location not provided"
        );


    const education =
        getValue(
            "resumeEducation",
            "Education not provided"
        );


    const skills =
        getValue(
            "resumeSkills",
            "Skills not provided"
        );


    const projects =
        getValue(
            "resumeProjects",
            "Projects not provided"
        );


    const experience =
        getValue(
            "resumeExperience",
            "Experience not provided"
        );


    const objective =
        getValue(
            "resumeObjective",
            "Career objective not provided"
        );


    let y = 20;


    // NAME

    pdf.setFontSize(22);

    pdf.text(
        name,
        20,
        y
    );


    y += 10;


    // ROLE

    pdf.setFontSize(14);

    pdf.text(
        role,
        20,
        y
    );


    y += 10;


    // CONTACT

    pdf.setFontSize(10);

    pdf.text(
        email + " | " +
        phone + " | " +
        location,
        20,
        y
    );


    y += 15;


    function section(title, text) {

        if (y > 270) {

            pdf.addPage();

            y = 20;

        }


        pdf.setFontSize(14);

        pdf.text(
            title,
            20,
            y
        );


        y += 7;


        pdf.setFontSize(10);


        const lines =
            pdf.splitTextToSize(
                text,
                170
            );


        pdf.text(
            lines,
            20,
            y
        );


        y +=
            lines.length * 5 +
            10;

    }


    section(
        "CAREER OBJECTIVE",
        objective
    );


    section(
        "EDUCATION",
        education
    );


    section(
        "SKILLS",
        skills
    );


    section(
        "PROJECTS",
        projects
    );


    section(
        "EXPERIENCE",
        experience
    );


    pdf.save(
        name.replace(
            /\s+/g,
            "-"
        ) +
        "-Resume.pdf"
    );

}

// =====================================================
// DOWNLOAD ANALYSIS PDF
// =====================================================

function downloadReport() {

    console.log(
        "Download Analysis clicked"
    );


    if (
        typeof window.jspdf === "undefined"
    ) {

        alert(
            "jsPDF is not loaded."
        );

        return;

    }


    if (
        !window.jobMatches ||
        !window.jobMatches.length
    ) {

        alert(
            "Please analyze your resume first."
        );

        return;

    }


    const jsPDF =
        window.jspdf.jsPDF;


    const pdf =
        new jsPDF();


    let y = 20;


    pdf.setFontSize(20);

    pdf.text(
        "AI Resume Analysis Report",
        20,
        y
    );

y += 15;


    const score =
        document.getElementById(
            "matchScore"
        );


    pdf.setFontSize(12);

    pdf.text(
        "Resume Match: " +
        (
            score
                ? score.textContent
                : "--"
        ),
        20,
        y
    );


    y += 15;


    pdf.setFontSize(16);

    pdf.text(
        "Recommended Jobs",
        20,
        y
    );


    y += 12;


    window.jobMatches.forEach(
        function(job, index) {

            if (y > 270) {

                pdf.addPage();

                y = 20;

            }


            pdf.setFontSize(12);


            pdf.text(
                (index + 1) +
                ". " +
                job.name,
                20,
                y
            );


            y += 7;


            pdf.setFontSize(10);


            pdf.text(
                "Match: " +
                job.percentage +
                "%",
                30,
                y
            );


            y += 10;


            pdf.text(
                "Matched skills: " +
                (
                    job.matchedSkills.length
                        ? job.matchedSkills.join(", ")
                        : "None"
                ),
                30,
                y
            );


            y += 7;


            pdf.text(
                "Missing skills: " +
                (
                    job.missingSkills.length
                        ? job.missingSkills.join(", ")
                        : "None"
                ),
                30,
                y
            );


            y += 15;

        }
    );


    pdf.save(
        "AI-Resume-Analysis.pdf"
    );

}
// ======================================================
// DOWNLOAD RESUME PDF - PRESERVE LIVE DESIGN
// ======================================================

async function downloadResumePDF() {

    const resume = document.getElementById("resumePreview");

    if (!resume) {
        alert("Resume preview not found.");
        return;
    }

    // Check html2canvas
    if (typeof html2canvas === "undefined") {
        alert("PDF library not loaded. Please refresh the page.");
        return;
    }

    // Check jsPDF
    if (!window.jspdf || !window.jspdf.jsPDF) {
        alert("jsPDF library not loaded. Please refresh the page.");
        return;
    }

    try {

        // Disable download button temporarily
        const downloadButton =
            document.querySelector(".download-btn");

        if (downloadButton) {
            downloadButton.disabled = true;
            downloadButton.innerText = "Generating PDF...";
        }

        // Make sure browser finishes rendering
        await new Promise(resolve => setTimeout(resolve, 500));

        // Capture the EXACT visible resume design
        const canvas = await html2canvas(resume, {

            scale: 2,

            useCORS: true,

            allowTaint: true,

            backgroundColor: "#ffffff",

            logging: false,

            imageTimeout: 15000,

            scrollX: 0,

            scrollY: 0,

            windowWidth: resume.scrollWidth,

            windowHeight: resume.scrollHeight

        });

        const imgData = canvas.toDataURL(
            "image/jpeg",
            0.95
        );

        // A4 size
        const {
            jsPDF
        } = window.jspdf;

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "mm",
            format: "a4"
        });

        const pageWidth = 210;
        const pageHeight = 297;

        const margin = 8;

        const availableWidth =
            pageWidth - (margin * 2);

        const imageHeight =
            (canvas.height * availableWidth) /
            canvas.width;

        // ------------------------------------------------
        // MULTI PAGE PDF
        // ------------------------------------------------

        let heightLeft = imageHeight;

        let position = margin;

        pdf.addImage(
            imgData,
            "JPEG",
            margin,
            position,
            availableWidth,
            imageHeight
        );

        heightLeft -=
            (pageHeight - margin * 2);

        while (heightLeft > 0) {

            position =
                heightLeft -
                imageHeight +
                margin;

            pdf.addPage();

            pdf.addImage(
                imgData,
                "JPEG",
                margin,
                position,
                availableWidth,
                imageHeight
            );

            heightLeft -=
                (pageHeight - margin * 2);
        }

        // ------------------------------------------------
        // FILE NAME
        // ------------------------------------------------

        const nameInput =
            document.getElementById("resumeName");

        let name =
            nameInput
                ? nameInput.value.trim()
                : "Resume";

        if (!name) {
            name = "Resume";
        }

        name = name.replace(
            /[^a-zA-Z0-9_-]/g,
            "_"
        );

        pdf.save(
            name + "_Resume.pdf"
        );

        // Restore button

        if (downloadButton) {

            downloadButton.disabled = false;

            downloadButton.innerHTML =
                "📥 Download Resume PDF";
        }

    }

    catch (error) {

        console.error(
            "PDF ERROR:",
            error
        );

        alert(
            "PDF generate करताना problem आला. Page refresh करून पुन्हा try करा."
        );
const downloadButton =
            document.querySelector(".download-btn");

        if (downloadButton) {

            downloadButton.disabled = false;

            downloadButton.innerHTML =
                "📥 Download Resume PDF";
        }
    }
}
// ================= DOWNLOAD RESUME PDF =================

async function downloadResumePDF() {

    const resume = document.getElementById("resumePreview");

    if (!resume) {
        alert("Resume preview not found!");
        return;
    }

    const name =
        document.getElementById("resumeName")?.value.trim()
        || "My_Resume";

    const downloadBtn =
        document.querySelector(".download-btn");

    try {

        if (downloadBtn) {
            downloadBtn.disabled = true;
            downloadBtn.innerText = "Generating PDF...";
        }

        // Make sure preview is visible
        resume.style.display = "block";

        // Wait for browser rendering
        await new Promise(resolve =>
            setTimeout(resolve, 500)
        );

        const canvas =
            await html2canvas(resume, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false
            });

        const { jsPDF } = window.jspdf;

        const pdf =
            new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

        const pageWidth = 210;
        const pageHeight = 297;

        const margin = 10;

        const imgWidth =
            pageWidth - (margin * 2);

        const imgHeight =
            (canvas.height * imgWidth) /
            canvas.width;

        let heightLeft = imgHeight;
        let position = margin;

        const imgData =
            canvas.toDataURL(
                "image/jpeg",
                0.95
            );

        // First page
        pdf.addImage(
            imgData,
            "JPEG",
            margin,
            position,
            imgWidth,
            imgHeight
        );

        heightLeft -=
            (pageHeight - margin * 2);

        // Extra pages
        while (heightLeft > 0) {

            position =
                heightLeft -
                imgHeight +
                margin;

            pdf.addPage();

            pdf.addImage(
                imgData,
                "JPEG",
                margin,
                position,
                imgWidth,
                imgHeight
            );

            heightLeft -=
                (pageHeight - margin * 2);
        }

        // Clean filename
        const fileName =
            name
                .replace(/[^a-zA-Z0-9 ]/g, "")
                .trim()
                .replace(/\s+/g, "_");

        pdf.save(
            (fileName || "My_Resume") +
            ".pdf"
        );

    }

    catch (error) {

        console.error(
            "PDF generation error:",
            error
        );

        alert(
            "PDF तयार करताना समस्या आली. पुन्हा प्रयत्न करा."
        );

    }

    finally {

        if (downloadBtn) {

            downloadBtn.disabled = false;

            downloadBtn.innerText =
                "📥 Download Resume PDF";
        }

    }
}

// ================= FAST PDF DOWNLOAD =================

function downloadResumePDF() {

    const { jsPDF } = window.jspdf;

    if (!jsPDF) {
        alert("PDF library not loaded.");
        return;
    }

    const getValue = (id, fallback = "") => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : fallback;
    };

    const name =
        getValue("resumeName", "Your Name");

    const role =
        getValue("resumeRole", "Job Title");

    const email =
        getValue("resumeEmail", "");

    const phone =
        getValue("resumePhone", "");

    const location =
        getValue("resumeLocation", "");

    const education =
        getValue("resumeEducation", "");

    const skills =
        getValue("resumeSkills", "");

    const projects =
        getValue("resumeProjects", "");

    const experience =
        getValue("resumeExperience", "");

    const objective =
        getValue("resumeObjective", "");

    // Create PDF
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
    });

    const pageWidth = 210;
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    let y = 20;

    // ================= HEADER =================

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(24);

    pdf.text(
        name || "Your Name",
        margin,
        y
    );

    y += 9;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(12);

    pdf.text(
        role || "Job Title",
        margin,
        y
    );

    y += 8;

    pdf.setFontSize(9);
const contact =
        [email, phone, location]
        .filter(Boolean)
        .join("  |  ");

    if (contact) {
        pdf.text(contact, margin, y);
        y += 8;
    }

    // Line
    pdf.setLineWidth(0.5);

    pdf.line(
        margin,
        y,
        pageWidth - margin,
        y
    );

    y += 10;

    // ================= SECTION FUNCTION =================

    function addSection(title, text) {

        if (!text) return;

        // New page if necessary
        if (y > 260) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);

        pdf.text(title, margin, y);

        y += 6;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);

        const lines =
            pdf.splitTextToSize(
                text,
                contentWidth
            );

        pdf.text(
            lines,
            margin,
            y
        );

        y +=
            lines.length * 5 + 8;
    }

    // ================= CONTENT =================

    addSection(
        "CAREER OBJECTIVE",
        objective
    );

    addSection(
        "EDUCATION",
        education
    );

    addSection(
        "SKILLS",
        skills
    );

    addSection(
        "PROJECTS",
        projects
    );

    addSection(
        "EXPERIENCE",
        experience
    );
    // ================= FOOTER =================

    pdf.setFontSize(8);

    pdf.text(
        "AI Resume Analyzer",
        margin,
        287
    );

    // ================= SAVE =================

    pdf.save(
        (name || "Resume")
        .replace(/[^a-z0-9]/gi, "_")
        + "_Resume.pdf"
    );
}
