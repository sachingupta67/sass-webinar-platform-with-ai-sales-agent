import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useWebinarStore } from "@/store/useWebinarStore";
import { Select } from "@radix-ui/react-select";
import { format } from "date-fns";
import { CalendarIcon, Clock, Upload } from "lucide-react";
import React from "react";
import { toast } from "sonner";

const BasicInfoStep = () => {
  const { formData, updateBasicInfoField, getValidationErrors } =
    useWebinarStore();

  const errors = getValidationErrors("basicInfo");

  const handlerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateBasicInfoField(name as keyof typeof formData.basicInfo, value);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    updateBasicInfoField("date", newDate);
    if (newDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (newDate < today) {
        console.log("Error : Date can not be in the past");
        toast.error("webinar date cannot be in the past");
      }
    }
  };

  const handleFormatChange = (format: string) => {
    updateBasicInfoField("timeFormat", format as "AM" | "PM");
  };
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label
          htmlFor="webinarName"
          className={errors.webinarName ? "text-red-400" : ""}
        >
          Webinar name <span className="text-red-400">*</span>
        </Label>
        <Input
          id="webinarName"
          name="webinarName"
          value={formData.basicInfo.webinarName}
          onChange={handlerChange}
          placeholder="Introduction to mochi"
          className={cn(
            "bg-background/50! border border-input",
            errors.webinarName &&
              "border-red-400 focus-visible:border'border-red-400 focus-visible:ring-red-400'"
          )}
        />
        {errors.webinarName && (
          <span className="text-red-400 text-sm">{errors.webinarName}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="description"
          className={errors.description ? "text-red-400" : ""}
        >
          Description <span className="text-red-400">*</span>
        </Label>
        <Textarea
          id="description"
          name="description"
          value={formData.basicInfo.description || ""}
          onChange={handlerChange}
          placeholder="Tell customer what your webinar is about"
          className={cn(
            "min-h-25 bg-background/50! border border-input",
            errors.description &&
              "border-red-400 focus-visible:border'border-red-400 focus-visible:ring-red-400'"
          )}
        />
        {errors.description && (
          <span className="text-red-400 text-sm">{errors.description}</span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="description"
            className={errors.date ? "text-red-400" : ""}
          >
            Webinar Date <span className="text-red-400">*</span>
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-background/50! border border-input",
                  !formData.basicInfo.date && "text-gray-500",
                  errors.date && "border-red-400  focus-visible:ring-red-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 " />
                {formData.basicInfo.date
                  ? format(formData.basicInfo.date, "PPP")
                  : "Select Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background/50! border border-input">
              <Calendar
                mode="single"
                selected={formData.basicInfo.date}
                onSelect={handleDateChange}
                initialFocus
                className="bg-background"
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  return date < today;
                }}
              />
            </PopoverContent>
          </Popover>
          {errors.date && (
            <span className="text-red-400 text-sm">{errors.date}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label className={errors.time ? "text-red-400" : ""}>
            Webinar Time <span className="text-red-400">*</span>
          </Label>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-foreground" />
              <Input
                name="time"
                value={formData.basicInfo.time || ""}
                onChange={handlerChange}
                placeholder="12:00"
                className={cn(
                  "pl-9 bg-background/50! border border-input",
                  errors.time && "border-red-400 focus-visible:ring-red-400"
                )}
              />
            </div>
            <Select
              value={formData.basicInfo.timeFormat || "AM"}
              onValueChange={handleFormatChange}
            >
              <SelectTrigger className="w-20 bg-background/50! border border-input">
                <SelectValue placeholder="AM"></SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-background! border border-input">
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {errors.time && (
            <span className="text-red-400 text-sm">{errors.time}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-400 mt-4">
        <div className="flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          Uploading a video makes this webinar pre-recorded
        </div>
        <Button
          variant="outline"
          className="ml-auto relative border border-input hover:bg-background"
        >
          Upload File
          <Input
            className="absolute inset-0 opacity-0 cursor-pointer"
            type="file"
          />
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep;
