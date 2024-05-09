import { format } from "date-fns";
import { convertCentsToReal } from "@/lib/utils";
import { db } from "@/lib/db";
import { ptBR } from "date-fns/locale/pt-BR";
import { ProductsClient } from "./_components/products-client";
import { ProductColumnProps } from "./_components/products-columns";

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      sizes: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumnProps[] = products.map((item) => ({
    id: item.id,
    number: item.number,
    name: item.name,
    description: item.description,
    isFeatured: item.isFeatured ? "Sim" : "Não",
    isArchived: item.isArchived ? "Sim" : "Não",
    stock: item.stock,
    isNew: item.isNew,
    salesCount: item.salesCount,
    price: convertCentsToReal(item.price),
    category: item.category.name,
    sizes: item.sizes,
    color: item.color?.value ?? "---",
    createdAt: format(item.createdAt, "dd/MM/yyyy", { locale: ptBR }),
  }));

  return (
    <div className="h-full xl:h-screen xl:overflow-auto p-3 pt-16 xl:pt-0">
      <ProductsClient data={formattedProducts} />
    </div>
  );
};

export default ProductsPage;
