import Image from "next/image";

interface Props {
  name: string;
  role: string;
  image: string;
}

export default function TeamCard({ name, role, image }: Props) {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">

      {/* Image Container */}
      <div className="relative w-full h-[320px] bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center">

        <Image
          src={image}
          alt={name}
          fill
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />

      </div>

      {/* Content */}
      <div className="p-5 text-center">

        <h4 className="text-lg font-semibold text-gray-800">
          {name}
        </h4>

        <p className="text-sm text-gray-500 mt-1">
          {role}
        </p>

      </div>

    </div>
  );
}