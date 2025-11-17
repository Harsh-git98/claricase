import React from "react";

// The Terms of Service content
const termsContent = [
    { title: "1. Agreement to Terms", content: "These Terms of Service ('Terms') govern your access to and use of ClariCase ('Service'). By accessing or using the Service, you agree to be bound by these Terms." },
    { title: "2. Who May Use the Service", content: "You must be at least 16 years old (or older where local law requires) and able to form binding contracts. You may not use the Service if you are barred from receiving services under applicable law." },
    { title: "3. Accounts and Registration", content: "You are responsible for providing accurate information and for maintaining the confidentiality of your account credentials. You agree to notify us of unauthorized use." },
    { title: "4. User Content & License", content: "You retain ownership of the content you upload. By uploading content you grant ClariCase a limited license to store, process, analyze, and generate derived outputs necessary to provide the Service." },
    { title: "5. Acceptable Use & Prohibited Conduct", content: "You agree not to: (a) upload content that infringes third-party rights, (b) use the Service for unlawful purposes, (c) attempt to reverse-engineer, exploit or interfere with the Service, or (d) use the Service to provide legal advice or present results as attorney-client privileged communications." },
    { title: "6. AI Outputs & No Legal Advice", content: "ClariCase provides AI-generated analysis and summaries for informational purposes only. These outputs do not constitute legal advice, attorney-client communications, or a substitute for professional legal counsel. Always consult an attorney for legal advice." },
    { title: "7. Fees & Payments", content: "If you purchase paid features, you agree to the billing terms presented at purchase. Refund and cancellation policies will be posted where applicable." },
    { title: "8. Intellectual Property", content: "ClariCase retains ownership of its platform, code, and AI models. Users retain ownership of their uploaded content. We respect copyrights and will respond to valid DMCA notices where applicable." },
    { title: "9. Disclaimers", content: 'THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.' },
    { title: "10. Limitation of Liability", content: "TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT WILL CLARICASE BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES, OR FOR LOST PROFITS, REVENUES, DATA, OR USE." },
    { title: "11. Indemnification", content: "You agree to indemnify and hold ClariCase harmless from claims arising from your breach of these Terms, your misuse of the Service, or your content." },
    { title: "12. Termination", content: "We may suspend or terminate accounts for violations of these Terms or for inactivity. Termination does not relieve you of obligations that accrued prior to termination." },
    { title: "13. Governing Law & Dispute Resolution", content: "These Terms are governed by the laws of [Insert jurisdiction — e.g., State of New York, India, etc.]. Disputes will be resolved in the courts or via arbitration as set forth here. (Customize to your company’s preferred governing law and forum.)" },
    { title: "14. Modifications", content: "We may change these Terms; material changes will be posted with notice. Continued use after changes constitutes acceptance." },
    { title: "15. Contact", content: 'For questions about these Terms, contact us at <a href="mailto:terms@claricase.example" class="font-bold underline">terms@claricase.example</a>.' }
];

export default function TermsOfServicePopup({ onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div
                className="bg-white rounded-lg shadow-2xl w-full max-w-3xl p-6 md:p-8 max-h-[90vh] overflow-y-auto relative space-y-4"
                onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the card
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

                <h1 className="text-3xl font-bold">Terms of Service</h1>
                <p className="text-sm text-gray-500">Effective date: November 17, 2025</p>
                <div className="h-0.5 bg-gray-100 my-4"></div>

                {termsContent.map((section, index) => (
                    <section key={index} className="space-y-2">
                        <h2 className="text-xl font-semibold">{section.title}</h2>
                        <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: section.content }}></p>
                    </section>
                ))}
            </div>
        </div>
    );
}