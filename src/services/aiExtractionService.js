import api from "@/utils/api";

/**
 * Service for AI-powered deadline extraction from documents
 */
export const aiExtractionService = {
  /**
   * Extract deadlines from PDF URLs using Gemini API
   * @param {string} userId - User ID
   * @param {string} courseId - Course ID to associate deadlines with
   * @param {string[]} pdfUrls - Array of PDF URLs to process
   * @param {string} customPrompt - Optional custom instructions for the AI
   * @returns {Promise<{suggestions: string[]}>} Array of suggestion IDs
   */
  async extractFromPDFs(userId, courseId, pdfUrls, customPrompt) {
    // First, get or create a default extraction config
    const configId = await this.getDefaultExtractionConfig();

    console.log("🔧 Frontend sending custom prompt:", customPrompt);

    // Call the SuggestionManagement concept to extract deadlines
    const response = await api.post(
      "/SuggestionManagement/llmExtractFromPDFUrls",
      {
        user: userId,
        course: courseId,
        pdfUrls,
        config: configId,
        customPrompt: customPrompt || null, // Include custom prompt if provided
      }
    );

    return response;
  },

  /**
   * Extract deadlines from a course website URL
   * @param {string} userId
   * @param {string} courseId
   * @param {string} websiteUrl
   * @param {string} customPrompt
   */
  async extractFromWebsite(userId, courseId, websiteUrl, customPrompt) {
    const configId = await this.getDefaultExtractionConfig();

    const response = await api.post(
      "/SuggestionManagement/llmExtractFromWebsite",
      {
        user: userId,
        course: courseId,
        url: websiteUrl,
        config: configId,
        customPrompt: customPrompt || null,
      }
    );

    return response;
  },

  /**
   * Refine existing suggestions using AI without re-processing documents
   * @param {string} userId - User ID
   * @param {Array} suggestions - Array of existing suggestions to refine
   * @param {string} refinementPrompt - Instructions for how to refine the suggestions
   * @returns {Promise<{suggestions: Array}>} Refined suggestions
   */
  async refineSuggestions(userId, suggestions, refinementPrompt) {
    console.log(
      "🔧 Frontend calling refinement API with prompt:",
      refinementPrompt
    );

    const response = await api.post(
      "/SuggestionManagement/refineMultipleSuggestions",
      {
        user: userId,
        suggestions: suggestions.map((s) => s._id), // Send just the IDs
        refinementPrompt: refinementPrompt,
      }
    );

    console.log("🔧 Refinement service response:", response);
    console.log("🔧 Refinement response.data:", response.data);
    console.log("🔧 Is response an object?", typeof response);

    // Handle different response formats (same as getAllSuggestions)
    // The axios interceptor might unwrap the response differently
    if (response && response.data) {
      return response.data;
    } else if (response) {
      return response;
    } else {
      return { error: "No response from server" };
    }
  },

  /**
   * Get all unconfirmed suggestions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of suggestion objects
   */
  async getUnconfirmedSuggestions(userId) {
    const response = await api.post(
      "/SuggestionManagement/_getUnconfirmedSuggestionsByUser",
      {
        user: userId,
      }
    );

    return response;
  },

  /**
   * Get all suggestions for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of suggestion objects
   */
  async getAllSuggestions(userId) {
    const response = await api.post(
      "/SuggestionManagement/_getSuggestionsByUser",
      {
        user: userId,
      }
    );

    console.log("🔧 getAllSuggestions raw response:", response);
    console.log("🔧 getAllSuggestions response.data:", response.data);
    console.log("🔧 Is response an array?", Array.isArray(response));
    console.log("🔧 Is response.data an array?", Array.isArray(response.data));

    // Backend returns array of suggestions directly
    // The axios interceptor might have already unwrapped response.data
    // So check if response itself is the array, or if it's in response.data
    let suggestionsArray;
    if (Array.isArray(response)) {
      suggestionsArray = response;
    } else if (Array.isArray(response.data)) {
      suggestionsArray = response.data;
    } else if (response.data?.suggestions) {
      suggestionsArray = response.data.suggestions;
    } else {
      suggestionsArray = [];
    }

    console.log("🔧 getAllSuggestions final array:", suggestionsArray);

    return { suggestions: suggestionsArray };
  },

  /**
   * Confirm a suggestion and convert it to a real deadline
   * @param {string} suggestionId - Suggestion ID
   * @param {string} courseId - Course ID
   * @param {string} userId - User ID (addedBy)
   * @returns {Promise<Object>} Deadline data
   */
  async confirmSuggestion(suggestionId, courseId, userId) {
    const response = await api.post("/SuggestionManagement/confirm", {
      suggestion: suggestionId,
      course: courseId,
      addedBy: userId,
    });

    return response;
  },

  /**
   * Edit a suggestion manually
   * @param {string} suggestionId - Suggestion ID
   * @param {string} newTitle - New title
   * @param {Date} newDue - New due date
   * @returns {Promise<void>}
   */
  async editSuggestion(suggestionId, newTitle, newDue) {
    const response = await api.post("/SuggestionManagement/editSuggestion", {
      suggestion: suggestionId,
      newTitle,
      newDue,
    });

    return response;
  },

  /**
   * Get or create default extraction configuration
   * @returns {Promise<string>} Config ID
   */
  async getDefaultExtractionConfig() {
    // Try to create default config
    try {
      const response = await api.post(
        "/SuggestionManagement/createExtractionConfig",
        {
          name: `default-${Date.now()}`, // Use unique name to avoid conflicts
          modelVersion: "gemini-2.5-flash",
          basePromptTemplate: `You are an expert at extracting deadline information from academic documents.

Extract all deadline information from the provided documents. For each deadline, provide:
- title: A clear, descriptive title of the assignment/task
- due: The due date in ISO 8601 format (YYYY-MM-DDTHH:mm:ss-04:00)
- confidence: Your confidence level (0.0 to 1.0) in the extraction accuracy
- provenance: Where you found this information in the document
- warnings: Any ambiguities or concerns about the extracted data

Current year is ${new Date().getFullYear()}. If a document only provides month/day without year, assume the current academic year.`,
          maxTokens: 8192,
          temperature: 0.1,
          timezone: "America/New_York",
        }
      );

      if (response.config) {
        return response.config;
      }

      // If response doesn't have config but no error, something went wrong
      throw new Error("Failed to create extraction config");
    } catch (error) {
      console.error("Failed to create extraction config:", error);
      throw new Error("Could not initialize AI extraction. Please try again.");
    }
  },
};
