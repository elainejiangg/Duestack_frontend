// Backend API base URL
export const API_BASE_URL = "http://localhost:8000/api";

export const API_ENDPOINTS = {
  // UserIdentity
  userIdentity: {
    createUser: "/UserIdentity/createUser",
    updateUserName: "/UserIdentity/updateUserName",
    updateUserEmail: "/UserIdentity/updateUserEmail",
  },

  // UserAuthentication
  auth: {
    register: "/UserAuthentication/register",
    login: "/UserAuthentication/login",
    logout: "/UserAuthentication/logout",
    changePassword: "/UserAuthentication/changePassword",
  },

  // CourseManagement
  courses: {
    create: "/CourseManagement/createCourse",
    update: "/CourseManagement/updateCourse",
    delete: "/CourseManagement/deleteCourse",
  },

  // DeadlineManagement
  deadlines: {
    create: "/DeadlineManagement/createDeadline",
    update: "/DeadlineManagement/updateDeadline",
    setStatus: "/DeadlineManagement/setStatus",
    delete: "/DeadlineManagement/deleteDeadline",
  },

  // DocumentManagement
  documents: {
    upload: "/DocumentManagement/uploadDocument",
    updateMetadata: "/DocumentManagement/updateDocumentMetadata",
    getContent: "/DocumentManagement/getDocumentContent",
    delete: "/DocumentManagement/deleteDocument",
  },

  // SuggestionManagement
  suggestions: {
    createExtractionConfig: "/SuggestionManagement/createExtractionConfig",
    llmExtractFromDocument: "/SuggestionManagement/llmExtractFromDocument",
    llmExtractFromMultipleDocuments:
      "/SuggestionManagement/llmExtractFromMultipleDocuments",
    llmExtractFromWebsite: "/SuggestionManagement/llmExtractFromWebsite",
    refineWithFeedback: "/SuggestionManagement/refineWithFeedback",
    editSuggestion: "/SuggestionManagement/editSuggestion",
    updateTitle: "/SuggestionManagement/updateSuggestionTitle",
    updateDate: "/SuggestionManagement/updateSuggestionDate",
    confirm: "/SuggestionManagement/confirm",
  },
};
