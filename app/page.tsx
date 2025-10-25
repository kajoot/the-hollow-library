import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/stamp.jpg"
        alt="Hogwarts Castle"
        layout="fill"
        objectFit="cover"
        className="z-0"
        priority
      />

      {/* White mist overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/20 to-transparent z-10" />

      {/* Content */}
      <div className="relative z-20 bg-white/10 p-10 rounded-2xl shadow-2xl max-w-md w-full border border-yellow-500/30">
        <h1 className="text-4xl font-serif text-yellow-400 text-center drop-shadow-[0_0_8px_#FFD700] mb-6">
          Welcome to The Hollow Library
        </h1>

        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Wizard Name"
            className="p-3 bg-black/60 border border-yellow-400/30 text-yellow-100 rounded-md placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <input
            type="password"
            placeholder="Secret Spell"
            className="p-3 bg-black/60 border border-yellow-400/30 text-yellow-100 rounded-md placeholder-yellow-200/50 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold rounded-md shadow-lg hover:shadow-yellow-400/50 transition-all duration-300"
          >
            Enter the Castle
          </button>
        </form>

        <p className="text-center text-yellow-200/70 mt-4">
          Don’t have an account?{" "}
          <a
            href="#"
            className="text-yellow-400 hover:text-yellow-200 underline decoration-yellow-400/50"
          >
            Enroll now
          </a>
        </p>
      </div>
    </div>
  );
}
