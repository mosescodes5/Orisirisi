import Image from "next/image";
import type { BlogAuthor } from "@/lib/types";
import { placeholderImage } from "@/lib/data";

export function AuthorCard({ author }: { author: BlogAuthor }) {
  return (
    <div className="flex items-start gap-4 rounded-card border border-ink/[0.08] p-6 sm:p-7">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-ink/[0.04]">
        <Image src={placeholderImage(author.avatar, 140, 140)} alt={author.name} fill className="object-cover" />
      </div>
      <div>
        <p className="font-display text-base font-medium">{author.name}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-orisirisi">{author.role}</p>
        <p className="mt-2 text-[13.5px] leading-relaxed text-ink/60">{author.bio}</p>
      </div>
    </div>
  );
}
