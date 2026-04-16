import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface DynamicRoutePageProps {
  params: Promise<{
    segments: string[];
  }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: DynamicRoutePageProps): Promise<Metadata> {
  await params;
  return {
    title: "페이지를 찾을 수 없습니다",
    description: "요청하신 페이지를 찾을 수 없습니다.",
  };
}

export default async function DynamicRoutePage({
  params,
}: DynamicRoutePageProps) {
  await params;
  notFound();
}
