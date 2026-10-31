import type { Metadata } from "next";
import { CareerChiveLayout, careerchiveMetadata } from "career-chive";
import "career-chive/styles.css";
import "./host.css";

export const metadata: Metadata = {
  title: careerchiveMetadata.title,
  icons: careerchiveMetadata.icons,
};

export default CareerChiveLayout;
