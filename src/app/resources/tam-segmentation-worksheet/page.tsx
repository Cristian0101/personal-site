import { PracticeResourcePage } from "@/components/site/PracticeResourcePage";
import { tamContent as content } from "@/lib/practiceResources";
import { resourceMetadata } from "@/lib/resources";
export const metadata = resourceMetadata(content.resource.title, content.resource.description, content.resource.path);
export default function Page() { return <PracticeResourcePage content={content} />; }
