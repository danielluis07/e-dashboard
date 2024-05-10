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
import { convertCentsToReal } from "@/lib/utils";
import { OrdersByDayChart } from "../../_components/charts/orders-by-day";
import { getSalesData } from "@/actions/charts-data/get-sales-data";
import { getUserData } from "@/actions/charts-data/get-users-data";
import { UsersByDayChart } from "../../_components/charts/users-by-day";
import { RANGE_OPTIONS, getRangeOption } from "@/lib/range-options";
import { ChartCard } from "../../_components/charts/chart-card";

const DashboardPage = async ({
  params,
  searchParams,
}: {
  params: { storeId: string };
  searchParams: {
    ordersRange?: string;
    usersRange?: string;
    ordersRangeFrom: string;
    ordersRangeTo: string;
    usersRangeFrom: string;
    usersRangeTo: string;
  };
}) => {
  const ordersRangeOption =
    getRangeOption(
      searchParams.ordersRange,
      searchParams.ordersRangeFrom,
      searchParams.ordersRangeTo
    ) || RANGE_OPTIONS.last_7_days;
  const usersRangeOption =
    getRangeOption(
      searchParams.usersRange,
      searchParams.usersRangeFrom,
      searchParams.usersRangeTo
    ) || RANGE_OPTIONS.last_7_days;

  const [
    salesData,
    usersData,
    totalRevenue,
    graphRevenue,
    salesCount,
    stockCount,
    usersCount,
  ] = await Promise.all([
    getSalesData(ordersRangeOption.startDate, ordersRangeOption.endDate),
    getUserData(usersRangeOption?.startDate, usersRangeOption?.endDate),
    getTotalRevenue(params.storeId),
    getGraphRevenue(params.storeId),
    getSalesCount(params.storeId),
    getStockCount(params.storeId),
    getUsersCount(params.storeId),
  ]);

  return (
    <div className="h-full xl:h-screen xl:overflow-auto pl-3 pb-3 pr-3 pt-16 xl:pt-5">
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
                {convertCentsToReal(totalRevenue)}
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
        <ChartCard
          title="Vendas por Período"
          selectRangeLabel={ordersRangeOption.label}
          queryKey="ordersRange">
          <OrdersByDayChart data={salesData.chartData} />
        </ChartCard>
        <ChartCard
          title="Usuários por Período"
          selectRangeLabel={usersRangeOption?.label}
          queryKey="usersRange">
          <UsersByDayChart data={usersData.chartData} />
        </ChartCard>
      </div>
    </div>
  );
};

export default DashboardPage;
