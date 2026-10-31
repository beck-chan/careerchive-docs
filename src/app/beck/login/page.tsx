import { Suspense } from "react";
import {
 CareerChiveLoginPage,
 careerchiveLoginMetadata as metadata,
} from "career-chive";

export { metadata };

export default function Page() {
 return (
   <Suspense fallback={null}>
     <CareerChiveLoginPage />
   </Suspense>
 );
}
