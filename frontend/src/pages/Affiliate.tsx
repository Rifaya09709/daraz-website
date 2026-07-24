import { FaLink, FaChartLine, FaWallet } from "react-icons/fa";

const Affiliate = () => {
  return (
    <div className="bg-white">
      <section className="bg-gradient-to-r from-primary to-orange-600 text-white py-16 text-center px-5">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Affiliate Program</h1>
        <p className="max-w-2xl mx-auto text-orange-50">
          Earn commission by promoting products you love. Share links, drive sales, get paid.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-5 py-14">
        <div className="grid sm:grid-cols-3 gap-8 mb-14">
          {[
            { icon: <FaLink size={26} />, title: "Share Links", desc: "Get unique tracking links for any product" },
            { icon: <FaChartLine size={26} />, title: "Track Performance", desc: "Monitor clicks and conversions in real time" },
            { icon: <FaWallet size={26} />, title: "Earn Commission", desc: "Get paid monthly for every sale you drive" },
          ].map((s) => (
            <div key={s.title} className="text-center">
              <div className="text-primary flex justify-center mb-3">{s.icon}</div>
              <h3 className="font-semibold mb-1">{s.title}</h3>
              <p className="text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-secondary rounded-xl p-8 text-center">
          <h2 className="text-lg font-bold mb-2">Interested in Joining?</h2>
          <p className="text-gray-600 mb-4">
            Sign up to become an affiliate partner and start earning today.
          </p>
          <a
            href="mailto:affiliates@darazclone.com"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg hover:bg-orange-600"
          >
            Apply Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default Affiliate;