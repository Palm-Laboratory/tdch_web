import { redirect } from "next/navigation";

export default function AboutPage() {
  // /about 경로로 직접 접속하면 자동으로 첫 번째 서브메뉴인 /about/greeting 로 이동
  redirect("/about/greeting");
}
