import { Suspense } from "react";
import {
 CareerChiveArchivePage,
 careerchiveArchiveMetadata as metadata,
} from "career-chive";

export { metadata };

export default function Page({
 searchParams,
}: {
 searchParams: Promise<{ org?: string; iso?: string }>;
}) {
 return (
   <Suspense fallback={null}>
     <CareerChiveArchivePage searchParams={searchParams} />
   </Suspense>
 );
}
