"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AppDownloadSection() {
  return (
    <section className="relative overflow-hidden bg-[#FFFFFF] py-20">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[#A38870]/10 to-transparent" />
      <Image
        src="/images/Ellipse0.png"
        alt="Background ellipse"
        width={500}
        height={500}
        className="pointer-events-none absolute -left-44 top-0 h-[300px] w-[300px] sm:h-[500px] sm:w-[500px] opacity-90"
        unoptimized
      />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="  p-8  sm:p-10"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="h-px w-14 bg-[#65452D]" />
              <span className="text-[#65452D] text-xs font-semibold uppercase tracking-[0.26em]">Download App</span>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-[#3B2718] text-3xl sm:text-4xl font-bold leading-tight"
            >
              Get the free Nordic App
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="mt-4 max-w-xl text-[#543826]/60 font-bold text-2xl leading-[29.25px] sm:whitespace-nowrap" style={{fontFamily:"Arial"}}
            >
              UAE&apos;s fastest growing health and wellness App.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-8 space-y-3"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 rounded-full bg-[#98887D] px-4 py-3 shadow-sm shadow-[#B59F85]/10 w-full sm:w-fit"
              >
                <span className="inline-flex h-3 w-3 items-center justify-center rounded-full text-base font-black text-[#F7EEE0]">1</span>
                <span className="text-[#F7EEE0] text-sm sm:text-base">Book home healthcare services</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 rounded-full bg-[#98887D] px-4 py-3 shadow-sm shadow-[#B59F85]/10 w-full sm:w-fit"
              >
                <span className="inline-flex h-3 w-3 items-center justify-center rounded-full text-base font-black text-[#F7EEE0]">2</span>
                <span className="text-[#F7EEE0] text-sm sm:text-base">Manage Health &amp; Wellness</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 rounded-full bg-[#98887D] px-4 py-3 shadow-sm shadow-[#B59F85]/10 w-full sm:w-fit"
              >
                <span className="inline-flex h-3 w-2.5 items-center justify-center rounded-full text-base font-black text-[#F7EEE0]">3</span>
                <span className="text-[#F7EEE0] text-sm sm:text-base">Track your appointments</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="mt-8 flex items-center gap-0 w-full sm:w-fit"
            >
              <div className="flex-1 px-3 sm:px-6 py-3 text-center">
                <p className="text-[#5D4936] font-bold text-xl sm:text-2xl leading-6" style={{fontFamily:"Arial"}}>4.9</p>
                <p className="text-[#5D4936]/60 text-xs font-semibold mt-1 whitespace-nowrap">App Rating</p>
              </div>
              <div className="h-12 w-px bg-[#D9C7B1]" />
              <div className="flex-1 px-3 sm:px-6 py-3 text-center">
                <p className="text-[#5D4936] font-bold text-xl sm:text-2xl leading-6" style={{fontFamily:"Arial"}}>3K+</p>
                <p className="text-[#5D4936]/60 text-xs font-semibold mt-1 whitespace-nowrap">Downloads</p>
              </div>
              <div className="h-12 w-px bg-[#D9C7B1]" />
              <div className="flex-1 px-3 sm:px-6 py-3 text-center">
                <p className="text-[#5D4936] font-bold text-xl sm:text-2xl leading-6" style={{fontFamily:"Arial"}}>DHA</p>
                <p className="text-[#5D4936]/60 text-xs font-semibold mt-1 whitespace-nowrap">Licensed</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#B9A285] bg-[#FBF4ED] px-6 py-3 text-sm font-semibold text-[#5D4936] transition duration-300 hover:bg-[#F2E8DE] sm:w-auto"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.46-2.48 4.18-2.51 1.34-.03 2.61.9 3.29.9.68 0 2.09-1.1 3.44-.95.59.03 2.2.24 3.24 1.8-2.85 1.77-2.41 6.33.4 7.96-.6 1.2-1.36 2.37-2.04 2.91zM12.17 5.28c-.63-1.01-.21-2.41.34-3.12 1.1.07 2.04.72 2.54 1.56.56 1 .12 2.32-.42 3.02-.88-.01-1.96-.65-2.46-1.46z"/>
                </svg>
                App Store
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#B9A285] bg-[#FBF4ED] px-6 py-3 text-sm font-semibold text-[#5D4936] transition duration-300 hover:bg-[#F2E8DE] sm:w-auto"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.89l2.302 2.302-11.847 5.86 9.545-8.162zm3.072-2.2l2.802 1.39c.51.25.51.98 0 1.23l-2.802 1.39-2.472-2.472 2.472-2.472zM5.158 2.744l11.847 5.86-2.302 2.302-9.545-8.162z"/>
                </svg>
                Google Play
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative flex justify-center sm:translate-x-4"
          >
            <div
              className="pointer-events-none absolute -bottom-[15%] left-1/2 -translate-x-1/2 h-[350px] w-[350px] sm:h-[650px] sm:w-[650px] rounded-full"
              style={{ background: 'linear-gradient(to bottom, #9B897E, #D6CDC7, #F4F1EF, #FFFFFF)' }}
            />
            <div className="relative z-10 w-full max-w-[260px] sm:max-w-[360px] rounded-[2rem] border border-[#D2B89A]/20 bg-white shadow-[0_30px_80px_rgba(92,68,54,0.18)]">
              <Image
                src="/images/nordic-mobile-ui.png"
                alt="Nordic mobile app screen"
                width={360}
                height={780}
                className="w-full h-auto rounded-[2rem]"
                unoptimized
              />
            </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}