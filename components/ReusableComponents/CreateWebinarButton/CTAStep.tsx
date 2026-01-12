"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CtaTypeEnum } from "@/lib/generated/prisma/enums";
import { cn } from "@/lib/utils";
import { useWebinarStore } from "@/store/useWebinarStore";
import { Search, X } from "lucide-react";
import { useState } from "react";
import Stripe from "stripe";

type Props = {
  stripeProducts: Stripe.Product[] | [];
};
const CTAStep = (props: Props) => {
  const { stripeProducts } = props;
  const { formData, getValidationErrors, updateCtaField, addTag, removeTag } =
    useWebinarStore();
  const { ctaLabel, tags, priceId } = formData.cta;
  const [tagInput, setTagInput] = useState("");
  const errors = getValidationErrors("cta");

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    updateCtaField(name as keyof typeof formData.cta, value);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput.trim());
      setTagInput("");
    }
  };

  const handleSelectCTAType = (type: CtaTypeEnum) => {
    updateCtaField("ctaType", type);
  };

  const handleProductChange = (value: string) => {
    updateCtaField("priceId", value);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="ctaLabel"
          className={errors.ctaLabel ? "text-red-400" : ""}
        >
          CTA Label <span className="text-red-400">*</span>
        </Label>
        <Input
          id="ctaLabel"
          name="ctaLabel"
          value={ctaLabel}
          onChange={handlerChange}
          placeholder="Let's Get started"
          className={cn(
            "bg-background/50! border border-input",
            errors.ctaLabel &&
              "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400",
          )}
        />
        {errors.ctaLabel && (
          <span className="text-red-400 text-sm">{errors.ctaLabel}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <Input
          id="tags"
          name="tags"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tags and press Enter"
          className={cn("bg-background/50! border border-input")}
        />
        {tags && tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag: string, idx) => {
              return (
                <div
                  key={idx}
                  className="flex items-center gap-1 bg-gray-800 text-white px-3 py-1 rounded-md"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="space-y-2 w-full">
        <Label>CTA Type</Label>
        <Tabs defaultValue={CtaTypeEnum.BOOK_A_CALL} className="w-full">
          <TabsList className="w-full bg-transparent">
            <TabsTrigger
              value={CtaTypeEnum.BOOK_A_CALL}
              className="w-1/2 data-[state=active]:bg-background/50! px-2 py-2"
              onClick={() => handleSelectCTAType(CtaTypeEnum.BOOK_A_CALL)}
            >
              Book a Call
            </TabsTrigger>

            <TabsTrigger
              value={CtaTypeEnum.BUY_NOW}
              className="w-1/2 px-2 py-2"
              onClick={() => handleSelectCTAType(CtaTypeEnum.BUY_NOW)}
            >
              Buy Now
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="space-y-2">
        <Label> Attach an Product</Label>
        <div className="relative">
          <div className="mb-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="search agents"
                className="pl-9 bg-background/50! border border-input"
              />
            </div>
          </div>

          <Select value={priceId} onValueChange={handleProductChange}>
            <SelectTrigger className="w-full bg-background/50! border border-input">
              <SelectValue placeholder="select an product" />
            </SelectTrigger>
            {/*<SelectContent className="bg-background border border-input max-h-48">
              {stripeProducts?.length > 0 ? (
                stripeProducts?.map((product, i) => {
                  return (
                    <SelectItem
                      key={i}
                      value={product?.default_price?.toString() || ""}
                      className="bg-background/50! hover:bg-white/10!"
                    >
                      {product.name}
                    </SelectItem>
                  );
                })
              ) : (
                <SelectItem value="" disabled>
                  Create Product in Stripe
                </SelectItem>
              )}
            </SelectContent>*/}

            <SelectContent className="bg-background border border-input max-h-48">
              {stripeProducts?.length > 0 ? (
                stripeProducts.map((product) =>
                  product.default_price ? (
                    <SelectItem
                      key={product.id}
                      value={String(product.default_price)}
                      className="bg-background/50! hover:bg-white/10!"
                    >
                      {product.name} | {String(product.default_price)}
                    </SelectItem>
                  ) : null,
                )
              ) : (
                <SelectItem value="__no_products__" disabled>
                  Create Product in Stripe
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default CTAStep;
