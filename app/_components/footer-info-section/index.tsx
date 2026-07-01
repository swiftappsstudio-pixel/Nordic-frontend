export default function FooterInfoSection() {
  return (
    <section className="py-16 bg-[#3e2a1c] text-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-brand text-xl font-semibold mb-4">Location</h3>
          <div className="space-y-4 text-white/60 font-brand">
            <div>
              <p className="text-white/80 font-semibold">Abu Dhabi</p>
              <p className="text-sm">Nordic Health Technologies Limited, 15th Floor Al Khatem Tower, Al Maryah Island</p>
            </div>
            <div>
              <p className="text-white/80 font-semibold">Dubai</p>
              <p className="text-sm">Nordic Health Services LLC</p>
              <p className="text-sm">701-13, Opal Tower, Business Bay</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-brand text-xl font-semibold mb-4">Contact Us</h3>
          <div className="space-y-3 text-white/60 font-brand">
            <p>+971 58 164 9910</p>
            <p className="text-sm">Toll-Free</p>
            <p>wecare@nordichc.ae</p>
          </div>
        </div>

        <div>
          <h3 className="font-brand text-xl font-semibold mb-4">Regulatory License (DHA)</h3>
          <div className="space-y-2 text-white/60 font-brand text-sm">
            <p>Digital Clinic License # 2985077</p>
            <p>Home Healthcare License #5167298</p>
            <p>Pharmacy License # 1736821</p>
          </div>
        </div>
      </div>
    </section>
  );
}