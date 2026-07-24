const pressReleases = [
  { date: "Jan 2026", title: "Daraz Clone crosses 200,000 active sellers milestone" },
  { date: "Nov 2025", title: "Daraz Clone launches nationwide same-week delivery" },
  { date: "Aug 2025", title: "Daraz Clone partners with local logistics providers to expand reach" },
];

const PressCenter = () => {
  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Press Center</h1>
      <p className="text-gray-500 mb-12">
        Latest news, announcements, and media resources from Daraz Clone.
      </p>

      <div className="space-y-6 mb-14">
        {pressReleases.map((item) => (
          <div key={item.title} className="border-b pb-6">
            <p className="text-sm text-primary font-medium mb-1">{item.date}</p>
            <h3 className="text-lg font-semibold">{item.title}</h3>
          </div>
        ))}
      </div>

      <div className="bg-secondary rounded-xl p-8 text-center">
        <h2 className="text-lg font-bold mb-2">Media Inquiries</h2>
        <p className="text-gray-600 mb-4">
          For press inquiries, interview requests, or brand assets, reach out to our media team.
        </p>
        <a
          href="mailto:press@darazclone.com"
          className="text-primary font-semibold underline"
        >
          press@darazclone.com
        </a>
      </div>
    </div>
  );
};

export default PressCenter;