"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { IoIosMore, IoIosSearch } from "react-icons/io";
import { Plus } from "lucide-react";

interface DataTableProps<TData, TValue> {
  title?: string;
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  addProject?: boolean;
  onAddProject?: () => void;
  addButtonText?: string;
}

export function DataTable<TData, TValue>({
  title,
  columns,
  data,
  addProject,
  onAddProject,
  addButtonText = "+ Tambah",
}: DataTableProps<TData, TValue>) {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Jumlah data per halaman
  const nav = useRouter();

  const filteredData = useMemo(() => {
    if (!search) return data;

    return data.filter((item) => {
      // Gabungkan properti dari objek utama dan properti bersarang
      const flattenedValues = [
        ...Object.values(item as any), // Nilai dari item utama
        ...Object.values((item as any).projects || {}), // Nilai dari objek projects
        ...Object.values((item as any).users || {}), // Nilai dari objek users
      ];

      // Gabungkan semua nilai menjadi string, lalu cek apakah mengandung kata kunci
      return flattenedValues
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  }, [data, search]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center justify-between">
        <Button
          variant="success"
          className="rounded-md hidden md:inline-flex gap-1"
          onClick={onAddProject}
        >
          {addButtonText}
        </Button>
        <div className="flex gap-3 items-center">
          <Input
            placeholder="Search..."
            className="w-[15rem]"
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            iconBefore={<IoIosSearch size={20} className="text-gray-500" />}
          />
          {addProject && (
            <Button
              variant="primary"
              className="rounded-md hidden md:inline-flex gap-1"
              onClick={() => nav.push("/project")}
            >
              <Plus />
              Project
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none md:hidden">
              <Button variant="default">
                <IoIosMore />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Button
                  variant="success"
                  className="rounded-md w-full"
                  onClick={onAddProject}
                >
                  {addButtonText}
                </Button>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {addProject && (
                <DropdownMenuItem>
                  <Button
                    variant="primary"
                    className="rounded-md"
                    onClick={() => nav.push("/project")}
                  >
                    <Plus />
                    Project
                  </Button>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="rounded-md shadow-md overflow-hidden w-full">
        <Table>
          <TableHeader className="bg-primary text-white">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-white">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: cell.column.columnDef.size,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {data.length > 10 && (
          <>
            <div className="px-4 pt-2 flex justify-center bg-primary text-white">
              <span className="text-sm text-center">
                Showing{" "}
                {Math.min(
                  (currentPage - 1) * itemsPerPage + 1,
                  filteredData.length
                )}{" "}
                to {Math.min(currentPage * itemsPerPage, filteredData.length)}{" "}
                of {filteredData.length} data
              </span>
            </div>
            <Pagination className="bg-primary text-white">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Mencegah scroll ke atas
                      setCurrentPage((prev) => Math.max(prev - 1, 1));
                    }}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault(); // Mencegah scroll ke atas
                        setCurrentPage(index + 1);
                      }}
                      className={currentPage === index + 1 ? "font-bold" : ""}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault(); // Mencegah scroll ke atas
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </>
        )}
      </div>
    </div>
  );
}
