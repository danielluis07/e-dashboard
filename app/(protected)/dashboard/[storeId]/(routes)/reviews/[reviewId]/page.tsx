import { db } from "@/lib/db";
import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import { FormWrapper } from "@/components/creation-form";
import { ReviewForm } from "./_components/review-form";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const ReviewPage = async ({
  params,
}: {
  params: { reviewId: string; storeId: string };
}) => {
  const review = await db.review.findUnique({
    where: {
      id: params.reviewId,
    },
    include: {
      user: true,
      product: true,
    },
  });

  const imageUrl = review?.user.imageUrl as string | StaticImport;

  // const reviewDate = format(review?.createdAt, "dd/MM/yyyy", { locale: ptBR })

  return (
    <div className="flex mt-10 pb-10 items-center justify-center">
      <FormWrapper>
        <ReviewForm
          text={review?.text}
          initialData={review}
          imageUrl={imageUrl}
          name={review?.user.name}
          rating={review?.rating}
        />
      </FormWrapper>
    </div>
  );
};

export default ReviewPage;
