import Image from "next/image";
import TeamCard from "@/app/_components/team-card";

export default function AboutPage() {
  const team = [
    {
      name: "John Carter",
      role: "Physiotherapist",
      image: "/images/team1.JPG",
    },
    {
      name: "David Lee",
      role: "Medical Assistant",
      image: "/images/team2.JPG",
    },
    {
      name: "Sarah Wilson",
      role: "Nurse",
      image: "/images/team2.JPG",
    },
    {
      name: "Michael Smith",
      role: "Caregiver",
      image: "/images/team2.JPG",
    },
  ];

  return (
    <div className="w-full">

      {/* HERO SECTION */}

      <div className="relative w-full h-[600px]">
        <Image
          src="/about-banner.jpg"
          alt="about banner"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-white text-4xl font-bold">About Us</h1>
        </div>
      </div>

      {/* ABOUT SECTION */}

      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10">

        <div>

          <p className="text-gray-600 leading-relaxed">
           At Nordic Home Healthcare, we are dedicated to delivering compassionate, reliable, and professional home healthcare services that prioritize the comfort, dignity, and well-being of every patient we serve. Our goal is to make high-quality healthcare accessible in the place where patients feel safest and most comfortable — their own homes. We understand that every individual has unique healthcare needs, which is why our services are carefully tailored to provide personalized support for patients of all ages. From elderly care and post-surgery recovery to chronic illness management and daily assistance, our experienced team is committed to providing attentive and respectful care at every stage.
          </p>

          <p className="text-gray-600 mt-4">
        Our team consists of qualified nurses, caregivers, and healthcare professionals who are highly trained, experienced, and passionate about helping others. Each member of our staff is dedicated to maintaining the highest standards of medical care while also offering emotional support and compassion to both patients and their families. By combining professional medical expertise with a patient-centered approach, we ensure that every individual receives the attention and care they truly deserve.
          </p>
        </div>

        <div className="relative h-[400px]">
          <Image
            src="/images/demo.png"
            alt="about"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      </div>

      {/* TRUSTED CARE SECTION */}

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10 items-center">

     <div className="relative h-[400px] w-full bg-gray-100">
  <Image
    src="/images/demo.png"
    alt="care"
    fill
    className="object-contain rounded-lg"
  />
</div>

        <div>
          <h2 className="text-2xl text-black font-semibold mb-4">
            Trusted, personalized healthcare.
          </h2>

          <p className="text-gray-600 leading-relaxed">

At Nordic Home Healthcare, our focus is on delivering dependable and patient-centered healthcare services that families can trust. We understand that receiving care at home allows patients to feel more relaxed, secure, and supported during their recovery or daily health management. That is why our team works closely with each patient to understand their individual needs and provide care that is both professional and compassionate.

Our qualified healthcare professionals are dedicated to ensuring safety, comfort, and consistent support for every patient. We provide a wide range of services including nursing care, elderly assistance, physiotherapy, and post-operative support. Each service is delivered with careful attention to detail, ensuring that patients receive the right level of care at the right time.
          </p>
        </div>
      </div>

      {/* MISSION VISION VALUES */}

      <div className="bg-gray-100 py-14">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-6">

          {/* Mission */}

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-black mb-2">Our Mission</h3>

            <p className="text-gray-600">
              To provide exceptional home healthcare services, improving
              patients’ quality of life through compassionate, professional,
              and personalized care.
            </p>
          </div>

          {/* Vision */}

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-black mb-2">Vision</h3>

            <p className="text-gray-600">
              To become a trusted leader in home healthcare, delivering
              innovative and compassionate services for communities.
            </p>
          </div>

          {/* Values */}

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-black mb-2">Values</h3>

            <p className="text-gray-600">
              Compassion, integrity, professionalism, and dedication are the
              values that guide our healthcare services.
            </p>
          </div>
        </div>
      </div>

      {/* TEAM SECTION */}

      <div className="max-w-6xl mx-auto px-6 py-16">

        <h2 className="text-3xl text-black font-bold text-center mb-10">
          Meet Our Team
        </h2>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <TeamCard
              key={index}
              name={member.name}
              role={member.role}
              image={member.image}
            />
          ))}
        </div>

      </div>

    </div>
  );
}