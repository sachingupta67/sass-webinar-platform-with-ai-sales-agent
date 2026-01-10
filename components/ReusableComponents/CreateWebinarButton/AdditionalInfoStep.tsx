"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useWebinarStore } from "@/store/useWebinarStore";
import { Info } from "lucide-react";
import React from "react";

const AdditionalInfoStep = () => {
  const { formData, getValidationErrors, updateAdditionalInfo } =
    useWebinarStore();
  const { lockChat, couponEnabled, couponCode } = formData.additionalInfo;
  const errors = getValidationErrors("additionalInfo");
  const handleToggleLockChat = (checked: boolean) => {
    updateAdditionalInfo("lockChat", checked);
  };

  const handleToggleCoupon = (checked: boolean) => {
    updateAdditionalInfo("couponEnabled", checked);
  };

  const handleCouponCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateAdditionalInfo("couponCode", e.target.value);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Label htmlFor="lockChat" className="text-base font-medium">
            Lock Chat
          </Label>
          <p className="text-sm text-gray-400">
            Turn it on to make chat visible to your users at all time
          </p>
        </div>
        <Switch
          id="lock-chat"
          checked={lockChat || false}
          onCheckedChange={handleToggleLockChat}
          className="cursor-pointer"
        />
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="coupon-enabled" className="text-base font-medium">
              Coupon Code
            </Label>
            <p className="text-sm text-gray-400">
              Turn it on to after discounts to your viewers
            </p>
          </div>
          <Switch
            id="coupon-enabled"
            checked={couponEnabled || false}
            onCheckedChange={handleToggleCoupon}
            className="cursor-pointer"
          />
        </div>
        {couponEnabled && (
          <div className="space-y-2">
            <Input
              id="coupon-code"
              name="couponCode"
              value={couponCode}
              onChange={handleCouponCodeChange}
              placeholder="Paste the coupon code here"
              className={cn(
                "bg-background/50! border border-input",
                errors.couponCode &&
                  "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
              )}
            />
            {errors.couponCode && (
              <p className="text-red-400 text-sm">{errors.couponCode}</p>
            )}
            <div className="flex items-start gap-2 text-sm text-gray-400 mt-2">
              <Info className="h-4 w-4 mt-1" />
              <p>
                This coupon code can be used to promote a sale. Users can use it
                for the buy now CTA
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdditionalInfoStep;
