"use client";

import { useState, useTransition } from "react";
import { ReviewColumnProps, columns } from "./reviews-columns";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { CiCirclePlus, CiTrash } from "react-icons/ci";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { ReviewsDataTable } from "./reviews-table";

interface ReviewsClientProps {
  data: ReviewColumnProps[];
}

export const ReviewsClient = ({ data }: ReviewsClientProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams<{ storeId: string }>();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState(false);
  const router = useRouter();

  const onDelete = () => {};

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />

      {/*       <Separator />
      <div className="flex justify-end space-x-4">
        <div className="flex items-center space-x-2">
          <Input
            id="watches"
            type="checkbox"
            className="size-4"
            checked={filters.showWatchesOnly}
            onChange={(event) =>
              setFilters({ ...filters, showWatchesOnly: event.target.checked })
            }
          />
          <Label htmlFor="watches">Relógios</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            id="shoes"
            type="checkbox"
            className="size-4"
            checked={filters.showShoesOnly}
            onChange={(event) =>
              setFilters({ ...filters, showShoesOnly: event.target.checked })
            }
          />
          <Label htmlFor="shoes">Sapatos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            id="shirts"
            type="checkbox"
            className="size-4"
            checked={filters.showShirtsOnly}
            onChange={(event) =>
              setFilters({ ...filters, showShirtsOnly: event.target.checked })
            }
          />
          <Label htmlFor="shirts">Coletes/Camisas</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            id="suits"
            type="checkbox"
            className="size-4"
            checked={filters.showSuitsOnly}
            onChange={(event) =>
              setFilters({ ...filters, showSuitsOnly: event.target.checked })
            }
          />
          <Label htmlFor="suits">Ternos</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            id="isArchived"
            type="checkbox"
            className="size-4"
            checked={filters.showArchivedOnly}
            onChange={(event) =>
              setFilters({ ...filters, showArchivedOnly: event.target.checked })
            }
          />
          <Label htmlFor="isArchived">Arquivados</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            id="isFeatured"
            type="checkbox"
            className="size-4"
            checked={filters.showFeaturedOnly}
            onChange={(event) =>
              setFilters({ ...filters, showFeaturedOnly: event.target.checked })
            }
          />
          <Label htmlFor="isFeatured">Destaques</Label>
        </div>
      </div> */}
      <div className="w-[330px] sm:w-[580px] md:w-[750px] lg:w-full mx-auto">
        <ReviewsDataTable searchKey="user" columns={columns} data={data} />
      </div>
      {/* <Heading title="API" description="API dos Produtos" />
      <Separator /> */}
      {/* <ApiList entityName="products" entityIdName="productId" /> */}
    </>
  );
};
