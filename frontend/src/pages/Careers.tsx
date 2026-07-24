import { FaBriefcase, FaHeart, FaRocket, FaUsers } from "react-icons/fa";

const openings = [
  { title: "Frontend Engineer", dept: "Engineering", location: "Remote / Chennai" },
  { title: "Product Designer", dept: "Design", location: "Chennai" },
  { title: "Customer Support Executive", dept: "Operations", location: "Chennai" },
  { title: "Warehouse Associate", dept: "Logistics", location: "Multiple Cities" },
];

const perks = [
  { icon: <FaHeart size={24} />, label: "Health Insurance" },
  { icon: <FaRocket size={24} />, label: "Growth Opportunities" },
  { icon: <FaUsers size={24} />, label: "Collaborative Culture" },
  { icon: <FaBriefcase size={24} />, label: "Flexible Work" },
];

const Careers = () => {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-primary to-orange-600 text-white py-16 text-center px-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Join Our Team</h1>
        <p className="max-w-2xl mx-auto text-orange-50">
          Help us build the future of online shopping. We're always looking for passionate people to join us.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-5 py-14">
        <h2 className="text-xl font-bold mb-8 text-center">Why Work With Us</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {perks.map((p) => (
            <div key={p.label} className="flex flex-col items-center gap-3 text-center">
              <div className="text-primary bg-secondary w-16 h-16 rounded-full flex items-center justify-center">
                {p.icon}
              </div>
              <p className="text-sm font-medium text-gray-700">{p.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-6">Open Positions</h2>
        <div className="space-y-4">
          {openings.map((job) => (
            <div
              key={job.title}
              className="border rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:shadow-md transition"
            >
              <div>
                <h3 className="font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-500">
                  {job.dept} · {job.location}
                </p>
              </div>
              <a
                href="mailto:careers@darazclone.com"
                className="text-primary font-semibold text-sm whitespace-nowrap"
              >
                Apply Now →
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Careers;