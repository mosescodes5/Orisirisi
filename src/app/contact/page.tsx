import type { Metadata } from "next";
import { Mail, MessageCircle, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { Reveal } from "@/components/layout/Reveal";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Orísirísi with Taiwo — questions about an order, a return, or anything else.",
};

const CHANNELS = [
  { icon: Mail, label: "Email", value: "hello@orisirisi.com" },
  { icon: MessageCircle, label: "WhatsApp", value: "+234 800 000 0000" },
  { icon: Clock, label: "Response time", value: "Within 1 business day" },
];

export default function ContactPage() {
  return (
    <div className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-16">
        <Reveal>
          <p className="eyebrow">Get In Touch</p>
          <h1 className="mt-2.5 font-display text-[32px] font-medium sm:text-[42px]">Let&apos;s talk.</h1>
          <p className="mt-3 max-w-sm text-[14.5px] leading-relaxed text-ink/60">
            Question about an order, a piece you&apos;re curious about, or feedback on the shop — send it over
            and Taiwo&apos;s team will get back to you personally.
          </p>

          <div className="mt-10 flex flex-col gap-6">
            {CHANNELS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orisirisi/[0.1] text-orisirisi">
                  <Icon size={18} strokeWidth={1.7} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-mist">{label}</p>
                  <p className="text-[14.5px] font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-card border border-ink/[0.08] p-7 sm:p-9">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </div>
  );
}
