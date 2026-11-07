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
const ListingCard = ({products, onRequestDelete}) => {
    return (
        <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white md:block">
            <Table>
                <TableHeader>
                    <TableRow className="border-slate-200 hover:bg-transparent">
                        {["Studio", "Category", "Rate", "Location", "Actions"].map((h) => (
                            <TableHead
                                key={h}
                                className="h-12 text-xs font-semibold text-slate-500"
                            >
                                {h}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((s) => (
                        <TableRow key={s._id} className="border-slate-100 hover:bg-slate-50">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Thumb src={s.imageUrl} alt={s.title} />
                                    <span className="font-bold text-[#244855]">{s.title}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <CategoryPill>{s.category}</CategoryPill>
                            </TableCell>
                            <TableCell className="font-bold text-[#244855]">${s.hourlyRate}/hr</TableCell>
                            <TableCell className="text-slate-500">{s.location}</TableCell>
                            <TableCell>
                                <RowActions
                                    id={s._id}
                                    onDelete={() => onRequestDelete(s)}
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
      className="h-10 w-10 shrink-0 rounded-lg border border-slate-200 object-cover"
    />
  ) : (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400">
      <Building2 className="h-4 w-4" aria-hidden />
    </span>
  );
}

function CategoryPill({ children }) {
  return (
    <span className="badge badge-outline h-auto whitespace-nowrap rounded-full border-slate-200 px-3 py-1 text-xs font-normal text-slate-600">
      {children}
    </span>
  );
}


function RowActions({ id, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={EDIT_ROUTE(id)}
        className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-4 text-xs font-semibold text-[#244855] transition hover:bg-slate-50"
      >
        Update
      </Link>
      <button
        type="button"
        onClick={onDelete}
        className="inline-flex h-9 items-center rounded-lg border border-red-500/20 bg-red-500/10 px-4 text-xs font-semibold text-red-600 transition hover:bg-red-500/20"
      >
        Delete
      </button>
    </div>
  );
}
