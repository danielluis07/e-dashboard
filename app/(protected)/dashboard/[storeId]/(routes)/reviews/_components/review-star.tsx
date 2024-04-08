"use client";

import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { Rating } from "react-simple-star-rating";

interface ReviewStarProps {
  averageRatingResult: Prisma.GetReviewAggregateType<{
    where: {
      storeId: string;
    };
    _avg: {
      rating: true;
    };
  }>;
}

export const ReviewStar = ({ averageRatingResult }: ReviewStarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const averageRating =
    averageRatingResult._avg.rating !== null
      ? averageRatingResult._avg.rating
      : 0;

  const roundedAverage = parseFloat(averageRating.toFixed(2));
  return (
    <Rating readonly size={40} initialValue={roundedAverage} allowFraction />
  );
};
