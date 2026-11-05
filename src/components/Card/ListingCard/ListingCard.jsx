import React from 'react';
import { Building2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from 'next/link';

const EDIT_ROUTE = (id) => `/add-studio?studioId=${id}`;
const ListingCard = ({products, confirmDelete}) => {
    return (
        <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 md:block">
            <Table>
                <TableHeader>
                    <TableRow className="border-white/10 hover:bg-transparent">
                        {["Studio", "Category", "Rate", "Location", "Actions"].map((h) => (
                            <TableHead
                                key={h}
                                className="h-12 text-xs font-semibold text-neutral-400"
                            >
                                {h}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((s) => (
                        <TableRow key={s._id} className="border-white/5 hover:bg-white/[0.02]">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Thumb src={s.imageUrl} alt={s.title} />
                                    <span className="font-bold">{s.title}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <CategoryPill>{s.category}</CategoryPill>
                            </TableCell>
                            <TableCell className="font-bold">${s.hourlyRate}/hr</TableCell>
                            <TableCell className="text-neutral-400">{s.location}</TableCell>
                            <TableCell>
                                <RowActions
                                    id={s._id}
                                    onDelete={() => confirmDelete(s._id)}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};

export default ListingCard;


function Thumb({ src, alt }) {
  return src ? (
    // plain <img> so any image host works without next.config changes
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-10 w-10 shrink-0 rounded-lg border border-white/10 object-cover"
    />
  ) : (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[#4a3a26] to-[#2c2318] text-neutral-400">
      <Building2 className="h-4 w-4" aria-hidden />
    </span>
  );
}

function CategoryPill({ children }) {
  return (
    <span className="badge badge-outline h-auto whitespace-nowrap rounded-full border-white/20 px-3 py-1 text-xs font-normal text-neutral-200">
      {children}
    </span>
  );
}


function RowActions({ id, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={EDIT_ROUTE(id)}
        className="inline-flex h-9 items-center rounded-lg border border-white/15 px-4 text-xs font-semibold text-white transition hover:bg-white/5"
      >
        Update
      </Link>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 items-center rounded-lg border border-red-500/20 bg-red-500/15 px-4 text-xs font-semibold text-red-300 transition hover:bg-red-500/25"
      >
        Delete
      </button>
    </div>
  );
}