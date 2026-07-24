const sections = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly (name, email, phone, shipping address) and information generated through your use of the platform (order history, browsing activity, device information).",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use your information to process orders, provide customer support, personalize your shopping experience, send order updates, and improve our platform. We do not sell your personal data to third parties.",
  },
  {
    title: "3. Information Sharing",
    body: "We share your information with sellers (to fulfill your order), payment processors (to complete transactions), and delivery partners (to ship your order). We may also share information when required by law.",
  },
  {
    title: "4. Data Security",
    body: "We use industry-standard measures, including password hashing and secure connections, to protect your information. However, no method of transmission over the internet is 100% secure.",
  },
  {
    title: "5. Cookies",
    body: "We use cookies and similar technologies to keep you logged in, remember your cart, and understand how you use our platform. You can control cookies through your browser settings.",
  },
  {
    title: "6. Your Rights",
    body: "You may access, update, or delete your account information at any time from your Profile page. You may also contact us to request a copy of the data we hold about you.",
  },
  {
    title: "7. Data Retention",
    body: "We retain your information for as long as your account is active or as needed to provide services, comply with legal obligations, and resolve disputes.",
  },
  {
    title: "8. Children's Privacy",
    body: "Our platform is not intended for individuals under 18. We do not knowingly collect personal information from children.",
  },
  {
    title: "9. Changes to This Policy",
    body: "We may update this Privacy Policy periodically. We encourage you to review this page for the latest information on our privacy practices.",
  },
  {
    title: "10. Contact Us",
    body: "If you have questions about this Privacy Policy or how we handle your data, reach out to us at privacy@darazclone.com.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
      <p className="text-gray-500 mb-12">Last updated: January 2026</p>

      <div className="space-y-8">
        {sections.map((section) => (
          <div key={section.title}>
            <h2 className="text-lg font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600 leading-7">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;