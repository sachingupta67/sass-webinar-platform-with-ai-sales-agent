import { Bot, Home, Settings, Users, Webcam } from "lucide-react";

export const sidebarData = [
  {
    id: 1,
    title: "Home",
    icon: Home,
    link: "/home",
  },
  {
    id: 2,
    title: "Webinars",
    icon: Webcam,
    link: "/webinars",
  },
  {
    id: 3,
    title: "Leads",
    icon: Users,
    link: "/lead",
  },
  {
    id: 4,
    title: "AI Agents",
    icon: Bot,
    link: "/ai-agents",
  },
  {
    id: 5,
    title: "Settings",
    icon: Settings,
    link: "/settings",
  },
];

export const onBoardingSteps = [
  {
    id: 1,
    title: "Create a webinar",
    complete: false,
    link: "",
  },
  {
    id: 2,
    title: "Get leads",
    complete: false,
    link: "",
  },
  {
    id: 3,
    title: "Conversion Status",
    complete: false,
    link: "",
  },
];
