import { Suspense } from "react";
import {
 CareerChiveOrganizationsPage,
 careerchiveOrganizationsMetadata as metadata,
} from "career-chive";

export { metadata };

export default function Page({
 searchParams,
}: {
 searchParams: Promise<{ add?: string; org?: string; edit?: string }>;
}) {
 return (
   <Suspense fallback={null}>
     <CareerChiveOrganizationsPage searchParams={searchParams} />
   </Suspense>
 );
}
