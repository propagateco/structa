import { Card, CardContent } from "@/components/ui/card";
import { ProductInterface } from "@core/product/product.interface";
import { Calendar, Users, Dumbbell, HeartPulse, Gauge } from "lucide-react";
import { getImageUrl } from "@/components/ui/image";
import { Separator } from "../ui/separator";
import { MutationDot } from "@/components/ui/dot";
import { getProductStatusInfo } from "@/utils/product-status";
import * as ProductModel from "@core/product/product.model";
import { UserModel } from "@core/user/user.model";
import React from "react";
import { motion } from "motion/react";
import { ProgressiveBlur } from "../ui/progressive-blur";
import { AuthorTime } from "@/components/ui/author-time";

function ProductDetails({
  product,
}: {
  product: ProductInterface.ProductCardData;
}) {
  const difficultyConfig =
    ProductInterface.DifficultyConfig[product.difficultyLevel];
  const trainingStyleConfig =
    ProductInterface.TrainingStyleConfig[product.trainingStyle];
  return (
    <div className="flex items-center gap-4 lg:gap-5 xl:gap-6 text-xs text-white px-4 xl:px-6 py-3">
      <div className="flex flex-col items-center gap-1">
        <Calendar className="w-4 h-4" />
        <span>{product.durationWeeks} weeks</span>
      </div>

      <Separator orientation="vertical" className="h-10 bg-white/30" />
      <div className="flex flex-col items-center gap-1">
        <Gauge className="w-4 h-4" />
        {difficultyConfig.label}
      </div>

      <Separator orientation="vertical" className="h-10 bg-white/30" />

      <div className="flex flex-col items-center gap-1">
        <HeartPulse className="size-4" />
        {trainingStyleConfig.label}
      </div>
    </div>
  );
}

interface ProductCardProps {
  product: ProductInterface.ProductCardData;
  onClick: () => void;
  user?: UserModel.UserType;
}

export function ProductCard({ product, onClick, user }: ProductCardProps) {
  const [isHover, setIsHover] = React.useState(false);

  // Get product status
  const productStatus = getProductStatusInfo({
    publishedAt: product.publishedAt || null,
    updatedAt: product.updatedAt,
  } as ProductModel.QueryType);

  return (
    <Card
      variant={"ghost"}
      className="cursor-pointer transition-all duration-300 ease-in-out h-96 p-0 flex flex-col group"
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <div
        className="relative flex-1 w-full rounded-t-lg bg-gradient-to-br from-primary/10 to-primary/5"
        style={{ isolation: "isolate" }}
      >
        <div className="absolute inset-0 overflow-hidden rounded-t-lg">
          {product.coverImage ? (
            <img
              src={getImageUrl(product.coverImage, "?height=600&format=webp")}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Dumbbell className="w-12 h-12 text-primary/30" />
            </div>
          )}
        </div>

        <ProgressiveBlur
          className="pointer-events-none absolute bottom-0 left-0 h-[75%] w-full"
          blurIntensity={0.5}
          animate={isHover ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        />

        <motion.div
          className="absolute bottom-5 xl:bottom-8 left-0 right-0 flex justify-center"
          animate={isHover ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
          }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <ProductDetails product={product} />
        </motion.div>
      </div>
      <CardContent className="pt-4 h-[85px] flex flex-col">
        {/* Container that expands on hover to push content down */}
        <div className="transition-all duration-300 ease-in-out max-h-0 group-hover:max-h-8 overflow-hidden">
          <div className="text-sm text-muted-foreground pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            {user && (
              <AuthorTime
                authorName={user.name}
                authorAvatar={user.image}
                timestamp={product.updatedAt}
              />
            )}
          </div>
        </div>

        <div>
          <MutationDot
            state={
              productStatus.type === "success"
                ? "published"
                : productStatus.type === "warning"
                  ? "saved"
                  : "saved"
            }
            textSize="text-xs"
            className="text-text font-medium"
          />
          <div className="mt-1">
            <h3 className="font-semibold text-foreground text-lg line-clamp-1">
              {product.title}
            </h3>
            <div className="transition-all duration-300 ease-in-out max-h-10 group-hover:max-h-0 overflow-hidden">
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
