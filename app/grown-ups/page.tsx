import { redirect } from "next/navigation";
import { getSessionAdult } from "../../lib/auth";
import { safeReturnPath } from "../../lib/safe-redirect";
import GrownUpsContent from "./GrownUpsContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Grown-up sign in | Bangla Adventures",
  description:
    "Sign in or create a grown-up account to manage learner profiles, assignments and the content studio.",
};

export default async function GrownUpsPage({
  searchParams,
}: {
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { returnTo } = await searchParams;
  const destination = safeReturnPath(returnTo, "/family");
  const adult = await getSessionAdult();
  if (adult) redirect(destination);

  return <GrownUpsContent destination={destination} />;
}
