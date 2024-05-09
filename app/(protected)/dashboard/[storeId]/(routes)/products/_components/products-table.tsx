"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  ColumnDef,
  flexRender,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  VisibilityState,
  ColumnFiltersState,
  getFilteredRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import { cn } from "@/lib/utils";

import { Filters } from "@/app/(protected)/dashboard/[storeId]/(routes)/products/_components/products-client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { DeleteProductsButton } from "./delete-products";

interface ProductsDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
  filters?: Filters;
}

type FilteredProducIds = {
  productsIds: Array<{
    id: string;
  }>;
};

export function ProductsDataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: ProductsDataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnFilters,
      sorting,
      columnVisibility,
      rowSelection,
    },
  });

  const selectedProductsIds = table
    .getFilteredSelectedRowModel()
    //@ts-ignore
    .rows.map((item) => item.original.id);

  return (
    <>
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Procurar..."
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-1/2"
        />
        <div className="flex items-center space-x-5">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <DeleteProductsButton productsIds={selectedProductsIds} />
          )}
          {table.getRowModel().rows?.length > 0 && (
            <DropdownMenu onOpenChange={() => setIsOpen(!isOpen)}>
              <DropdownMenuTrigger asChild>
                <div className="flex cursor-pointer items-center gap-x-1 justify-center p-2 rounded-lg hover:border-fuchsia-300">
                  <div>Colunas</div>
                  <FaChevronDown
                    className={cn(
                      isOpen && "-rotate-180",
                      "transition-all duration-300"
                    )}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    let renderedColumnId = column.id;

                    if (column.id === "salesCount") {
                      renderedColumnId = "Vendas";
                    } else if (column.id === "number") {
                      renderedColumnId = "Número";
                    } else if (column.id === "name") {
                      renderedColumnId = "Nome";
                    } else if (column.id === "isArchived") {
                      renderedColumnId = "Arquivado";
                    } else if (column.id === "isFeatured") {
                      renderedColumnId = "Destaque";
                    } else if (column.id === "price") {
                      renderedColumnId = "Preço";
                    } else if (column.id === "category") {
                      renderedColumnId = "Categoria";
                    } else if (column.id === "sotck") {
                      renderedColumnId = "Estoque";
                    } else if (column.id === "color") {
                      renderedColumnId = "Cor";
                    } else if (column.id === "createdAt") {
                      renderedColumnId = "Criação";
                    } else if (column.id === "actions") {
                      renderedColumnId = "Ações";
                    }

                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }>
                        {renderedColumnId}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center font-extrabold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => {
                    let cellStyle = "";

                    if (cell.getValue() === "---") {
                      cellStyle = "flex justify-center";
                    }

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(cellStyle, "text-center")}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center">
                  Nenhum resultado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex-1 text-sm text-muted-foreground mt-2">
        {table.getFilteredSelectedRowModel().rows.length} de{" "}
        {table.getFilteredRowModel().rows.length} colunas(s) selecionadas.
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Próxima
        </Button>
      </div>
    </>
  );
}
