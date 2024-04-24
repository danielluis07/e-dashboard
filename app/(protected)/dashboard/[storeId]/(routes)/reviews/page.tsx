import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";
import ptBR from "date-fns/locale/pt-BR";
import { ReviewsClient } from "./_components/reviews-client";
import { ReviewColumnProps } from "./_components/reviews-columns";
import { ReviewStar } from "./_components/review-star";
import { Heading } from "@/components/ui/heading";

const ReviewsPage = async ({ params }: { params: { storeId: string } }) => {
  const reviews = await db.review.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      user: true,
      product: true,
    },
  });

  const averageRatingResult = await db.review.aggregate({
    where: {
      storeId: params.storeId,
    },
    _avg: {
      rating: true,
    },
  });

  const averageRating =
    averageRatingResult._avg.rating !== null
      ? averageRatingResult._avg.rating
      : 0;

  const roundedAverage = parseFloat(averageRating.toFixed(2));

  if (!reviews) {
    return (
      <div className="flex items-center justify-center h-full">
        Nenhuma avaliação encontrada
      </div>
    );
  }

  const formattedReviews: ReviewColumnProps[] = reviews.map((item) => ({
    id: item.id,
    user: item.user.name,
    product: item.product.name,
    rating: item.rating,
    hasReply: item.hasReply ? "Sim" : "Não",
    isArchived: item.isArchived ? "Sim" : "Não",
    createdAt: format(item.createdAt, "dd/MM/yyyy", { locale: ptBR }),
  }));

  return (
    <div className="h-full xl:h-screen xl:overflow-auto p-3 pt-16 xl:pt-0">
      <Heading
        title="Todos as Avaliações"
        description="Gerencie as avaliações de sua loja"
      />
      <div className="flex-col space-y-3 sm:flex-row mt-10">
        <Card className="w-full p-5 space-y-4">
          <div>Total</div>
          <div className="text-4xl">{reviews.length}</div>
        </Card>
        <Card className="w-full p-5 space-y-2">
          <div>Nota média</div>
          <div className="text-4xl ml-1">{roundedAverage}</div>
          <ReviewStar averageRatingResult={averageRatingResult} />
        </Card>
      </div>
      <ReviewsClient data={formattedReviews} />
    </div>
  );
};

export default ReviewsPage;
