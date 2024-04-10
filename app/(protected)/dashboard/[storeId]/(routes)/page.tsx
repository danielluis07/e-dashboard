import { PiPiggyBankLight } from "react-icons/pi";
import { BsBoxes } from "react-icons/bs";
import { CiCreditCard1, CiUser } from "react-icons/ci";

import { Separator } from "@/components/ui/separator";
import { Overview } from "../../_components/overview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { getTotalRevenue } from "@/actions/get-total-revenue";
import { getSalesCount } from "@/actions/get-sales-count";
import { getGraphRevenue } from "@/actions/get-graph-revenue";
import { getStockCount } from "@/actions/get-stock-count";
import { getUsersCount } from "@/actions/get-users-count";
import { formatter } from "@/lib/utils";

interface DashboardPageProps {
  params: {
    storeId: string;
  };
}

const DashboardPage = async ({ params }: DashboardPageProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const usersCount = await getUsersCount(params.storeId);

  return (
    <div className="h-full xl:h-screen xl:overflow-auto pl-3 pb-3 pr-3 pt-16">
      <div className="space-y-4 p-8 pt-6">
        <Heading title="Dashboard" description="Resumo das vendas" />
        <Separator />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 cursor-default">
          <Card className="group bg-green-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-milky">
                Receitas Totais
              </CardTitle>
              <PiPiggyBankLight className="size-5 group-hover:text-milky" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-milky">
                {formatter.format(totalRevenue)}
              </div>
            </CardContent>
          </Card>
          <Card className="group bg-sky-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-milky">
                Total de Usuários
              </CardTitle>
              <CiUser className="size-5 group-hover:text-milky" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-milky">
                {usersCount}
              </div>
            </CardContent>
          </Card>
          <Card className="group bg-orange-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-milky">
                Vendas
              </CardTitle>
              <CiCreditCard1 className="size-5 group-hover:text-milky" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-milky">
                + {salesCount}
              </div>
            </CardContent>
          </Card>
          <Card className="group bg-rose-400">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium group-hover:text-milky">
                Estoque
              </CardTitle>
              <BsBoxes className="size-4 group-hover:text-milky" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold group-hover:text-milky">
                {stockCount === null ? 0 : stockCount}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Gráfico</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={graphRevenue} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
