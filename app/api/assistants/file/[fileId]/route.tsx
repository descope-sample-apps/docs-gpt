import { openai } from "@/app/openai";

// Get an existing file
export async function GET(
  request: Request,
  { params: { fileId } }: { params: { fileId: string } }
) {
  const file = await openai.files.retrieve(fileId);
  return Response.json(file);
}
