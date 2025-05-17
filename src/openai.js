const API_KEY = "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"; // Get it from https://openrouter.ai/

export const generateQuestions = async (difficulty) => {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        // 'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
        // 'X-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: "system",
            content: "You are an AI that generates multiple-choice React questions."
          },
          {
            role: "user",
            content: `Generate 25 React multiple-choice ${difficulty} questions. Each question should have 5 options and return the correct option as an index. Format the response as a JSON array:
            [
              {
                "question": "What is React?",
                "options": ["A framework", "A library", "A language", "A database", "An operating system"],
                "correctOption": 1
              }
            ]`
          }
        ],
      }),
    });

    const data = await res.json()
    return data.choices[0].message.content

  } catch (error) {
    console.log(error.message)
  }
}
// generateQuestions();
