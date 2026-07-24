import { useState, FormEvent } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No backend endpoint for contact messages yet — this is a static
    // confirmation UI. Wire this up to a real API if/when one exists.
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="max-w-5xl mx-auto px-5 py-14">
      <h1 className="text-3xl md:text-4xl font-bold mb-3">Contact Us</h1>
      <p className="text-gray-500 mb-12">
        Have a question or need help? Reach out to us — we're happy to help.
      </p>

      <div className="grid md:grid-cols-5 gap-10">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex gap-4">
            <FaMapMarkerAlt className="text-primary shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold mb-1">Our Address</h3>
              <p className="text-sm text-gray-500">Chennai, Tamil Nadu, India</p>
            </div>
          </div>

          <div className="flex gap-4">
            <FaPhoneAlt className="text-primary shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-gray-500">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex gap-4">
            <FaEnvelope className="text-primary shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-gray-500">support@darazclone.com</p>
            </div>
          </div>

          <div className="flex gap-4">
            <FaClock className="text-primary shrink-0 mt-1" size={20} />
            <div>
              <h3 className="font-semibold mb-1">Support Hours</h3>
              <p className="text-sm text-gray-500">Mon–Sat, 9:00 AM – 8:00 PM</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          {submitted ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <h3 className="font-semibold text-green-800 mb-2">Message Sent!</h3>
              <p className="text-sm text-green-700">
                Thanks for reaching out. Our team will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="border rounded-lg p-3 outline-none focus:border-primary"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="border rounded-lg p-3 outline-none focus:border-primary"
                />
              </div>

              <input
                type="text"
                placeholder="Subject"
                required
                value={form.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none focus:border-primary"
              />

              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => handleChange("message", e.target.value)}
                className="w-full border rounded-lg p-3 outline-none focus:border-primary"
              />

              <button
                type="submit"
                className="bg-primary hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;