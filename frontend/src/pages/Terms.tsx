const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using Daraz Clone, you agree to be bound by these Terms & Conditions and our Privacy Policy. If you do not agree, please do not use our platform.",
  },
  {
    title: "2. Account Registration",
    body: "You must provide accurate information when creating an account and are responsible for maintaining the confidentiality of your login credentials. You must be at least 18 years old, or have parental consent, to make purchases.",
  },
  {
    title: "3. Orders & Payments",
    body: "All orders are subject to product availability and confirmation of the order price. We reserve the right to refuse or cancel any order for reasons including pricing errors, suspected fraud, or stock unavailability. Accepted payment methods include Cash on Delivery, Card, and UPI.",
  },
  {
    title: "4. Pricing & Product Information",
    body: "We strive to display accurate pricing and product details. However, errors may occasionally occur. In the event of a pricing error, we will contact you before processing the order, and you may choose to proceed at the correct price or cancel.",
  },
  {
    title: "5. Shipping & Delivery",
    body: "Delivery timelines are estimates and not guaranteed. Daraz Clone is not liable for delays caused by circumstances beyond our control, including weather, courier delays, or incorrect address information provided by the customer.",
  },
  {
    title: "6. Returns & Cancellations",
    body: "Orders can be cancelled before delivery from the My Orders page. Return eligibility is governed by our Returns & Refunds policy. Refunds are processed after the returned item is received and inspected.",
  },
  {
    title: "7. Seller Responsibilities",
    body: "Sellers on our platform are responsible for the accuracy of their product listings and for fulfilling orders in accordance with our seller guidelines. Daraz Clone acts as a marketplace facilitator.",
  },
  {
    title: "8. Prohibited Activities",
    body: "Users may not use the platform for any unlawful purpose, post false reviews, attempt to defraud other users, or interfere with the platform's security or functionality.",
  },
  {
    title: "9. Limitation of Liability",
    body: "Daraz Clone is not liable for any indirect, incidental, or consequential damages arising from your use of the platform, to the maximum extent permitted by law.",
  },
  {
    title: "10. Changes to These Terms",
    body: "We may update these Terms & Conditions from time to time. Continued use of the platform after changes are posted constitutes acceptance of the revised terms.",
  },
];

const Terms = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms & Conditions</h1>
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

export default Terms;