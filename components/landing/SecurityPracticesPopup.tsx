import React from "react";

// The Security Practices content
const securityContent = [
    { title: "1. Governance & Roles", content: "We maintain clear security ownership with responsibilities assigned to executive leadership and a security lead (CISO or equivalent). We conduct periodic risk assessments and security reviews." },
    { title: "2. Access Control & Identity", content: "We apply least-privilege access controls, role-based permissions, and require multi-factor authentication (MFA) for administrative accounts. All access to production systems is logged and reviewed." },
    { title: "3. Encryption", content: "We encrypt data in transit (TLS 1.2 or higher) and at rest where supported. Encryption keys are managed securely and rotated per policy." },
    { title: "4. Infrastructure & Hosting", content: "We use reputable cloud providers and maintain hardened configurations, network segmentation, firewalls, and monitoring. We follow secure deployment pipelines and code review practices." },
    { title: "5. Vulnerability Management", content: "We regularly scan for vulnerabilities, apply security patching, and run penetration tests periodically. Critical vulnerabilities are triaged and remediated on an accelerated timeline." },
    { title: "6. Logging & Monitoring", content: "We collect system and application logs, monitor for suspicious activity, and retain logs for incident investigation. Alerts escalate to on-call personnel." },
    { title: "7. Incident Response", content: "We maintain an incident response plan that includes detection, containment, eradication, recovery, and post-incident review. Users will be notified of breaches as required by law." },
    { title: "8. Third-Party Risk Management", content: "We perform due diligence on third-party vendors, require contractual data processing terms, and monitor vendor security posture." },
    { title: "9. Data Backup & Availability", content: "We maintain regular automated backups, store backups securely, and test restoration procedures to ensure business continuity." },
    { title: "10. Employee Training & Background Checks", content: "We conduct security awareness training for employees and limit access based on need-to-know. Key personnel undergo background checks where appropriate." },
    { title: "11. Compliance & Certifications", content: "Where applicable, we pursue recognized frameworks (e.g., SOC 2) and will make summary compliance reports available to customers under NDA or as contractually agreed." },
    { title: "12. Bug Bounty & Responsible Disclosure", content: 'We welcome responsible disclosure of vulnerabilities. Security researchers should contact <a href="mailto:security@claricase.example" class="font-bold underline">security@claricase.example</a> and follow our responsible disclosure guidelines.' },
    { title: "13. Contact & Reporting", content: 'Report security issues to <a href="mailto:security@claricase.example" class="font-bold underline">security@claricase.example</a>.' }
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

                <h1 className="text-3xl font-bold">Security Practices</h1>
                <p className="text-sm text-gray-500">Last updated: November 17, 2025</p>
                <div className="h-0.5 bg-gray-100 my-4"></div>

                <div className="mb-6 space-y-2">
                    <h2 className="text-xl font-semibold">Overview</h2>
                    <p className="text-gray-700">ClariCase takes the confidentiality, integrity, and availability of data seriously. We maintain technical and organizational measures designed to protect user data and to reduce security risks.</p>
                </div>

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