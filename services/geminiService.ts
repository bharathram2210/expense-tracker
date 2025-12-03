
import { GoogleGenAI } from "@google/genai";
import { SpendingSummary } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateNotificationMessage = async (summary: SpendingSummary): Promise<string> => {
  if (!API_KEY) {
    return Promise.resolve("Your API key is missing. Here's a default daily summary:\n\n" +
      `Spent Today: ₹${summary.today.toFixed(2)}\n` +
      `Remaining Budget: ₹${(summary.totalBudgetThisMonth - summary.thisMonth).toFixed(2)}\n` +
      `You've used ${((summary.thisMonth / summary.totalBudgetThisMonth) * 100).toFixed(0)}% of your monthly budget.`);
  }

  const { totalBudgetThisMonth, thisMonth, today } = summary;
  const remainingBudget = totalBudgetThisMonth - thisMonth;
  const percentageUsed = totalBudgetThisMonth > 0 ? (thisMonth / totalBudgetThisMonth) * 100 : 0;

  const prompt = `
    You are a friendly and encouraging financial assistant. 
    Create a short, positive, and informative daily summary message for a user's expense tracking app.
    The message should be suitable for a WhatsApp notification. Use emojis to make it engaging.

    Here is the user's financial data for today, in Indian Rupees (₹):
    - Total Monthly Budget: ₹${totalBudgetThisMonth.toFixed(2)}
    - Total Spent This Month: ₹${thisMonth.toFixed(2)}
    - Remaining Monthly Budget: ₹${remainingBudget.toFixed(2)}
    - Spent Today: ₹${today.toFixed(2)}
    - Percentage of Monthly Budget Used: ${percentageUsed.toFixed(1)}%

    Based on this data, craft a message that:
    1.  Starts with a friendly greeting (e.g., "Hi there!", "Your daily financial check-in!").
    2.  Briefly mentions today's spending.
    3.  Highlights the remaining monthly budget.
    4.  Offers a small piece of encouragement or a simple tip.
    5.  Keeps the tone light and positive, not judgmental.

    Example structure:
    "Friendly Greeting 👋\n\nToday you've spent ₹X.XX. You have ₹Y.YY left in your monthly budget. Keep up the great work! ✨\n\nRemember, every small step counts towards your financial goals! 🎯"

    Generate a message now based on the provided data.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating notification from Gemini:", error);
    return "Could not generate a personalized message. Here's your summary:\n\n" +
      `Spent Today: ₹${summary.today.toFixed(2)}\n` +
      `Remaining Budget: ₹${(summary.totalBudgetThisMonth - summary.thisMonth).toFixed(2)}`;
  }
};
