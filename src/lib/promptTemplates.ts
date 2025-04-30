
export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  template: string;
}

export const promptTemplates: PromptTemplate[] = [
  {
    id: "saas",
    name: "SaaS Application",
    description: "Web app with user authentication and dashboard",
    template: "I want to build a SaaS application that helps [target audience] to [main purpose]. The core features should include [feature 1], [feature 2], and [feature 3]. The design should be [design preference]."
  },
  {
    id: "portfolio",
    name: "Portfolio Website",
    description: "Showcase your work with a personal site",
    template: "Create a portfolio website to showcase my work as a [profession]. The site should appeal to [target audience] and highlight my expertise in [main purpose]. I want to include [feature 1], [feature 2], and [feature 3] with a [design preference] design style."
  },
  {
    id: "ecommerce",
    name: "E-Commerce Platform",
    description: "Online store with product catalog",
    template: "Build an e-commerce platform for [target audience] to shop for [main purpose]. Essential features should include [feature 1], [feature 2], and [feature 3]. The design should follow [design preference] aesthetics for a seamless shopping experience."
  },
  {
    id: "dashboard",
    name: "Analytics Dashboard",
    description: "Data visualization and reporting interface",
    template: "Create an analytics dashboard for [target audience] to monitor [main purpose]. Key features should include [feature 1], [feature 2], and [feature 3]. The interface should have a [design preference] design with clear data visualization."
  },
  {
    id: "mobile",
    name: "Mobile App UI",
    description: "Mobile-first application design",
    template: "Design a mobile application for [target audience] focused on [main purpose]. The app should feature [feature 1], [feature 2], and [feature 3] with a [design preference] interface that works well on both iOS and Android."
  }
];
