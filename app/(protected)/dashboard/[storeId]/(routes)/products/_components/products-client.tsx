"use client";

import { CiCirclePlus, CiTrash } from "react-icons/ci";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import { ProductColumnProps, columns } from "./products-columns";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteProducts } from "@/actions/product/delete-products";
import { toast } from "sonner";
import { IoIosAlert } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import { AlertModal } from "@/components/modals/alert-modal";
import { ProductsDataTable } from "./products-table";

interface ProductsClientProps {
  data: ProductColumnProps[];
}

export type Filters = {
  showArchivedOnly: boolean;
  showFeaturedOnly: boolean;
  showSuitsOnly: boolean;
  showShirtsOnly: boolean;
  showShoesOnly: boolean;
  showWatchesOnly: boolean;
};

export const ProductsClient: React.FC<ProductsClientProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  const params = useParams<{ storeId: string }>();
  const [isPending, startTransition] = useTransition();
  const [filters, setFilters] = useState<Filters>({
    showArchivedOnly: false,
    showFeaturedOnly: false,
    showSuitsOnly: false,
    showShirtsOnly: false,
    showShoesOnly: false,
    showWatchesOnly: false,
  });
  const router = useRouter();

  const filterData = (data: ProductColumnProps[], filters: Filters) => {
    let filteredData = data;

    if (filters.showArchivedOnly) {
      filteredData = filteredData.filter((item) => item.isArchived === "Sim");
    }

    if (filters.showFeaturedOnly) {
      filteredData = filteredData.filter((item) => item.isFeatured === "Sim");
    }

    if (filters.showSuitsOnly) {
      filteredData = filteredData.filter((item) => item.category === "Ternos");
    }

    if (filters.showShirtsOnly) {
      filteredData = filteredData.filter(
        (item) => item.category === "Coletes/Camisas"
      );
    }

    if (filters.showShoesOnly) {
      filteredData = filteredData.filter((item) => item.category === "Sapatos");
    }

    if (filters.showWatchesOnly) {
      filteredData = filteredData.filter(
        (item) => item.category === "Relógios"
      );
    }

    return filteredData;
  };

  const filteredData = filterData(data, filters);

  const onDelete = () => {
    startTransition(() => {
      deleteProducts(params).then((data) => {
        if (data.error) {
          toast(data.error, {
            icon: <IoIosAlert className="text-red-600" />,
          });
        }

        if (data.success) {
          toast(data.success, {
            icon: <FaCheckCircle className="text-lime-500" />,
          });
          setOpen(false);
        }
      });
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isPending}
      />
      <div className="w-full overflow-auto">
        <div className="flex items-center justify-between">
          <Heading
            title={`Todos os Produtos (${data.length})`}
            description="Gerencie os produtos de sua loja"
          />
          <div className="flex flex-col md:flex-row gap-x-4 gap-y-2">
            <Button
              variant="destructive"
              onClick={() => setOpen(true)}
              disabled={data.length < 1}>
              <CiTrash className="mr-2 size-4" />
              Deletar Todos
            </Button>
            <Button
              onClick={() =>
                router.push(`/dashboard/${params.storeId}/products/new`)
              }>
              <CiCirclePlus className="mr-2 size-5" /> Adicionar
            </Button>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="w-[330px] sm:w-[580px] md:w-[750px] lg:w-full mx-auto grid gap-1 grid-cols-2 sm:grid-cols-3 2xl:grid-cols-6">
          <div className="flex items-center space-x-2">
            <Input
              id="watches"
              type="checkbox"
              className="size-4"
              checked={filters.showWatchesOnly}
              onChange={(event) =>
                setFilters({
                  ...filters,
                  showWatchesOnly: event.target.checked,
                })
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
                setFilters({
                  ...filters,
                  showArchivedOnly: event.target.checked,
                })
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
                setFilters({
                  ...filters,
                  showFeaturedOnly: event.target.checked,
                })
              }
            />
            <Label htmlFor="isFeatured">Destaques</Label>
          </div>
        </div>
        <div className="w-[330px] sm:w-[580px] md:w-[750px] lg:w-full mx-auto">
          <ProductsDataTable
            searchKey="name"
            columns={columns}
            data={filteredData}
          />
        </div>
        {/* <Heading title="API" description="API dos Produtos" />
        <Separator /> */}
        {/* <ApiList entityName="products" entityIdName="productId" /> */}
      </div>
    </>
  );
};
