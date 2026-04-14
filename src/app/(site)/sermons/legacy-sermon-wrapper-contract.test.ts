import MessagesPage from "@/app/(site)/sermons/messages/page";
import BetterDevotionPage from "@/app/(site)/sermons/better-devotion/page";
import ItsOkayPage from "@/app/(site)/sermons/its-okay/page";

type LegacySermonWrapperProps = {
  params: Promise<{
    slug: "messages" | "better-devotion" | "its-okay";
  }>;
  searchParams?: Promise<{
    page?: string;
  }>;
};

type Exact<A, B> = A extends B ? (B extends A ? true : never) : never;

const _assertMessagesProps: Exact<Parameters<typeof MessagesPage>[0], LegacySermonWrapperProps> = true;
const _assertBetterDevotionProps: Exact<Parameters<typeof BetterDevotionPage>[0], LegacySermonWrapperProps> = true;
const _assertItsOkayProps: Exact<Parameters<typeof ItsOkayPage>[0], LegacySermonWrapperProps> = true;

void _assertMessagesProps;
void _assertBetterDevotionProps;
void _assertItsOkayProps;
