"use client";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosMore } from "react-icons/io";
import { CiTrash } from "react-icons/ci";
import { MdOutlineModeEdit } from "react-icons/md";
import { IoEyeOutline } from "react-icons/io5";
import { LogOut, UserCircle } from "lucide-react";

export const detailColumn = (handleDelete: any): ColumnDef<any>[] => [
  {
    accessorKey: "no",
    header: "No",
    size: 12,
    cell: ({ row }) => {
      return <div className="capitalize">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "work_date",
    header: "Date",
    size: 100,
    cell: ({ row }) => {
      const value = row.getValue("work_date");
      return (
        <div className="capitalize">
          {moment(value as string).format("DD MMM YYYY")}
        </div>
      );
    },
  },
  {
    accessorKey: "projects.name",
    header: "Nama Project",
    size: 100,
  },
  {
    accessorKey: "hours_worked",
    header: "Jam Kerja",
    size: 100,
  },
  {
    accessorKey: "daily_total",
    header: "Total Harian",
    size: 100,
    cell: ({ row }) => {
      const value = row.getValue("hours_worked");
      const dailyTotal = (value as number) / 8;
      return (
        <div className="capitalize">
          {dailyTotal.toLocaleString("id-ID", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "mnthly_Total",
    header: "Total Bulanan",
    size: 100,
    cell: ({ row }) => {
      const value = row.getValue("hours_worked");
      const dailyTotal = (value as number) / 8;
      const monthlyTotal = dailyTotal / 31;
      return (
        <div className="capitalize">
          {monthlyTotal.toLocaleString("id-ID", {
            minimumFractionDigits: 1,
            maximumFractionDigits: 3,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: ({ table }) => (
      <div className="flex justify-center">
        <span>Action</span>
      </div>
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <IoIosMore />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  handleDelete(data.id);
                }}
              >
                {" "}
                <div className="flex gap-2 items-center text-xs text-red-500">
                  <CiTrash />
                  <span>Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 20,
  },
];

export const projectColumn = (
  handleEdit: any,
  deleteProject: any
): ColumnDef<any>[] => [
  {
    accessorKey: "no",
    header: "No",
    size: 12,
    cell: ({ row }) => {
      return <div className="capitalize">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Project Name",
  },
  {
    accessorKey: "location",
    header: "Project Location",
  },
  {
    accessorKey: "action",
    header: ({ table }) => (
      <div className="flex justify-center">
        <span>Action</span>
      </div>
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <IoIosMore />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => {
                  handleEdit(data);
                }}
              >
                <div className="flex gap-2 items-center text-xs">
                  <MdOutlineModeEdit />

                  <span>Edit</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  deleteProject(data.id);
                }}
              >
                {" "}
                <div className="flex gap-2 items-center text-xs text-red-500">
                  <CiTrash />
                  <span>Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 20,
  },
];

export const userColumn = (
  navigateWithData: (...args: any) => void,
  handleEdit: (...args: any) => void,
  handleDelete: (...args: any) => void
): ColumnDef<any>[] => [
  {
    accessorKey: "no",
    header: "No",
    size: 12,
    cell: ({ row }) => {
      return <div className="capitalize">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 100,
  },
  {
    accessorKey: "email",
    header: "Email",
    size: 100,
  },
  {
    accessorKey: "created_at",
    header: "Date",
    size: 100,
    cell: ({ row }) => {
      const value = row.getValue("created_at");
      return (
        <div className="capitalize">
          {moment(value as string).format("DD MMM YYYY")}
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: ({ table }) => (
      <div className="flex justify-center">
        <span>Action</span>
      </div>
    ),
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none">
              <IoIosMore />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={() => navigateWithData("detail", data)}
              >
                <div className="flex gap-2 !items-center text-xs">
                  <IoEyeOutline />
                  <span>View Detail</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleEdit(data)}>
                <div className="flex gap-2 items-center text-xs">
                  <MdOutlineModeEdit />

                  <span>Edit</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(data.id)}>
                {" "}
                <div className="flex gap-2 items-center text-xs text-red-500">
                  <CiTrash />

                  <span>Delete</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
    size: 20,
  },
];