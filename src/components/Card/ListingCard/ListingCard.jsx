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

const EDIT_ROUTE = (id) => `/studios/edit/${id}`;
const ListingCard = ({products, onRequestDelete}) => {
    return (
        <div className="hidden overflow-hidden rounded-2xl border border-border bg-card md:block">
            <Table>
                <TableHeader>
                    <TableRow className="border-border hover:bg-transparent">
                        {["Studio", "Category", "Rate", "Location", "Actions"].map((h) => (
                            <TableHead
                                key={h}
                                className="h-12 text-xs font-semibold text-muted-foreground"
                            >
                                {h}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.map((s) => (
                        <TableRow key={s._id} className="border-border hover:bg-muted/50">
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Thumb src={s.imageUrl} alt={s.title} />
                                    <span className="font-bold text-heading">{s.title}</span>
                                </div>
                            </TableCell>
                            <TableCell>
                                <CategoryPill>{s.category}</CategoryPill>
                            </TableCell>
                            <TableCell className="font-bold text-heading">${s.hourlyRate}/hr</TableCell>
                            <TableCell className="text-muted-foreground">{s.location}</TableCell>
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
      className="h-10 w-10 shrink-0 rounded-lg border border-border object-cover"
    />
  ) : (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-muted to-muted text-muted-foreground">
      <Building2 className="h-4 w-4" aria-hidden />
    </span>
  );
}

function CategoryPill({ children }) {
  return (
    <span className="badge badge-outline h-auto whitespace-nowrap rounded-full border-border px-3 py-1 text-xs font-normal text-muted-foreground">
      {children}
    </span>
  );
}


function RowActions({ id, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={EDIT_ROUTE(id)}
        className="inline-flex h-9 items-center rounded-lg border border-border px-4 text-xs font-semibold text-heading transition hover:bg-muted/50"
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
