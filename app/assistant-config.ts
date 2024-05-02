if (!process.env.OPENAI_ASSISTANT_ID) {
    throw new Error("ASSISTANT_ID is not set");
}

export const assistantId = process.env.OPENAI_ASSISTANT_ID; // set your assistant ID here