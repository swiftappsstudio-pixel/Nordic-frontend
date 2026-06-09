export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-[#543826]/20 border-t-[#543826] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-orange-500/20 border-b-orange-500 animate-spin" style={{ animationDirection: "reverse" }} />
        </div>
      </div>
    </div>
  );
}