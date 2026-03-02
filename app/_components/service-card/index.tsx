import Image from "next/image";
import Link from "next/link";

interface ServiceCardProps {
  id: string;
  image?: string;
  title: string;
  price: number;
  actualPrice?: number;
  description?: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  id,
  image,
  title,
  price,
  actualPrice,
  description,
}) => {
  return (
    <Link href={`/services/request/${id}`} className="block">
      <div className="bg-[#F4F4F4] shadow-md rounded-xl overflow-hidden hover:shadow-lg transition p-4 cursor-pointer">
        {image && (
          <div className="w-full h-48 relative">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 33vw"
              unoptimized
            />
          </div>
        )}
        <h3 className="text-lg text-[#593E30] font-semibold mt-3">{title}</h3>
        {description && (
          <p className="text-black text-sm mt-1 line-clamp-2">{description}</p>
        )}
        <div className="mt-2 flex items-center gap-3">
          <span className="text-orange-600 font-bold text-xl">AED {price}</span>
          {actualPrice && actualPrice > price && (
            <span className="text-gray-400 line-through text-md">
              AED {actualPrice}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
