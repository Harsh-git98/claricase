import React from "react";

// The Security Practices content
const securityContent = [
    { title: "1. About ClariCase", content: "ClariCase is an AI-powered legal assistant designed to simplify complex legal documents. We help students, researchers, and professionals quickly understand lengthy cases with clear summaries, key insights, and visual mind maps that save hours of analysis." },

    { title: "2. Our Mission", content: "To make law more accessible by transforming dense legal information into easy-to-understand, actionable knowledge for everyone — from first-year law students to practicing attorneys." },

    { title: "3. Our Vision", content: "To become the most intelligent and trusted legal comprehension platform globally, empowering a future where legal understanding is no longer a barrier to justice, education, or innovation." },

    { title: "4. What We Do", content: "We automate legal reading workflows: summarization, issue spotting, precedent mapping, and knowledge extraction — helping users stay efficient, informed, and ahead." },

    { title: "5. Why We Exist", content: "Legal research can be overwhelming. Hours spent reading and analyzing a single case often affects productivity and decision-making. ClariCase reduces that workload to minutes, without compromising on depth or accuracy." },

    { title: "6. Who We Serve", content: "Law students, legal researchers, litigators, paralegals, and anyone who needs fast clarity on legal texts — from case judgments to complex filings." },

    { title: "7. Our Technology", content: "Powered by cutting-edge AI, including natural language understanding and knowledge graphs, ClariCase breaks down legal complexities with precision and context awareness." },

    { title: "8. Data Responsibility", content: "We treat legal data with confidentiality. User documents are handled securely with strict access controls and encrypted storage, while adhering to compliance best practices." },

    { title: "9. Continuous Improvement", content: "Our platform learns and evolves constantly. We incorporate user feedback, new legal datasets, and AI advancements to keep improving context accuracy and feature reliability." },

    { title: "10. Values", content: "Accuracy, trust, accessibility, and innovation drive everything we build. We believe every user deserves the highest clarity when dealing with the law." },

    { title: "11. Transparency", content: "We openly communicate how our technology works and continually validate our system against real-world legal needs to ensure quality and fairness." },

    { title: "12. Community & Collaboration", content: "We collaborate with legal educators, professionals, and early adopters to refine ClariCase’s capabilities and support wider legal education initiatives." },

    {
  "title": "13. Founded by",
  "content": "<section style='line-height: 1.6;'> <h3><strong>Founder — Harsh Ranjan</strong></h3><p>Harsh Ranjan founded <strong>ClariCase</strong> to democratize legal understanding through human-centered and ethical AI. As a passionate engineer, he focuses on bridging technology and justice to empower students, researchers, and legal practitioners worldwide.</p><h4>Professional Profiles</h4><p>connect here:</p><ul><strong><li>LinkedIn: <a href='https://www.linkedin.com/in/harshrjn/' target='_blank'>linkedin.com/in/harshrjn/</a></li><li>GitHub: <a href='https://github.com/Harsh-git98' target='_blank'>github.com/Harsh-git98</a></li><li>Product Hunt Maker: <a href='https://www.producthunt.com/@harsh_git98' target='_blank'>producthunt.com/@harsh_git98</a></li><li>Portfolio Website: <a href='https://harshranjan.onrender.com/' target='_blank'>https://harshranjan.onrender.com/</a></li></strong></ul><h4>Contact</h4><p>Open to feedback, partnerships, and academic collaborations:</p><p/><strong>Email: <a href='mailto:shriharshranjangupta@gmail.com'>shriharshranjangupta@gmail.com</a></p></strong> </section>"
}
];

export default function SecurityPracticesPopup({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative space-y-4"
                onClick={(e) => e.stopPropagation()}
            >
                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
                        aria-label="Close"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}

                <h1 className="text-3xl font-bold">About Us</h1>
                <div className="h-0.5 bg-gray-100 my-4"></div>

                {/* <div className="mb-6 space-y-2">
                    <h2 className="text-xl font-semibold">Overview</h2>
                    <p className="text-gray-700">ClariCase takes the confidentiality, integrity, and availability of data seriously. We maintain technical and organizational measures designed to protect user data and to reduce security risks.</p>
                </div> */}

                {securityContent.map((section, index) => (
                    <section key={index} className="space-y-2">
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                        <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: section.content }}></p>
                    </section>
                ))}
            </div>
        </div>
    );
}