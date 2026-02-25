import React from "react";

interface CtaSectionProps {
  title: string;
  imageUrl: string;
  buttonText: string;
  phoneNumber: string; // without + sign
  message: string;
}

export const CTASection: React.FC<CtaSectionProps> = ({
  title,
  imageUrl,
  buttonText,
  phoneNumber,
  message,
}) => {
  const handleClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
  };

  return (
    <section
      className="relative w-full h-[400px] flex items-center justify-center text-center text-white"
      style={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          {title}
        </h2>

        <button
          onClick={handleClick}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          {buttonText}
        </button>
      </div>
    </section>
  );
};
