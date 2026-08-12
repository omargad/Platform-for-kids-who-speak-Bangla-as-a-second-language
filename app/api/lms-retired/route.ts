function retiredLmsResponse() {
  return Response.json(
    {
      error: "This custom LMS endpoint is disabled. Learning accounts, classes, submissions and publishing are handled by Moodle.",
      code: "CUSTOM_LMS_RETIRED",
    },
    {
      status: 410,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

export {
  retiredLmsResponse as DELETE,
  retiredLmsResponse as GET,
  retiredLmsResponse as PATCH,
  retiredLmsResponse as POST,
  retiredLmsResponse as PUT,
};
